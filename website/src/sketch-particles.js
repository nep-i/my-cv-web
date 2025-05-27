import canvasSketch from 'canvas-sketch';
import { range } from 'canvas-sketch-util/random';
import { mapRange } from 'canvas-sketch-util/math';
import { quadOut } from 'eases';
import colormap from 'colormap';
import interpolate from 'color-interpolate';
import image from './image-01.png';

let animateParticles = true;

export const handleParticleAnimate = (statement) => {
  animateParticles = !statement;
};

const settings = {
  dimensions: [1080, 1100],
  animate: true,
  fps: 18,
};

let clicked = false;

const particles = [];
const cursor = { x: 9999, y: 9999 };
let lastFrameTime = 0;
const colors = colormap({
  colormap: 'viridis',
  nshades: 9,
});

let elCanvas;
let imgA, imgB;

const sketch = ({ width, height, canvas }) => {
  const frameInterval = 1000 / settings.fps;
  let x, y, particle, radius;

  const imgACanvas = document.createElement('canvas');
  const imgAContext = imgACanvas.getContext('2d');

  const imgBCanvas = document.createElement('canvas');
  const imgBContext = imgBCanvas.getContext('2d');

  imgACanvas.width = imgA.width;
  imgACanvas.height = imgA.height;

  imgBCanvas.width = imgB.width;
  imgBCanvas.height = imgB.height;

  const numCircles = 22;
  const gapCircle = 2;
  const gapDot = 7;
  let dotRadius = 11;
  let cirRadius = 1.5;
  const fitRadius = dotRadius;

  imgAContext.drawImage(imgA, 0, 0);
  imgBContext.drawImage(imgB, 0, 0);

  const imgAData = imgAContext.getImageData(0, 0, imgA.width, imgA.height).data;

  elCanvas = canvas;
  canvas.addEventListener('mouseover', onMouseOver);
  canvas.addEventListener('mouseout', onMouseOut);
  canvas.addEventListener('mousedown', () => {
    clicked = !clicked;
  });

  for (let i = 0; i < numCircles; i++) {
    const circumference = Math.PI * 1.8 * cirRadius;
    const numFit = i
      ? Math.floor(circumference / (fitRadius * 1.6 + gapDot))
      : 1;
    const fitSlice = (Math.PI * 2) / numFit;
    let ix, iy, idx, r, g, b, colA, colB, colMap;

    for (let j = 0; j < numFit; j++) {
      const theta = fitSlice * j;

      x = Math.cos(theta) * cirRadius - 8;
      y = Math.sin(theta) * cirRadius - 30;

      x += width * 0.5;
      y += height * 0.5;

      ix = Math.floor((x / width) * imgA.width);
      iy = Math.floor((y / height) * imgA.height);
      idx = (iy * imgA.width + ix) * 4;

      r = imgAData[idx + 3];
      g = imgAData[idx + 2];
      b = imgAData[idx + 6];
      colA = `rgb(${r - 90}, ${g + 10}, ${b + 5})`;

      radius = mapRange(r, 0, 225, 3, 7);

      r = imgAData[idx + 0];
      g = imgAData[idx + 1];
      b = imgAData[idx + 2];
      colB = `rgb(${r}, ${g}, ${b})`;

      colMap = interpolate([colA, colB]);
      particle = new Particle({ x, y, radius, colMap });
      particles.push(particle);
    }

    cirRadius += fitRadius * 2 + gapCircle;
    dotRadius = (1 - quadOut(i / numCircles)) * fitRadius;
  }

  return ({ context, width, height, time }) => {
    if (!animateParticles) return;

    const now = performance.now();
    const delta = now - lastFrameTime;

    if (delta >= frameInterval) {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(10, 0, width, height);

      particles.sort((a, b) => a.scale + b.scale);

      particles.forEach((particle) => {
        particle.update();
        particle.draw(context);
      });

      lastFrameTime = now;
    }
  };
};

const onMouseOut = (e) => {
  window.removeEventListener('mousemove', onMouseMove);

  cursor.x = 9999;
  cursor.y = 9999;
};

const onMouseOver = (e) => {
  if (!clicked) {
    window.addEventListener('mousemove', onMouseMove);
  }

  onMouseMove(e);
};

const onTouch = (e) => {
  if (!clicked) {
    window.addEventListener('touchmove', onToucheMove);
  }

  onToucheMove(e);
};

const onToucheMove = (e) => {
  cursor.x = 670;
  cursor.y = 740;
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  cursor.x = x;
  cursor.y = y;
};

const simulateMouseOver = (canvas) => {
  const simulatedEvent = {
    offsetX: canvas.width / 2,
    offsetY: canvas.height / 2,
  };

  onMouseOver(simulatedEvent);
};

const simulateTouch = (canvas) => {
  const simulatedEvent = {
    offsetX: canvas.width / 1.3,
    offsetY: canvas.height / 2.4,
  };

  onTouch(simulatedEvent);
};

const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      reject(new Error(`Failed to load image at ${url}`));
    };
    img.src = url;
  });
};

export async function start(canvas) {
  try {
    imgA = await loadImage(image);
    imgB = await loadImage(image);

    canvasSketch(({ width, height }) => sketch({ width, height, canvas }), {
      ...settings,
      canvas,
    });

    setTimeout(() => {
      if (window.innerWidth < 450) {
        simulateTouch(canvas);
      } else {
        simulateMouseOver(canvas);
      }
    }, 200);
  } catch (error) {}
}

class Particle {
  constructor({ x, y, radius = 1, colMap }) {
    this.x = x;
    this.y = y;
    this.ax = 0;
    this.ay = 14;
    this.vx = 0;
    this.vy = 0;
    this.ix = x;
    this.iy = y;
    this.radius = radius < 0 ? 1 : radius;
    this.colMap = colMap;
    this.color = colMap(1);
    this.minDist = range(100, 750);
    this.pushFactor = range(0.01, 0.34);
    this.pullFactor = range(0.08, 0.4);
    this.dampFactor = range(0, 0.3);
  }

  update() {
    let dx, dy, dd, distDelta;

    dx = this.ix - this.x;
    dy = this.iy - this.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;
    this.scale = mapRange(dd, 3, 100, 2.6, 1.4);

    this.color = this.colMap(mapRange(dd, 1, 10, 0, 1, true));

    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    distDelta = this.minDist - dd < 0 ? 0 : this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
    }

    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.color;

    context.beginPath();

    try {
      context.arc(1, 0, this.radius + 1.5, 1, Math.PI * 2);
    } catch (error) {}

    context.fill();
    context.restore();
  }
}

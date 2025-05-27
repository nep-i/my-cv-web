import canvasSketch from 'canvas-sketch';
import mandol from './mandol.mp3';
import { range, noise2D } from 'canvas-sketch-util/random';
import { mapRange } from 'canvas-sketch-util/math';
import colormap from 'colormap';

let settings;
export const setClient = (x, y) => {
  clientx = x;
  clienty = y;
  return { clientx, clienty };
};

let clientx = 0,
  clienty = 0;

export let audioContext,
  audioData,
  sourceNode,
  analyserNode,
  audio = null,
  manager,
  elCanvas;
let minDb, maxDb;
let fps = 19,
  lastFrameTime = 0;

export const createAudio = () => {
  audio = document.createElement('audio');
  audio.src = mandol;
  audio.volume = 0.3;
  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const getAverage = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length;
};

const sketch = ({ width, height }) => {
  let cols = 53;
  let rows = 2;
  let numCells = cols * rows * 2;

  let gw = width;
  let gh = height * 0.9;
  let cw = gw / cols;
  let ch = gh / rows;
  let mx = (width - gw) * 0.2;
  let my = (height - gh) * 0.5;

  const points = [];

  let x, y, n, lineWidth, color;
  let frequency = 0.0019;
  let amplitude = 60;

  const colors = colormap({
    colormap: 'bone',
    nshades: 7,
  });

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = noise2D(x, y, frequency, amplitude);
    x += n;
    y += n;

    lineWidth = mapRange(n, -amplitude, 1, 5, 3);

    color =
      colors[
        Math.floor(mapRange(n, -amplitude, range(1, amplitude), 0, amplitude))
      ];

    points.push(new Point({ x, y, lineWidth, color }));
  }

  return ({ context, width, height, frame }) => {
    const frameInterval = 1000 / fps;
    const now = performance.now();
    const delta = now - lastFrameTime;
    const avg = Math.min(Math.abs(getAverage(audioData)) - 50, 255);
    analyserNode.getFloatFrequencyData(audioData);
    if (delta >= frameInterval) {
      // context.fillStyle = `rgba(7, 10, 19,0)`;
      context.clearRect(0, 0, width, height);
      // context.fillRect(0, 0, width, height);

      context.save();
      context.translate(mx, my);
      context.translate(cw * 0.7, ch * 0.5);
      context.strokeStyle = `rgba(${(avg, 255)}, 30, 0, 1)`;
      points.forEach((point) => {
        n = noise2D(
          point.ix * 0.03,
          point.iy * avg * 0.003,
          audio.currentTime * 0.0002,
          audio.currentTime * 0.0002
        );
        point.x = point.ix + n;
        point.y = point.iy + n;
      });

      let lastx, lasty;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          // cw = Math.floor((audio.currentTime * gw) / audioData[r] / 2);
          ch = (audio.currentTime * gh) / avg / 1.2;

          const curr = points[r * cols + c + 0];
          const next = points[r * cols + c + 2];

          const mx = curr.x + (next.x - curr.x) * avg * 0.0001;
          const my = curr.y + (next.y - curr.y) * audio.currentTime * 0.0001;

          if (!c) {
            lastx = curr.x;
            lasty = curr.y;
          }

          context.beginPath();
          context.lineWidth = audio.currentTime / avg;
          context.strokeStyle = curr.color;

          context.moveTo(lastx, lasty);
          context.quadraticCurveTo(
            (curr.x * audio.currentTime) / 9,
            (curr.y * audio.currentTime) / 9,
            (mx * audioData[r]) / 20,
            (my * audio.currentTime * audioData[c]) / 30
          );
          context.stroke();

          lastx = mx - (c / cols) * audioData[c];
          lasty = my - (r / rows) * audioData[r];
        }
      }

      context.restore();
      lastFrameTime = now;
    }
  };
};

class Point {
  constructor({ x, y, lineWidth, color }) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;

    this.ix = x;
    this.iy = y;
  }

  draw(context) {
    context.save();
    context.translate(this.x * audio.currentTime, this.y);
    context.fillStyle = `rgba{${Math.floor(range(120, 255))}, ${Math.floor(range(12, 55))},30,1}`;

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 1.4);
    context.fill();

    context.restore();
  }
}

export const PlayAudio = () => {
  if (audio && audio.paused) {
    audio.play();

    if (manager && typeof manager.play === 'function') {
      manager.play();
    }
  } else {
    if (audio) audio.pause();
    if (manager && typeof manager.pause === 'function') {
      manager.stop();
    }
  }
};

export const start = async (canvas) => {
  if (canvas && !manager) {
    settings = {
      canvas: canvas,
      dimensions: [
        window.innerWidth < 550 ? window.innerHeight : window.innerWidth * 1.4,
        window.innerWidth < 550 ? window.innerWidth * 1.6 : window.innerWidth,
      ],
      animate: true,
    };

    if (!audioContext) createAudio();
    manager = await canvasSketch(sketch, settings);
    PlayAudio();
  } else {
    PlayAudio();
  }
};
export const managerClearer = () => {
  manager = null;
};

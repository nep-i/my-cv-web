import canvasSketch from 'canvas-sketch';
import mandol from './mandol.mp3';
import { range, noise2D } from 'canvas-sketch-util/random';
import { mapRange } from 'canvas-sketch-util/math';
import { quadOut, quadIn } from 'eases';
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
let fps = 24,
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

  console.log(audioData.length);
};

const getAverage = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return Math.abs(sum / data.length);
};

const sketch = ({ width, height }) => {
  let cols = 40;
  let rows = 2;
  let numCells = cols * rows * 2;

  let gw = width;
  let gh = height * 0.9;
  let cw = gw / cols;
  let ch = gh / rows;
  let mx = (width - gw) * 0.2;
  let my = (height - gh) * 0.1;

  const points = [];

  let x, y, n, lineWidth, color;
  let frequency = 0.0007;
  let amplitude = 70;

  const colors = colormap({
    colormap: 'bone',
    nshades: 4,
  });

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = noise2D(x, y, frequency, amplitude);
    x += n;
    y += n;

    lineWidth = mapRange(n, -amplitude, 2, 5, 3);

    color = colors[Math.floor(mapRange(n, -amplitude, amplitude, 0, i))];

    points.push(new Point({ x, y, lineWidth, color }));
  }

  return ({ context, width, height, frame }) => {
    console.log(clientx, clienty);
    const frameInterval = 1000 / fps;
    const now = performance.now();
    const delta = now - lastFrameTime;
    const avg = Math.min(Math.abs(getAverage(audioData)) - 50, 255);
    analyserNode.getFloatFrequencyData(audioData);
    console.log(avg);
    if (delta >= frameInterval) {
      // context;
      context.fillStyle = `rgba(7, 10, 19,1)`;

      context.fillRect(0, 0, width, height);

      context.save();
      context.translate(Math.abs(mx / avg), my * 0.3);
      context.translate(cw * 3, ch * 1.5);
      context.strokeStyle = `rgba(228, 231, 233, 1)`;
      points.forEach((point) => {
        n = noise2D(
          point.ix + audio.currentTime * 0.3,
          point.iy * audio.currentTime * 0.003,
          audio.currentTime * 0.0002,
          audio.currentTime * 0.0002
        );
        point.x = point.ix + n;
        point.y = point.iy + n;
      });

      let lastx, lasty;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          // cw = +audioData.currentTime * 2;
          // ch = +audioData.currentTime / 3;
          // cw += 20;

          cw = Math.floor((audio.currentTime * gw) / audioData[c] / 30);
          ch = Math.floor((audio.currentTime * gh) / audioData[c]) / 50;

          const curr = points[r * cols + c + 0];
          const next = points[r * cols + c + 2];

          const mx = curr.x + (next.x - curr.x) * audio.currentTime * 0.0001;
          const my = curr.y + (next.y - curr.y) * audio.currentTime * 0.0003;

          if (!c) {
            lastx = curr.x;
            lasty = curr.y;
          }

          context.beginPath();
          context.lineWidth = audio.currentTime / range(25, 51);
          context.strokeStyle = curr.color;

          context.moveTo(lastx, lasty);
          context.quadraticCurveTo(
            (curr.x * audio.currentTime) / 3,
            (curr.y * audio.currentTime) / range(avg - 5, avg),
            (mx * avg) / audio.currentTime / 0.2,
            (my * audio.currentTime * avg - 15) / 13.3
          );
          context.stroke();

          lastx = mx - (c / cols) * audioData[c];
          lasty = my - (r / rows) * audioData[r + 3];
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
    context.fillStyle = `rgba{20,12,3,1}`;

    context.beginPath();
    // context.arc(0, 0, 10, 0, Math.PI * range(1, 797));
    context.fill();

    context.restore();
  }
}

export const PlayAudio = () => {
  if (audio && audio.paused) {
    audio.play();
    console.log('Playing');

    if (manager && typeof manager.play === 'function') {
      console.log('Playing animated');
      manager.play();
    }
  } else {
    if (audio) audio.pause();
    if (manager && typeof manager.pause === 'function') {
      manager.stop();
      console.log('Paused animated');
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
  //   PlayAudio();
};
export const managerClearer = () => {
  manager = null;
};

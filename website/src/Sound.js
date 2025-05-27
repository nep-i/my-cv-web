import React, { useEffect, useRef } from 'react';
import SkillLineSection from './SkillSec.js';
import {
  animation,
  playStatus,
  animationInstance,
  animationButtonPlay,
  destroyInstance,
  ChangePlayStatus,
} from './constants.js';
import {
  start as createCanvas,
  managerClearer,
  PlayAudio,
} from './sketch-audio-2.js';

export function Sound() {
  const playIconContainer = useRef(null);
  const canvasRefAudio = useRef(null);
  managerClearer();

  useEffect(() => {
    if (playStatus === 'pause') {
      createCanvas(canvasRefAudio.current);
      managerClearer();
    }

    animation(playIconContainer.current).then(() => {
      if (playStatus === 'play') {
        animationInstance?.playSegments([0, 14], true);
      } else {
        animationInstance?.playSegments([14, 27], true);
      }
    });

    return () => {
      if (animationInstance) destroyInstance();
      if (playStatus === 'pause') {
        animationButtonPlay();
        // ChangePlayStatus();
        PlayAudio();
      }
      // managerClearer();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRefAudio}
        className="canvas-audio"
        style={{
          transform: `scale(${window.innerWidth < 700 ? '1.1' : '0.6'}) rotate(90deg)`,
          position: 'fixed',
          zIndex: 1,
          top: window.outerWidth > 800 ? '70px' : '5vh',
          right:
            window.outerWidth > 1500
              ? '241px'
              : window.outerWidth > 1390
                ? '200px'
                : '-10.4vw',
        }}
      ></canvas>
      <div className="skills-part">
        <div
          style={{
            marginRight: '5%',
            marginTop: window.innerWidth > 800 ? '5px' : '140%',
          }}
        >
          <SkillLineSection
            exp={[
              '19.01.2025',
              `I was playing mandolin in an old, around 1000 years, church. The walls are about 2 meters thick, so it preserved the temperature very well. It's very nice at summer, but it was 0 or -3 outside, so even colder inside, fingers didn't move well, strings were loosen very quickly, but the sound was angelic. The animation ${window.innerWidth > 1000 ? 'below' : 'above'} is created with code.`,
            ]}
            index={432}
          />
        </div>
      </div>
      <button
        ref={playIconContainer}
        className="play-icon"
        style={{
          zIndex: 10,
          position: 'fixed',
          right: '10px',
          top: '10px',
          width:
            window.innerWidth > 1000
              ? '3vw'
              : window.innerWidth > 700 && window.innerWidth < 1000
                ? '4vw'
                : '11vw',
          height:
            window.innerWidth > 1000
              ? '3vw'
              : window.innerWidth > 700 && window.innerWidth < 1000
                ? '4vw'
                : '11vw',
          backgroundColor: 'transparent',
        }}
        onClick={() => {
          animationButtonPlay();
          createCanvas(canvasRefAudio.current);
          managerClearer();
        }}
      ></button>
    </>
  );
}

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';
import './styles.scss';

gsap.registerPlugin(CSSRulePlugin);
gsap.config({ nullTargetWarn: true });

const LineSection = ({ exp, index }) => {
  const id = `education-part-${index}`;
  let showLines = window.innerWidth <= 1300 ? false : true;

  const handleMouseMove = (e) => {
    if (showLines) {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;

      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `#${id}::after { width: ${offsetX}px; }`;
      document.head.appendChild(style);
    }
  };

  const handleMouseLeave = () => {
    if (showLines) {
      const element = document.getElementById(id);
      if (element) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `#${id}::after { width: 0px; }`;
        document.head.appendChild(style);
      }
    }
  };

  return (
    <div
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseLeave={() => handleMouseLeave()}
      key={exp[0] + exp[1]}
      style={{
        fontSize: window.innerWidth < 900 ? '0.8em' : '.9em',
      }}
      id={id}
      className="known"
    >
      <section>{exp[0]}</section>
      <div>{exp[1]}</div>
    </div>
  );
};

export default LineSection;

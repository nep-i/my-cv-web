import './styles.scss';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { start, handleParticleAnimate } from './sketch-particles.js';
import { Poetry } from './Poetry.js';
import { About } from './About.js';
import LineSection from './EducationSec.js';
import SkillLineSection from './SkillSec.js';
import { Sound } from './Sound.js';
import { MainFrameButtons } from './MainFrameButtons.js';
import { Photography } from './Photography.js';
import { HandlePasswordSubmit } from './constants.js';

function App() {
  const canvasRef = useRef(null);
  const [animateLines, setAnimateLines] = useState(false);
  const [initialAnimateLines, setInitialAnimateLines] = useState(true);
  const [sectionText, setSectionText] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [password, setPassword] = useState('123');
  const [context, setContent] = useState('');
  const [error, setError] = useState('');
  const [loggedin, setLoggedin] = useState(false);

  const switchAnimation = (statement) => {
    setAnimateLines(statement);
    handleParticleAnimate(statement);
  };

  const setupSketch = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      await start(canvas);
    }
  };

  useEffect(() => {
    setupSketch();
    handlePasswordSubmit();
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.section-text-bottom-two') &&
        !event.target.closest('.play-icon') &&
        !event.target.closest('.icon') &&
        !event.target.closest('.section-text')
      ) {
        switchAnimation(false);
        setActiveSection(null);
        setSectionText(null);
        setInitialAnimateLines(false);
      }
    };

    if (window.innerWidth < 450) {
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (window.innerWidth < 450) {
        document.removeEventListener('touchstart', handleClickOutside);
      } else {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, []);

  const handleAnimate = (section) => {
    if (activeSection === section) {
      switchAnimation(false);
      setActiveSection(null);
      setSectionText(null);
    } else {
      switch (section) {
        case 'about':
          if (!context) return;
          const about = About(context);
          switchAnimation(true);
          setSectionText(about);
          setActiveSection(section);
          break;

        case 'education':
          if (!context?.education || !Array.isArray(context.education)) return;
          const education = (
            <>
              {context.education.map((exp, index) => LineSection(exp, index))}
            </>
          );
          switchAnimation(true);
          setSectionText(education);
          setActiveSection(section);
          break;

        case 'experience':
          if (!context?.experience || !Array.isArray(context.experience))
            return;
          const experience = (
            <div>
              {context.experience.map((exp, index) => LineSection(exp, index))}
            </div>
          );
          switchAnimation(true);
          setSectionText(experience);
          setActiveSection(section);
          break;

        case 'skills':
          if (!context) return;
          const skills = (
            <div className="skills-part">
              {context.skills.map((exp, index) => (
                <SkillLineSection exp={[exp[0], exp[1]]} index={index} />
              ))}
            </div>
          );
          switchAnimation(true);
          setSectionText(skills);
          setActiveSection(section);
          break;

        case 'sound':
          if (!context) return;
          const sound = <Sound />;

          switchAnimation(true);
          setSectionText(sound);
          setActiveSection(section);

          break;

        case 'poetry':
          if (!context) return;
          const poetry = Poetry;
          switchAnimation(true);
          setSectionText(poetry);
          setActiveSection(section);
          break;

        case 'photography':
          if (!context) return;
          const photo = Photography();
          switchAnimation(true);
          setSectionText(photo);
          setActiveSection(section);
          break;

        case 'qualities':
          if (!context) return;
          const qualities = (
            <div
              className="qualities"
              style={{
                alignItems:
                  window.innerWidth <= 900 ? 'flex-end' : 'flex-start',
                paddingLeft: '10px',
              }}
            >
              {context.qualities.map((exp, index) => (
                <div className="qualy-text" index={index}>
                  {exp}
                </div>
              ))}
            </div>
          );
          switchAnimation(true);
          setSectionText(qualities);
          setActiveSection(section);
          break;

        default:
          break;
      }
    }
  };

  const handlePasswordSubmit = HandlePasswordSubmit(
    password,
    setLoggedin,
    setContent,
    setError
  );

  return MainFrameButtons(
    animateLines,
    handleAnimate,
    activeSection,
    loggedin,
    context,
    canvasRef,
    initialAnimateLines,
    sectionText
  );
}

export default App;

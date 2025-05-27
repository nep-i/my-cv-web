export function MainFrameButtons(
  animateLines,
  handleAnimate,
  activeSection,
  loggedin,
  context,
  canvasRef,
  initialAnimateLines,
  sectionText
) {
  return (
    <div className="app animate-app">
      <div
        className={`above-section `}
        style={{
          height: '35%',
          width: window.innerWidth <= 1200 ? '45%' : '20%',
        }}
      >
        <div
          className={`line-top animate-top-line-initial ${animateLines ? 'animate-top' : ''}`}
        ></div>
        <section
          className={`top-text`}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <section
            className={`section-text ${animateLines ? 'animate-text-top' : ''}`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleAnimate('about');
              }}
              className={activeSection === 'about' ? 'active' : ''}
            >
              about
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleAnimate('sound');
              }}
              className={activeSection === 'sound' ? 'active' : ''}
            >
              sounds
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleAnimate('education');
              }}
              className={activeSection === 'education' ? 'active' : ''}
            >
              education
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleAnimate('experience');
              }}
              className={activeSection === 'experience' ? 'active' : ''}
            >
              experience
            </div>
          </section>
          <section
            className={`section-text-bottom-two ${animateLines ? 'animate-bottom-section-two' : 'de-animate-bottom-section-two'}`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleAnimate('qualities');
              }}
              className={activeSection === 'qualities' ? 'active' : ''}
            >
              qualities
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (loggedin && context) handleAnimate('photography');
              }}
              className={activeSection === 'photography' ? 'active' : ''}
            >
              visuals
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                if (loggedin && context) handleAnimate('poetry');
              }}
              className={activeSection === 'poetry' ? 'active' : ''}
            >
              poetry
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleAnimate('skills');
              }}
              className={activeSection === 'skills' ? 'active' : ''}
            >
              skills
            </div>
          </section>
        </section>
      </div>

      <div
        className="pic"
        style={{
          height: '35%',
          width: window.innerWidth <= 1200 ? '45%' : '20%',
        }}
      >
        <section className="pic-content">
          <div
            className={`line line-one ${animateLines ? 'animate-one' : ''}`}
          ></div>
        </section>
        <div
          className={`line line-two ${animateLines ? 'animate-two' : ''}`}
        ></div>
        <canvas
          ref={canvasRef}
          className={`canvas-pic`}
          style={{ marginTop: '1%', zIndex: 1 }}
        ></canvas>
      </div>

      <div
        className={`bottom-section `}
        style={{
          height: '35%',
          width: window.innerWidth <= 1200 ? '45%' : '20%',
        }}
      >
        <section
          className={`section-text-bottom ${animateLines ? 'animate-bottom-section' : ''}`}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleAnimate('skills');
            }}
            className={activeSection === 'skills' ? 'active' : ''}
          >
            skills
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (loggedin && context) handleAnimate('poetry');
            }}
            className={activeSection === 'poetry' ? 'active' : ''}
          >
            poetry
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (loggedin && context) handleAnimate('photography');
            }}
            className={activeSection === 'photography' ? 'active' : ''}
          >
            visuals
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (loggedin && context) handleAnimate('qualities');
            }}
            className={activeSection === 'qualities' ? 'active' : ''}
          >
            qualities
          </div>
        </section>
        <div
          className={`line-bottom ${initialAnimateLines ? 'animate-bottom-line-initial' : ''} ${animateLines ? 'animate-bottom' : ''}`}
        ></div>
      </div>
      <div className={`main-text ${animateLines ? 'main-text-animate' : ''}`}>
        {sectionText}
      </div>
    </div>
  );
}

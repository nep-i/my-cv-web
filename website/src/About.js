import { RxLinkedinLogo } from 'react-icons/rx';
import { FaGithub } from 'react-icons/fa';
export function About(context) {
  return (
    <div
      className="perinfo"
      style={{
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          width:
            window.innerWidth < 500
              ? '100%'
              : window.innerWidth > 1900
                ? '28%'
                : window.innerWidth < 1400 && window.innerWidth > 500
                  ? '70%'
                  : '35%',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginRight: '10px',
          fontSize: window.innerWidth < 435 ? '1rem' : '1.3rem',
        }}
      >
        <p
          style={{
            textAlign: 'center',
            marginRight: '.3vw',
          }}
        >
          {context.ima}
        </p>

        <a
          href="https://www.linkedin.com/in/dimitriy-belshin-789a98221/"
          className="linkedin icon"
        >
          <RxLinkedinLogo size={'1.6rem'} />
        </a>
        <a href="https://github.com/nep-i" className="git icon">
          <FaGithub size={'1.6rem'} />
        </a>
      </div>

      <br />
      <div
        className="about-about"
        style={{
          textAlign: window.innerWidth > 900 ? 'left' : 'justify',
          width: window.innerWidth > 900 ? '80%' : '100%',
        }}
      >
        {context?.description && context.description}
      </div>
    </div>
  );
}

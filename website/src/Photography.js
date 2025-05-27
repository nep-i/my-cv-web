import girl from './img1.jpg';
import hand from './img2.jpg';
import lantern from './img3.jpg';
import boxer from './img4.jpg';

export function Photography() {
  return (
    <div
      className="photo-section"
      style={{
        alignItems: window.innerWidth <= 900 ? 'flex-end' : 'flex-start',
        top: window.innerWidth <= 1200 ? '35vw' : '50px',
      }}
    >
      <button className="button-img">
        <img className="img" src={girl} alt="girl's hair" />
      </button>
      <button
        style={{
          alignSelf: window.innerWidth <= 900 ? 'flex-start' : 'flex-end',
        }}
        className="button-img"
      >
        <img
          className="img"
          src={hand}
          alt="hand with a sigarette from the balcony"
        />
      </button>
      <button className="button-img">
        <img className="img" src={boxer} alt="bent lantern" />
      </button>
      <button
        className="button-img"
        style={{
          alignSelf: window.innerWidth <= 900 ? 'flex-start' : 'flex-end',
        }}
      >
        <img className="img" src={lantern} alt="boxer" />
      </button>
    </div>
  );
}

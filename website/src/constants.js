import lottieWeb from 'lottie-web';
import pauseFile from './pause.json';
export let animationInstance = null;

export const animation = async (element) => {
  animationInstance = lottieWeb.loadAnimation({
    container: element,
    animationData: pauseFile,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    name: 'Lottie Animation',
  });
  return animationInstance;
};

export let playStatus = 'play';
export const destroyInstance = () => {
  animationInstance.destroy();
};

export const ChangePlayStatus = () => {
  if (playStatus === 'play') {
    playStatus = 'pause';
  } else {
    playStatus = 'play';
  }
};
export const animationButtonPlay = async () => {
  ChangePlayStatus();
  const anim = animationInstance;

  if (playStatus === 'play') {
    anim.playSegments([0, 14], true);
  } else {
    anim.playSegments([14, 27], true);
  }
};

export function HandlePasswordSubmit(
  password,
  setLoggedin,
  setContent,
  setError
) {
  return async () => {
    try {
      const url =
        process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';
      const response =
        password.trim().length > 0
          ? await fetch(url + '/api.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password }),
            })
          : null;
      if (!response) return;
      const data = await response.json();
      if (data.status === 'success') {
        setLoggedin(true);
        setContent(data);
        setError('');
      } else {
        setError('wrong pass');
      }
    } catch (error) {
      setError('wrong pass');
    }
  };
}

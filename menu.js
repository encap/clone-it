/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
const menu = document.getElementsByClassName('menu');
const helpBtn = document.getElementsByClassName('helpBtn');
const overlay = document.querySelector('.overlay');

const popUp = {
  show(el) {
    console.log(`showing ${el.id}`);
    if (mobile && el.classList.contains('fullscreen')) {
      overlay.style.filter = 'none';
    } else {
      overlay.style.filter = styles.overlayBlur;
      overlay.style.pointerEvents = 'none';
    }

    el.style.display = 'block';

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
      if (el === helpMenu) {
        pauseMenu.style.display = 'none';
        if (level.started || !level.firstTime) {
          document.querySelector('#helpMenu .menuTop .title').innerText = 'Need some help?';
        }
      }
    }, 100);

    if (el === pauseMenu) {
      document.addEventListener('keydown', changeLevelNumber);
    }

    level.timer.stop();
    if (level.inProgress || level.started) {
      resume.removeAttribute('disabled');
      resume.style.display = 'block';
    } else {
      author.style.display = 'unset';
      resume.setAttribute('disabled', true);
      resume.style.display = 'none';
    }
  },

  close(el = menu) {
    console.log(`closing ${el.id ? el.id : 'all'}`);
    if (el !== helpMenu) {
      author.style.display = 'none';
      overlay.style.filter = 'none';
      overlay.style.pointerEvents = 'all';
    }

    level.timer.start();

    if (el === menu) {
      for (let i = 0; i < el.length; i += 1) {
        el[i].style.opacity = '0';
        el[i].style.transform = 'translate(-50%, -50%) scale(.5)';

        if (el[i].id === 'levelNotFoundMenu') {
          el[i].style.display = 'none';
        } else {
          setTimeout(() => {
            el[i].style.display = 'none';
          }, 200);
        }
      }
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(.5)';
      if (el.id === 'levelNotFoundMenu') {
        el.style.display = 'none';
      } else {
        setTimeout(() => {
          if (el === helpMenu) pauseMenu.style.display = 'block';
          el.style.display = 'none';
        }, 200);
      }
    }
  },
};

for (let i = 0; i < menu.length; i += 1) {
  try {
    menu[i].querySelector('.resume').addEventListener('click', () => {
      popUp.close();
      document.addEventListener(
        'keydown',
        () => {
          level.inProgress = true;
          check.disabled = false;
        },
        { once: true },
      );
    });
  } catch (e) {
    // nothing
  }
  try {
    menu[i]
      .querySelector('.closeMenu')
      .addEventListener('click', () => popUp.close());
  } catch (e) {
    // nothing
  }
  try {
    menu[i]
      .querySelector('.helpBtn')
      .addEventListener('click', () => popUp.show(helpMenu));
  } catch (e) {
    // nothing
  }
  try {
    menu[i]
      .querySelector('.reset')
      .addEventListener('click', () => level.reset());
  } catch (e) {
    // nothing
  }
}

document
  .querySelector('.helpBtn')
  .addEventListener('click', () => popUp.show(helpMenu));
document
  .querySelector('#helpMenu .closeBtn')
  .addEventListener('click', () => popUp.close(helpMenu));
document
  .querySelector('#fixButton')
  .addEventListener('click', () => popUp.close());

document.getElementById('closeHelp').addEventListener('click', () => {
  popUp.close(helpMenu);

  if (level.firstTime) {
    level.firstTime = false;
    console.log('first time');
    level.loadLevel();
  }
});

document.getElementById('loadLevel').addEventListener('click', () => {
  document.removeEventListener('keydown', changeLevelNumber);
  if (mobile && !document.location.search.includes('utm_source=pwa')) {
    document.querySelector('html').requestFullscreen({ nagivationUI: 'hide' });
  }
  if (level.inProgress) {
    popUp.close(pauseMenu);
    popUp.show(confirmMsg);
    decline.onclick = () => {
      popUp.close(confirmMsg);
      popUp.show(pauseMenu);
    };
    accept.onclick = () => {
      level.loadLevel();
    };
  } else {
    level.loadLevel();
  }
});
document
  .getElementById('loadFirstLevel')
  .addEventListener('click', () => level.loadLevel(1));
document
  .getElementById('loadNextLevel')
  // eslint-disable-next-line no-plusplus
  .addEventListener('click', () => level.loadLevel(++level.current));
document.getElementById('donateButton').addEventListener('click', () => {

});
document
  .getElementById('pause')
  .addEventListener('click', () => popUp.show(pauseMenu));

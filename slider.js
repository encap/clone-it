/* eslint-disable prefer-destructuring */
const description = [
  'You have to match selectors in stylesheet based on read-only page structure.',
  'This mode is all about dragging lines of css rules to right place.',
  'Finally, you can write your own CSS.',
  'Like in real life. Write page structure and stylesheet. You should use some provided hints.',
  'Everything is in your hand.',
  "Ohh, you can't decide?",
];
const slider = document.querySelector('#modeSlider');
const modeDesc = document.querySelector('.modeDesc');
[modeDesc.innerHTML] = description;

function setThumbPosition(pos) {
  slider.value = pos;
  slider.updateThumb();
}

let timeout;
let percent = 0;
slider.updateThumb = () => {
  if (timeout) {
    window.cancelAnimationFrame(timeout);
  }

  timeout = window.requestAnimationFrame(() => {
    percent = Number(slider.value);
    console.log(percent);
    // console.log(level.mode);
    label0.style.color = '';
    label1.style.color = '';
    label2.style.color = '';
    label3.style.color = '';
    label4.style.color = '';
    slider.classList.remove(
      'cyan',
      'blue',
      'darkBlue',
      'darkBlue2',
      'purple',
      'pink',
      'lightRed',
      'red',
      'proRed',
    );
    // don't look at this spaghetti
    if (percent >= 0 && percent < 8) {
      level.mode = 'selector';
      root.style.setProperty('--thumbColor', 'var(--cyan)');
      label0.style.color = styles.cyan;
    } else if (percent >= 8 && percent < 17) {
      level.mode = 'undecided';
      root.style.setProperty('--thumbColor', 'var(--blue)');
    } else if (percent >= 17 && percent < 25) {
      level.mode = 'junior';
      root.style.setProperty('--thumbColor', 'var(--darkBlue)');
      label1.style.color = styles.darkBlue;
    } else if (percent >= 25 && percent < 33) {
      level.mode = 'junior';
      root.style.setProperty('--thumbColor', 'var(--darkBlue2)');
      label1.style.color = styles.darkBlue2;
    } else if (percent >= 33 && percent < 42) {
      level.mode = 'undecided';
      root.style.setProperty('--thumbColor', 'var(--darkBlue2)');
    } else if (percent >= 42 && percent < 50) {
      level.mode = 'easy';
      root.style.setProperty('--thumbColor', 'var(--purple)');
      label2.style.color = styles.purple;
    } else if (percent >= 50 && percent < 58) {
      level.mode = 'easy';
      root.style.setProperty('--thumbColor', 'var(--purple)');
      label2.style.color = styles.purple;
    } else if (percent >= 58 && percent < 67) {
      level.mode = 'undecided';
      root.style.setProperty('--thumbColor', 'var(--pink)');
    } else if (percent >= 67 && percent < 75) {
      level.mode = 'normal';
      root.style.setProperty('--thumbColor', 'var(--lightRed)');
      label3.style.color = styles.lightRed;
    } else if (percent >= 75 && percent < 83) {
      level.mode = 'normal';
      root.style.setProperty('--thumbColor', 'var(--red)');
      label3.style.color = styles.red;
    } else if (percent >= 83 && percent < 92) {
      level.mode = 'undecided';
      root.style.setProperty('--thumbColor', 'var(--proRed)');
    } else if (percent >= 92 && percent <= 100) {
      level.mode = 'pro';
      root.style.setProperty('--thumbColor', 'var(--proRed)');
      label4.style.color = styles.proRed;
    }

    modeDesc.style.color = 'inherit';
    switch (level.mode) {
      case 'selector':
        modeDesc.innerHTML = description[0];
        preventTyping(true);
        break;
      case 'junior':
        modeDesc.innerHTML = description[1];
        preventTyping(true);
        break;
      case 'easy':
        modeDesc.innerHTML = description[2];
        preventTyping(true);
        break;
      case 'normal':
        modeDesc.innerHTML = description[3];
        preventTyping(false);
        hints.checked = false;
        break;
      case 'pro':
        modeDesc.innerHTML = description[4];
        preventTyping(false);
        hints.checked = true;
        break;
      default:
        setTimeout(() => {
          if (level.mode === 'undecided') {
            modeDesc.innerHTML = description[5];
          }
        }, 2000);
    }
  });
};

slider.updateThumb();

slider.addEventListener('input', slider.updateThumb, false);

const labels = document.querySelector('.labels');
for (let label = 0; label < labels.childNodes.length; label += 1) {
  if (labels.childNodes[label].nodeType !== 3) {
    labels.childNodes[label].addEventListener('click', () => {
      setThumbPosition((25 * (label - 1)) / 2);
    });
  }
}

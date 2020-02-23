const style = document.getElementById('style');
const root = document.documentElement;
const footer = document.querySelector('footer');
const codeMirrorClass = document.getElementsByClassName('CodeMirror');

let fontSize = 15;

let mobile = false;

function layout1() {
  style.innerHTML = `
main {
  overflow-y: scroll !important;
}

main:after {
  width: 199%;
  top: 99%;
}

.html, .css, .formula, .result {
  height: 100% !important;
}

.html, .formula {
  padding-bottom: 14px;
  scroll-snap-align: start;
}

.css, .result {
  padding-top: 15x;
  scroll-snap-align: end;
}

#layout1 {
  display: none;
}

#layout2 {
  display: inline;
}
`;
  try {
    setTimeout(() => {
      htmlCodeEditor.refresh();
      cssCodeEditor.refresh();
    }, 300);
  } catch (e) {
    console.log(e);
  }
}

if (window.screen.width <= 600) {
  mobile = true;
  autoRefresh.checked = true;
  layout1();
}

function layout2() {
  style.innerHTML = `
#layout2 {
  display: none;
}
`;
  htmlCodeEditor.refresh();
  cssCodeEditor.refresh();
}

window.addEventListener('resize', () => {
  if (window.screen.width <= 600) {
    mobile = true;
  } else {
    mobile = false;
  }
});

function changeLevelNumber(ev) {
  if (ev.keyCode >= 48 && ev.keyCode <= 57) {
    if (level.current === 0 || level.current.length === 2) {
      level.current = '';
    }
    level.current = level.current.toString() + ev.key;
    loadLevel.innerText = `Load: ${level.current}`;
  }
}

document.addEventListener('keydown', changeLevelNumber);

document.getElementById('layout1').addEventListener('click', layout1);
document.getElementById('layout2').addEventListener('click', layout2);

function getCssVarNames(styleSheets) {
  const cssVars = [];
  // loop each stylesheet
  for (let i = 0; i < 1; i += 1) {
    // loop stylesheet's cssRules
    try {
      // try/catch used because 'hasOwnProperty' doesn't work
      for (let j = 0; j < 1; j += 1) {
        try {
          // loop stylesheet's cssRules' style (property names)
          for (let k = 0; k < styleSheets[i].cssRules[j].style.length; k += 1) {
            const name = styleSheets[i].cssRules[j].style[k];
            // test name for css variable signiture and uniqueness
            if (name.startsWith('--') && cssVars.indexOf(name) === -1) {
              cssVars.push(name);
            }
          }
        } catch (e) {
          console.trace(e);
        }
      }
    } catch (e) {
      console.trace(e);
    }
  }
  return cssVars;
}

function getElementCSSVariables(varsNames, element = document.body) {
  const elStyles = window.getComputedStyle(element);
  const cssVars = {};
  for (let i = 0; i < varsNames.length; i += 1) {
    const key = varsNames[i];
    const value = elStyles.getPropertyValue(key);
    if (value) {
      cssVars[key.substring(2)] = value;
    }
  }
  return cssVars;
}

const cssVarsNames = getCssVarNames(document.styleSheets);
const styles = getElementCSSVariables(cssVarsNames, document.documentElement);
// console.table(styles);

document.getElementById('zoomOut').addEventListener('click', () => {
  if (fontSize > 8) {
    zoomIn.disabled = false;
    fontSize -= 1;
    codeMirrorClass[0].style.fontSize = `${fontSize}px`;
    codeMirrorClass[1].style.fontSize = `${fontSize}px`;
    cmStyle.innerText = `
    .codemirror-colorview {
      --size: ${fontSize - 2}px
    }`;
  } else {
    zoomOut.disabled = true;
  }
});
document.getElementById('zoomIn').addEventListener('click', () => {
  if (fontSize < 50) {
    zoomOut.disabled = false;
    fontSize += 1;
    codeMirrorClass[0].style.fontSize = `${fontSize}px`;
    codeMirrorClass[1].style.fontSize = `${fontSize}px`;
    cmStyle.innerText = `
    .codemirror-colorview {
      --size: ${fontSize - 2}px
    }`;
  } else {
    zoomIn.disabled = true;
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const original = document.getElementById('original');
const mirror = document.getElementById('mirror');
const cssArea = document.querySelector('.cssArea');

document.getElementById('check').addEventListener('click', () => level.check());
document.getElementById('undo').addEventListener('click', () => undo());
document.getElementById('reset').addEventListener('click', () => level.reset());
document
  .getElementById('skipLevel')
  .addEventListener('click', () => level.skip());

function run() {
  mirror.srcdoc = `${level.hiddenhtml}
  ${level.globalhtml}
  <style>
    ${level.globalcss}
    ${level.hiddencss}
    ${cssCodeEditor.getValue()}
  </style>
  ${htmlCodeEditor.getValue()}`;
  // console.log('run');
}

document.getElementById('run').addEventListener('click', run);

const dragHistory = [];
let currentDragElement;
let dragElementWidth;

function handleDragStart(ev) {
  console.log('drag');
  currentDragElement = ev.target;
  dragElementWidth = window
    .getComputedStyle(ev.target)
    .getPropertyValue('width');
  root.style.setProperty('--cursorWidth', dragElementWidth);
  root.style.setProperty('--cursorColor', 'var(--proRedAlpha)');
  ev.dataTransfer.setData('text/plain', ' ');
}

let doc;
let cursorPos;

function handleDrop() {
  level.inProgress = true;
  check.disabled = false;
  console.log('drop');
  doc = cssCodeEditor.getDoc();
  cursorPos = doc.getCursor();
  cssCodeEditor.replaceRange(
    `${currentDragElement.innerText} {`,
    { line: cursorPos.line, ch: 0 },
    { line: cursorPos.line },
  );

  if (level.mode === 'selector' || level.mode === 'easy') {
    currentDragElement.style.backgroundColor = 'var(--cyanAlpha)';
    dragHistory.push(currentDragElement);
  }

  root.style.setProperty('--cursorWidth', '2px');
  root.style.setProperty('--cursorColor', '#56b6c2');
}

cssArea.addEventListener('drop', handleDrop);

document.addEventListener(
  'keydown',
  (ev) => {
    if (
      (window.navigator.platform.match('Mac') ? ev.metaKey : ev.ctrlKey)
      && ev.altKey
      && ev.key === 'z'
    ) {
      ev.preventDefault();
      console.log('redo');
      cssCodeEditor.redo();
      cssCodeEditor.redo();
    } else if (
      (window.navigator.platform.match('Mac') ? ev.metaKey : ev.ctrlKey)
      && ev.key === 'z'
    ) {
      ev.preventDefault();
      undo();
    } else if (
      (window.navigator.platform.match('Mac') ? ev.metaKey : ev.ctrlKey)
      && ev.key === 's'
    ) {
      ev.preventDefault();
      run();
    } else if (
      (window.navigator.platform.match('Mac')
        ? ev.metaKey
        : ev.ctrlKey && ev.shiftKey && ev.altKey)
      && ev.key === 'Q'
    ) {
      ev.preventDefault();
      level.cheat();
    }
  },
  false,
);

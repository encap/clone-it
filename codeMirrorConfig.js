const htmlEditorArea = document.getElementById('htmlEditorArea');
const cssEditorArea = document.getElementById('cssEditorArea');

const config = {
  theme: 'one-dark',
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 2,
  showCursorWhenSelecting: true,
  autoCloseBrackets: true,
  matchTags: true,
};

const configHtml = {
  ...config,
  mode: 'text/html',
  placeholder: 'Page structure',
  autoCloseTags: true,
};
const configCss = {
  ...config,
  mode: 'css',
  placeholder: 'Your styling',
  autofocus: true,
  colorpicker: {
    mode: 'view',
  },
};

const htmlCodeEditor = CodeMirror.fromTextArea(htmlEditorArea, configHtml);
const cssCodeEditor = CodeMirror.fromTextArea(cssEditorArea, configCss);

function indentWrappedLine(editor) {
  const charWidth = editor.defaultCharWidth();
  const basePadding = 2;
  editor.on('renderLine', (cm, line, elt) => {
    const offset =
      CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) *
      charWidth;
    elt.style.textIndent = `-${offset}px`;
    elt.style.paddingLeft = `${basePadding + offset}px`;
  });
  editor.refresh();
}

indentWrappedLine(htmlCodeEditor);
indentWrappedLine(cssCodeEditor);

function preventTyping(prevent) {
  htmlCodeEditor.setOption('readOnly', prevent);
  htmlCodeEditor.setOption('cursorBlinkRate', prevent ? -1 : 530);
  cssCodeEditor.setOption('cursorBlinkRate', prevent ? -1 : 530);
}

function undo() {
  cssCodeEditor.undo();
  if (dragHistory.length) dragHistory.pop().style.backgroundColor = 'unset';
}

const level = {
  current: 1,
  mode: 'selector',
  started: false,
  inProgress: false,
  firstTime: !document.cookie.match('(^|; )firstTime=([^;]*)'),
  isNotFound: false,

  handleNotFound() {
    console.warn('NOT FOUND');
    // eslint-disable-next-line prettier/prettier
    levelNotFoundMenu.querySelector('.title').innerText = `Level ${this.current} not found!`;

    popUp.close(loading);
    popUp.show(levelNotFoundMenu);

    mirror.srcdoc = '';
    this.html = '';
    this.css = '';
    this.userhtml = `Level ${this.current} not found!`;
    this.usercss = 'Ups';
    this.hiddenCss = '{} * {display: none}';
  },

  loadLevel(whichLevel = 'current') {
    slider.updateThumb();
    reset.disabled = true;
    skipLevel.disabled = true;
    check.disabled = true;
    this.started = false;
    this.inProgress = false;

    if (this.firstTime) {
      popUp.show(helpMenu);
      const d = new Date();
      d.setTime(d.getTime() + 60 * 24 * 60 * 60 * 1000);
      const expires = `;expires=${d.toUTCString()}`;
      document.cookie = `firstTime=false${expires}`;
      return;
    }

    if (this.mode === 'undecided') {
      // eslint-disable-next-line prefer-destructuring
      modeDesc.innerHTML = description[5];
      modeDesc.style.color = styles.proRed;
      console.log(this.mode);

      return;
    }

    popUp.close();

    console.warn(`Loading ${this.current}`);
    if (whichLevel !== 'current') {
      this.current = whichLevel;
    }

    popUp.show(loading);

    const paths = {
      html: `global/${this.current}.html`,
      hiddenhtml: `global/${this.current}h.html`,
      css: `global/${this.current}.css`,
      hiddencss: `global/${this.current}h.css`,
      usercss: `${this.mode}/${this.current}.css`,
      json: `global/${this.current}.json`,
    };

    if (this.mode === 'easy' || this.mode === 'normal' || this.mode === 'pro') {
      delete paths.usercss;
      if (this.mode === 'normal') {
        paths.userhtml = `${this.mode}/${this.current}.html`;
      } else if (this.mode === 'pro') {
        delete paths.userhtml;
      }
    }

    const urls = Object.values(paths);
    const names = Object.keys(paths);

    const fetchFile = url => {
      return new Promise((resolve, reject) => {
        fetch(`./levels/${url}`).then(response => {
          if (response.ok) {
            resolve(response.text());
          } else {
            reject(new Error(response.statusText));
          }
        });
      });
    };


    Promise.all(urls.map(url => fetchFile(url)))
      .then(data => {
        for (let i = 0; i < data.length; i += 1) {
          this[names[i]] = data[i];
        }

        if (this.mode === 'normal' || this.mode === 'pro') {
          this.usercss = '';
          if (this.mode === 'pro') {
            this.userhtml = '';
          }
        } else {
          this.userhtml = this.html;
        }

        if (!hints.checked || this.mode === 'junior') {
          // false = show hints; its oppo
          try {
            this.json = JSON.parse(this.json);
            this.showHints();
          } catch (e) {
            console.error('JSON ERROR');
            console.error(e);
          }
        } else {
          document.querySelector('.css').style.display = 'block';
          puzzles.style.display = 'none';
        }

        original.srcdoc = `${this.hiddenhtml}${this.globalhtml}<style>${this.globalcss}${this.hiddencss}${this.css}</style>${this.html}`;

        htmlCodeEditor.setValue(this.userhtml);

        setTimeout(() => {
          cssCodeEditor.setValue(this.usercss);
          const htmlHistory = cssCodeEditor.getHistory();
          const cssHistory = cssCodeEditor.getHistory();
          htmlHistory.done.shift();
          htmlHistory.done.shift();
          cssHistory.done.shift();
          cssHistory.done.shift();
          htmlCodeEditor.setHistory(htmlHistory);
          cssCodeEditor.setHistory(cssHistory);

          popUp.close(loading);
          popUp.close(pauseMenu);
          popUp.close(resultsMenu);

          if (clock.checked) {
            this.timer.hText.style.opacity = '0';
            this.timer.minText.style.opacity = '0';
            this.timer.secText.style.opacity = '0';
          }
          this.timer.reset();
          this.timer.start();

          this.started = true;

          document.addEventListener(
            'keydown',
            () => {
              this.inProgress = true;
              check.disabled = false;
            },
            { once: true }
          );

          // console.warn(`Loaded ${this.current}`);

          if (!autoRefresh.checked) {
            if (this.mode === 'normal' || this.mode === 'pro') {
              htmlCodeEditor.on('change', () => run());
            }
            cssCodeEditor.on('change', () => run());
          }

          run();
          reset.disabled = false;
          skipLevel.disabled = false;
        }, 100);
      })
      .catch(error => {
        this.handleNotFound();
        throw Error(error);
      });
  },
  check() {
    console.log('check');
    check.disabled = true;
    fixButton.style.display = 'none';
    donateButton.style.display = 'none';
    loadNextLevel.classList.remove('shouldFix');

    const messageText = [
      'does not match',
      "isn't as expected",
      'not reflect original',
      "doesn't match",
    ];
    const hintText = [
      'should be',
      '<i class="fas fa-long-arrow-alt-right"></i>',
      'expected:',
      'must be:',
    ];

    loadNextLevel.disabled = false;
    popUp.show(loading);
    run();

    setTimeout(() => {
      if (
        level.mode === 'pro' ||
        level.mode === 'normal' ||
        level.mode === 'easy'
      ) {
        // eslint-disable-next-line prettier/prettier
        resultsMenu.querySelector('h2').innerText = `Unfortunatly, this mode currently doesn't support automated checking.`;
      } else {
        review().then(
          result => {
            console.log('Excellent job');
            level.correct = true;
            loadNextLevel.innerText = 'Next';
            loadNextLevel.classList.remove('shouldFix');
            loadNextLevel.parentNode.replaceChild(
              loadNextLevel.cloneNode(true),
              loadNextLevel
            );
            document
              .getElementById('loadNextLevel')
              .addEventListener('click', () =>
                // eslint-disable-next-line no-plusplus
                level.loadLevel(++level.current)
              );
            fixButton.style.display = 'none';
            donateButton.style.display = 'inline-block';
            // eslint-disable-next-line prettier/prettier
            resultsMenu.querySelector('h2').innerText = `Some shit about your genius`;
            resultsMenu.querySelector(
              '.resultsContainer'
            ).innerHTML = `<p>Level completed in ${this.timer.min +
              60 * this.timer.h} minutes and ${this.timer.sec} seconds.<p/>`;

            popUp.close(loading);
            popUp.show(resultsMenu);
            check.disbaled = false;
          },
          errors => {
            console.warn(errors);
            level.correct = false;
            fixButton.style.display = 'block';
            resultsMenu.querySelector('h2').innerText = '';
            resultsMenu.querySelector('.resultsContainer').innerHTML = '';

            let i = 0;
            errors.forEach(message => {
              i += 1;

              if (i < 4) {
                const tempEl = document.createElement('DIV');
                tempEl.classList.add('messageContainer');
                const tempMessage = document.createElement('p');
                tempMessage.classList.add('message');

                if (message.type === 1) {
                  tempEl.innerHTML += `<i class="fas fa-exclamation-circle messageIcon"></i>`;
                  tempMessage.innerHTML += `<span class="messageText"> You did not match all the selectors. </span>`;
                  tempMessage.innerHTML += `<span class="messageElement">at line:&nbsp;<span class="messageElementName">${message.line}</span></span>
                  `;

                  tempEl.appendChild(tempMessage);

                  if (!mobile) {
                    i -= 1;
                  }
                } else if (message.type === 2) {
                  const random = Math.floor(Math.random() * 4);
                  console.log(random);

                  let elementName;
                  if (message.element.id !== '') {
                    elementName = `#${message.element.id}`;
                  } else if (
                    message.element.id === '' &&
                    message.element.className !== ''
                  ) {
                    elementName = `.${message.element.className}`;
                  } else {
                    elementName = message.element.tagName.toLowerCase();

                    if (elementName === 'input') {
                      elementName += `<span class="bracket">[</span>type
                      <span class="equal">=</span>
                      <span class="attribute">
                      "${message.element.getAttribute('type')}"
                      </span>
                      <span class="bracket">]</span>`;
                    }
                  }

                  tempEl.innerHTML += `<i class="fas fa-bug messageIcon"></i>`;
                  tempMessage.innerHTML += `
                  <span class="messageText">
                    <span class="messageProperty">
                    ${message.property.charAt(0).toUpperCase() +
                      message.property
                        .slice(1)
                        .replace(/([a-z])([A-Z])/g, '$1 $2')}
                    </span>
                    &nbsp;${messageText[random]} 
                  </span>`;

                  tempMessage.innerHTML += `<span class="messageElement">at 
                  <span class="messageElementName">${elementName}</span>
                  </span>`;

                  tempEl.appendChild(tempMessage);

                  if (!hints.checked && message.property !== 'margin') {
                    if (message.expected.includes('rgb')) {
                      message.current = '';
                      message.expected = `<i class="color" style="border: 1px solid var(--ticks); display: inline-block; height: 1.2em; width: 3em; background-color: ${message.expected}; transform: translateY(0.2em)">`;
                    }

                    const tempHint = document.createElement('p');
                    tempHint.classList.add('messageHint');
                    tempHint.innerHTML += `<span class="hintCurrent">${message.current}</span>`;
                    tempHint.innerHTML += `<span class="hintText"> ${hintText[random]} </span>`;

                    tempHint.innerHTML += `<span class="hintExpected">${message.expected} </span>`;

                    tempEl.appendChild(tempHint);
                  }
                } else {
                  tempEl.innerHTML += `<i class="fas fa-exclamation messageIcon"></i>`;
                  tempMessage.innerHTML += `<span class="messageText> Sorry, we couldn't review your solution. </span>`;

                  tempEl.appendChild(tempMessage);
                }

                resultsMenu
                  .querySelector('.resultsContainer')
                  .appendChild(tempEl);
              } else if (i === 5) {
                let numberOfErrors = errors.length - i + 1;
                if (numberOfErrors > 15) {
                  numberOfErrors = 'many';

                  loadNextLevel.classList.add('shouldFix');

                  loadNextLevel.addEventListener('mouseover', () => {
                    loadNextLevel.innerText = 'YOU SHOULD FIX IT';
                  });
                  loadNextLevel.addEventListener('mouseout', () => {
                    loadNextLevel.innerText = 'Next';
                  });
                }

                resultsMenu.querySelector('.resultsContainer').innerHTML += `
                <p class="manyMore">
                  And ${numberOfErrors} more...
                </p>`;
              }
            });

            popUp.close(loading);
            popUp.show(resultsMenu);
          }
        );
      }
    }, 200);
  },
  reset() {
    function doReset() {
      htmlCodeEditor.setValue('');
      cssCodeEditor.setValue('');
      puzzles.innerHTML = '';
      original.srcdoc = '';
      mirror.srcdoc = '';
      level.timer.reset();
      level.timer.start();
      level.loadLevel();
      console.log('reset');
    }

    if (this.inProgress) {
      popUp.show(confirmMsg);

      decline.onclick = () => popUp.close(confirmMsg);
      accept.onclick = () => doReset();
    } else {
      doReset();
    }
  },
  skip(toLevel = this.current + 1) {
    function doSkip() {
      level.current = toLevel;
      level.loadLevel();
      console.log('skipLevel');
    }
    if (this.inProgress) {
      popUp.show(confirmMsg);
      decline.onclick = () => popUp.close(confirmMsg);
      accept.onclick = () => {
        doSkip();
      };
    } else {
      doSkip();
    }
  },
  cheat() {
    htmlCodeEditor.setValue(this.html);
    cssCodeEditor.setValue(this.css);
    run();
  },
  showHints() {
    puzzles.innerHTML = '';

    shuffleArray(this.json.cssHints);
    this.json.cssHints.forEach(hint => {
      const el = document.createElement('span');
      el.innerText = hint;
      el.setAttribute('draggable', true);
      el.setAttribute('ondragstart', 'handleDragStart(event)');
      puzzles.appendChild(el);
      document.querySelector('.css').style.display = 'flex';
      puzzles.style.display = 'block';
    });
  },
  timer: {
    Interval: '',
    sec: 0,
    min: 0,
    h: 0,
    hText: document.getElementById('h'),
    minText: document.getElementById('min'),
    secText: document.getElementById('sec'),
    counter() {
      this.sec += 1;
      if (this.sec < 9) {
        this.secText.innerHTML = `0${this.sec}`;
      }
      if (this.sec > 9) {
        this.secText.innerHTML = this.sec;
      }
      if (this.sec === 60) {
        this.min += 1;
        if (this.min < 9) {
          this.minText.innerHTML = `0${this.min} `;
        }
        if (this.min > 9) {
          this.minText.innerHTML = `${this.min} `;
        }
        if (this.min === 60) {
          this.h += 1;
          this.hText.innerHTML = `0${this.h} : `;
          this.min = 0;
          this.minText.innerHTML = '00 ';
        }
        this.sec = 0;
        this.secText.innerHTML = '00';
      }
    },
    start() {
      this.minText.innerHTML = '';
      clearInterval(this.Interval);
      this.Interval = setInterval(() => this.counter(), 1000);
    },
    stop() {
      clearInterval(this.Interval);
    },
    reset() {
      clearInterval(this.Interval);
      this.min = 0;
      this.sec = 0;
      this.minText.innerHTML = this.min;
      this.secText.innerHTML = `0${this.sec}`;
      console.log('Timer reseted');
    },
  },
  html: '',
  hiddenhtml: '',
  userhtml: '',
  css: '',
  hiddencss: '',
  usercss: '',
  globalhtml: `<script>console.log = function() {}; console.error = function() {}</script>`,
  globalcss: `
  *:selection {
    background: grey;
  }
  body {
    user-select: none;
  }
  ::-webkit-scrollbar {
      width: 9px;
      height: 9px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #5c6370 !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    `,
};

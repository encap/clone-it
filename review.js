const review = () => {
  return new Promise(function(resolve, reject) {
    const message = [];
    console.log('Review started');

    try {
      const lines = cssCodeEditor.getValue().split(/\r?\n/);
      console.log(lines);
      let i = 0;
      lines.some(line => {
        i += 1;
        console.log(line);
        if (line.includes('___')) {
          message.push({
            type: 1,
            line: i,
          });
          return true;
        }
        return false;
      });

      // eslint-disable-next-line prettier/prettier
      const originalContent = original.contentWindow.document.querySelectorAll('*');
      console.log(originalContent);
      const mirrorContent = mirror.contentWindow.document.querySelectorAll('*');
      console.log(mirrorContent);

      const propertiesToCheck = [
        'boxSizing',
        'display',
        'color',
        'background-color',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'margin',
        'padding',
        'outline',
        'border',
        'textAlign',
        'textDecoration',
        'flexDirection',
      ];

      Object.keys(mirrorContent).forEach(elementIndex => {
        mirrorEl = mirrorContent[elementIndex];
        const tag = mirrorEl.tagName.toLowerCase();
        if (
          tag !== 'head' &&
          tag !== 'meta' &&
          tag !== 'title' &&
          tag !== 'style' &&
          tag !== 'link' &&
          tag !== 'script'
        ) {
          mirrorElStyle = window.getComputedStyle(mirrorEl);
          originalEl = originalContent[elementIndex];
          originalElStyle = window.getComputedStyle(originalEl);
          console.warn(`Type: ${mirrorEl.getAttribute('type')}`);

          propertiesToCheck.forEach(property => {
            console.log(
              `Checking property ${property} of ${mirrorEl.tagName} 
              ${mirrorEl.id !== '' ? `#${mirrorEl.id}` : ''} 
              ${mirrorEl.className !== '' ? `.${mirrorEl.className}` : ''}`
            );

            if (mirrorElStyle[property] === originalElStyle[property]) {
              console.log(`✓ ${property} is ${mirrorElStyle[property]}`);
            } else if (
              mirrorEl.getAttribute('type') &&
              mirrorEl.getAttribute('type').includes('SVG')
            ) {
              // nothing
            } else {
              console.warn(
                `✗ ${property} doesn't match. ${mirrorElStyle[property]} ≠ ${originalElStyle[property]}`
              );
              message.push({
                type: 2,
                // eslint-disable-next-line prettier/prettier
                'property': property,
                element: mirrorEl,
                current: mirrorElStyle[property],
                expected: originalElStyle[property],
              });
            }
          });
        }
      });
    } catch (e) {
      console.warn(`Review error`);
      console.error(e);
      // eslint-disable-next-line prefer-promise-reject-errors
      reject([
        {
          type: 0,
        },
      ]);
    }

    if (Array.isArray(message) && !message.length) {
      resolve();
    } else if (Array.isArray(message)) {
      reject(message);
    }
  });
};

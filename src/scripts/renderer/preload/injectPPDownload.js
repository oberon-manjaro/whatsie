/* global XMLHttpRequest, MutationObserver, Blob */

function prependZero (number) {
  return ('0' + number).slice(-2);
}

function _inject () {
  const drawerPane = document.querySelector('div.drawer-manager > span.pane.pane-three');
  if (!drawerPane) return;

  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.addedNodes.length === 1) {
        if (mutation.addedNodes[0].firstChild.className === 'drawer drawer-info') {
          let avatar = document.querySelector('div.drawer.drawer-info div.drawer-section-photo > div.avatar');
          if (!avatar) return;

          avatar.onclick = () => {
            setTimeout(() => {
              const menu = document.querySelector('div.media-viewer > div.media-panel-header > div.menu');
              const closeMenuItem = menu.lastChild;

              const downloadMenuItem = document.createElement('div');
              downloadMenuItem.className = 'menu-item';

              const downloadLink = document.createElement('a');
              downloadLink.className = 'icon icon-download';
              downloadLink.title = 'Download';

              downloadLink.onclick = (e) => {
                e.stopPropagation();
                const currentDate = new Date();

                const imageUrl = document.querySelector('div.profile-viewer > img.profile-viewer-img').src;
                const nameContainer = document.querySelector('div.media-viewer > div.media-panel-header > div.media-chat > div.chat-body span.emojitext');
                // NOTE: Matching the behaviour of WhatsApp for Android (and iOS?)
                const name = Array.from(nameContainer.childNodes).filter((node) => node.nodeName === '#text' || node.nodeName === 'IMG').map((node) => {
                  return node.nodeValue || node.alt;
                }).join('');

                const tempA = document.createElement('a');
                tempA.style = 'display: none';
                // WhatsApp Profile Image {Full name} {YYYY-MM-DD} at {hh.mm.ss}.jpeg
                tempA.download = `WhatsApp Profile Image ${name} ${currentDate.getFullYear()}-${prependZero(currentDate.getMonth() + 1)}-${prependZero(currentDate.getDate())} at ${prependZero(currentDate.getHours())}.${prependZero(currentDate.getMinutes())}.${prependZero(currentDate.getSeconds())}.jpeg`;

                // NOTE: Sadly profile images are not Blobs already, so we need to create a Blob by ourselves to assign a custom file name
                const xhr = new XMLHttpRequest();
                xhr.open('GET', imageUrl, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) {
                  const imageBuffer = new Uint8Array(this.response);
                  const imageBlob = new Blob([imageBuffer], {type: 'octet/stream'});
                  const blobUrl = window.URL.createObjectURL(imageBlob);
                  tempA.href = blobUrl;
                  document.body.appendChild(tempA);
                  tempA.click();
                  window.URL.revokeObjectURL(blobUrl);
                  document.body.removeChild(tempA);
                };
                xhr.send();
              };

              downloadMenuItem.appendChild(downloadLink);
              menu.insertBefore(downloadMenuItem, closeMenuItem);
            });
          };

          return;
        }
      }
    }
  });

  observer.observe(drawerPane, {childList: true});
}

export function inject () {
  const appWrapper = document.querySelector('.app-wrapper');
  if (!appWrapper) {
    // NOTE: do not work if timeout is lower than 1000. Strange...
    setTimeout(() => {
      inject();
    }, 1000);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (mutation.oldValue.indexOf('app-wrapper-main') === -1 && appWrapper.className.indexOf('app-wrapper-main') !== -1) {
          _inject();
        }
      }
    });
  });
  observer.observe(appWrapper, {attributes: true, attributeOldValue: true});

  _inject();
}

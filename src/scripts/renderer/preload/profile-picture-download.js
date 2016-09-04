/* global XMLHttpRequest, MutationObserver, Blob */

function prependZero (number) {
  return ('0' + number).slice(-2);
}

function getImageUrl () {
  return document.querySelector('div.profile-viewer > img.profile-viewer-img').src;
}

function getUserName () {
  const selector = 'div.media-viewer > div.media-panel-header > ' +
    'div.media-chat > div.chat-body span.emojitext';
  const nameContainer = document.querySelector(selector);

  // Matching the behaviour of WhatsApp for Android (and iOS?)
  return Array.from(nameContainer.childNodes)
    .filter((node) => node.nodeName === '#text' || node.nodeName === 'IMG')
    .map((node) => node.nodeValue || node.alt)
    .join('');
}

/**
 * WhatsApp Profile Image {Full name} {YYYY-MM-DD} at {hh.mm.ss}.jpeg
 */
function generateFileName (userName) {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = prependZero(currentDate.getMonth() + 1);
  const day = prependZero(currentDate.getDate());

  const hour = prependZero(currentDate.getHours());
  const min = prependZero(currentDate.getMinutes());
  const sec = prependZero(currentDate.getSeconds());

  return `WhatsApp Profile Image ${userName} ${year}-${month}-${day} at ${hour}.${min}.${sec}.jpg`;
}

function onDownloadClick (e) {
  e.stopPropagation();

  const tempA = document.createElement('a');
  tempA.style = 'display: none';
  tempA.download = generateFileName(getUserName());

  // Profile images are not Blobs, so we need to create a Blob to change the file name
  const xhr = new XMLHttpRequest();
  xhr.open('GET', getImageUrl(), true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
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
}

function injectItem () {
  const avatarSelector = 'div.drawer.drawer-info div.drawer-section-photo > div.avatar';
  const avatar = document.querySelector(avatarSelector);
  if (!avatar) return;

  avatar.onclick = () => {
    setTimeout(() => {
      const menuElem = document.querySelector('div.media-viewer > div.media-panel-header > div.menu');
      const closeMenuItem = menuElem.lastChild;

      const downloadLink = document.createElement('a');
      downloadLink.className = 'icon icon-download';
      downloadLink.title = 'Download';
      downloadLink.onclick = onDownloadClick;

      const downloadMenuItem = document.createElement('div');
      downloadMenuItem.className = 'menu-item';
      downloadMenuItem.appendChild(downloadLink);

      menuElem.insertBefore(downloadMenuItem, closeMenuItem);
    });
  };

  return;
}

function attachMenuObserver () {
  const drawerPane = document.querySelector('div.drawer-manager > span.pane.pane-three');
  if (!drawerPane) return;

  const observer = new MutationObserver((mutations) => {
    mutations
      .filter((m) => m.addedNodes.length === 1)
      .filter((m) => m.addedNodes[0].firstChild.className === 'drawer drawer-info')
      .forEach(() => injectItem());
  });

  observer.observe(drawerPane, {childList: true});
}

// Inject after the DOM is loaded
window.addEventListener('load', function () {
  log('document loaded');

  const appWrapper = document.querySelector('.app-wrapper');
  if (!appWrapper) {
    logError(new Error('appWrapper is falsy'));
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations
      .filter((m) => m.attributeName === 'class')
      .filter((m) => {
        const oldValIsMain = !m.oldValue.includes('app-wrapper-main');
        const appWrapperIsMain = appWrapper.className.includes('app-wrapper-main');
        return oldValIsMain && appWrapperIsMain;
      })
      .forEach((m) => attachMenuObserver());
  });
  observer.observe(appWrapper, {attributes: true, attributeOldValue: true});

  attachMenuObserver();
});

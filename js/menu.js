function openPopup(url, type) {
  const urls = {
    radio: 'https://raptureradio.cc/',
    guide: 'https://www.rapturearchives.org/radio/',
    report: 'https://www.rapturearchives.org/radio/'
  };

  const sizes = {
    radio: { height: 523, width: 614 },
    guide: { height: 523, width: 614 },
    report: { height: 637, width: 850 }
  };

  const finalUrl = `${urls[type]}${url}`;
  const { height, width } = sizes[type];
  window.open(finalUrl, `${type}Load`, `popup=true,height=${height},width=${width},left=0,top=0,noopener,noreferrer,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no`);
}

function newRadio(url) {
  openPopup(url, 'radio');
}

function newGuide(url) {
  openPopup(url, 'guide');
}

function newReport(url) {
  openPopup(url, 'report');
}
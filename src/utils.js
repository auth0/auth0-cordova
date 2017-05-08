function getOS() {
  var userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }
}

module.exports = {
  getOS: getOS
};

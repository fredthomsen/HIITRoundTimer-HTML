chrome.app.runtime.onLaunched.addListener(function() {
      chrome.app.window.create('../roundtimer.html', {
              bounds: {
              },
              minWidth: 1280,
              minHeight: 720
      });
});

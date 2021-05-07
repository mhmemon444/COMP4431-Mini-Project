const visualizer = new VisualKey();

init();

function init() {
  // Start the drawing loop.
  onWindowResize();
  window.requestAnimationFrame(() => visualizer.drawLoop());

  // Event listeners.
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('orientationchange', onWindowResize);
}

function keyDownVisual(key) {
  if (VisualMap.has(key)) {
    return;
  }
  var pos = 0;
  var widthOfKey = '40px';
  var blackKeyWidth = '30px';
  switch (key) {
    case 1:
      pos = 25;
      widthOfKey = blackKeyWidth;
      break;
    case 2:
      pos = 40;
      break;
    case 3:
      pos = 65;
      widthOfKey = blackKeyWidth;
      break;
    case 4:
      pos = 80;
      break;
    case 5:
      pos = 120;
      break;
    case 6:
      pos = 145;
      widthOfKey = blackKeyWidth;
      break;

    case 7:
      pos = 160;
      break;
    case 8:
      pos = 185;
      widthOfKey = blackKeyWidth;
      break;
    case 9:
      pos = 200;
      break;
    case 10:
      pos = 225;
      widthOfKey = blackKeyWidth;
      break;
    case 11:
      pos = 240;
      break;
    case 12:
      pos = 280;
      break;
    case 13:
      pos = 305;
      widthOfKey = blackKeyWidth;
      break;
    case 14:
      pos = 320;
      break;
    case 15:
      pos = 345;
      widthOfKey = blackKeyWidth;
      break;
    case 16:
      pos = 360;
      break;
    case 17:
      pos = 400;
      break;
    case 18:
      pos = 425;
      widthOfKey = blackKeyWidth;
      break;
    case 19:
      pos = 440;
      break;
    case 20:
      pos = 465;
      widthOfKey = blackKeyWidth;
      break;
    case 21:
      pos = 480;
      break;
    case 22:
      pos = 505;
      widthOfKey = blackKeyWidth;
      break;
    case 23:
      pos = 520;
      break;
    default:
      break;
  }

  const keyToVisualize = visualizer.addKey(key, pos, widthOfKey);
  VisualMap.set(key, { keyToVisualize: keyToVisualize });
}

function keyUpVisual(key) {
  const heldVisual = VisualMap.get(key);
  if (heldVisual) {
    visualizer.stopKey(heldVisual.keyToVisualize);
  }

  VisualMap.delete(key);
}

function onWindowResize() {
  visualizer.resize(0);
}

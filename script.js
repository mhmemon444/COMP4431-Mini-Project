const painter = new FloatyNotes();
const piano = new Piano();
const genie = new mm.PianoGenie(
  'https://storage.googleapis.com/magentadata/js/checkpoints/piano_genie/model/epiano/stp_iq_auto_contour_dt_166006'
);

initEverything();

function initEverything() {
  genie.initialize().then(() => {
    console.log('🧞‍♀️ ready!');
  });

  // Start the drawing loop.
  onWindowResize();
  window.requestAnimationFrame(() => painter.drawLoop());

  // Event listeners.
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('orientationchange', onWindowResize);
}

function keyDownVisual(key) {
  if (heldButtonToVisualData.has(key)) {
    return;
  }

  var pos = 0;
  switch (key) {
    case 2:
      pos = 40;
      break;
    case 4:
      pos = 80;
      break;
    case 5:
      pos = 120;
      break;
    case 7:
      pos = 160;
      break;
    case 9:
      pos = 200;
      break;
    case 11:
      pos = 240;
      break;
    //   w: 12,
    //   e: 14,
    //   r: 16,
    //   t: 17,
    //   y: 19,
    //   u: 21,
    //   i: 23,
    case 12:
      pos = 280;
      break;
    case 14:
      pos = 320;
      break;
    case 16:
      pos = 360;
      break;
    case 17:
      pos = 400;
      break;
    case 19:
      pos = 440;
      break;
    case 21:
      pos = 480;
      break;
    case 23:
      pos = 520;
      break;

    default:
      break;
  }

  const noteToPaint = painter.addNote(key, pos, '40px');
  heldButtonToVisualData.set(key, { noteToPaint: noteToPaint });
}

function keyUpVisual(key) {
  const thing = heldButtonToVisualData.get(key);
  if (thing) {
    painter.stopNote(thing.noteToPaint);
  }
  console.log(heldButtonToVisualData, 'held');

  heldButtonToVisualData.delete(key);
  console.log(heldButtonToVisualData, 'held');
}

function onWindowResize() {
  OCTAVES = window.innerWidth > 700 ? 7 : 3;
  const bonusNotes = OCTAVES > 6 ? 4 : 0; // starts on an A, ends on a C.
  const totalNotes = CONSTANTS.NOTES_PER_OCTAVE * OCTAVES + bonusNotes;
  const totalWhiteNotes =
    CONSTANTS.WHITE_NOTES_PER_OCTAVE * OCTAVES + (bonusNotes - 1);
  keyWhitelist = Array(totalNotes)
    .fill()
    .map((x, i) => {
      if (OCTAVES > 6) return i;
      // Starting 3 semitones up on small screens (on a C), and a whole octave up.
      return i + 3 + CONSTANTS.NOTES_PER_OCTAVE;
    });

  piano.resize(totalWhiteNotes);
  painter.resize(piano.config.whiteNoteHeight);
  piano.draw();
}

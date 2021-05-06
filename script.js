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

  console.log(key);

  const noteToPaint = painter.addNote(key, key * key, '40px');
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

const CONSTANTS = {
  COLORS: [
    '#EE2B29',
    '#ff9800',
    '#ffff00',
    '#c6ff00',
    '#00e5ff',
    '#2979ff',
    '#651fff',
    '#d500f9',
  ],
  NUM_BUTTONS: 8,
  NOTES_PER_OCTAVE: 12,
  WHITE_NOTES_PER_OCTAVE: 7,
  LOWEST_PIANO_KEY_MIDI_NOTE: 21,
  GENIE_CHECKPOINT:
    'https://storage.googleapis.com/magentadata/js/checkpoints/piano_genie/model/epiano/stp_iq_auto_contour_dt_166006',
};

class Piano {
  constructor() {
    this.config = {
      whiteNoteWidth: 30,
      blackNoteWidth: 20,
      whiteNoteHeight: 70,
      blackNoteHeight: (2 * 70) / 3,
    };

    this.svg = document.getElementById('svg');
    this.svgNS = 'http://www.w3.org/2000/svg';
  }

  resize(totalWhiteNotes) {
    // i honestly don't know why some flooring is good and some is bad sigh.
    this.config.blackNoteWidth = (this.config.whiteNoteWidth * 2) / 3;
    this.svg.setAttribute('width', window.innerWidth);
    this.svg.setAttribute('height', this.config.whiteNoteHeight);
  }

  draw() {
    this.svg.innerHTML = '';
    const halfABlackNote = this.config.blackNoteWidth / 2;
    let x = 0;
    let y = 0;
    let index = 0;

    const blackNoteIndexes = [1, 3, 6, 8, 10];

    // Starting 3 semitones up on small screens (on a C), and a whole octave up.
    index = 3 + 12;

    // Draw the white notes.
    for (let o = 0; o < 2; o++) {
      for (let i = 0; i < 12; i++) {
        if (blackNoteIndexes.indexOf(i) === -1) {
          this.makeRect(
            index,
            x,
            y,
            this.config.whiteNoteWidth,
            this.config.whiteNoteHeight,
            'white',
            '#141E30'
          );
          x += this.config.whiteNoteWidth;
        }
        index++;
      }
    }

    // Starting 3 semitones up on small screens (on a C), and a whole octave up.
    index = 3 + 12;
    x = -this.config.whiteNoteWidth;

    // Draw the black notes.
    for (let o = 0; o < 2; o++) {
      for (let i = 0; i < 12; i++) {
        if (blackNoteIndexes.indexOf(i) !== -1) {
          this.makeRect(
            index,
            x + this.config.whiteNoteWidth - halfABlackNote,
            y,
            this.config.blackNoteWidth,
            this.config.blackNoteHeight,
            'black'
          );
        } else {
          x += this.config.whiteNoteWidth;
        }
        index++;
      }
    }
  }

  highlightNote(note, button) {
    // Show the note on the piano roll.
    const rect = this.svg.querySelector(`rect[data-index="${note}"]`);
    if (!rect) {
      console.log('couldnt find a rect for note', note);
      return;
    }
    rect.setAttribute('active', true);
    rect.setAttribute('class', `color-${button}`);
    return rect;
  }

  clearNote(rect) {
    rect.removeAttribute('active');
    rect.removeAttribute('class');
  }

  makeRect(index, x, y, w, h, fill, stroke) {
    const rect = document.createElementNS(this.svgNS, 'rect');
    rect.setAttribute('data-index', index);
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.setAttribute('fill', fill);
    if (stroke) {
      rect.setAttribute('stroke', stroke);
      rect.setAttribute('stroke-width', '3px');
    }
    this.svg.appendChild(rect);
    return rect;
  }
}
class FloatyNotes {
  constructor() {
    this.notes = []; // the notes floating on the screen.

    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.lineWidth = 4;
    this.context.lineCap = 'round';

    this.contextHeight = 0;
  }

  resize(whiteNoteHeight) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = this.contextHeight =
      window.innerHeight - whiteNoteHeight - 20;
  }

  addNote(button, x, width) {
    const noteToPaint = {
      x: parseFloat(x),
      y: 0,
      width: parseFloat(width),
      height: 0,
      color: CONSTANTS.COLORS[button],
      on: true,
    };

    console.log(noteToPaint);
    this.notes.push(noteToPaint);
    console.log(this.notes);
    return noteToPaint;
  }

  stopNote(noteToPaint) {
    noteToPaint.on = false;
  }

  drawLoop() {
    const dy = 5;
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Remove all the notes that will be off the page;
    this.notes = this.notes.filter(
      (note) => note.on || note.y < this.contextHeight - 100
    );

    // Advance all the notes.

    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i];
      console.log('note drop');
      console.log(note);

      // If the note is still on, then its height goes up but it
      // doesn't start sliding down yet.
      if (note.on) {
        note.height += dy;
      } else {
        note.y += dy;
      }

      this.context.globalAlpha = 1 - note.y / this.contextHeight;
      this.context.fillStyle = note.color;
      this.context.fillRect(note.x, note.y, note.width, note.height);
    }

    window.requestAnimationFrame(() => this.drawLoop());
  }
}

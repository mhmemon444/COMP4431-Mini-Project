// The last played key number
let last_mouse_key_number = -1;

//Map

// Map the key with the key number
let key_mapping = {
  // White keys of the first octave
  z: 0,
  x: 2,
  c: 4,
  v: 5,
  b: 7,
  n: 9,
  m: 11,
  // Black keys of the first octave
  s: 1,
  d: 3,
  g: 6,
  h: 8,
  j: 10,
  // White keys of the second octave
  w: 12,
  e: 14,
  r: 16,
  t: 17,
  y: 19,
  u: 21,
  i: 23,
  // Black keys of the second octave
  3: 13,
  4: 15,
  6: 18,
  7: 20,
  8: 22,
};

// Signal the key is down
let key_down_status = new Array(23);

var recordingStartTime;
var songNotes;

var editPitch = 60;
var editAmplitude = 100;
var editSave = false;

//get record button
const recordButton = document.querySelector('.record-button');
const playButton = document.querySelector('.play-button');
const editButton = document.querySelector('.edit-button');
const cancelEditButton = document.querySelector('.cancelbtn');
const saveEditButton = document.querySelector('.savebtn');
// const saveButton = document.querySelector('.save-button');

//add event listener to record button
recordButton.addEventListener('click', toggleRecording)
playButton.addEventListener('click', playSong)
editButton.addEventListener('click', editSong)
cancelEditButton.addEventListener('click', cancelEdit)
saveEditButton.addEventListener('click', saveEdit)

function editSong() {
    document.getElementById("backgroundModal").style.display = "block";
    document.getElementById("editmodalshow").style.display = "block";
    document.getElementById("edit-pitch").value = editPitch.toString();
    document.getElementById("edit-amplitude").value = editAmplitude.toString();
}

function cancelEdit() {
    document.getElementById("editmodalshow").style.display = "none";
    document.getElementById("backgroundModal").style.display = "none";
}

function saveEdit() {
    // Extract the amplitude value from the slider
    editAmplitude = parseInt($("#edit-amplitude").val());
    editPitch = parseInt($("#edit-pitch").val());
    editSave = true;
    document.getElementById("editmodalshow").style.display = "none";
    document.getElementById("backgroundModal").style.display = "none";
}

function toggleRecording() {
    recordButton.classList.toggle('active');
    if (recordButton.classList.contains('active')) {
        editSave = false;
        recordButton.innerHTML = "Recording..."
    } else {
        recordButton.innerHTML = "Record"
    }

    if (isRecording()) {
        startRecording();
    } else {
        stopRecording();
    }
}

function isRecording() {
    return recordButton != null && recordButton.classList.contains('active');
}

function startRecording() {
    playButton.classList.remove('show');
    editButton.classList.remove('show');
    recordingStartTime = Date.now();
    songNotes = [];
}

function stopRecording() {
    // playSong();
    playButton.classList.add('show');
    editButton.classList.add('show');
}


function recordNote(note, pitch, amplitude, chord) {
    songNotes.push({
        key: note,
        startTime: Date.now() - recordingStartTime,
        pitch: pitch,
        amplitude: amplitude,
        chord: chord
    })
}

function endRecordNote() {
    var endTime = Date.now() - recordingStartTime;
    songNotes[songNotes.length - 1]["endTime"] = endTime;
    for (var i = songNotes.length - 2; i >= 0; i--) {
        songNotes[i]["endTime"] = ( songNotes[i]["endTime"] || endTime );
    }
}

function playSong() {
    if (songNotes.length === 0) return;
    playButton.innerHTML = "Playing...";
    songNotes.forEach((note, index) => {
        setTimeout(() => {
            playbackNoteOn(note.pitch, note.amplitude, note.chord, note.key)
        }, note.startTime)
        setTimeout(() => {
            playbackNoteOff(note.pitch, note.chord, note.key)
            if (index == songNotes.length - 1) {
                playButton.innerHTML = "Play";
            }
        }, note["endTime"])
    });
    console.log(songNotes);
}

function handleNoteOn(key_number) {
    // Find the pitch
    let p = parseInt($("#pitch").val());
    // console.log("p: ", p)
    let pitch = p + key_number;
    /*
     * You need to use the slider to get the lowest pitch number above
     * rather than the hardcoded value
     */

    // Extract the amplitude value from the slider
    let amplitude = parseInt($("#amplitude").val());

    // Use the two numbers to start a MIDI note
    let chord = $(":radio[name=play-mode]:checked").val()
    console.log("chord: ", chord)

    if (isRecording()) {
        recordNote(key_number, pitch, amplitude, chord);
    }

    // MIDI.noteOn(0, pitch, amplitude);
     MIDI.noteOn(0, pitch, amplitude);


    /*
     * You need to handle the chord mode here
     */
    if (chord == "major") {
        MIDI.noteOn(0, pitch+4, amplitude);
        MIDI.noteOn(0, pitch+7, amplitude);
    } else if (chord == "minor") {
        MIDI.noteOn(0, pitch+3, amplitude);
        MIDI.noteOn(0, pitch+7, amplitude);
    }

}

function playbackNoteOn(pitch, amplitude, chord, key_number) {
    if (editSave) { //if song is edited
        pitch = editPitch + key_number;
        amplitude = editAmplitude;
    }

    MIDI.noteOn(0, pitch, amplitude);
    /*
     * You need to handle the chord mode here
     */
    
    if (chord == "major") {
        MIDI.noteOn(0, pitch+4, amplitude);
        MIDI.noteOn(0, pitch+7, amplitude);
    } else if (chord == "minor") {
        MIDI.noteOn(0, pitch+3, amplitude);
        MIDI.noteOn(0, pitch+7, amplitude);
    }
    keyDownVisual(key_number);
}

function playbackNoteOff(pitch, chord, key_number) {
    if (editSave) { //if song is edited
        pitch = editPitch + key_number;
    }

    MIDI.noteOff(0, pitch);
    /*
     * You need to handle the chord mode here
     */
    if (chord == "major") {
        MIDI.noteOff(0, pitch+4);
        MIDI.noteOff(0, pitch+7);
    } else if (chord == "minor") {
        MIDI.noteOff(0, pitch+3);
        MIDI.noteOff(0, pitch+7);
    }
    keyUpVisual(key_number);
}

function handleNoteOff(key_number) {
    // Find the pitch
    let p = parseInt($("#pitch").val());
    let pitch = p + key_number;
    /*
     * You need to use the slider to get the lowest pitch number above
     * rather than the hardcoded value
     */

    // Send the note off message for the pitch
    let chord = $(":radio[name=play-mode]:checked").val()

    if (isRecording()) {
        endRecordNote();
    }

     MIDI.noteOff(0, pitch);
    
    



    /*
     * You need to handle the chord mode here
     */
    if (chord == "major") {
        MIDI.noteOff(0, pitch+4);
        MIDI.noteOff(0, pitch+7);
    } else if (chord == "minor") {
        MIDI.noteOff(0, pitch+3);
        MIDI.noteOff(0, pitch+7);
    }
  }

const VisualMap = new Map();

function handlePianoMouseDown(evt) {
  // Determine which piano key has been clicked on
  // evt.target tells us which item triggered this function
  // The piano key number is extracted from the key id (0-23)
  let key_number = $(evt.target).attr('id').substring(4);
  key_number = parseInt(key_number);

  // Start the note
  handleNoteOn(key_number);

  // Select the key
  $('#key-' + key_number).focus();

  // Show a simple message in the console
  console.log('Piano mouse down event for key ' + key_number + '!');
  keyDownVisual(key_number);

  // Remember the key number
  last_mouse_key_number = key_number;
}


function handlePianoMouseUp(evt) {
  // last_key_number is used because evt.target does not necessarily
  // equal to the key that has been clicked on
  if (last_mouse_key_number < 0) return;

  // Stop the note
  handleNoteOff(last_mouse_key_number);

  // Show a simple message in the console
  console.log('Piano mouse up event for key ' + last_mouse_key_number + '!');
  keyUpVisual(last_mouse_key_number);

  // Reset the key number
  last_mouse_key_number = -1;
}

function handlePageKeyDown(evt) {
  // Exit the function if the key is not a piano key
  // evt.key tells us the key that has been pressed
  if (!(evt.key in key_mapping)) return;

  // Find the key number of the key that has been pressed
  let key_number = key_mapping[evt.key];
  if (key_down_status[key_number]) return;

  // Start the note
  handleNoteOn(key_number);

  // Select the key
  $('#key-' + key_number).focus();

  // Show a simple message in the console
  console.log('Page key down event for key ' + key_number + '!');

  keyDownVisual(key_number);

  // Remember the key is down
  key_down_status[key_number] = true;
}

function handlePageKeyUp(evt) {
  // Exit the function if the key is not a piano key
  // evt.key tells us the key that has been released
  if (!(evt.key in key_mapping)) return;

  // Find the key number of the key that has been released
  let key_number = key_mapping[evt.key];

  // Stop the note
  handleNoteOff(key_number);

  // De-select the key
  $('#key-' + key_number).blur();

  // Show a simple message in the console
  console.log('Page key up event for key ' + key_number + '!');

  keyUpVisual(key_number);

  // Reset the key status
  key_down_status[key_number] = false;
}

/*
 * You need to write an event handling function for the instrument
 */
function onInstrumentSelect() {
  let programChangeNumber = parseInt($('#instrumentSelect').val());
  // console.log(programChangeNumber);
  MIDI.programChange(0, programChangeNumber);
}

$(document).ready(function () {
  const totalWhiteNotes = 21;

  MIDI.loadPlugin({
    soundfontUrl: './midi-js/soundfont/',
    instruments: [
      'trumpet',
      /*
       * You can preload the instruments here if you add the instrument
       * name in the list here
       */
    ],
    onprogress: function (state, progress) {
      console.log(state, progress);
    },
    onsuccess: function () {
      // Resuming the AudioContext when there is user interaction
      $('body').click(function () {
        if (MIDI.getContext().state != 'running') {
          MIDI.getContext()
            .resume()
            .then(function () {
              console.log('Audio Context is resumed!');
            });
        }
      });

      // Hide the loading text and show the container
      $('.loading').hide();
      $('.container').show();

      // At this point the MIDI system is ready
      MIDI.setVolume(0, 127); // Set the volume level
      MIDI.programChange(0, 56); // Use the General MIDI 'trumpet' number

      // Set up the event handlers for all the buttons
      $('button').on('mousedown', handlePianoMouseDown);
      $(document).on('mouseup', handlePianoMouseUp);

      // Set up key events
      $(document).keydown(handlePageKeyDown);
      $(document).keyup(handlePageKeyUp);

      /*
       * You need to set up the event for the instrument
       */
    },
  });
});

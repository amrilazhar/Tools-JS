/* Sample Code from https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
 Wtih some edit and add recorder function
*/
const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const startRecElem = document.getElementById("startRec");
const stopRecElem = document.getElementById("stopRec");

//Recorder buat ngerekam
let recorder;
const chunks = [];

// Options for getDisplayMedia()
var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function(evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function(evt) {
  stopCapture();
}, false);
startRecElem.addEventListener("click", function(evt) {
  console.log("Start Recording");
  recorder.start();
}, false);

stopRecElem.addEventListener("click", function(evt) {
  recorder.stop();
  /// Convert to Object and save
  recorder.onstop = e => {
    const completeBlob = new Blob(chunks, { type: 'video/webm' });
    let DLink = document.getElementById("recorded");
    DLink.href = URL.createObjectURL(completeBlob);
    DLink.download = "scRecord";
    DLink.innerHTML = "Click here to download the video";
  };
}, false);

console.log = msg => logElem.innerHTML += `${msg}<br>`;
console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;


// Share Screen //
async function startCapture() {
  logElem.innerHTML = "";

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    recorder = new MediaRecorder(videoElem.srcObject);
    recorder.ondataavailable = e => chunks.push(e.data);
    dumpOptionsInfo();
  } catch(err) {
    console.error("Error: " + err);
  }
}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];

  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

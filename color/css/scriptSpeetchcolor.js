const main = document.querySelector("main");
const voicesSelect = document.getElementById("voices");
const textarea = document.getElementById("text");
const readButton = document.getElementById("read");
const toggleButton = document.getElementById("toggle");
const closeButton = document.getElementById("close");

const data = [
  {
    image: "square",
    text: "square",
  },
  {
    image: "circle",
    text: "circle",
  },
  {
    image: "triangle",
    text: "triangle",
  },
  {
    image: "rectangle",
    text: "rectangle",
  },
  {
    image: "diamond",
    text: "diamond",
  },
  {
    image: "star",
    text: "star",
  },
  {
    image: "Red",
    text: "Red",
  },
  {
    image: "Orange", 
    text: "Orange",
  },
  {
    image: "Yellow",
    text: "Yellow",
  },
  {
    image: "Pink",
    text: "Pink",
  },
  {
    image: "Green",
    text: "Green",
  },
  {
    image: "Blue", 
    text: "Blue",
  },
  {
    image: "Purple", 
    text: "Purple",
  },
  {
    image: "White", 
    text: "White",
  },
  {
    image: "Black",
    text: "Black",
  },
  {
    image: "Brown",
    text: "Brown",
  },
];


function createBox(item) {
  const box = document.createElement("div");
  const { image, text, type } = item;
  box.classList.add("box");
  box.innerHTML = `
    <br>
    <img src='./imgSpeech/${image}.jpg?raw=true' alt="${text}" />
    <p class="info">${text} </p> <br>
  `;
  box.addEventListener("click", () => handleSpeech(text, box));
  main.appendChild(box);
}



data.forEach(createBox);


// Check for browser support
if (!"speechSynthesis" in window) {
  $("#msg").html(
    "Sorry your browser <strong>does not support</strong> speech synthesis."
  );
}

// Fetch the list of voices and populate the voice options.
function loadVoices() {
  // Fetch the available voices in English US.
  var voices = speechSynthesis
    .getVoices()
    .filter(voice => voice.lang == "en-US");

  $("#voices").empty();
  voices.forEach(function(voice, i) {
    $option = $("<option>")
      .val(voice.name)
      .text(voice.name)
      .prop("selected", voice.name === "Samantha");
    $("#voices").append($option);
  });
}



// Execute loadVoices.
loadVoices();

// Chrome loads voices asynchronously.
window.speechSynthesis.onvoiceschanged = function(e) {
  loadVoices();
};

const message = new SpeechSynthesisUtterance();

function handleSpeech(text, box) {
  setTextMessage(text);
  speakText();
  box.classList.add("active");
  setTimeout(() => box.classList.remove("active"), 800);

  if ($("#voices").val()) 
  message.voice = speechSynthesis
      .getVoices()
      .filter(voice => voice.name == $("#voices").val())[0];


}

function setTextMessage(text) {
  message.text = text;
  message.rate = parseFloat($("#rate").val());
}

function speakText() {
  speechSynthesis.speak(message);
}

function setVoice(e) {
  message.voice = voices.find((voice) => voice.name === e.target.value);
}

// Event Listeners
toggleButton.addEventListener("click", () => {
  document.getElementById("text-box").classList.toggle("show");
});
closeButton.addEventListener("click", () => {
  document.getElementById("text-box").classList.remove("show");
});
speechSynthesis.addEventListener("voiceschanged", loadVoices);
voicesSelect.addEventListener("change", setVoice);
readButton.addEventListener("click", () => {
  setTextMessage(textarea.value);
  speakText();
});

loadVoices();

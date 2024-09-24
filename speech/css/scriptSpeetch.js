const main = document.querySelector("main");
const voicesSelect = document.getElementById("voices");
const textarea = document.getElementById("text");
const readButton = document.getElementById("read");
const toggleButton = document.getElementById("toggle");
const closeButton = document.getElementById("close");

const data = [
  {
    image: "parrot",
    text: "parrot",
    type: "Long",
    test: "0"
  },
  {
    image: "pen",
    text: "pen",
    type: "Long",
    test: "0"
  },
  {
    image: "panda",
    text: "panda",
    type: "Long",
    test: "0"
  },
  {
    image: "banana",
    text: "banana",
    type: "Long",
    test: "0"
  },
  {
    image: "bear",
    text: "bear",
    type: "Long",
    test: "0"
  },
  {
    image: "bed",
    text: "bed",
    type: "Long",
    test: "0"
  },
  {
    image: "cape",
    text: "cape",
    type: "Long",
    test: "1"
  },
  {
    image: "cap", 
    text: "cap",
    type: "Short",
    test: "1"
  },
  {
    image: "pin",
    text: "pin",
    type: "Short",
    test: "1"
  },
  {
    image: "pine",
    text: "pine",
    type: "Long",
    test: "1"
  },
  {
    image: "tap",
    text: "tap",
    type: "Short",
    test: "1"
  },
  {
    image: "tape", 
    text: "tape",
    type: "Long",
    test: "1"
  },
  {
    image: "tim", 
    text: "tim",
    type: "Short",
    test: "1"
  },
  {
    image: "time", 
    text: "time",
    type: "Long",
    test: "1"
  },
  {
    image: "ink",
    text: "ink",
    type: "Short",
    test: "1"
  },
  {
    image: "vase",
    text: "vase",
    type: "Long",
    test: "1"
  },
];

function createBox(item) {
  const box = document.createElement("div");
  const { image, text, type, test } = item;
  box.classList.add("box");

  // المحتوى الرئيسي للصورة والنص
  box.innerHTML = `
    <br>
    <img src='./imgSpeech/${image}.jpg?raw=true' alt="${text}" />
    <p class="info">${text}</p>
  `;

  // إذا كانت قيمة `test` تساوي "1"، عرض النص والأزرار
  if (test === "1") {
    // عرض النص الإرشادي
    const instruction = document.createElement("p");
    instruction.classList.add("instruction");
    instruction.innerText = "انظر واستمع هل الصوت Short أم Long؟";
    box.appendChild(instruction);

    // إنشاء مجموعة الأزرار
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("button-group");

    const longButton = document.createElement("button");
    longButton.classList.add("check-btn");
    longButton.innerText = "Long";
    longButton.onclick = () => checkAnswer(type, 'Long');

    const shortButton = document.createElement("button");
    shortButton.classList.add("check-btn");
    shortButton.innerText = "Short";
    shortButton.onclick = () => checkAnswer(type, 'Short');

    buttonGroup.appendChild(longButton);
    buttonGroup.appendChild(shortButton);

    box.appendChild(buttonGroup);
  }

  box.addEventListener("click", () => handleSpeech(text, box));
  main.appendChild(box);
}

data.forEach(createBox);


// التحقق من الإجابة
function checkAnswer(correctType, selectedType) {
  if (correctType === selectedType) {
    Swal.fire({
      icon: 'success',
      title: 'إجابة صحيحة!',
      text: 'أحسنت، الإجابة صحيحة!',
      showConfirmButton: false,
      timer: 1500
    });
    handleSpeech(selectedType);  // نطق "Long" أو "Short"
  } else {
    Swal.fire({
      icon: 'error',
      title: 'إجابة خاطئة!',
      text: 'حاول مرة أخرى!',
      showConfirmButton: false,
      timer: 1500
    });
  }
}




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

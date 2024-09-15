const main = document.querySelector("main");
const voicesSelect = document.getElementById("voices");
const textarea = document.getElementById("text");
const readButton = document.getElementById("read");
const toggleButton = document.getElementById("toggle");
const closeButton = document.getElementById("close");

const data = [
  {
    text: "Red",
    answer1: "أصفر",
    answer2: "أخضر",
    answer3: "أحمر"
  },
  {
    text: "Orange",
    answer1: "أزرق",
    answer2: "برتقالي",
    answer3: "أخضر"
  },
  {
    text: "Yellow",
    answer1: "أزرق",
    answer2: "أحمر",
    answer3: "أصفر"
  },
  {
    text: "Pink",
    answer1: "أصفر",
    answer2: "وردي",
    answer3: "أزرق"
  },
  {
    text: "Green",
    answer1: "أخضر",
    answer2: "أحمر",
    answer3: "أزرق"
  },
  {
    text: "Blue",
    answer1: "أصفر",
    answer2: "أصفر",
    answer3: "أزرق"
  },
  {
    text: "Purple",
    answer1: "بنفسجي",
    answer2: "أحمر",
    answer3: "أخضر"
  },
  {
    text: "White",
    answer1: "أخضر",
    answer2: "أسود",
    answer3: "أبيض"
  },
  {
    text: "Black",
    answer1: "أسود",
    answer2: "أبيض",
    answer3: "أزرق"
  },
  {
    text: "Brown",
    answer1: "أزرق",
    answer2: "بني",
    answer3: "أحمر"
  }
];

function createBox(item) {
  const box = document.createElement("div");
  const { text, answer1, answer2, answer3 } = item;
  box.classList.add("box");
  box.innerHTML = `
    <br>
    <p class="info">${text}</p><br>
    <p class="instruction">اختر الترجمة الصحيحة للون:</p>
    <div class="button-group">
      <button class="check-btn" onclick="checkAnswer('${text}', '${answer1}')">${answer1}</button>
      <button class="check-btn" onclick="checkAnswer('${text}', '${answer2}')">${answer2}</button>
      <button class="check-btn" onclick="checkAnswer('${text}', '${answer3}')">${answer3}</button>
    </div>
  `;
  box.addEventListener("click", () => handleSpeech(text, box));
  main.appendChild(box);
}

data.forEach(createBox);

function checkAnswer(correctText, selectedAnswer) {
  const correctTranslation = translateColor(correctText); // نستخدم هذه الدالة لترجمة اللون
  if (correctTranslation === selectedAnswer) {
    Swal.fire({
      icon: 'success',
      title: 'إجابة صحيحة!',
      text: 'أحسنت، الإجابة صحيحة!',
      showConfirmButton: false,
      timer: 1500
    });
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

function translateColor(color) {
  const translations = {
    "Red": "أحمر",
    "Orange": "برتقالي",
    "Yellow": "أصفر",
    "Pink": "وردي",
    "Green": "أخضر",
    "Blue": "أزرق",
    "Purple": "بنفسجي",
    "White": "أبيض",
    "Black": "أسود",
    "Brown": "بني"
  };
  return translations[color] || ""; // إرجاع الترجمة أو نص فارغ إذا لم يتم العثور على الترجمة
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

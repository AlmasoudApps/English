const main = document.querySelector("main");
const voicesSelect = document.getElementById("voices");
const textarea = document.getElementById("text");
const readButton = document.getElementById("read");
const toggleButton = document.getElementById("toggle");
const closeButton = document.getElementById("close");

const data = [
  {
    text: "Whose hat is it?",
    answer: "It's not mine",
    image: "hat2", // الكلمة المستخدمة للبحث عن الصورة
  },

  {
    text: "Whose hat is it?",
    answer: "It's mine",
    image: "hat", // الكلمة المستخدمة للبحث عن الصورة
  }
];

// الدالة لإنشاء الصندوق وضبط الأزرار للنطق
function createBox(item) {
  const { text, answer, image } = item; // استخراج النص، الجواب، واسم الصورة

  // إنشاء صندوق جديد
  const box = document.createElement("div");
  box.classList.add("box");

  // تعيين محتوى الصندوق بما في ذلك النص والصورة والزر
  box.innerHTML = `
    <br>
    <p class="info">${text}</p><br>
    <img src='./imgSpeech/${image}.jpg' alt="${image}" /> <!-- استخدام اسم الصورة من الكائن data -->
    <div class="button-group">
      <button class="check-btn" id="answerButton">${answer}</button>
    </div>
  `;

  // إضافة الصندوق إلى العنصر الرئيسي في الصفحة
  document.querySelector("main").appendChild(box);

  // إضافة حدث نطق النص عند الضغط على السؤال
  const infoElement = box.querySelector(".info");
  infoElement.addEventListener('click', () => {
    handleSpeech(text, box);  // نطق السؤال
  });

  // إضافة حدث نطق الإجابة عند الضغط على الزر
  const answerButton = box.querySelector("#answerButton");
  answerButton.addEventListener('click', () => {
    handleSpeech(answer, box);  // نطق الجواب
  });
}

// إنشاء الصندوق مع بيانات جميع الأسئلة والأجوبة
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

// تشغيل الأصوات عند تحميل الصفحة
loadVoices();

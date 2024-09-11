const main = document.querySelector("main");
const voicesSelect = document.getElementById("voices");
const rateInput = document.getElementById("rate");

const data = [
  { image: "cape", text: "cape", missing: ["a", "e"] },
  { image: "pin", text: "pin", missing: ["i"] },
  { image: "tap", text: "tap", missing: ["a"] },
  { image: "pine", text: "pine", missing: ["i", "e"] },
  { image: "ink", text: "ink", missing: ["i"] },
  { image: "vase", text: "vase", missing: ["a", "e"] },
];

// إنشاء العناصر المرئية بناءً على البيانات
data.forEach(createBox);

function createBox(item) {
  const box = document.createElement("div");
  const { image, text, missing } = item;

  box.classList.add("box");
  box.innerHTML = `
    <br>
    <img src='./imgSpeech/${image}.jpg' alt="${text.toLowerCase()}" />
    <p class="info">${text.toLowerCase()}</p>
    <form class="fill-word" onsubmit="return false;">
      ${createInputs(text.toLowerCase(), missing)}
      <br>
      <p class="result" style="color:green;"></p>
      <br><br>
      <button class="check-btn">Check</button>
    </form>
    <br>
  `;

  // إضافة حدث النقر على الصورة لتشغيل الصوت
  box.querySelector("img").addEventListener("click", () => handleSpeech(text.toLowerCase(), box));
  box.querySelector(".check-btn").addEventListener("click", () => checkAnswer(box, text.toLowerCase()));
  main.appendChild(box);
}

function createInputs(word, missing) {
  return word.split("").map((char) => {
    return missing.includes(char)
      ? `<input type="text" maxlength="1" class="letter" style="width: 20px;">`
      : `<span>${char}</span>`;
  }).join("");
}

function checkAnswer(box, correctWord) {
  const inputs = box.querySelectorAll(".letter");
  let userAnswer = "";

  inputs.forEach(input => {
    const letter = input.value.trim().toLowerCase();
    userAnswer += letter;
  });

  const missingLetters = correctWord.split('').filter(char => data.find(item => item.text === correctWord).missing.includes(char.toLowerCase()));

  if (userAnswer.length !== missingLetters.length) {
    Swal.fire({
      title: 'اكمل الإجابة!',
      text: 'يجب عليك إكمال جميع الحروف الناقصة.',
      icon: 'warning',
      confirmButtonText: 'حسناً'
    });
    return;
  }

  if (userAnswer === missingLetters.join('')) {
    Swal.fire({
      title: 'آحسنت!',
      text: 'إجابتك صحيحة!',
      icon: 'success',
      confirmButtonText: 'رائع!'
    });
  } else {
    Swal.fire({
      title: 'حاول مرة أخرى!',
      text: 'إجابتك خاطئة، جرب مرة أخرى.',
      icon: 'error',
      confirmButtonText: 'حسناً'
    });
  }
}

// إدارة الأصوات وتحميلها
const message = new SpeechSynthesisUtterance();
let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();

  $("#voices").empty();
  voices.forEach(function(voice, i) {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = voice.name;
    if (voice.name === "Samantha") {
      option.selected = true;
      message.voice = voice;
    }
    voicesSelect.appendChild(option);
  });
}

// تحميل الأصوات عند التغيير
window.speechSynthesis.onvoiceschanged = function() {
  loadVoices();
};

// دالة لتحضير النص ليتم نطقه
function setTextMessage(text) {
  message.text = text;
  message.rate = parseFloat(rateInput.value);
}

// تشغيل النص
function speakText() {
  speechSynthesis.speak(message);
}

// نطق النص عند الضغط على الصورة
function handleSpeech(text, box) {
  setTextMessage(text);
  speakText();
  box.classList.add("active");
  setTimeout(() => box.classList.remove("active"), 800);

  const selectedVoice = voicesSelect.value;
  message.voice = voices.find(voice => voice.name === selectedVoice);
}

// تعيين الصوت عند تغييره من القائمة المنسدلة
voicesSelect.addEventListener("change", function() {
  const selectedVoice = voicesSelect.value;
  message.voice = voices.find(voice => voice.name === selectedVoice);
});

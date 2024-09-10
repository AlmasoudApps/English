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

  box.querySelector("img").addEventListener("click", () => handleSpeech(text.toLowerCase()));

  const checkButton = box.querySelector(".check-btn");
  checkButton.addEventListener("click", () => checkAnswer(box, text.toLowerCase()));

  main.appendChild(box);
}

function createInputs(word, missing) {
  let inputsHTML = "";
  for (let i = 0; i < word.length; i++) {
    if (missing.includes(word[i])) {
      inputsHTML += `<input type="text" maxlength="1" class="letter" style="width: 20px;">`;
    } else {
      inputsHTML += `<span>${word[i]}</span>`;
    }
  }
  return inputsHTML;
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

const message = new SpeechSynthesisUtterance();
let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();

  const userAgent = navigator.userAgent.toLowerCase();
  let preferredVoice = null;

  if (userAgent.includes("win")) {
    preferredVoice = voices.find(voice => voice.name.includes("Microsoft"));
  } else if (userAgent.includes("mac") || userAgent.includes("iphone") || userAgent.includes("ipad")) {
    preferredVoice = voices.find(voice => voice.name === "Samantha");
  } else if (userAgent.includes("android")) {
    preferredVoice = voices.find(voice => voice.name.includes("Google"));
  } else if (userAgent.includes("linux")) {
    preferredVoice = voices.find(voice => voice.lang.startsWith("en"));
  }

  if (preferredVoice) {
    message.voice = preferredVoice;
    voicesSelect.value = preferredVoice.name;
  }

  voices.forEach(function(voice) {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = voice.name;

    if (voice === preferredVoice) {
      option.selected = true;
    }

    voicesSelect.appendChild(option);
  });
}

function handleSpeech(text) {
  message.text = text;
  message.rate = parseFloat(rateInput.value);

  const selectedVoice = voices.find(voice => voice.name === voicesSelect.value);
  if (selectedVoice) {
    message.voice = selectedVoice;
  }

  speechSynthesis.speak(message);
}

window.speechSynthesis.onvoiceschanged = loadVoices;

// إنشاء صناديق الصور والاختبارات
data.forEach(createBox);

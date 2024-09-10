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
    <img src='./imgSpeech/${image}.jpg' alt="${text.toLowerCase()}" /> <!-- تحويل النص في alt إلى حروف صغيرة -->
    <p class="info">${text.toLowerCase()}</p> <!-- تحويل النص أسفل الصورة إلى حروف صغيرة -->
    <form class="fill-word" onsubmit="return false;">
      ${createInputs(text.toLowerCase(), missing)} <!-- تأكد من تحويل النص المستخدم في الحقول أيضا إلى حروف صغيرة -->
      <br>
      <p class="result" style="color:green;"></p>
      <br><br>
      <button class="check-btn">Check</button> <!-- الزر الآن أسفل النص -->
    </form>
    <br>
  `;

  // إضافة حدث للنقر على الصورة لتشغيل الصوت
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

  // جمع الأحرف المدخلة
  inputs.forEach(input => {
    const letter = input.value.trim().toLowerCase(); // إزالة الفراغات وتحويل الحروف إلى lowercase
    userAnswer += letter;
  });

  // الحصول على الحروف الناقصة من البيانات
  const missingLetters = correctWord.split('').filter((char, index) => data.find(item => item.text === correctWord).missing.includes(char.toLowerCase()));

  // التحقق أولاً من أن المستخدم أدخل الأحرف في كل الحقول
  if (userAnswer.length !== missingLetters.length) {
    Swal.fire({
      title: 'اكمل الإجابة!',
      text: 'يجب عليك إكمال جميع الحروف الناقصة.',
      icon: 'warning',
      confirmButtonText: 'حسناً'
    });
    return;
  }

  // التحقق من صحة الحروف الناقصة فقط
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




// تفعيل تحويل النص إلى صوت عند النقر على الصورة
function handleSpeech(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rateInput.value;
  
  // تحديد الصوت
  const selectedVoice = voicesSelect.value;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(voice => voice.name === selectedVoice);
  if (voice) {
    utterance.voice = voice;
  }
  
  speechSynthesis.speak(utterance);
}

// تحميل قائمة الأصوات المتاحة
function loadVoices() {
  const voices = speechSynthesis.getVoices().filter(voice => voice.lang === "en-US");
  
  voicesSelect.innerHTML = "";
  voices.forEach(voice => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = voice.name;
    voicesSelect.appendChild(option);
  });
}

// استدعاء تحميل الأصوات عند جاهزيتها
speechSynthesis.onvoiceschanged = loadVoices;

// إنشاء صناديق الصور والاختبارات
data.forEach(createBox);

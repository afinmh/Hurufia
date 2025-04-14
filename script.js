const questions = [
    [
        "1. Apa hukum tajwid dari mim mati bertemu ha dalam kalimat: بُيُوْتِكُمْ حَتّٰى ؟",
        [
            ["A. Idzhar Syafawi", 1.0, 0.0, "Benar. Hukum mim mati bertemu ha adalah Idzhar Syafawi."],
            ["B. Idzhar Haqiqi", 0.4, 0.6, "Salah. Namanya mirip, tapi ini hukum nun mati, bukan mim mati."],
            ["C. Ikhfa Syafawi", 0.6, 0.4, "Mendekati. Ini masih hukum mim mati, tapi bukan huruf ha."],
            ["D. Idzhar Qomariyah", 0.0, 1.0, "Ngaco. Ini jauh sekali karena ini hukum alif lam bertemu huruf qamariyah."]
        ],
        "A"
    ],
    [
        "2. Apa hukum tajwid dari tanwin bertemu mim dalam kalimat: عُصْبَةٌ مِّنْكُمْۗ ؟",
        [
            ["A. Idgham Bilaghunnah", 0.7, 0.4, "Mendekati. Ini digunakan untuk lam dan ra."],
            ["B. Idgham Bighunnah", 1.0, 0.0, "Benar. Tanwin bertemu mim termasuk dalam hukum Idgham Bighunnah."],
            ["C. Iqlab", 0.3, 0.8, "Salah. Iqlab terjadi saat nun mati bertemu ba."],
            ["D. Izhar Syafawi", 0.0, 1.0, "Ngaco. Ini berlaku untuk mim mati, bukan nun mati."]
        ],
        "B"
    ],
    [
        "3. Apa hukum tajwid berikut: وَاللّٰهُ ؟",
        [
            ["A. Tarqiq", 0.7, 0.3, "Mendekati. Ini hanya tepat jika sebelumnya kasrah, bukan fathah."],
            ["B. Tafkhim", 1.0, 0.0, "Benar. Karena sebelumnya adalah fathah, maka lafadz wallahu dibaca tafkhim (tebal)."],
            ["C. Ikhfa Haqiqi", 0.3, 0.6, "Salah. Ini berlaku untuk nun mati bertemu huruf-huruf ikhfa."],
            ["D. Idzhar Qomariyah", 0.0, 1.0, "Ngaco Tidak berkaitan, ini hukum alif lam qomariyah."]
        ],
        "B"
    ],
    [
        "4. Apa hukum tajwid berikut: وَفِيْٓ اُذُنَيْهِ ؟",
        [
            ["A. Mad lazim mutsaqqal kilmi", 0.3, 0.6, "Salah. Ini adalah hukum mad bertemu tasydid dalam satu kata. Tidak terjadi di sini ."],
            ["B. Qalqalah", 0.0, 1.0, "Ngaco. Qalqalah adalah pantulan suara pada huruf tertentu."],
            ["C. Mad Jaiz Munfashil", 1.0, 0.0, "Benar. Mad thabi’i bertemu hamzah di kata berbeda."],
            ["D. Mad Wajib Muttashil", 0.8, 0.3, "Mendekati. Ini mirip, tapi terjadi jika mad bertemu hamzah dalam satu kata, bukan antar kata."]
        ],
        "C"
    ]
];

let currentQuestion = 0;
let totalCF = 0;
let selectedOption = null;
const answersList = document.getElementById('answers-list');
let answers = [];

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');
const cfValue = document.getElementById('cf-value');
const nextButton = document.getElementById('next-button');
const resultContainer = document.getElementById('result-container');
const averageCF = document.getElementById('average-cf');
const finalFeedback = document.getElementById('final-feedback');
const restartButton = document.getElementById('restart-button');
const checkButton = document.getElementById('check-button');
const modal = document.getElementById('feedback-modal');
const closeModal = document.querySelector('.close-modal');
const feedbackIcon = document.getElementById('feedback-icon');
const progress = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

function calculateCF(mb, md) {
    return mb - md;
}

function updateProgress() {
    const percentage = ((currentQuestion + 1) / questions.length) * 100;
    progress.style.width = `${percentage}%`;
    progressText.textContent = `${currentQuestion + 1}/${questions.length}`;
}

function displayQuestion() {
    const [question, options] = questions[currentQuestion];
    questionText.textContent = question;
    optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option[0];
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });
    
    checkButton.classList.add('hidden');
    resultContainer.classList.add('hidden');
}

function selectOption(index) {
    selectedOption = index;
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    checkButton.classList.remove('hidden');
}

function addAnswerToPanel(questionNumber, cf) {
    const answerItem = document.createElement('div');
    answerItem.className = 'answer-item';
    
    const answerNumber = document.createElement('div');
    answerNumber.className = 'answer-number';
    answerNumber.textContent = questionNumber;
    
    const answerStatus = document.createElement('div');
    answerStatus.className = 'answer-status';
    
    if (cf === 1) {
        answerItem.classList.add('correct');
        answerStatus.textContent = 'Benar';
    } else if (cf >= 0) {
        answerItem.classList.add('close');
        answerStatus.textContent = 'Mendekati';
    } else if (cf > -0.5) {
        answerItem.classList.add('wrong');
        answerStatus.textContent = 'Salah';
    } else {
        answerItem.classList.add('kacau');
        answerStatus.textContent = 'Kacau';
    }
    
    answerItem.appendChild(answerNumber);
    answerItem.appendChild(answerStatus);
    answersList.appendChild(answerItem);
}

function showFeedback() {
    if (selectedOption === null) return;
    
    const [_, options, correct] = questions[currentQuestion];
    const selected = options[selectedOption];
    const cf = calculateCF(selected[1], selected[2]);
    totalCF += cf;
    
    // Add answer to panel
    addAnswerToPanel(currentQuestion + 1, cf);
    
    // Set feedback icon based on CF value
    if (cf === 1) {
        feedbackIcon.className = 'fas fa-check-circle';
        feedbackIcon.style.color = '#4caf50';
    } else if (cf >= 0) {
        feedbackIcon.className = 'fas fa-exclamation-circle';
        feedbackIcon.style.color = '#ff9800';
    } else {
        feedbackIcon.className = 'fas fa-times-circle';
        feedbackIcon.style.color = '#f44336';
    }
    
    feedbackText.textContent = selected[3];
    cfValue.textContent = cf.toFixed(2);
    
    // Show modal with animation
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
}

function hideModal() {
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

closeModal.addEventListener('click', hideModal);

nextButton.addEventListener('click', () => {
    hideModal();
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        selectedOption = null;
        displayQuestion();
        updateProgress();
    } else {
        showResults();
    }
});

function showResults() {
    const average = totalCF / questions.length;
    averageCF.textContent = `CF Rata-rata Anda: ${average.toFixed(2)}`;
    
    if (average >= 0.85) {
        finalFeedback.textContent = "🟢 Sangat yakin dan akurat.";
        finalFeedback.className = "good";
    } else if (average >= 0.6) {
        finalFeedback.textContent = "🟡 Cukup yakin, bisa ditingkatkan.";
        finalFeedback.className = "medium";
    } else if (average >= 0.3) {
        finalFeedback.textContent = "🟠 Perlu penguatan konsep.";
        finalFeedback.className = "medium";
    } else {
        finalFeedback.textContent = "🔴 Pemahaman masih lemah, perlu belajar lagi.";
        finalFeedback.className = "poor";
    }
    
    resultContainer.classList.remove('hidden');
}

checkButton.addEventListener('click', showFeedback);

function restartQuiz() {
    currentQuestion = 0;
    totalCF = 0;
    selectedOption = null;
    answers = [];
    answersList.innerHTML = '';
    displayQuestion();
    updateProgress();
}

restartButton.addEventListener('click', restartQuiz);

// Initialize the quiz
displayQuestion();
updateProgress(); 
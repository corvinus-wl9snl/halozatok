var hotList = [];
var questionsInHotlist = 3;
var displayedQuestion;
var numberOfQuestions;
var nextQuestion = 1;
var timerhandler;

function init() {
    for (let i = 0; i < questionsInHotlist; i++) {
        hotList[i] = {
            question: {},
            goodAnswers: 0
        }
    }

    for (let i = 0; i < questionsInHotlist; i++) {
        kérdésBetöltés(nextQuestion, i);
        nextQuestion++;
    }

    fetch("/questions/count")
        .then(response => response.text())
        .then(n => { numberOfQuestions = parseInt(n) })

    document.getElementById("előre").addEventListener("click", előre);
    document.getElementById("vissza").addEventListener("click", hátra);

    if (localStorage.getItem("hotList")) {
        hotList = JSON.parse(localStorage.getItem("hotList"));
    }
    if (localStorage.getItem("nextQuestion")) {
        nextQuestion = parseInt(localStorage.getItem("nextQuestion"));
    }
    if (localStorage.getItem("displayedQuestion")) {
        displayedQuestion = localStorage.getItem("displayedQuestion");
    }

    if (hotList.length==0) {
        for (let i = 0; i < questionsInHotlist; i++) {
            kérdésBetöltés(nextQuestion, i);
            nextQuestion++;
        }
    }
    else {
        kérdésMegjelenítés();
        console.log("Localstorageből töltött kérdésekkel dolgozunk");
    }
}

function kérdésBetöltés(id, destination) {
    fetch(`/questions/${id}`)
        .then(response => {
            if (!response.ok) {
                console.error(`Hibás válasz: ${response.status}`)
            }
            else {
                return response.json()
            }
        })
        .then(q => {
            hotList[destination].question = q;
            hotList[destination].goodAnswers = 0;
            console.log(`A ${id}. kérdés letöltésre került a hotList ${destination} helyére.`);
            if (displayedQuestion === undefined && destination === 0) {
                displayedQuestion = 0;
                kérdésMegjelenítés();
            }
        }
        )
}

function kérdésMegjelenítés() {
    let kérdés = hotList[displayedQuestion].question;
    document.getElementById("kérdés_szöveg").innerText = kérdés.questionText;
    document.getElementById("válasz1").innerText = kérdés.answer1;
    document.getElementById("válasz2").innerText = kérdés.answer2;
    document.getElementById("válasz3").innerText = kérdés.answer3;

    if (kérdés.image) {
        document.getElementById("kép").src = kérdés.image;
        document.getElementById("kép").style.display = "block";
    }
    else {
        document.getElementById("kép").style.display = "none";
    }

    for (let i = 1; i <= 3; i++) {
        document.getElementById("válasz" + i).classList.remove("jó","rossz");
    }
    document.getElementById("válaszok").style.pointerEvents= "auto";
} 

window.onload = init;

function előre() {
    clearTimeout(timerHandler);
    displayedQuestion++;
    if (displayedQuestion === questionsInHotlist) {
        displayedQuestion = 0;
    }
    kérdésMegjelenítés();
}

function hátra() {
    clearTimeout(timerHandler);
    displayedQuestion--;
    if (displayedQuestion < 0) {
        displayedQuestion = questionsInHotlist - 1;
    }
    kérdésMegjelenítés();
}

function választás(n) {
    let kérdés = hotList[displayedQuestion].question;
    if (n === kérdés.correctAnswer) {
        document.getElementById("válasz" + n).classList.add("jó");
        hotList[displayedQuestion].goodAnswers++;
        if (hotList[displayedQuestion].goodAnswers == 3) {
            kérdésBetöltés(nextQuestion, displayedQuestion);
            nextQuestion++;
        }
    }
    else {
        document.getElementById("válasz" + n).classList.add("rossz");
        document.getElementById("válasz" + kérdés.correctAnswer).classList.add("jó");
        hotList[displayedQuestion].goodAnswers = 0;
    }
    document.getElementById("válaszok").style.pointerEvents = "none";
    timerHandler = setTimeout(előre, 3000);

    localStorage.setItem("hotList", JSON.stringify(hotList));
    localStorage.setItem("displayedQuestion", displayedQuestion);
    localStorage.setItem("nextQuestion", nextQuestion);
} 
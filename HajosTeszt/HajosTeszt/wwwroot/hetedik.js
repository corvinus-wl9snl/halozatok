var kérdések;
function letöltés() {
    fetch('/questions.json')
        .then(response => response.json())
        .then(data => letöltésBefejeződött(data)
       );
}

function letöltésBefejeződött(k) {
    console.log("Sikeres letöltés")
    console.log(k)
    kérdések = k;
}

window.onload(letöltés());

function kérdésMegjelenítés(kérdés) {
    document.getElementById("vissza").onclick = function () {

    }
}
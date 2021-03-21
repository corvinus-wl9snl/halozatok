window.onload = () => {
    let hova = document.getElementById("pascal");
    for (var s = 0; s < length; s++) {
        let sor = document.createElement("div");
        sor.classList.add("sor");
        hova.appendChild("sor");
        for (var o = 0; o < length; o++) {
            let szám = document.createElement("div");
            szám.innerText = (s + 1) * (o + 1);
            sor.appendChild("szám");
            szám.classList.add("elem");
        }
    }
}
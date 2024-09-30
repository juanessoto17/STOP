const myInput = document.getElementById("input-cant");

function stepper(btn){
    let id = btn.getAttribute("id");
    let min = myInput.getAttribute("min");
    let max = myInput.getAttribute("max");
    let step = myInput.getAttribute("step");
    let val = myInput.getAttribute("value");
    let calcstep = (id == "increment") ? (step*1) : (step * -1)
    let newValue = parseInt(val) + calcstep;

    if (newValue >= min && newValue <= max){
        myInput.setAttribute("value", newValue);
    }
}

function play() {
    let val = myInput.getAttribute("value");

    if (val == 3) {
        window.location.href = "../HTML/3p.html";
    }
    else {
        alert("PROXIMAMENTE...");
    }
}

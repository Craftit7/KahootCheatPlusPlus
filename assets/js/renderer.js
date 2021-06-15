// JavaScript.
let inputs = document.getElementsByTagName('input');
for (let inputPin of inputs) {
    inputPin.addEventListener('input', () => {
        inputPin.classList.remove('error');
    });
}
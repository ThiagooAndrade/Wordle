import rows from "./rowsObject.js";
import palavrasSecretas from "./palavrasSecretas.js";

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const numRandom = getRandomArbitrary(0, 142);

let palavraSecreta = palavrasSecretas[numRandom].toUpperCase();
let arrPalavraSecreta = palavraSecreta.split("");

let respostaJogador = [];

let linhaAtual = 0;
// const colorGray = "585858";
// const colorGreen = "538d4e";
// const colorYellow = "b59f3b";
let auxColunaAtual = 0;
let colunaAtual = `index${auxColunaAtual}`;
let numberOfLetters = 0;

document.addEventListener("click", (event) => {
    const element = event.target;

    // if (element.classList.contains("")) {
    // }
    if (element.classList.contains("caractere")) {
        if (numberOfLetters <= 5) {
            inputLetter(element.innerText);

            console.log(element.innerText);
        }
        return;
    } else if (element.classList.contains("enter")) {
        if (numberOfLetters == 5) {
            let repetidas = 0;
            if (verificaSePalavraExiste(repetidas)) {
                atualizaCorDosQuadrados();
                atualizaCorDoTeclado();
                if (verificaVitoria()) {
                    setTimeout(() => {
                        window.alert("Você acertou!");
                    }, 1000);
                    return;
                }
                numberOfLetters = 0;
                linhaAtual++;
                auxColunaAtual = 0;
                colunaAtual = `index${auxColunaAtual}`;
                respostaJogador = [];
            }
        } else {
            window.alert("Preencha todas as letras");
        }
        if (linhaAtual == 6) {
            vocePerdeu();
        }
        return;
    } else if (element.classList.contains("apagar")) {
        if (numberOfLetters > 0) {
            numberOfLetters--;
            auxColunaAtual--;
            colunaAtual = `index${auxColunaAtual}`;
            apagaLetra();
        }

        return;
    }
});

function verificaSePalavraExiste(repetidas) {
    for (let letra = 0; letra < arrPalavraSecreta.length; letra++) {
        for (let index = letra + 1; index < arrPalavraSecreta.length; index++) {
            if (respostaJogador[letra] == respostaJogador[index]) {
                repetidas++;
            }
        }
        if (repetidas >= 2) {
            window.alert("Escreva outra palavra, esta palavra não existe!");
            return false;
        }
        repetidas = 0;
    }
    return true;
}

function vocePerdeu() {
    return window.alert("Você perdeu!");
}

function inputLetter(letter) {
    rows[linhaAtual][`${colunaAtual}`].innerText = letter;
    numberOfLetters++;
    auxColunaAtual++;
    colunaAtual = `index${auxColunaAtual}`;
    if (respostaJogador.length < 5) {
        respostaJogador.push(letter);
    }
}

function verificaVitoria() {
    let tentativa = respostaJogador.join("");
    if (tentativa == palavraSecreta) {
        return true;
    }
    return false;
}

function apagaLetra() {
    rows[linhaAtual][`${colunaAtual}`].innerText = "";
    respostaJogador.pop();
}

function atualizaCorDoTeclado() {
    let elemento;
    for (let index = 0; index < arrPalavraSecreta.length; index++) {
        elemento = document.getElementById(`${respostaJogador[index]}`);
        if (
            arrPalavraSecreta.includes(respostaJogador[index]) &&
            !elemento.classList.contains("bg-right")
        ) {
            elemento.classList.add("bg-right");
            continue;
        }
        if (
            !arrPalavraSecreta.includes(respostaJogador[index]) &&
            !elemento.classList.contains("bg-wrong")
        ) {
            document
                .getElementById(`${respostaJogador[index]}`)
                .classList.add("bg-wrong");
        }
    }
}

function atualizaCorDosQuadrados() {
    let colunaAtual;
    let auxColunaAtual;
    let arrLetrasJogador = [];
    let quantidadeDeElementos;

    for (let letra = 0; letra < arrPalavraSecreta.length; letra++) {
        auxColunaAtual = letra;
        colunaAtual = `index${auxColunaAtual}`;

        rows[linhaAtual][colunaAtual].classList.add("bg-wrong");

        quantidadeDeElementos = arrPalavraSecreta.filter(
            (elemento) => elemento == respostaJogador[letra]
        ).length;
        console.log(quantidadeDeElementos);

        if (respostaJogador[letra] == arrPalavraSecreta[letra]) {
            rows[linhaAtual][colunaAtual].classList.remove("bg-wrong");
            rows[linhaAtual][colunaAtual].classList.add("bg-right");
        } else if (quantidadeDeElementos > 1) {
            rows[linhaAtual][colunaAtual].classList.remove("bg-wrong");
            rows[linhaAtual][colunaAtual].classList.add("bg-displaced");
        } else {
            if (!arrPalavraSecreta.includes(respostaJogador[letra])) {
                continue;
            }
            if (arrLetrasJogador.includes(respostaJogador[letra])) {
                continue;
            } else {
                rows[linhaAtual][colunaAtual].classList.remove("bg-wrong");
                rows[linhaAtual][colunaAtual].classList.add("bg-displaced");
            }
        }

        arrLetrasJogador.push(respostaJogador[letra]);
    }
}

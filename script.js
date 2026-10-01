const telaMenu = document.getElementById("tela-menu");
const telaJogo = document.getElementById("tela-jogo");
const telaResultado = document.getElementById("tela-resultado");

const botoesDificuldade =
    document.querySelectorAll(".botao-dificuldade");

const cronometro =
    document.getElementById("cronometro");

const pontuacao =
    document.getElementById("pontuacao");

const pontuacaoFinal =
    document.getElementById("pontuacao-final");

const botaoTentarNovamente =
    document.getElementById("botao-tentar-novamente");

const botaoVoltarMenu =
    document.getElementById("botao-voltar-menu");

const areaJogo =
    document.getElementById("area-jogo");

const indicadorDificuldade =
    document.getElementById("indicador-dificuldade");

const mensagemResultado =
    document.getElementById("mensagem-resultado");


let dificuldade = "";

let pontos = 0;

let tempoRestante = 30;

let intervaloCronometro = null;

let proximaRodada = null;

let jogoAtivo = false;


/* ================================================= */
/* ================= CONFIGURAÇÕES ================= */
/* ================================================= */

const configuracoes = {

    facil: {

        quantidadeMinima: 1,

        quantidadeMaxima: 1,

        tempoBotao: 1800,

        intervaloRodada: 1750,

        cores: [
            "#00ff66",
            "#00e5ff",
            "#39ff14"
        ]

    },


    normal: {

        quantidadeMinima: 1,

        quantidadeMaxima: 2,

        chanceDoisBotoes: 0.28,

        tempoBotao: 1150,

        intervaloRodada: 950,

        cores: [
            "#ffe600",
            "#ff7b00",
            "#00e5ff",
            "#7c4dff"
        ]

    },


desafiador: {

    quantidadeMinima: 3,

    quantidadeMaxima: 5,

    tempoBotao: 2200,

    intervaloRodada: 1800,

    cores: [
        "#ff1744",
        "#ff00cc",
        "#7c4dff",
        "#00e5ff",
        "#39ff14"
    ]

},

extremo: {

    quantidadeMinima: 4,

    quantidadeMaxima: 7,

    tempoBotao: 1600,

    intervaloRodada: 1300,

    cores: [
        "#ff1744",
        "#ff00cc",
        "#7c4dff",
        "#00e5ff",
        "#39ff14",
        "#ffe600"
    ]

},

cores: {

    quantidadeMinima: 3,

    quantidadeMaxima: 4,

    tipos: [

        {
            nome: "azul",
            cor: "#2196f3",
            pontos: 1,
            tempo: 3000,
            chance: 30
        },

        {
            nome: "vermelho",
            cor: "#f44336",
            pontos: 2,
            tempo: 2700,
            chance: 22
        },

        {
            nome: "roxo",
            cor: "#9c27b0",
            pontos: 5,
            tempo: 2400,
            chance: 16
        },

        {
            nome: "rosa",
            cor: "#ff4081",
            pontos: 10,
            tempo: 2100,
            chance: 11
        },

        {
            nome: "verde",
            cor: "#4caf50",
            pontos: 15,
            tempo: 1800,
            chance: 8
        },

        {
            nome: "ciano",
            cor: "#00e5ff",
            pontos: 20,
            tempo: 1550,
            chance: 5
        },

        {
            nome: "branco",
            cor: "#ffffff",
            pontos: 50,
            tempo: 1300,
            chance: 4
        },

        {
            nome: "cinza",
            cor: "#777777",
            pontos: 100,
            tempo: 1050,
            chance: 2.5
        },

        {
            nome: "preto",
            cor: "#111111",
            pontos: 150,
            tempo: 800,
            chance: 1.5
        }

    ],

    intervaloRodada: 900

}

};


/* ================================================= */
/* ================= ESCOLHER DIFICULDADE ========== */
/* ================================================= */

botoesDificuldade.forEach(function (botao) {

    botao.addEventListener("click", function () {

        dificuldade =
            botao.dataset.dificuldade;

        iniciarJogo();

    });

});


/* ================================================= */
/* ================= INICIAR JOGO ================== */
/* ================================================= */

function iniciarJogo() {

    limparTudo();

    telaMenu.classList.add("escondido");

    telaResultado.classList.add("escondido");

    telaJogo.classList.remove("escondido");

    pontos = 0;

    tempoRestante = 30;

    jogoAtivo = true;

    atualizarPontuacao();

    atualizarCronometro();

    atualizarIndicador();

    iniciarCronometro();

    criarRodada();

}


/* ================================================= */
/* ================= CRONÔMETRO ==================== */
/* ================================================= */

function iniciarCronometro() {

    clearInterval(intervaloCronometro);

    intervaloCronometro =
        setInterval(function () {

            if (!jogoAtivo) {
                return;
            }

            tempoRestante--;

            atualizarCronometro();

            if (tempoRestante <= 0) {

                finalizarJogo();

            }

        }, 1000);

}


function atualizarCronometro() {

    cronometro.textContent =
        tempoRestante;

    if (tempoRestante <= 10) {

        cronometro.classList.add("tempo-final");

    } else {

        cronometro.classList.remove("tempo-final");

    }

}


/* ================================================= */
/* =================== PONTOS ====================== */
/* ================================================= */

function atualizarPontuacao() {

    pontuacao.textContent =
        "Pontos: " + pontos;

}


/* ================================================= */
/* ================ INDICADOR MODO ================= */
/* ================================================= */

function atualizarIndicador() {

    const nomes = {

        facil: "Fácil",

        normal: "Normal",

        desafiador: "Desafiador",

        extremo: "Extremo",

        cores: "Caça às Cores"

    };

    indicadorDificuldade.textContent =
        nomes[dificuldade];

}


/* ================================================= */
/* ================= CRIAR RODADA ================== */
/* ================================================= */

function criarRodada() {

    if (!jogoAtivo) {
        return;
    }

    removerBotoesAtuais();

    if (dificuldade === "cores") {

    const configuracao =
        configuracoes.cores;

    const quantidade =
        Math.floor(
            Math.random() *
            (
                configuracao.quantidadeMaxima -
                configuracao.quantidadeMinima +
                1
            )
        )
        +
        configuracao.quantidadeMinima;

    const posicoes = [];

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const botao =
            criarBotaoPorCor(posicoes);

        areaJogo.appendChild(botao);

    }

    proximaRodada =
        setTimeout(function () {

            if (jogoAtivo) {

                criarRodada();

            }

        }, configuracao.intervaloRodada);

    return;

}

    const configuracao =
        configuracoes[dificuldade];

    let quantidade;


    /* ================= FÁCIL ================= */

    if (dificuldade === "facil") {

        quantidade = 1;

    }


    /* ================= NORMAL ================= */

    else if (dificuldade === "normal") {

        if (
            Math.random() <
            configuracao.chanceDoisBotoes
        ) {

            quantidade = 2;

        } else {

            quantidade = 1;

        }

    }


    /* =============== DESAFIADOR =============== */

    else {

        quantidade =
            Math.floor(
                Math.random() *
                (
                    configuracao.quantidadeMaxima -
                    configuracao.quantidadeMinima +
                    1
                )
            )
            +
            configuracao.quantidadeMinima;

    }


    const posicoes = [];


    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const botao =
            criarBotao(posicoes);

        areaJogo.appendChild(botao);

    }


    proximaRodada =
        setTimeout(function () {

            if (jogoAtivo) {

                criarRodada();

            }

        }, configuracao.intervaloRodada);

}


/* ================================================= */
/* ================= CRIAR BOTÃO =================== */
/* ================================================= */
function criarBotaoPorCor(posicoes) {

    const configuracao =
        configuracoes.cores;

    const botao =
        document.createElement("button");

    botao.className =
        "botao-reacao";

    botao.type = "button";


    /* ================= ESCOLHER COR ================= */

    let numero =
        Math.random() * 100;

    let tipoEscolhido =
        configuracao.tipos[0];


    for (
        const tipo of configuracao.tipos
    ) {

        if (numero < tipo.chance) {

            tipoEscolhido = tipo;

            break;

        }

        numero -= tipo.chance;

    }


    /* ================= VISUAL ================= */

    botao.style.background =
        criarGradiente(
            tipoEscolhido.cor
        );

    botao.style.color =
        tipoEscolhido.cor;

    botao.style.boxShadow = `
        0 0 10px ${tipoEscolhido.cor},
        inset 0 0 8px rgba(255,255,255,0.3)
    `;


    /* ================= PONTUAÇÃO ================= */

    botao.dataset.pontos =
        tipoEscolhido.pontos;


    /* ================= POSIÇÃO ================= */

    const posicao =
        encontrarPosicao(posicoes);

    botao.style.left =
        posicao.x + "px";

    botao.style.top =
        posicao.y + "px";

    posicoes.push(posicao);


    /* ================= CLIQUE ================= */

    botao.addEventListener(
        "click",
        function () {

            if (!jogoAtivo) {
                return;
            }

            pontos +=
                Number(
                    botao.dataset.pontos
                );

            atualizarPontuacao();

            botao.classList.add(
                "sumindo"
            );

            setTimeout(function () {

                if (botao.parentElement) {

                    botao.remove();

                }

            }, 250);

        }
    );


    /* ================= DESAPARECER ================= */

    setTimeout(function () {

        if (
            jogoAtivo &&
            botao.parentElement
        ) {

            botao.classList.add(
                "sumindo"
            );

            setTimeout(function () {

                if (botao.parentElement) {

                    botao.remove();

                }

            }, 250);

        }

    }, tipoEscolhido.tempo);


    return botao;

}

function criarBotao(posicoes) {

    const configuracao =
        configuracoes[dificuldade];

    const botao =
        document.createElement("button");

    botao.className =
        "botao-reacao";

    botao.type = "button";


    const cor =
        configuracao.cores[
            Math.floor(
                Math.random() *
                configuracao.cores.length
            )
        ];


    botao.style.background =
        criarGradiente(cor);

    botao.style.color =
        cor;

    botao.style.boxShadow = `
    0 0 10px ${cor},
    inset 0 0 8px rgba(255,255,255,0.3)
`;


    const posicao =
        encontrarPosicao(posicoes);


    botao.style.left =
        posicao.x + "px";

    botao.style.top =
        posicao.y + "px";


    posicoes.push(posicao);


    botao.addEventListener(
        "click",
        function () {

            if (!jogoAtivo) {
                return;
            }

            pontos++;

            atualizarPontuacao();

            botao.classList.add("sumindo");

            setTimeout(function () {

                if (botao.parentElement) {

                    botao.remove();

                }

            }, 250);

        }
    );


    setTimeout(function () {

        if (
            jogoAtivo &&
            botao.parentElement
        ) {

            botao.classList.add("sumindo");

            setTimeout(function () {

                if (botao.parentElement) {

                    botao.remove();

                }

            }, 250);

        }

    }, configuracao.tempoBotao);


    return botao;

}


/* ================================================= */
/* ============== POSIÇÃO DOS BOTÕES ============== */
/* ================================================= */

function encontrarPosicao(posicoes) {

    const largura =
        areaJogo.clientWidth;

    const altura =
        areaJogo.clientHeight;


    const tamanhoBotao = 105;

    const margem = 70;

    const distanciaMinima = 125;


    let x;

    let y;

    let tentativa = 0;

    let posicaoValida = false;


    while (
        !posicaoValida &&
        tentativa < 30
    ) {

        x =
            margem +
            Math.random() *
            Math.max(
                1,
                largura -
                margem * 2
            );


        y =
            margem +
            Math.random() *
            Math.max(
                1,
                altura -
                margem * 2
            );


        posicaoValida = true;


        for (
            const posicao of posicoes
        ) {

            const distanciaX =
                x - posicao.x;

            const distanciaY =
                y - posicao.y;


            const distancia =
                Math.sqrt(
                    distanciaX * distanciaX +
                    distanciaY * distanciaY
                );


            if (
                distancia <
                distanciaMinima
            ) {

                posicaoValida = false;

                break;

            }

        }


        tentativa++;

    }


    return {

        x: Math.min(
            Math.max(x, tamanhoBotao / 2),
            largura - tamanhoBotao / 2
        ),

        y: Math.min(
            Math.max(y, tamanhoBotao / 2),
            altura - tamanhoBotao / 2
        )

    };

}


/* ================================================= */
/* ================== GRADIENTE ==================== */
/* ================================================= */

function criarGradiente(cor) {

    return `
        radial-gradient(
            circle at 35% 30%,
            rgba(255,255,255,0.65),
            ${cor} 30%,
            ${cor} 100%
        )
    `;

}


/* ================================================= */
/* ============== REMOVER BOTÕES ================== */
/* ================================================= */

function removerBotoesAtuais() {

    const botoes =
        document.querySelectorAll(
            ".botao-reacao"
        );


    botoes.forEach(function (botao) {

        botao.remove();

    });

}


/* ================================================= */
/* ================= LIMPAR TUDO =================== */
/* ================================================= */

function limparTudo() {

    clearInterval(
        intervaloCronometro
    );

    clearTimeout(
        proximaRodada
    );

    removerBotoesAtuais();

}


/* ================================================= */
/* ================= FINALIZAR ===================== */
/* ================================================= */

function finalizarJogo() {

    if (!jogoAtivo) {
        return;
    }

    jogoAtivo = false;

    clearInterval(
        intervaloCronometro
    );

    clearTimeout(
        proximaRodada
    );


    const botoes =
        document.querySelectorAll(
            ".botao-reacao"
        );


    botoes.forEach(function (botao) {

        botao.classList.add("sumindo");

    });


    pontuacaoFinal.textContent =
        "Pontuação: " + pontos;


    definirMensagem();


    setTimeout(function () {

        removerBotoesAtuais();

        telaJogo.classList.add(
            "escondido"
        );

        telaResultado.classList.remove(
            "escondido"
        );

    }, 300);

}


/* ================================================= */
/* ============== MENSAGEM FINAL =================== */
/* ================================================= */

function definirMensagem() {

    if (pontos === 0) {

        mensagemResultado.textContent =
            "Vamos tentar de novo!";

        return;

    }


    if (pontos < 10) {

        mensagemResultado.textContent =
            "Boa! Continue praticando!";

        return;

    }


    if (pontos < 25) {

        mensagemResultado.textContent =
            "Muito bem! Você foi rápido!";

        return;

    }


    mensagemResultado.textContent =
        "Incrível! Que velocidade!";

}


/* ================================================= */
/* ============== TENTAR NOVAMENTE ================= */
/* ================================================= */

botaoTentarNovamente.addEventListener(
    "click",
    function () {

        iniciarJogo();

    }
);


/* ================================================= */
/* ================= VOLTAR MENU =================== */
/* ================================================= */

botaoVoltarMenu.addEventListener(
    "click",
    function () {

        limparTudo();

        jogoAtivo = false;

        telaResultado.classList.add(
            "escondido"
        );

        telaJogo.classList.add(
            "escondido"
        );

        telaMenu.classList.remove(
            "escondido"
        );

    }
);
/**
 * SHEIN Verify Page - JavaScript Controller
 * Barra de progresso animada com saldo aumentando
 */

// Configurações
const TOTAL_DURATION = 6000; // 6 segundos para completar
const INITIAL_PRIZE = 0;
const FINAL_PRIZE = 100; // Valor final que vai parar
const UPDATE_INTERVAL = 50; // Atualiza a cada 50ms

// Status messages que vão aparecer
const statusMessages = [
    "Analisando banco de dados...",
    "Verificando sua localização...",
    "Consultando disponibilidade...",
    "Validando informações...",
    "Confirmando elegibilidade...",
    "Quase lá...",
    "Finalizando verificação..."
];

// Elementos do DOM
let progressFill;
let progressText;
let verifyStatus;
let prizeValue;
let verifyLoading;
let verifySuccess;

// Estado
let currentProgress = 0;
let currentPrize = INITIAL_PRIZE;
let startTime;
let currentMessageIndex = 0;

/**
 * Inicializa a verificação quando a página carrega
 */
document.addEventListener('DOMContentLoaded', function () {
    // Captura elementos
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');
    verifyStatus = document.getElementById('verifyStatus');
    prizeValue = document.getElementById('prizeValue');
    verifyLoading = document.getElementById('verifyLoading');
    verifySuccess = document.getElementById('verifySuccess');

    // Inicia a animação
    startVerification();
});

/**
 * Inicia o processo de verificação
 */
function startVerification() {
    startTime = performance.now();
    updateProgress();
}

/**
 * Atualiza a barra de progresso
 */
function updateProgress() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

    // Progresso LINEAR (velocidade constante)
    progressFill.style.width = `${Math.max(progress, 12)}%`;
    progressText.textContent = `${Math.floor(progress)}%`;

    // Atualiza o saldo gradualmente (de 0 a 100) - também linear
    const targetPrize = INITIAL_PRIZE + (FINAL_PRIZE * (progress / 100));
    animatePrize(targetPrize);

    // Atualiza a mensagem de status
    const messageIndex = Math.floor((progress / 100) * (statusMessages.length - 1));
    if (messageIndex !== currentMessageIndex && messageIndex < statusMessages.length) {
        currentMessageIndex = messageIndex;
        verifyStatus.style.opacity = '0';
        setTimeout(() => {
            verifyStatus.textContent = statusMessages[messageIndex];
            verifyStatus.style.opacity = '1';
        }, 150);
    }

    // Continua ou finaliza
    if (progress < 100) {
        requestAnimationFrame(updateProgress);
    } else {
        // Completa a animação
        setTimeout(() => {
            showSuccess();
        }, 500);
    }
}

/**
 * Anima o valor do prêmio
 */
function animatePrize(targetValue) {
    const displayValue = Math.floor(targetValue);
    prizeValue.textContent = formatCurrency(displayValue);

    // Adiciona efeito visual se mudou
    if (displayValue !== currentPrize) {
        prizeValue.classList.add('counting');
        currentPrize = displayValue;

        clearTimeout(window.prizeTimeout);
        window.prizeTimeout = setTimeout(() => {
            prizeValue.classList.remove('counting');
        }, 200);
    }
}

/**
 * Formata valor em reais
 */
function formatCurrency(value) {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Easing function - ease out quart
 */
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

/**
 * Mostra a tela de sucesso
 */
function showSuccess() {
    // Esconde loading
    verifyLoading.classList.add('hidden');

    // Mostra sucesso
    verifySuccess.classList.remove('hidden');

    // Aguarda um momento e adiciona a classe visible para animação
    setTimeout(() => {
        verifySuccess.classList.add('visible');
    }, 50);

    // Pulsa o valor final
    prizeValue.classList.add('pulse');
}

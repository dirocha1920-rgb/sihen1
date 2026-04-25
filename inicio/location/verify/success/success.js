/**
 * SHEIN Success Page - JavaScript Controller
 * Barra de progresso, confetes e animações de sucesso
 */

// Configurações
const TOTAL_DURATION = 8000; // 8 segundos
const CONFETTI_COUNT = 150;
const CONFETTI_COLORS = ['#22c55e', '#16a34a', '#fbbf24', '#f97316', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899'];

// Status messages
const statusMessages = [
    "Verificando respostas...",
    "Analisando seu perfil...",
    "Calculando premiação...",
    "Confirmando elegibilidade...",
    "Finalizando..."
];

// Elementos
let progressFill, progressText, loadingStatus, prizeValue;
let loadingState, successState, prizeAmount;
let termsCheckbox, claimBtn, confettiContainer;

let currentMessageIndex = 0;
let startTime;
let finalPrize;

/**
 * Inicializa quando a página carrega
 */
document.addEventListener('DOMContentLoaded', function () {
    // Pega elementos
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');
    loadingStatus = document.getElementById('loadingStatus');
    prizeValue = document.getElementById('prizeValue');
    loadingState = document.getElementById('loadingState');
    successState = document.getElementById('successState');
    prizeAmount = document.getElementById('prizeAmount');
    termsCheckbox = document.getElementById('termsCheckbox');
    claimBtn = document.getElementById('claimBtn');
    confettiContainer = document.getElementById('confettiContainer');

    // Pega o prêmio da página anterior
    finalPrize = window.prizeFromQuiz || 2157;

    // Mostra o saldo inicial (que veio do quiz)
    prizeValue.textContent = formatCurrency(finalPrize);

    // Configura checkbox
    termsCheckbox.addEventListener('change', function () {
        if (this.checked) {
            claimBtn.disabled = false;
            claimBtn.classList.remove('disabled');
        } else {
            claimBtn.disabled = true;
            claimBtn.classList.add('disabled');
        }
    });

    // Configura botão
    claimBtn.addEventListener('click', function () {
        if (!this.disabled) {
            // Redireciona para página de escolha de premiação
            window.location.href = '../premio/?prize=' + finalPrize;
        }
    });

    // Inicia animação
    startLoading();
});

/**
 * Formata valor em reais
 */
function formatCurrency(value) {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Inicia o loading
 */
function startLoading() {
    startTime = performance.now();
    updateProgress();
}

/**
 * Atualiza progresso - LINEAR e uniforme
 */
function updateProgress() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

    // Atualiza barra (LINEAR - velocidade uniforme)
    progressFill.style.width = `${Math.max(progress, 12)}%`;
    progressText.textContent = `${Math.floor(progress)}%`;

    // Atualiza mensagem com animação de slide
    const messageIndex = Math.floor((progress / 100) * (statusMessages.length - 1));
    if (messageIndex !== currentMessageIndex) {
        currentMessageIndex = messageIndex;

        // Animação de slide para a esquerda
        loadingStatus.classList.add('slide-out');

        setTimeout(() => {
            loadingStatus.textContent = statusMessages[messageIndex];
            loadingStatus.classList.remove('slide-out');
            loadingStatus.classList.add('slide-in');

            setTimeout(() => {
                loadingStatus.classList.remove('slide-in');
            }, 300);
        }, 300);
    }

    if (progress < 100) {
        requestAnimationFrame(updateProgress);
    } else {
        setTimeout(showSuccess, 500);
    }
}

/**
 * Mostra tela de sucesso
 */
function showSuccess() {
    // Esconde loading
    loadingState.classList.add('hidden');

    // Atualiza valor do prêmio na mensagem
    prizeAmount.textContent = formatCurrency(finalPrize);

    // Mostra sucesso
    successState.classList.remove('hidden');
    successState.classList.add('visible');

    // Dispara confetes!
    launchConfetti();
}

/**
 * Dispara confetes
 */
function launchConfetti() {
    for (let i = 0; i < CONFETTI_COUNT; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 20);
    }
}

/**
 * Cria um confete individual
 */
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // Posição aleatória horizontal
    confetti.style.left = Math.random() * 100 + '%';

    // Cor aleatória
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    confetti.style.backgroundColor = color;

    // Tamanho aleatório
    const size = Math.random() * 10 + 5;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';

    // Forma aleatória (quadrado ou círculo)
    if (Math.random() > 0.5) {
        confetti.style.borderRadius = '50%';
    }

    // Delay aleatório
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';

    confettiContainer.appendChild(confetti);

    // Remove após animação
    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

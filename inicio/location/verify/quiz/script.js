/**
 * SHEIN Quiz - Premium JavaScript Controller
 * Quiz com animações suaves, transições slide, e efeito confetti
 */

// Configuração das 12 perguntas do quiz
const quizQuestions = [
    // 5 PRIMEIRAS PERGUNTAS COM IMAGENS DE ROUPAS
    {
        id: 1,
        question: "O que você achou desse look? Avalie!",
        type: "image_rating",
        image: "https://img.ltwebstatic.com/v4/j/pi/2025/07/30/f2/1753845551f3b53b079e686f53fac3c1020719025e_thumbnail_560x.webp",
        imageName: "Vestido Casual de Verão",
        options: ["😍 Amei!", "😊 Gostei", "😐 Não é meu estilo", "😕 Não curti"]
    },
    {
        id: 2,
        question: "Essa peça combina com seu estilo?",
        type: "image_rating",
        image: "https://img.ltwebstatic.com/images3_pi/2025/03/19/0c/1742379909c9da2ab39828b0da0f847047f14fb550.webp",
        imageName: "Clasi Vestido Elegante",
        options: ["😍 Perfeito!", "😊 Usaria sim", "😐 Talvez", "😕 Não combina"]
    },
    {
        id: 3,
        question: "Nota para este vestido da nova coleção?",
        type: "image_rating",
        image: "https://img.ltwebstatic.com/v4/j/spmp/2026/01/20/8c/1768873259c1098c423e2b0ef981d21228fe72f14a.webp",
        imageName: "Vestido Curto Premium",
        options: ["😍 Maravilhoso!", "😊 Bonito", "😐 Mais ou menos", "😕 Não gostei"]
    },
    {
        id: 4,
        question: "Você usaria essa peça no dia a dia?",
        type: "image_rating",
        image: "https://img.ltwebstatic.com/images3_pi/2025/02/14/25/17395098695fa2416db7db384c3f6422d5060c4e68.webp",
        imageName: "Reflora Casual Chic",
        options: ["😍 Com certeza!", "😊 Sim, usaria", "😐 Depende da ocasião", "😕 Não usaria"]
    },
    {
        id: 5,
        question: "Última peça! Qual sua avaliação?",
        type: "image_rating",
        image: "https://img.ltwebstatic.com/v4/j/pi/2025/06/30/62/1751282718835859d155d012101cdcd624832c5217.webp",
        imageName: "Solflare Vestido Decote V",
        options: ["😍 Incrível!", "😊 Gostei bastante", "😐 Nada demais", "😕 Poderia ser melhor"]
    },
    // PERGUNTAS DE TEXTO SELECIONADAS (7 perguntas)
    {
        id: 6,
        question: "Você já é cliente SHEIN?",
        options: ["Sim, compro sempre!", "Já comprei algumas vezes", "Ainda não, mas quero", "Estou conhecendo agora"]
    },
    {
        id: 7,
        question: "Como você descobriu a SHEIN?",
        options: ["Instagram ou TikTok", "Indicação de amigas", "Anúncios online", "Pesquisando no Google", "Outros"]
    },
    {
        id: 8,
        question: "Qual seu tamanho mais frequente?",
        options: ["PP / XS", "P / S", "M", "G / L", "GG / XL", "XGG / XXL"]
    },
    {
        id: 9,
        question: "Com que frequência você compra roupas online?",
        options: ["Toda semana", "Pelo menos 1x por mês", "A cada 2-3 meses", "Só em promoções", "Raramente"]
    },
    {
        id: 10,
        question: "Você já indicou a SHEIN pra alguém?",
        options: ["Sim, já indiquei várias vezes!", "Já indiquei uma vez", "Ainda não, mas pretendo", "Não costumo indicar"]
    },
    {
        id: 11,
        question: "Você gostaria de receber ofertas exclusivas da SHEIN?",
        options: ["Sim, com certeza!", "Só as melhores promoções", "Talvez, depende", "Prefiro não receber"]
    },
    {
        id: 12,
        question: "Por que você merece ser selecionada como avaliadora oficial SHEIN?",
        type: "text",
        placeholder: "Conte um pouco sobre você, seu estilo e por que seria uma ótima representante da marca... ✨"
    }
];

// Configurações de valor (ajustado para 12 perguntas manter saldo ~R$ 2,70)
const INITIAL_PRIZE = 100;
const PRIZE_INCREMENT = 178; // Ajustado para 12 perguntas (11 incrementos + final)

// Estado do quiz
let currentQuestion = 0;
let answers = [];
let currentPrize = INITIAL_PRIZE;
let selectedOption = null;

// Elementos do DOM
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const quizCard = document.getElementById('quizCard');
const prizeValueElement = document.getElementById('prizeValue');
const progressFill = document.getElementById('progressFill');
const progressCount = document.getElementById('progressCount');

/**
 * Inicializa o quiz
 */
function initQuiz() {
    currentQuestion = 0;
    answers = [];
    currentPrize = INITIAL_PRIZE;
    selectedOption = null;
    updatePrizeDisplay(currentPrize, false);
    updateProgress();
    renderQuestion();
}

/**
 * Atualiza barra de progresso
 */
function updateProgress() {
    const total = quizQuestions.length;
    const current = currentQuestion + 1;
    const percent = (current / total) * 100;

    if (progressFill) {
        progressFill.style.width = `${percent}%`;
        if (percent > 5) {
            progressFill.classList.add('active');
        }
    }
    if (progressCount) {
        progressCount.textContent = `${current} de ${total}`;
    }
}

/**
 * Formata o número da pergunta com zero à esquerda
 */
function formatQuestionNumber(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Formata valor em reais
 */
function formatCurrency(value) {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Atualiza display do prêmio com animação de contagem
 */
function updatePrizeDisplay(targetValue, animate = true) {
    if (!animate) {
        prizeValueElement.textContent = formatCurrency(targetValue);
        return;
    }

    const startValue = currentPrize;
    const endValue = targetValue;
    const duration = 1500;
    const startTime = performance.now();

    prizeValueElement.classList.add('counting');

    function animateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        prizeValueElement.textContent = formatCurrency(currentValue);

        if (progress < 1) {
            requestAnimationFrame(animateValue);
        } else {
            prizeValueElement.textContent = formatCurrency(endValue);
            prizeValueElement.classList.remove('counting');
            prizeValueElement.classList.add('pulse');
            setTimeout(() => {
                prizeValueElement.classList.remove('pulse');
            }, 600);
        }
    }

    requestAnimationFrame(animateValue);
}

/**
 * Cria efeito ripple no botão
 */
function createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
}

/**
 * Renderiza a pergunta atual
 */
function renderQuestion() {
    const question = quizQuestions[currentQuestion];
    selectedOption = null;

    // Atualiza número e texto da pergunta
    questionNumber.textContent = `Pergunta ${formatQuestionNumber(question.id)}`;
    questionText.textContent = question.question;

    // Limpa e renderiza opções
    optionsContainer.innerHTML = '';

    if (question.type === 'image_rating') {
        renderImageRating(question);
    } else if (question.type === 'rating') {
        renderStarRating(question);
    } else if (question.type === 'text') {
        renderTextInput(question);
    } else {
        renderNormalOptions(question);
    }

    // Remove botão enviar existente
    const existingSubmit = document.getElementById('submitBtn');
    if (existingSubmit) existingSubmit.remove();
}

/**
 * Renderiza pergunta com imagem
 */
function renderImageRating(question) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const img = document.createElement('img');
    img.src = question.image;
    img.alt = question.imageName;
    img.className = 'product-image';
    img.loading = 'lazy';
    img.onerror = function () {
        this.src = 'https://via.placeholder.com/260x300/f5f5f5/999?text=SHEIN';
    };

    const imageName = document.createElement('p');
    imageName.textContent = question.imageName;
    imageName.className = 'product-name';

    imageContainer.appendChild(img);
    imageContainer.appendChild(imageName);
    optionsContainer.appendChild(imageContainer);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'image-rating-grid';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'image-rating-btn';
        button.textContent = option;
        button.style.animationDelay = `${index * 0.08}s`;

        button.addEventListener('click', (e) => {
            buttonsContainer.querySelectorAll('.image-rating-btn').forEach(b => {
                b.classList.remove('selected');
            });
            button.classList.add('selected');
            selectedOption = option;
            showSubmitButton();
        });

        buttonsContainer.appendChild(button);
    });

    optionsContainer.appendChild(buttonsContainer);
}

/**
 * Renderiza estrelas de avaliação
 */
function renderStarRating(question) {
    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'rating-container';

    question.options.forEach((option, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'rating-wrapper';

        const star = document.createElement('button');
        star.className = 'rating-star';
        star.textContent = '⭐';
        star.setAttribute('data-value', option);

        const label = document.createElement('span');
        label.textContent = option;
        label.className = 'rating-label';

        wrapper.appendChild(star);
        wrapper.appendChild(label);

        star.addEventListener('click', () => {
            ratingContainer.querySelectorAll('.rating-star').forEach(s => {
                s.classList.remove('selected');
            });
            // Seleciona todas até a clicada
            const stars = ratingContainer.querySelectorAll('.rating-star');
            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('selected');
            }
            selectedOption = option;
            showSubmitButton();
        });

        ratingContainer.appendChild(wrapper);
    });

    optionsContainer.appendChild(ratingContainer);
}

/**
 * Renderiza campo de texto
 */
function renderTextInput(question) {
    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';

    const textarea = document.createElement('textarea');
    textarea.id = 'textAnswer';
    textarea.className = 'text-answer';
    textarea.placeholder = question.placeholder || 'Digite sua resposta...';

    textarea.addEventListener('input', () => {
        if (textarea.value.trim().length > 0) {
            selectedOption = textarea.value.trim();
            showSubmitButton();
        }
    });

    textContainer.appendChild(textarea);
    optionsContainer.appendChild(textContainer);
}

/**
 * Renderiza opções normais
 */
function renderNormalOptions(question) {
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerHTML = `<span class="option-label">${option}</span>`;
        button.style.animationDelay = `${index * 0.08}s`;

        button.addEventListener('click', (e) => {
            createRipple(e, button);
            selectOption(button, option);
        });

        optionsContainer.appendChild(button);
    });
}

/**
 * Seleciona uma opção
 */
function selectOption(buttonElement, optionText) {
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.classList.remove('selected'));

    buttonElement.classList.add('selected');
    selectedOption = optionText;

    showSubmitButton();
}

/**
 * Mostra o botão de enviar
 */
function showSubmitButton() {
    let submitBtn = document.getElementById('submitBtn');

    if (!submitBtn) {
        submitBtn = document.createElement('button');
        submitBtn.id = 'submitBtn';
        submitBtn.className = 'submit-btn';
        submitBtn.innerHTML = `
            <span>Enviar Resposta</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        `;
        submitBtn.addEventListener('click', handleSubmit);
        quizCard.appendChild(submitBtn);

        submitBtn.offsetHeight;
        submitBtn.classList.add('visible');
    }
}

/**
 * Processa o envio da resposta
 */
function handleSubmit() {
    if (!selectedOption) return;

    answers.push({
        questionId: quizQuestions[currentQuestion].id,
        question: quizQuestions[currentQuestion].question,
        answer: selectedOption
    });

    showLoading();
}

/**
 * Mostra overlay de carregamento com slide
 */
function showLoading() {
    // Slide out card
    quizCard.classList.add('slide-out-left');

    loadingOverlay.classList.add('active');

    setTimeout(() => {
        loadingOverlay.classList.add('show-check');

        setTimeout(() => {
            hideLoading();
        }, 450);
    }, 700);
}

/**
 * Esconde overlay e avança
 */
function hideLoading() {
    loadingOverlay.classList.remove('active', 'show-check');

    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;

        const newPrize = currentPrize + PRIZE_INCREMENT;
        updatePrizeDisplay(newPrize, true);
        currentPrize = newPrize;

        updateProgress();
        renderQuestion();

        // Slide in card
        quizCard.classList.remove('slide-out-left', 'fade-out');
        quizCard.classList.add('slide-in-right');

        setTimeout(() => {
            quizCard.classList.remove('slide-in-right');
        }, 400);
    } else {
        const FINAL_INCREMENT = 198;
        const newPrize = currentPrize + FINAL_INCREMENT;
        updatePrizeDisplay(newPrize, true);
        currentPrize = newPrize;

        setTimeout(() => {
            launchConfetti();
            setTimeout(() => {
                finishQuiz();
            }, 1800);
        }, 1500);
    }
}

/**
 * Efeito confetti ao finalizar
 */
function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#22c55e', '#16a34a', '#1a1a1a', '#fbbf24', '#f97316', '#ef4444', '#8b5cf6'];

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.1,
            drift: (Math.random() - 0.5) * 1
        });
    }

    let frame = 0;
    function animate() {
        if (frame > 180) {
            canvas.remove();
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.y += p.speed;
            p.x += p.drift;
            p.angle += p.spin;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, 1 - frame / 180);
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        frame++;
        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Finaliza o quiz
 */
function finishQuiz() {
    window.location.href = '../success/?prize=' + currentPrize;
}

// Inicializa o quiz quando a página carregar
document.addEventListener('DOMContentLoaded', initQuiz);

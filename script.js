// Obteniendo el elemento canvas y su contexto.
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

let gameState = "playing"; // otros posibles estados: 'won'


// Configuración inicial del objeto bola.
const BALL = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 5,
    dy: 5,
    maxSpeed: 21
};

// Configuración inicial del objeto paleta.
const PADDLE = {
    width: 25,
    height: 100,
    speed: 8
};

// Puntuaciones iniciales
let scoreLeft = 0;
let scoreRight = 0;

// Configuración inicial de las paletas izquierda y derecha
let leftPaddle = { x: 50, y: canvas.height / 2 - PADDLE.height / 2, dy: 0 };
let rightPaddle = { x: canvas.width - 50 - PADDLE.width, y: canvas.height / 2 - PADDLE.height / 2, dy: 0 };

const menu = document.getElementById('menu');
menu.style.display = 'block';

// Función para comenzar el juego
function startGame() {
    // Oculta el menú
    menu.style.display = 'none';

    // Llama a la función principal de tu juego para iniciarlo
    // Por ejemplo, puedes llamar a resetBall y resetGame aquí
    resetBall();
    resetGame();
}

// Añade un evento de clic al botón de inicio para comenzar el juego
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

// Función para calcular la velocidad de la bola
function calculateSpeed(dx, dy) {
    return Math.sqrt(dx*dx + dy*dy);
}

// Función para actualizar la velocidad de la bola
function updateBallSpeed() {
    BALL.dx *= 1.001;
    BALL.dy *= 1.001;

    // Limita la velocidad a un máximo
    const currentSpeed = calculateSpeed(BALL.dx, BALL.dy);
    if (currentSpeed > BALL.maxSpeed) {
        const angle = Math.atan2(BALL.dy, BALL.dx);
        BALL.dx = BALL.maxSpeed * Math.cos(angle);
        BALL.dy = BALL.maxSpeed * Math.sin(angle);
    }
}

// Función para dibujar el marcador en el canvas
function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillText(scoreLeft, canvas.width / 4, 30);
    ctx.fillText(scoreRight, (3 * canvas.width) / 4, 30);
}

// Función para dibujar la bola en el canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(BALL.x, BALL.y, BALL.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Función para dibujar una paleta en el canvas
function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, PADDLE.width, PADDLE.height);
    ctx.fill();
    ctx.closePath();
}

// Función para actualizar la posición de una paleta
function updatePaddlePosition(paddle) {
    paddle.y += paddle.dy;
    // Asegura que la paleta no salga del canvas
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y > canvas.height - PADDLE.height) paddle.y = canvas.height - PADDLE.height;
}

// Función para resetear la posición y velocidad de la bola
function resetBall() {
    BALL.x = canvas.width / 2;
    BALL.y = canvas.height / 2;

    // Elegir aleatoriamente entre 0 y 180 grados
    let angle = Math.random() > 0.5 ? 0 : Math.PI; 

    // Calcula las componentes dx y dy
    BALL.dx = 5 * Math.cos(angle);
    BALL.dy = 5 * Math.sin(angle);
}

// Función principal de actualización
function update() {
    BALL.x += BALL.dx;
    BALL.y += BALL.dy;

    // Llama a la función para actualizar la velocidad de la bola
    updateBallSpeed();

    // Verificando la colisión con el techo o el suelo y ajustando la posición.
    if (BALL.y - BALL.radius < 0) {
        BALL.y = BALL.radius;
        BALL.dy *= -1;
    } else if (BALL.y + BALL.radius > canvas.height) {
        BALL.y = canvas.height - BALL.radius;
        BALL.dy *= -1;
    }

    // Llama a las funciones para manejar colisiones con paletas y puntuaciones
    handlePaddleCollision();
    handleScoring();
    updatePaddlePosition(leftPaddle);
    updatePaddlePosition(rightPaddle);
}

// Función para manejar colisiones de la bola con las paletas
function handlePaddleCollision() {
    let hitLeftPaddle = BALL.x - BALL.radius < leftPaddle.x + PADDLE.width &&
        BALL.y > leftPaddle.y && BALL.y < leftPaddle.y + PADDLE.height &&
        BALL.dx < 0;

    let hitRightPaddle = BALL.x + BALL.radius > rightPaddle.x &&
        BALL.y > rightPaddle.y && BALL.y < rightPaddle.y + PADDLE.height &&
        BALL.dx > 0;

    if (hitLeftPaddle) {
        BALL.x = leftPaddle.x + PADDLE.width + BALL.radius;
        BALL.dx *= -1;
    
        // Ajusta el ángulo ligeramente
        BALL.dy += (Math.random() - 0.5) * 4;
    } else if (hitRightPaddle) {
        BALL.x = rightPaddle.x - BALL.radius;
        BALL.dx *= -1;
    
        // Ajusta el ángulo ligeramente
        BALL.dy += (Math.random() - 0.5) * 4;
    }
}




function handleScoring() {
    if (BALL.x - BALL.radius < 0) {
        scoreRight++;
        resetBall();
    } else if (BALL.x + BALL.radius > canvas.width) {
        scoreLeft++;
        resetBall();
    }

    // Verifica si algún jugador ha alcanzado los 10 puntos
    if (scoreLeft >= 3) {
        gameState = 'won';
        // Si el Jugador 1 alcanza los 10 puntos, muestra el mensaje de victoria
        drawVictoryMessage('Player 1 Wins!');
    } else if (scoreRight >= 3) {
        gameState = 'won';
        // Si el Jugador 2 alcanza los 10 puntos, muestra el mensaje de victoria
        drawVictoryMessage('Player 2 Wins!');
    }

    
}

// Función para dibujar el mensaje de victoria en el canvas
function drawVictoryMessage(message) {
    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Establece las propiedades del texto
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Dibuja el mensaje de victoria en el centro del canvas
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    // Crea un botón de reinicio en el canvas
    let buttonWidth = 150;
    let buttonHeight = 50;
    let buttonX = (canvas.width / 2) - (buttonWidth / 2);
    let buttonY = (canvas.height / 2) + 40;
    ctx.rect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = 'lightgray';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText('Restart', canvas.width / 2, buttonY + (buttonHeight / 2));
}


function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawScore();
    update();
}


setInterval(draw, 20);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            leftPaddle.dy = -PADDLE.speed;
            break;
        case 's':
            leftPaddle.dy = PADDLE.speed;
            break;
        case 'o':
            rightPaddle.dy = -PADDLE.speed;
            break;
        case 'l':
            rightPaddle.dy = PADDLE.speed;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
        case 's':
            leftPaddle.dy = 0;
            break;
        case 'o':
        case 'l':
            rightPaddle.dy = 0;
            break;
    }
});

canvas.addEventListener('click', (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let buttonWidth = 150;
    let buttonHeight = 50;
    let buttonX = (canvas.width / 2) - (buttonWidth / 2);
    let buttonY = (canvas.height / 2) + 40;

    // Verifica si el clic fue dentro del botón de reinicio
    if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
        resetGame();
    }
});

function resetGame() {
    gameState = 'playing';
    scoreLeft = 0;
    scoreRight = 0;
    resetBall();
    // Borra el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redibuja el estado inicial del juego
    draw();
}


resetBall();


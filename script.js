const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 2, dy: 2 };
const paddleWidth = 25, paddleHeight = 100, paddleSpeed = 8;

let prevSpeed = calculateSpeed(ball.dx, ball.dy);
let scoreLeft = 0;
let scoreRight = 0;

let leftPaddle = { x: 50, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
let rightPaddle = { x: canvas.width - 50 - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };

function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillText(scoreLeft, canvas.width / 4, 30);
    ctx.fillText(scoreRight, (3 * canvas.width) / 4, 30);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
}

function updatePaddlePosition(paddle) {
    paddle.y += paddle.dy;
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y > canvas.height - paddleHeight) paddle.y = canvas.height - paddleHeight;
}

// Calcula la magnitud de la velocidad.
function calculateSpeed(dx, dy) {
    return Math.sqrt(dx*dx + dy*dy);
}

// Ajusta la velocidad de la bola para mantener una velocidad constante después de una colisión.
function adjustBallSpeed() {
    const speed = calculateSpeed(ball.dx, ball.dy);
    const desiredSpeed = 2; // Puedes ajustar esto a la velocidad deseada.
    const factor = desiredSpeed / speed;
    ball.dx *= factor;
    ball.dy *= factor;
}

function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    ball.dx *= 1.001;
    ball.dy *= 1.001;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }

    let hitLeftPaddle = ball.x - ball.radius < leftPaddle.x + paddleWidth && ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddleHeight;
    let hitRightPaddle = ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddleHeight;

    if (hitLeftPaddle || hitRightPaddle) {
        ball.dx *= -1;

        // Calcula la diferencia entre el centro de la paleta y el centro de la bola.
        let diff;
        if (hitLeftPaddle) {
            diff = ball.y - (leftPaddle.y + paddleHeight / 2);
        } else {
            diff = ball.y - (rightPaddle.y + paddleHeight / 2);
        }

        // Normaliza la diferencia para un valor entre -1 y 1 y multiplica por un factor para cambiar la velocidad en Y.
        ball.dy = (diff / (paddleHeight / 2)) * 3;

        const speed = calculateSpeed(ball.dx, ball.dy);
        const factor = prevSpeed / speed;
        ball.dx *= factor;
        ball.dy *= factor;
    }

    if (ball.x - ball.radius < 0) {
        // La bola ha salido por la izquierda.
        scoreRight++; // Añade un punto al jugador de la derecha.
        resetBall(); // Llama a la función para resetear la bola.
    } else if (ball.x + ball.radius > canvas.width) {
        // La bola ha salido por la derecha.
        scoreLeft++; // Añade un punto al jugador de la izquierda.
        resetBall(); // Llama a la función para resetear la bola.
    }

    updatePaddlePosition(leftPaddle);
    updatePaddlePosition(rightPaddle);
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

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Genera un ángulo aleatorio en radianes entre 0 y 2*PI.
    let angle = Math.random() * 2 * Math.PI;

    // Usa trigonometría para descomponer el vector de velocidad en sus componentes x e y.
    ball.dx = 5 * Math.cos(angle);
    ball.dy = 5 * Math.sin(angle);

    // Asigna una dirección aleatoria en el eje x.
    ball.dx *= Math.random() > 0.5 ? 1 : -1;
}

resetBall();

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            leftPaddle.dy = -paddleSpeed;
            break;
        case 's':
            leftPaddle.dy = paddleSpeed;
            break;
        case 'o':
            rightPaddle.dy = -paddleSpeed;
            break;
        case 'l':
            rightPaddle.dy = paddleSpeed;
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

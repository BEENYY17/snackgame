document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const messageDisplay = document.getElementById('message');

    const gridSize = 20; // 每個方塊的大小
    const canvasSize = canvas.width; // 畫布大小
    let snake = [];
    let food = {};
    let dx = gridSize; // 蛇在x方向的移動速度
    let dy = 0;        // 蛇在y方向的移動速度
    let score = 0;
    let gameInterval;
    let gameSpeed = 150; // 遊戲速度 (毫秒)
    let isGameOver = true;

    // 初始化遊戲
    function initGame() {
        snake = [
            { x: 10 * gridSize, y: 10 * gridSize },
            { x: 9 * gridSize, y: 10 * gridSize },
            { x: 8 * gridSize, y: 10 * gridSize }
        ];
        dx = gridSize;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
        messageDisplay.textContent = '';
        isGameOver = false;
        restartButton.style.display = 'none';
        startButton.style.display = 'block'; // 確保開始按鈕可見
        generateFood();
        draw();
    }

    // 繪製遊戲畫面
    function draw() {
        ctx.clearRect(0, 0, canvasSize, canvasSize); // 清空畫布

        // 繪製蛇
        snake.forEach((segment, index) => {
            if (index === 0) {
                // 蛇頭 (顏色不同，可以更顯眼)
                ctx.fillStyle = '#2ecc71'; // 綠色
            } else {
                ctx.fillStyle = '#27ae60'; // 深綠色
            }
            ctx.strokeStyle = '#2c3e50'; // 邊框
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
            ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
        });

        // 繪製曲棍球 (食物)
        ctx.fillStyle = '#f39c12'; // 橙色
        ctx.strokeStyle = '#d35400'; // 深橙色
        ctx.beginPath();
        ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2 * 0.8, 0, Math.PI * 2); // 畫圓形
        ctx.fill();
        ctx.stroke();
    }

    // 生成食物 (曲棍球)
    function generateFood() {
        let newFoodX, newFoodY;
        let collisionWithSnake;

        do {
            newFoodX = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
            newFoodY = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
            collisionWithSnake = false;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === newFoodX && snake[i].y === newFoodY) {
                    collisionWithSnake = true;
                    break;
                }
            }
        } while (collisionWithSnake);

        food = { x: newFoodX, y: newFoodY };
    }

    // 更新遊戲狀態
    function updateGame() {
        if (isGameOver) return;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // 檢查是否碰到牆壁
        if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
            endGame('遊戲結束！你撞牆了！');
            return;
        }

        // 檢查是否碰到自己
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                endGame('遊戲結束！你咬到自己了！');
                return;
            }
        }

        snake.unshift(head); // 將新頭部添加到蛇的開頭

        // 檢查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            generateFood(); // 重新生成食物
            // 每次吃到食物後加快遊戲速度
            if (gameSpeed > 50) { // 設定最小速度
                gameSpeed -= 5;
                clearInterval(gameInterval); // 清除舊的定時器
                gameInterval = setInterval(updateGame, gameSpeed); // 設置新的定時器
            }
        } else {
            snake.pop(); // 移除蛇尾
        }

        draw(); // 重新繪製
    }

    // 遊戲結束
    function endGame(message) {
        isGameOver = true;
        clearInterval(gameInterval);
        messageDisplay.textContent = message;
        restartButton.style.display = 'block';
        startButton.style.display = 'none';
    }

    // 鍵盤控制
    document.addEventListener('keydown', changeDirection);

    function changeDirection(event) {
        if (isGameOver) return; // 遊戲結束時不響應按鍵

        const keyPressed = event.keyCode;
        const goingUp = dy === -gridSize;
        const goingDown = dy === gridSize;
        const goingLeft = dx === -gridSize;
        const goingRight = dx === gridSize;

        // 避免蛇立即反方向移動
        if (keyPressed === 37 && !goingRight) { // 左箭頭
            dx = -gridSize;
            dy = 0;
        } else if (keyPressed === 38 && !goingDown) { // 上箭頭
            dx = 0;
            dy = -gridSize;
        } else if (keyPressed === 39 && !goingLeft) { // 右箭頭
            dx = gridSize;
            dy = 0;
        } else if (keyPressed === 40 && !goingUp) { // 下箭頭
            dx = 0;
            dy = gridSize;
        }
    }

    // 開始遊戲按鈕
    startButton.addEventListener('click', () => {
        if (isGameOver) {
            initGame(); // 如果遊戲已經結束，則重新初始化
        }
        startButton.style.display = 'none';
        gameInterval = setInterval(updateGame, gameSpeed);
    });

    // 重新開始遊戲按鈕
    restartButton.addEventListener('click', () => {
        initGame();
        gameSpeed = 150; // 重置遊戲速度
        clearInterval(gameInterval); // 清除可能存在的舊定時器
        startButton.style.display = 'none'; // 隱藏開始按鈕
        gameInterval = setInterval(updateGame, gameSpeed); // 重新開始遊戲循環
    });

    // 首次載入頁面時初始化遊戲
    initGame();
});
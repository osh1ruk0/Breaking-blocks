        const canvas = document.getElementById("FirstCanvas");
        const ctx = canvas.getContext("2d");
        const ballRadius = 10;  // ボールの半径
        const paddleHeight = 10; // パドルの高さ
        const paddleWidth = 80; // パドルの幅
        

        let paddleX = (canvas.width - paddleWidth) / 2;
        let score = 0;
        let x = canvas.width / 2; 
        let y = canvas.height - 30;
        let dx = 2;
        let dy = -2;
        let rightPressed = false;
        let leftPressed = false;
        
        function circleRectCollision(circleX, circleY, radius, rectX, rectY, rectWidth, rectHeight) {

            // 最近点を求める
            const closestX = Math.max(
                rectX,
                Math.min(circleX, rectX + rectWidth)
            );

            const closestY = Math.max(
                rectY,
                Math.min(circleY, rectY + rectHeight)
            );

            // 円中心との距離
            const distanceX = circleX - closestX;
            const distanceY = circleY - closestY;

            // 距離の二乗
            const distanceSquared =
                distanceX * distanceX +
                distanceY * distanceY;

            // 半径と比較
            return distanceSquared < radius * radius;
        }


        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.closePath();

            if (rightPressed) {
                paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
            } else if (leftPressed) {
                paddleX = Math.max(paddleX - 7, 0);
            }  
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        }

        function updateBall() {
            // 壁に当たった時
            if (y + dy < ballRadius ) {
                dy = -dy;
            } else if (y > canvas.height + ballRadius && dy > 0) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            }
            if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
                dx = -dx;
            }

            //パドルに当たった時
            if (circleRectCollision(x, y, ballRadius, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)) {
                dx = (10 * (x - (paddleX + paddleWidth / 2))) / paddleWidth; 
                dy = -Math.abs(dy);
            }
        }

        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText(`Score: ${score}`, 8, 20);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            updateBall();
            drawPaddle();
            x += dx;
            y += dy;
            drawBricks();
            collisionDetection();
            drawScore();
            requestAnimationFrame(draw);
        }

        function keyDownHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = true;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = false;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = false;
            }
        }

        document.addEventListener("mousemove", mouseMoveHandler, false);

        function mouseMoveHandler(e){
            const relativeX = e.clientX -canvas.offsetLeft;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
            }
        }

        // ブロックの設定

        const brickRowCount = 3;
        const brickColumnCount = 5;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;

        

        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        function drawBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status === 1) {
                        bricks[c][r].x = 0;
                        bricks[c][r].y = 0;
                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;

                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "#0095DD";
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function collisionDetection() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const b = bricks[c][r];
                    if (b.status === 1) {
                        if (circleRectCollision(x, y, ballRadius, b.x, b.y, brickWidth, brickHeight)) {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if (score === brickRowCount * brickColumnCount) {
                                alert("YOU WIN, CONGRATS!");
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        }

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        onload = draw;
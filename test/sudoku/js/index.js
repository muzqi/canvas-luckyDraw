/**
 * 绘制九宫格
 */
function drawSudoku() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < AWARDS_LEN; i ++) {

        // 顶点的坐标
        let max_position = AWARDS_TOP_DRAW_LEN * SUDOKU_ITEM_SIZE + AWARDS_TOP_DRAW_LEN * SUDOKU_ITEM_MARGIN;

        // ----- 左上顶点
        if (i >= LETF_TOP_POINT && i < RIGHT_TOP_POINT) {
            let row = i,
                x = row * SUDOKU_ITEM_SIZE + row * SUDOKU_ITEM_MARGIN,
                y = 0;

            // 记录每一个方块的坐标
            positions.push({x, y});

            // 绘制方块
            drawSudokuItem(
                x, y, SUDOKU_ITEM_SIZE, SUDOKU_ITEM_RADIUS,
                awards[i], SUDOKU_ITEM_TXT_SIZE, SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
                SUDOKU_ITEM_UNACTIVE_COLOR,
                SUDOKU_ITEM_SHADOW_COLOR
            );
        };
        // -----

        // ----- 右上顶点
        if (i >= RIGHT_TOP_POINT && i < RIGHT_BOTTOM_POINT) {
            let row = Math.abs(AWARDS_TOP_DRAW_LEN - i),
                x = max_position,
                y = row * SUDOKU_ITEM_SIZE + row * SUDOKU_ITEM_MARGIN;

            // 记录每一个方块的坐标
            positions.push({x, y});

            // 绘制方块
            drawSudokuItem(
                x, y, SUDOKU_ITEM_SIZE, SUDOKU_ITEM_RADIUS,
                awards[i], SUDOKU_ITEM_TXT_SIZE, SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
                SUDOKU_ITEM_UNACTIVE_COLOR,
                SUDOKU_ITEM_SHADOW_COLOR
            );
        };
        // -----

        // ----- 右下顶点
        if (i >= RIGHT_BOTTOM_POINT && i < LEFT_BOTTOM_POINT) {
            let row = Math.abs(AWARDS_TOP_DRAW_LEN * 2 - i),
                reverse_row = Math.abs(row - AWARDS_TOP_DRAW_LEN),
                x = reverse_row * SUDOKU_ITEM_SIZE + reverse_row * SUDOKU_ITEM_MARGIN,
                y = max_position;

            // 记录每一个方块的坐标
            positions.push({x, y});    

            // 绘制方块
            drawSudokuItem(
                x, y, SUDOKU_ITEM_SIZE, SUDOKU_ITEM_RADIUS,
                awards[i], SUDOKU_ITEM_TXT_SIZE, SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
                SUDOKU_ITEM_UNACTIVE_COLOR,
                SUDOKU_ITEM_SHADOW_COLOR
            );
        }
        // -----

        // ----- 左上顶点
        if (i >= LEFT_BOTTOM_POINT) {
            let row = Math.abs(AWARDS_TOP_DRAW_LEN * 3 - i),
                reverse_row = Math.abs(row - AWARDS_TOP_DRAW_LEN)
                x = 0,
                y = reverse_row * SUDOKU_ITEM_SIZE + reverse_row * SUDOKU_ITEM_MARGIN;

            // 记录每一个方块的坐标
            positions.push({x, y});
                
            // 绘制方块
            drawSudokuItem(
                x, y, SUDOKU_ITEM_SIZE, SUDOKU_ITEM_RADIUS,
                awards[i], SUDOKU_ITEM_TXT_SIZE, SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
                SUDOKU_ITEM_UNACTIVE_COLOR,
                SUDOKU_ITEM_SHADOW_COLOR
            );
        }
        // -----
    };

    drawButton(); // 绘制按钮
}

/**
 * 绘制单个小方块
 * @param {Num} x            坐标
 * @param {Num} y            坐标
 * @param {Num} size         小方块的尺寸
 * @param {Num} radius       小方块的圆角大小
 * @param {Str} text         文字内容
 * @param {Str} txtSize      文字大小样式
 * @param {Str} txtColor     文字颜色
 * @param {Str} bgColor      背景颜色
 * @param {Str} shadowColor  底部厚度颜色
 */
function drawSudokuItem(x, y, size, radius, text, txtSize, txtColor, bgColor, shadowColor) {
    // ----- ① 绘制方块
    context.save();
    context.fillStyle = bgColor;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 4;
    context.shadowBlur = 0;
    context.shadowColor = shadowColor;
    context.beginPath();
    roundedRect(
        x, y,
        size, size, 
        radius
    );
    context.fill();
    context.restore();
    // -----

    // ----- ② 绘制图片与文字
    if (text) {
        if (text.substr(0, 3) === 'img') {
            let textFormat = text.replace('img-', ''),
                image = new Image();
                image.src = textFormat;

            function drawImage() {
                context.drawImage(
                    image, 
                    x + (size * .2 / 2), y + (size * .2 / 2), 
                    size * .8, size * .8
                );
            };

            // ----- 如果图片没有加载，则加载，如已加载，则直接绘制
            if (!image.complete) {
                image.onload = function (e) {
                    drawImage();
                }
            } else {
                drawImage();
            }
            // -----
        }
        else {
            context.save();
            context.fillStyle = txtColor;
            context.font = txtSize;
            context.translate(
                x + SUDOKU_ITEM_SIZE / 2 - context.measureText(text).width / 2,
                y + SUDOKU_ITEM_SIZE / 2 + 6
            );
            context.fillText(text, 0, 0);
            context.restore();
        }
    }
    // ----- 
}

/**
 * 绘制按钮
 */
function drawButton() {
    let x = SUDOKU_ITEM_SIZE + SUDOKU_ITEM_MARGIN,
        y = SUDOKU_ITEM_SIZE + SUDOKU_ITEM_MARGIN

    // ----- 绘制背景
    context.save();
    context.fillStyle = BUTTON_COLOR;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 4;
    context.shadowBlur = 0;
    context.shadowColor = BUTTON_SHADOW_COLOR;
    context.beginPath();
    roundedRect(
        x, y,
        BUTTON_SIZE, BUTTON_SIZE, 
        SUDOKU_ITEM_RADIUS,
        BUTTON_COLOR,
        BUTTON_SHADOW_COLOR
    );
    context.fill();
    context.restore();
    // -----

    // ----- 绘制文字
    context.save();
    context.fillStyle = BUTTON_TXT_COLOR;
    context.font = BUTTON_TXT_SIZE;
    context.translate(
        x + BUTTON_SIZE / 2 - context.measureText('立即抽奖').width / 2, 
        y + BUTTON_SIZE / 2 + 10
    );
    context.fillText('立即抽奖', 0, 0);
    context.restore();
    // -----

    button_position = {x, y};
}

/**
 * 创建一个新的按钮路径
 */
function createButtonPath() {
    context.beginPath();
    roundedRect(
        button_position.x, button_position.y,
        BUTTON_SIZE, BUTTON_SIZE, 
        SUDOKU_ITEM_RADIUS
    );
}

/**
 * 定义一个 setTimeout 逐帧动画
 */
function animate() {
    is_animate = true;

    if (jump_index < AWARDS_LEN - 1)       jump_index ++;
    else if (jump_index >= AWARDS_LEN -1 ) jump_index = 0;

    jumping_time += 100;  // 每一帧执行 setTimeout 方法所消耗的时间

    // 当前时间大于时间总量后，退出动画，清算奖品
    if (jumping_time >= jumping_total_time) {
        is_animate = false;
        if (jump_index != 0)       alert(`🎉恭喜您中得：${awards[jump_index - 1]}`)
        else if (jump_index === 0) alert(`🎉恭喜您中得：${awards[AWARDS_LEN - 1]}`);
        return;
    };

    // ----- 绘制轮跳方块
    drawSudoku();
    drawSudokuItem(
        positions[jump_index].x, positions[jump_index].y,
        SUDOKU_ITEM_SIZE, SUDOKU_ITEM_RADIUS, 
        awards[jump_index], SUDOKU_ITEM_TXT_SIZE, SUDOKU_ITEM_ACTIVE_TXT_COLOR,
        SUDOKU_ITEM_ACTIVE_COLOR,
        SUDOKU_ITEM_SHADOW_COLOR
    );
    // -----

    setTimeout(animate, easeOut(jumping_time, 0, jumping_change, jumping_total_time))
}

// ----- 执行句柄
['mousedown', 'touchstart'].forEach((event) => {
    canvas.addEventListener(event, (e) => {
        let loc = windowToCanvas(e);

        // 创建一段新的按钮路径，
        createButtonPath();

        // 判断当前鼠标点击 canvas 的位置，是否在当前路径中，
        // 如果为 true，则开始抽奖
        if (context.isPointInPath(loc.x, loc.y) && !is_animate) {
            jumping_time = 0;
            jumping_total_time = Math.random() * 1000 + duration;
            jumping_change = Math.random() * 3 + velocity;
            
            animate();  // 开始动画
        }
    })
});

canvas.addEventListener('mousemove', (e) => {
    let loc = windowToCanvas(e);

    createButtonPath();
    if (context.isPointInPath(loc.x, loc.y)) {
        canvas.setAttribute('style', 'cursor: pointer');
    } else {
        canvas.setAttribute('style', '');
    }
})

window.onload = function (e) {
    drawSudoku(); // 初始化九宫格
}
// -----


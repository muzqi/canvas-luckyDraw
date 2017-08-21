class Sudoku extends Global {
    constructor (options) {
        super();
        
        this.awardsRowLen =     options.awardsRowLen || 3;
        this.awards =           options.awards;
        this.sudokuSize =       options.sudokuSize;
        this.sudokuItemRadius = options.sudokuItemRadius || 8;

        this.sudokuItemUnactiveColor = options.sudokuItemUnactiveColor             || 'rgb(255, 235, 236)';
        this.sudokuItemUnactiveTxtColor = options.sudokuItemUnactiveTxtColor       || 'rgb(48, 44, 43)';
        this.sudokuItemUnactiveShadowColor = options.sudokuItemUnactiveShadowColor || 'rgb(255, 193, 200)';

        this.sudokuItemActiveColor = options.sudokuItemActiveColor                 || 'rgb(254, 150, 51)';
        this.sudokuItemActiveTxtColor = options.sudokuItemActiveTxtColor           || 'rgb(255, 255, 255)';
        this.sudokuItemActiveShadowColor = options.sudokuItemActiveShadowColor     || 'rgb(255, 193, 200)';

        this.buttonColor = options.buttonColor             || 'rgb(255, 216, 1)';
        this.buttonTxtColor = options.buttonTxtColor       || 'rgb(172, 97, 1)';
        this.buttonShadowColor = options.buttonShadowColor || 'rgb(253, 177, 1)';

        this.duration = options.duration || 4000;
        this.velocity = options.velocity || 300;

        this.finish = options.finish;

        this.AWARDS_STEP = this.awardsRowLen - 1;
        this.AWARDS_LEN =  this.AWARDS_STEP * 4;

        this.LETF_TOP_POINT =     0;
        this.RIGHT_TOP_POINT =    this.AWARDS_STEP;
        this.RIGHT_BOTTOM_POINT = this.AWARDS_STEP * 2;
        this.LEFT_BOTTOM_POINT =  this.AWARDS_STEP * 2 + this.AWARDS_STEP;

        this.SUDOKU_ITEM_MARGIN =   (this.sudokuSize / this.awardsRowLen) / 6;
        this.SUDOKU_ITEM_SIZE =     (this.sudokuSize / this.awardsRowLen) - this.SUDOKU_ITEM_MARGIN;
        this.SUDOKU_ITEM_TXT_SIZE = `bold ${this.SUDOKU_ITEM_SIZE * .12}px Helvetica`;

        this.BUTTON_SIZE = this.sudokuSize - (this.SUDOKU_ITEM_SIZE * 2 + this.SUDOKU_ITEM_MARGIN * 3);
        this.BUTTON_TXT_SIZE = `bold ${this.BUTTON_SIZE * .12}px Helvetica`;

        this._positions = [];
        this._buttonPosition = [];

        this._isAnimate = false;
        this._jumpIndex = Math.floor(Math.random() * this.AWARDS_LEN);
        this._jumpingTime = 0;
        this._jumpTotalTime;
        this._jumpChange;

        this._canvasStyle;

    };

    drawSudoku(context) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 顶点坐标
        let maxPosition = this.AWARDS_STEP * this.SUDOKU_ITEM_SIZE + this.AWARDS_STEP * this.SUDOKU_ITEM_MARGIN;
        
        for (let i = 0; i < this.AWARDS_LEN; i++) {
            // ----- 左上顶点
            if (i >= this.LETF_TOP_POINT && i < this.RIGHT_TOP_POINT) {
                let row = i,
                    x = row * this.SUDOKU_ITEM_SIZE + row * this.SUDOKU_ITEM_MARGIN,
                    y = 0;

                this._positions.push({x, y});

                this.drawSudokuItem(
                    context,
                    x, y,
                    this.SUDOKU_ITEM_SIZE,
                    this.sudokuItemRadius,
                    this.awards[i].type, this.awards[i].content,
                    this.SUDOKU_ITEM_TXT_SIZE,
                    this.sudokuItemUnactiveTxtColor,
                    this.sudokuItemUnactiveColor,
                    this.sudokuItemUnactiveShadowColor
                )
            }
            // -----

            // ----- 右上顶点
            if (i >= this.RIGHT_TOP_POINT && i < this.RIGHT_BOTTOM_POINT) {
                let row = Math.abs(this.AWARDS_STEP - i),
                    x = maxPosition,
                    y = row * this.SUDOKU_ITEM_SIZE + row * this.SUDOKU_ITEM_MARGIN;

                this._positions.push({x, y});

                this.drawSudokuItem(
                    context,
                    x, y,
                    this.SUDOKU_ITEM_SIZE,
                    this.sudokuItemRadius,
                    this.awards[i].type, this.awards[i].content,
                    this.SUDOKU_ITEM_TXT_SIZE,
                    this.sudokuItemUnactiveTxtColor,
                    this.sudokuItemUnactiveColor,
                    this.sudokuItemUnactiveShadowColor
                )
            }
            // -----

            // ----- 左下顶点
            if (i >= this.RIGHT_BOTTOM_POINT && i < this.LEFT_BOTTOM_POINT) {
                let row = Math.abs(this.AWARDS_STEP * 2 - i),
                    reverseRow = Math.abs(row - this.AWARDS_STEP),
                    x = reverseRow * this.SUDOKU_ITEM_SIZE + reverseRow * this.SUDOKU_ITEM_MARGIN,
                    y = maxPosition;

                this._positions.push({x, y});

                this.drawSudokuItem(
                    context,
                    x, y,
                    this.SUDOKU_ITEM_SIZE,
                    this.sudokuItemRadius,
                    this.awards[i].type, this.awards[i].content,
                    this.SUDOKU_ITEM_TXT_SIZE,
                    this.sudokuItemUnactiveTxtColor,
                    this.sudokuItemUnactiveColor,
                    this.sudokuItemUnactiveShadowColor
                )
            }
            // -----

            // ----- 左上顶点
            if (i >= this.LEFT_BOTTOM_POINT) {
                let row = Math.abs(this.AWARDS_STEP * 3 - i),
                    reverseRow = Math.abs(row - this.AWARDS_STEP),
                    x = 0,
                    y = reverseRow * this.SUDOKU_ITEM_SIZE + reverseRow * this.SUDOKU_ITEM_MARGIN;

                this._positions.push({x, y});

                this.drawSudokuItem(
                    context,
                    x, y,
                    this.SUDOKU_ITEM_SIZE,
                    this.sudokuItemRadius,
                    this.awards[i].type, this.awards[i].content,
                    this.SUDOKU_ITEM_TXT_SIZE,
                    this.sudokuItemUnactiveTxtColor,
                    this.sudokuItemUnactiveColor,
                    this.sudokuItemUnactiveShadowColor
                )
            }
        };

        this.drawButton(context);
    };

    drawSudokuItem(context, x, y, size, radius, type, content, txtSize, txtColor, bgColor, shadowColor) {
        // ----- 绘制方块
        context.save();
        context.fillStyle = bgColor;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 0;
        context.shadowColor = shadowColor;
        context.beginPath();
        super.roundedRect(
            context, 
            x, y,
            size, size, 
            radius
        );
        context.fill();
        context.restore();
        // -----

        // ----- 绘制图片与文字
        if (content) {
            if (type === 'image') {
                let image = new Image();
                    image.src = content;

                function drawImage() {
                    context.drawImage(
                        image, 
                        x + (size * .2 / 2), y + (size * .2 / 2), 
                        size * .8, size * .8
                    );
                };

                if (!image.complete) {
                    image.onload = function (e) {
                        drawImage();
                    }
                } else {
                    drawImage();
                }
            }
            else if (type === 'text' || type === 'losing') {
                context.save();
                context.fillStyle = txtColor;
                context.font = txtSize;
                context.translate(
                    x + this.SUDOKU_ITEM_SIZE / 2 - context.measureText(content).width / 2,
                    y + this.SUDOKU_ITEM_SIZE / 2 + 6
                );
                context.fillText(content, 0, 0);
                context.restore();
            }
        }
        // -----
    };

    drawButton(context) {
        let x = this.SUDOKU_ITEM_SIZE + this.SUDOKU_ITEM_MARGIN,
            y = this.SUDOKU_ITEM_SIZE + this.SUDOKU_ITEM_MARGIN;

        // ----- 绘制背景
        context.save();
        context.fillStyle = this.buttonColor;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 0;
        context.shadowColor = this.buttonShadowColor;
        context.beginPath();
        super.roundedRect(
            context, x, y,
            this.BUTTON_SIZE, this.BUTTON_SIZE, 
            this.sudokuItemRadius,
            this.buttonColor,
            this.buttonShadowColor
        );
        context.fill();
        context.restore();
        // -----

        // ----- 绘制文字
        context.save();
        context.fillStyle = this.buttonTxtColor;
        context.font = this.BUTTON_TXT_SIZE;
        context.translate(
            x + this.BUTTON_SIZE / 2 - context.measureText('立即抽奖').width / 2, 
            y + this.BUTTON_SIZE / 2 + 10
        );
        context.fillText('立即抽奖', 0, 0);
        context.restore();
        // -----

        this._buttonPosition = {x, y};
    };

    createButtonPath(context) {
        context.beginPath();
        super.roundedRect(
            context,
            this._buttonPosition.x, this._buttonPosition.y,
            this.BUTTON_SIZE, this.BUTTON_SIZE, 
            this.sudokuItemRadius
        );
    };

    animate(context) {
        this.isAnimate = true;

        if (this._jumpIndex < this.AWARDS_LEN - 1)        this._jumpIndex ++;
        else if (this._jumpIndex >= this.AWARDS_LEN -1 )  this._jumpIndex = 0;

        this._jumpingTime += 100;

        if (this._jumpingTime >= this._jumpTotalTime) {
            this.isAnimate = false;
            if (this.finish) {
                if (this._jumpIndex != 0)       this.finish(this._jumpIndex - 1)
                else if (this._jumpIndex === 0) this.finish(this.AWARDS_LEN - 1);
            }
            return;
        };

        this.drawSudoku(context);
        this.drawSudokuItem(
            context,
            this._positions[this._jumpIndex].x, this._positions[this._jumpIndex].y,
            this.SUDOKU_ITEM_SIZE, this.sudokuItemRadius, 
            this.awards[this._jumpIndex].type ,this.awards[this._jumpIndex].content,
            this.SUDOKU_ITEM_TXT_SIZE, this.sudokuItemActiveTxtColor,
            this.sudokuItemActiveColor,
            this.sudokuItemActiveShadowColor
        );

        setTimeout(this.animate.bind(this, context), 50 + super.easeOut(this._jumpingTime, 0, this._jumpChange, this._jumpTotalTime));
    };

    render(canvas, context) {
        this._canvasStyle = canvas.getAttribute('style');
        this.drawSudoku(context);

        ['mousedown', 'touchstart'].forEach((event) => {
            canvas.addEventListener(event, (e) => {
                let loc = super.windowToCanvas(canvas, e);

                this.createButtonPath(context);

                if (context.isPointInPath(loc.x, loc.y) && !this.isAnimate) {
                    this._jumpingTime = 0;
                    this._jumpTotalTime = Math.random() * 1000 + this.duration;
                    this._jumpChange = Math.random() * 3 + this.velocity;
                    this.animate(context);
                }
            })
        });

        canvas.addEventListener('mousemove', (e) => {
            let loc2 = super.windowToCanvas(canvas, e);
            this.createButtonPath(context);

            if (context.isPointInPath(loc2.x, loc2.y)) {
                canvas.setAttribute('style', `cursor: pointer;${this._canvasStyle}`);
            } else {
                canvas.setAttribute('style', this._canvasStyle);
            }
        })
    }

}
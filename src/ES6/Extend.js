class Global {
    constructor () {};

    /**
     * 判断是否为 PC 端，若是则返回 true，否则返回 flase
     */
    IsPC() {
        let userAgentInfo = navigator.userAgent,
            flag = true,
            Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];

        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    };

    /**
     * 缓动函数，由快到慢
     * @param {Num} t 当前时间
     * @param {Num} b 初始值
     * @param {Num} c 变化值
     * @param {Num} d 持续时间
     */
    easeOut(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    };

    windowToCanvas(canvas, e) {
        let bbox = canvas.getBoundingClientRect(),
            x = this.IsPC() ? e.clientX || event.clientX : e.changedTouches[0].clientX,
            y = this.IsPC() ? e.clientY || event.clientY : e.changedTouches[0].clientY;
            
        return {
            x: x - bbox.left,
            y: y - bbox.top
        }
    };

    /**
     * 绘制自动换行的文本
     * @param {Obj} context
     * @param {Str} t          文本内容
     * @param {Num} x          坐标
     * @param {Num} y          坐标
     * @param {Num} w          文本限制宽度
     * @param {Num} lineHeight 行高
     */
    drawText(context, t, x, y, w, lineHeight = 20){
        let chr = t.split(''),
            temp = '',           
            row = [];

        for (let a = 0; a < chr.length; a++){
            if ( context.measureText(temp).width < w ) {
                ;
            }
            else{
                row.push(temp);
                temp = '';
            }
            temp += chr[a];
        };

        row.push(temp);

        for(let b = 0; b < row.length; b++){
            context.fillText(row[b], x, y + (b + 1) * lineHeight);
        };
    };

    /**
     * 定义圆角矩形的方法
     * @param {Obj} context
     * @param {Num} cornerX 
     * @param {Num} cornerY 
     * @param {Num} width 
     * @param {Num} height 
     * @param {Num} cornerRadius 
     */
    roundedRect(context, cornerX, cornerY, width, height, cornerRadius) {
        if (width > 0) context.moveTo(cornerX + cornerRadius, cornerY);
        else           context.moveTo(cornerX - cornerRadius, cornerY);

        context.arcTo(cornerX + width, cornerY,
            cornerX + width, cornerY + height,
            cornerRadius);

        context.arcTo(cornerX + width, cornerY + height,
            cornerX, cornerY + height,
            cornerRadius);

        context.arcTo(cornerX, cornerY + height,
            cornerX, cornerY,
            cornerRadius);

        if (width > 0) {
            context.arcTo(cornerX, cornerY,
                cornerX + cornerRadius, cornerY,
                cornerRadius);
        }
        else {
            context.arcTo(cornerX, cornerY,
                cornerX - cornerRadius, cornerY,
                cornerRadius);
        }
    }
}

// 小写变量为用户定义值，
// 小写并带前缀 _ 为对象体中进行计算的值
// 大写变量为无需定义，自动根据条件计算的值

class RouletteWheel extends Global {
    constructor(options) {
        super();

        this.centerX = options.centerX;
        this.centerY = options.centerY;
        this.outsideRadius = options.outsideRadius;

        this.evenColor = options.evenColor     || '#FF6766';
        this.oddColor = options.oddColor       || '#FD5757';
        this.loseColor = options.loseColor     || '#F79494'
        this.textColor = options.textColor     || 'White';

        this.arrowColorFrom = options.arrowColorFrom   || '#FFFC95';
        this.arrowColorTo = options.arrowColorTo       || '#FF9D37';
        this.buttonFont = options.buttonFont           || '开始抽奖';
        this.buttonColorFrom = options.buttonColorFrom || '#FDC964';
        this.buttonColorTo = options.buttonColorTo     || '#FFCB65';
        this.buttonFontColor = options.buttonFontColor || '#88411F';

        this.awards = options.awards;

        this.startRadian = options.startRadian || 0;
        this.duration = options.duration || 4000;  
        this.velocity = options.velocity || 10; 

        this.finish = options.finish;

        this.INSIDE_RADIUS = 0;
        this.TEXT_RADIAS = this.outsideRadius * .8;
        this.FONT_STYLE = `bold ${this.outsideRadius * .07}px Helvetica, Arial`;

        this.ARROW_RADIUS = this.outsideRadius / 3;     // 圆盘指针的半径
        this.BUTTON_RADIUS = this.ARROW_RADIUS * .8;     // 圆盘内部按钮的半径

        this.AWARDS_COUNT = this.awards.length;
        this.AWARD_RADIAN = (Math.PI * 2) / this.AWARDS_COUNT;


        this._isAnimate = false;
        this._spinningTime = 0;
        this._spinTotalTime;
        this._spinningChange;

        this._canvasStyle;
    };

    /**
     * 绘制转盘
     * @param {Obj} context 
     */
    drawRouletteWheel(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        // ---------- 绘制外表盘
        context.save();
        let rgb = this.oddColor.replace('#', ''),
            r = parseInt(rgb[0] + rgb[1], 16),
            g = parseInt(rgb[2] + rgb[3], 16),
            b = parseInt(rgb[4] + rgb[5], 16);
            
        context.fillStyle = `rgba(${r}, ${g}, ${b}, .72)`;
        context.shadowColor = 'rgba(0, 0, 0, .24)';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 5;
        context.shadowBlur = 15;
        context.arc(this.centerX, this.centerY, this.outsideRadius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        // ----------

        // --------- 绘制表盘中的色块，和对应的文字与图片
        for (let i = 0; i < this.AWARDS_COUNT; i ++) {
            // 绘制色块
            context.save();

            if (this.awards[i].substr(0, 3) === 'los') context.fillStyle = this.loseColor;
            else if (i % 2 === 0) context.fillStyle = this.evenColor;
            else                  context.fillStyle = this.oddColor;

            let _startRadian = this.startRadian + this.AWARD_RADIAN * i,
                _endRadian =   _startRadian + this.AWARD_RADIAN;

            context.beginPath();
            context.arc(this.centerX, this.centerY, this.outsideRadius - 5, _startRadian, _endRadian, false);
            context.arc(this.centerX, this.centerY, this.INSIDE_RADIUS, _endRadian, _startRadian, true);
            context.fill();
            context.restore();

            // 绘制图片
            if (this.awards[i].substr(0, 3) === 'img') {
                let self = this,                    
                    image = new Image();
                    image.src = this.awards[i].replace('img-', '');

                function drawImage(self, context) {
                    let size = Math.sin(self.AWARD_RADIAN) * self.outsideRadius / 2.5;
                    context.save();
                    context.translate(
                        self.centerX + Math.cos(_startRadian + self.AWARD_RADIAN / 2) * self.TEXT_RADIAS,
                        self.centerY + Math.sin(_startRadian + self.AWARD_RADIAN / 2) * self.TEXT_RADIAS
                    )
                    context.rotate(_startRadian + self.AWARD_RADIAN / 2 + Math.PI / 2);
                    context.drawImage(
                        image, 
                        - size / 2, 0,
                        size, size
                    );
                    context.restore();
                }

                // 如果图片未加载，则加载
                // 如果图片已经加载完成，则直接使用
                if (!image.complete) {
                    image.onload = function (e) {
                        drawImage(self, context);
                    }
                } else {
                    drawImage(self, context);
                }

            } 
            // 绘制文字
            else {
                let award = this.awards[i].substr(0, 3) === 'los'?'未中奖':this.awards[i];
                context.save();
                context.fillStyle = this.textColor;
                context.font = this.FONT_STYLE;
                context.translate(
                    this.centerX + Math.cos(_startRadian + this.AWARD_RADIAN / 2) * this.TEXT_RADIAS,
                    this.centerY + Math.sin(_startRadian + this.AWARD_RADIAN / 2) * this.TEXT_RADIAS
                );
                context.rotate(_startRadian + this.AWARD_RADIAN / 2 + Math.PI / 2);
                context.fillText(award, -context.measureText(award).width / 2, 0);
                context.restore();
            }
        }
        // ----------

        // ---------- 绘制按钮指针
        let moveX = this.centerX,
            moveY = this.centerY - this.ARROW_RADIUS + 5;

        context.save();
        context.fillStyle = this.arrowColorFrom;
        context.beginPath();
        context.moveTo(moveX, moveY);
        context.lineTo(moveX - 15, moveY);
        context.lineTo(moveX, moveY - 30);
        context.closePath();
        context.fill();
        context.restore();

        context.save();
        context.fillStyle = this.arrowColorTo;
        context.beginPath();
        context.moveTo(moveX, moveY);
        context.lineTo(moveX + 15, moveY);
        context.lineTo(moveX, moveY - 30);
        context.closePath();
        context.fill();
        context.restore();
        // ----------


        // ---------- 绘制按钮圆盘
        let gradient_1 = context.createLinearGradient(
            this.centerX - this.ARROW_RADIUS, this.centerY - this.ARROW_RADIUS,
            this.centerX - this.ARROW_RADIUS, this.centerY + this.ARROW_RADIUS
        );
        context.save();
        gradient_1.addColorStop(0, this.arrowColorFrom);
        gradient_1.addColorStop(1, this.arrowColorTo);
        context.fillStyle = gradient_1;

        context.shadowColor = 'rgba(0, 0, 0, .12)';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 5;
        context.shadowBlur = 15;

        context.beginPath();
        context.arc(this.centerX, this.centerY, this.ARROW_RADIUS, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        // ---------- 

        // ---------- 绘制按钮
        let gradient_2 = context.createLinearGradient(
            this.centerX - this.BUTTON_RADIUS, this.centerY - this.BUTTON_RADIUS,
            this.centerX - this.BUTTON_RADIUS, this.centerY + this.BUTTON_RADIUS
        );
        context.save();
        gradient_2.addColorStop(0, this.buttonColorFrom);
        gradient_2.addColorStop(1, this.buttonColorTo);
        context.fillStyle = gradient_2;
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.BUTTON_RADIUS, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        // ----------

        // ---------- 绘制按钮文字
        context.save();
        context.fillStyle = this.buttonFontColor;
        context.font = `bold ${this.BUTTON_RADIUS / 2}px helvetica`;
        super.drawText(
            context, 
            this.buttonFont, 
            this.centerX - this.BUTTON_RADIUS / 2, this.centerY - this.BUTTON_RADIUS / 2 - 4, 
            this.BUTTON_RADIUS * .8,
            this.BUTTON_RADIUS / 2 + 4
        );
        context.restore();
        // ----------
    };

    /**
     * 开始旋转
     * @param {Obj} context 
     */
    rotateWheel(context) {
        this._spinningTime += 30;

        if (this._spinningTime >= this._spinTotalTime) {
            this._isAnimate = false;
            if (this.finish) this.finish(this.getValue());
            return;
        }
        
        let __spinningChange = (this._spinningChange - (super.easeOut(this._spinningTime, 0, this._spinningChange, this._spinTotalTime)))
                              * (Math.PI / 180);
        this.startRadian += __spinningChange;

        this.drawRouletteWheel(context);
        window.requestAnimationFrame(this.rotateWheel.bind(this, context));
    };

    /**
     * 获取奖品的值
     */
    getValue() {
        let degrees = this.startRadian * 180 / Math.PI + 90,
            arcd = this.AWARD_RADIAN * 180 / Math.PI,
            index = Math.floor((360 - degrees % 360) / arcd);

        return index;
    };

    /**
     * 执行旋转，用于绑定在按钮上
     * @param {Obj} context 
     */
    spin(context) {
        this._isAnimate = true;
        this.value = '';
        this._spinningTime = 0;
        this._spinTotalTime = Math.random() * 500 + this.duration;
        this._spinningChange = Math.random() * 100 + this.velocity;
        this.rotateWheel(context);
    };

    /**
     * 初始化转盘
     * @param {obj} canvas
     * @param {Obj} context 
     */
    render(canvas, context) {
        this._canvasStyle = canvas.getAttribute('style');
        this.drawRouletteWheel(context);

        ['touchstart', 'mousedown'].forEach((event) => {
            canvas.addEventListener(event, (e) => {
                if (!this._isAnimate) {
                    let loc = super.windowToCanvas(canvas, e);
                    context.beginPath();
                    context.arc(this.centerX, this.centerY, this.BUTTON_RADIUS, 0, Math.PI * 2, false);
                    if (context.isPointInPath(loc.x, loc.y)) {
                        this.spin(context);
                    }
                }
            })
        });

        canvas.addEventListener('mousemove', (e) => {
            let loc = super.windowToCanvas(canvas, e);
            context.beginPath();
            context.arc(this.centerX, this.centerY, this.BUTTON_RADIUS, 0, Math.PI * 2, false);
            if (context.isPointInPath(loc.x, loc.y)) {
                canvas.setAttribute('style', `cursor: pointer;${this._canvasStyle}`);
            } else {
                canvas.setAttribute('style', this._canvasStyle);
            }
        });
    }
}

class ScratchCard extends Global {
    constructor (options) {
        super();

        this.style = options.style;
        this.awardBackgroundImage = options.awardBackgroundImage;

        this.eraserSize = options.eraserSize || 15;
        this.coverColor = options.coverColor || '#b5b5b5';

        this._dragging = false;
    };

    /**
     * 绘制刮涂层
     * @param {Obj} context 
     */
    drawCover(context) {
        context.save();
        context.fillStyle = this.coverColor;
        context.beginPath();
        context.rect(0, 0, context.canvas.width, context.canvas.height);
        context.fill();
        context.restore();
    };

    /**
     * 绘制橡皮擦
     * @param {Obj} context 
     * @param {Obj} loc 
     */
    drawEraser(context, loc) {
        context.save();
        context.beginPath();
        context.arc(loc.x, loc.y, this.eraserSize, 0, Math.PI * 2, false);
        context.clip();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();
    };

    drawAwardBackgroundImage(canvas) {
        canvas.setAttribute(
            'style', 
            `background: url(${this.awardBackgroundImage}) no-repeat center / cover;${this.style}`
        )
    }

    render(canvas, context) {
        this.drawCover(context);
        this.drawAwardBackgroundImage(canvas);

        ['touchstart', 'mousedown'].forEach((event) => {
            canvas.addEventListener(event, (e) => {
                let loc = super.windowToCanvas(canvas, e);
                this._dragging = true;
                this.drawEraser(context, loc);
            })
        });

        ['touchmove', 'mousemove'].forEach((event) => {
            canvas.addEventListener(event, (e) => {
                let loc;
                if (this._dragging) {
                    loc = super.windowToCanvas(canvas, e);
                    this.drawEraser(context, loc);
                }
            })
        });


        ['touchend', 'mouseup'].forEach((event) => {
            canvas.addEventListener(event, (e) => {
                this._dragging = false;
            })
        });
    }
}

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
                    this.awards[i],
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
                    this.awards[i],
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
                    this.awards[i],
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
                    this.awards[i],
                    this.SUDOKU_ITEM_TXT_SIZE,
                    this.sudokuItemUnactiveTxtColor,
                    this.sudokuItemUnactiveColor,
                    this.sudokuItemUnactiveShadowColor
                )
            }
        };

        this.drawButton(context);
    };

    drawSudokuItem(context, x, y, size, radius, text, txtSize, txtColor, bgColor, shadowColor) {
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

                if (!image.complete) {
                    image.onload = function (e) {
                        drawImage();
                    }
                } else {
                    drawImage();
                }
            }
            else {
                context.save();
                context.fillStyle = txtColor;
                context.font = txtSize;
                context.translate(
                    x + this.SUDOKU_ITEM_SIZE / 2 - context.measureText(text).width / 2,
                    y + this.SUDOKU_ITEM_SIZE / 2 + 6
                );
                context.fillText(text, 0, 0);
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
            this.awards[this._jumpIndex], this.SUDOKU_ITEM_TXT_SIZE, this.sudokuItemActiveTxtColor,
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
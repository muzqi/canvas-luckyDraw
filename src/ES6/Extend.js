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
            x = this.IsPC() ? e.clientX || event.clientX : e.targetTouches[0].clientX,
            y = this.IsPC() ? e.clientY || event.clientY : e.targetTouches[0].clientY;
            
        return {
            x: x - bbox.left,
            y: y - bbox.top
        }
    }
}

/**
 * 大转盘
 * 可配置参数
 * @param {Num} centerX           必选，转盘圆心 x 轴坐标
 * @param {Num} centerY           必选，转盘圆心 y 轴坐标
 * @param {Num} outsideRadius     必选，转盘的半径
 * @param {Num} insideRadius      可选，默认为 10；转盘的内圆半径，若该值大于0，则会创建一个半径为该值的镂空圆
 * @param {Num} textRadius        必选，文字环绕转盘形成的圆的半径；该值必须小于 outsideRadius
 * 
 * @param {Str} evenColor         可选，转盘选项序号为偶数的填充颜色 
 * @param {Str} oddColor          可选，转盘选项序号为奇数的填充颜色 
 * @param {Str} loseColor         可选，未中奖表盘颜色 
 * @param {Str} textColor         可选，文字的颜色 
 * @param {Str} font              可选，文字的样式 
 * 
 * @param {Str} arrowColorFrom    可选，箭头圆盘渐变色 
 * @param {Str} arrowColorTo      可选，箭头圆盘渐变色
 * 
 * @param {Str} buttonFont        可选，箭头圆盘内按钮的文字
 * @param {Str} buttonColorFrom   可选，箭头圆盘内按钮的渐变色
 * @param {Str} buttonColorTo     可选，箭头圆盘内按钮的渐变色
 * @param {Str} buttonFontColor   可选，按钮文字颜色
 * @param {Num} buttonFontSize    可选，按钮的字体大小
 * 
 * @param {Arr} awards            必选，一个包含奖品的数组集合
 *                                奖品类型分三种：
 *                                1. 纯文字，抽中返回该字符串
 *                                2. 图片，抽中返回该元素的下标，格式：`img-${url}`
 *                                3. 未中奖，抽中返回提示文字，格式：`los-${text}`
 * 
 * @param {Num} startRadian       可选，默认为0；绘制转盘的起始角度，单位为弧度
 * @param {Num} duration          可选，默认为4000；转盘旋转的时间，单位毫秒
 * @param {Num} velocity          可选，默认为10；转盘旋转的速率
 */
class RouletteWheel extends Global {
    constructor(options) {
        super();

        this.centerX = options.centerX;
        this.centerY = options.centerY;
        this.outsideRadius = options.outsideRadius;
        this.insideRadius = options.insideRadius || 0;

        this.textRadius = options.textRadius;
        this.evenColor = options.evenColor     || '#FF6766';
        this.oddColor = options.oddColor       || '#FD5757';
        this.loseColor = options.loseColor     || '#F79494'
        this.textColor = options.textColor     || 'White';
        this.font = options.font               || 'bold 16px Helvetica, Arial';

        this.arrowRadius = this.outsideRadius / 3;     // 圆盘指针的半径
        this.arrowColorFrom = options.arrowColorFrom   || '#FFFC95';
        this.arrowColorTo = options.arrowColorTo       || '#FF9D37';

        this.buttonRadius = this.arrowRadius * .8;     // 圆盘内部按钮的半径
        this.buttonFont = options.buttonFont           || '开 始<br>抽 奖';
        this.buttonColorFrom = options.buttonColorFrom || '#FDC964';
        this.buttonColorTo = options.buttonColorTo     || '#FFCB65';
        this.buttonFontColor = options.buttonFontColor || '#88411F';
        this.buttonFontSize = options.buttonFontSize   || 20;

        this.awards = options.awards;
        this.awardsCount = this.awards.length;
        this.awardRadian = (Math.PI * 2) / this.awardsCount;
        this.startRadian = options.startRadian || 0;

        this.duration = options.duration || 4000;  
        this.velocity = options.velocity || 10;  
        this.spinningTime = 0;
        this.spinTotalTime;
        this.spinningChange;

        this.value;        
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
        for (let i = 0; i < this.awardsCount; i ++) {
            // 绘制色块
            context.save();

            if (this.awards[i].substr(0, 3) === 'los') context.fillStyle = this.loseColor;
            else if (i % 2 === 0) context.fillStyle = this.evenColor;
            else                  context.fillStyle = this.oddColor;

            let _startRadian = this.startRadian + this.awardRadian * i,
                _endRadian =   _startRadian + this.awardRadian;

            context.beginPath();
            context.arc(this.centerX, this.centerY, this.outsideRadius - 5, _startRadian, _endRadian, false);
            context.arc(this.centerX, this.centerY, this.insideRadius, _endRadian, _startRadian, true);
            context.fill();
            context.restore();

            // 绘制图片
            if (this.awards[i].substr(0, 3) === 'img') {
                let self = this,
                    drawImage = function (self, context) {
                        let size = Math.sin(self.awardRadian) * self.outsideRadius / 2.5;
                        context.save();
                        context.translate(
                            self.centerX + Math.cos(_startRadian + self.awardRadian / 2) * self.textRadius,
                            self.centerY + Math.sin(_startRadian + self.awardRadian / 2) * self.textRadius
                        )
                        context.rotate(_startRadian + self.awardRadian / 2 + Math.PI / 2);
                        context.drawImage(
                            image, 
                            - size / 2, 0,
                            size, size
                        );
                        context.restore();
                    },
                    image = new Image();
                    image.src = this.awards[i].replace('img-', '');

                drawImage(self, context);

                // 初始化
                image.onload = function (e) {
                    drawImage(self, context);
                }
            } 
            // 绘制文字
            else {
                let award = this.awards[i].substr(0, 3) === 'los'?'未中奖':this.awards[i];
                context.save();
                context.fillStyle = this.textColor;
                context.font = this.font;
                context.translate(
                    this.centerX + Math.cos(_startRadian + this.awardRadian / 2) * this.textRadius,
                    this.centerY + Math.sin(_startRadian + this.awardRadian / 2) * this.textRadius
                );
                context.rotate(_startRadian + this.awardRadian / 2 + Math.PI / 2);
                context.fillText(award, -context.measureText(award).width / 2, 0);
                context.restore();
            }
        }
        // ----------

        // ---------- 绘制按钮指针
        let moveX = this.centerX,
            moveY = this.centerY - this.arrowRadius + 5;

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
        context.save();

        let gradient = context.createLinearGradient(
            this.centerX - this.arrowRadius, this.centerY - this.arrowRadius,
            this.centerX - this.arrowRadius, this.centerY + this.arrowRadius
        );
        gradient.addColorStop(0, this.arrowColorFrom);
        gradient.addColorStop(1, this.arrowColorTo);
        context.fillStyle = gradient;

        context.shadowColor = 'rgba(0, 0, 0, .12)';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 5;
        context.shadowBlur = 15;

        context.beginPath();
        context.arc(this.centerX, this.centerY, this.arrowRadius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        // ---------- 
    };

    /**
     * 绘制抽奖按钮
     * @param {Obj} canvas 
     * @param {Obj} context 
     */
    drawButton(canvas, context) {
        let bbox = canvas.getBoundingClientRect(),
            windowX = this.centerX + bbox.left,
            windowY = this.centerY + bbox.top;

        let rouletteWheel = document.getElementById('roulette_wheel');

        let button = document.createElement('div');
            button.innerHTML = this.buttonFont;
            button.setAttribute('style', `
                width: ${this.buttonRadius * 2}px;
                height: ${this.buttonRadius * 2}px;
                cursor: pointer;
                text-align: center;
                background-image: -webkit-linear-gradient(to top, ${this.buttonColorFrom}, ${this.arrowColorTo}); 
                background-image: linear-gradient(to top, ${this.buttonColorFrom}, ${this.arrowColorTo});
                border-radius: 100%;
                font-weight: bold;
                font-size: ${this.buttonFontSize}px;
                color: ${this.buttonFontColor};
                position: absolute;
                left: ${windowX - this.buttonRadius}px;
                top: ${windowY - this.buttonRadius}px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
            `)
            button.addEventListener('click', (e) => {
                this.spin(context)
            });

        rouletteWheel.appendChild(button);
    };    

    /**
     * 开始旋转
     * @param {Obj} context 
     */
    rotateWheel(context) {
        this.spinningTime += 30;

        if (this.spinningTime >= this.spinTotalTime) {
            this.value = this.getValue(); 
            console.log(this.value);
            return;
        }
        
        let _spinningChange = (this.spinningChange - (super.easeOut(this.spinningTime, 0, this.spinningChange, this.spinTotalTime)))
                              * (Math.PI / 180);
        this.startRadian += _spinningChange;

        this.drawRouletteWheel(context);
        window.requestAnimationFrame(this.rotateWheel.bind(this, context));
    };

    /**
     * 获取奖品的值
     */
    getValue() {
        let degrees = this.startRadian * 180 / Math.PI + 90,
            arcd = this.awardRadian * 180 / Math.PI,
            index = Math.floor((360 - degrees % 360) / arcd);

        if (this.awards[index].substr(0, 3) === 'img')      return index;
        else if (this.awards[index].substr(0, 3) === 'los') return '很遗憾，您未中奖'
        else                                                return this.awards[index];
    };

    /**
     * 执行旋转，用于绑定在按钮上
     * @param {Obj} context 
     */
    spin(context) {
        this.value = '';
        this.spinningTime = 0;
        this.spinTotalTime = Math.random() * 3 + this.duration;
        this.spinningChange = Math.random() * 10 + this.velocity;
        this.rotateWheel(context);
    };

    /**
     * 初始化转盘
     * @param {obj} canvas
     * @param {Obj} context 
     */
    render(canvas, context) {
        this.drawRouletteWheel(context);
        this.drawButton(canvas, context);
    }
}

/**
 * 刮刮卡
 * 可配置参数
 * @param {Str} style                 可选，传入一个 css 字符串，设置刮刮卡的样式
 * @param {Str} awardBackgroundImage  必选，传入一个图片路径，设置刮刮卡的奖品类型
 * @param {Num} eraserSize            可选，默认15px，橡皮擦的半径大小
 * @param {Str} coverColor            可选，默认 #b5b5b5，涂层的颜色
 */
class ScratchCard extends Global {
    constructor (options) {
        super();

        this.dragging = false;

        this.style = options.style;
        this.awardBackgroundImage = options.awardBackgroundImage;

        this.eraserSize = options.eraserSize || 15;
        this.coverColor = options.coverColor || '#b5b5b5';
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
                this.dragging = true;
                this.drawEraser(context, loc);
            })
        });

        ['touchmove', 'mousemove'].forEach((event) => {
            canvas.addEventListener(event, (e) => {
                let loc;
                if (this.dragging) {
                    loc = super.windowToCanvas(canvas, e);
                    this.drawEraser(context, loc);
                }
            })
        });

        ['touchend', 'mouseup'].forEach((event) => {
            canvas.addEventListener(event, (e) => {
                this.dragging = false;
            })
        });
    }
}
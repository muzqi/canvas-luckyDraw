"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Global = function () {
    function Global() {
        _classCallCheck(this, Global);
    }

    _createClass(Global, [{
        key: "IsPC",


        /**
         * 判断是否为 PC 端，若是则返回 true，否则返回 flase
         */
        value: function IsPC() {
            var userAgentInfo = navigator.userAgent,
                flag = true,
                Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
    }, {
        key: "easeOut",


        /**
         * 缓动函数，由快到慢
         * @param {Num} t 当前时间
         * @param {Num} b 初始值
         * @param {Num} c 变化值
         * @param {Num} d 持续时间
         */
        value: function easeOut(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * (--t * (t - 2) - 1) + b;
        }
    }, {
        key: "windowToCanvas",
        value: function windowToCanvas(canvas, e) {
            var bbox = canvas.getBoundingClientRect(),
                x = this.IsPC() ? e.clientX || event.clientX : e.changedTouches[0].clientX,
                y = this.IsPC() ? e.clientY || event.clientY : e.changedTouches[0].clientY;

            return {
                x: x - bbox.left,
                y: y - bbox.top
            };
        }
    }, {
        key: "drawText",


        /**
         * 绘制自动换行的文本
         * @param {Obj} context
         * @param {Str} t          文本内容
         * @param {Num} x          坐标
         * @param {Num} y          坐标
         * @param {Num} w          文本限制宽度
         * @param {Num} lineHeight 行高
         */
        value: function drawText(context, t, x, y, w) {
            var lineHeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;

            var chr = t.split(''),
                temp = '',
                row = [];

            for (var a = 0; a < chr.length; a++) {
                if (context.measureText(temp).width < w) {
                    ;
                } else {
                    row.push(temp);
                    temp = '';
                }
                temp += chr[a];
            };

            row.push(temp);

            for (var b = 0; b < row.length; b++) {
                context.fillText(row[b], x, y + (b + 1) * lineHeight);
            };
        }
    }]);

    return Global;
}();

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
 * 
 * @param {Fnc} finish            可选，获取奖品后的回调函数
 */


var RouletteWheel = function (_Global) {
    _inherits(RouletteWheel, _Global);

    function RouletteWheel(options) {
        _classCallCheck(this, RouletteWheel);

        var _this = _possibleConstructorReturn(this, (RouletteWheel.__proto__ || Object.getPrototypeOf(RouletteWheel)).call(this));

        _this.centerX = options.centerX;
        _this.centerY = options.centerY;
        _this.outsideRadius = options.outsideRadius;
        _this.insideRadius = options.insideRadius || 0;

        _this.textRadius = options.textRadius;
        _this.evenColor = options.evenColor || '#FF6766';
        _this.oddColor = options.oddColor || '#FD5757';
        _this.loseColor = options.loseColor || '#F79494';
        _this.textColor = options.textColor || 'White';
        _this.font = options.font || 'bold 16px Helvetica, Arial';

        _this.arrowRadius = _this.outsideRadius / 3; // 圆盘指针的半径
        _this.arrowColorFrom = options.arrowColorFrom || '#FFFC95';
        _this.arrowColorTo = options.arrowColorTo || '#FF9D37';

        _this.buttonRadius = _this.arrowRadius * .8; // 圆盘内部按钮的半径
        _this.buttonFont = options.buttonFont || '开始抽奖';
        _this.buttonColorFrom = options.buttonColorFrom || '#FDC964';
        _this.buttonColorTo = options.buttonColorTo || '#FFCB65';
        _this.buttonFontColor = options.buttonFontColor || '#88411F';

        _this.awards = options.awards;
        _this.awardsCount = _this.awards.length;
        _this.awardRadian = Math.PI * 2 / _this.awardsCount;
        _this.startRadian = options.startRadian || 0;

        _this.isAnimate = false;
        _this.duration = options.duration || 4000;
        _this.velocity = options.velocity || 10;
        _this.spinningTime = 0;
        _this.spinTotalTime;
        _this.spinningChange;

        _this.finish = options.finish;

        _this.achieveAward;
        return _this;
    }

    _createClass(RouletteWheel, [{
        key: "drawRouletteWheel",


        /**
         * 绘制转盘
         * @param {Obj} context 
         */
        value: function drawRouletteWheel(context) {
            var _this2 = this;

            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            // ---------- 绘制外表盘
            context.save();
            var rgb = this.oddColor.replace('#', ''),
                r = parseInt(rgb[0] + rgb[1], 16),
                g = parseInt(rgb[2] + rgb[3], 16),
                b = parseInt(rgb[4] + rgb[5], 16);

            context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", .72)";
            context.shadowColor = 'rgba(0, 0, 0, .24)';
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 5;
            context.shadowBlur = 15;
            context.arc(this.centerX, this.centerY, this.outsideRadius, 0, Math.PI * 2, false);
            context.fill();
            context.restore();
            // ----------

            // --------- 绘制表盘中的色块，和对应的文字与图片

            var _loop = function _loop(i) {
                // 绘制色块
                context.save();

                if (_this2.awards[i].substr(0, 3) === 'los') context.fillStyle = _this2.loseColor;else if (i % 2 === 0) context.fillStyle = _this2.evenColor;else context.fillStyle = _this2.oddColor;

                var _startRadian = _this2.startRadian + _this2.awardRadian * i,
                    _endRadian = _startRadian + _this2.awardRadian;

                context.beginPath();
                context.arc(_this2.centerX, _this2.centerY, _this2.outsideRadius - 5, _startRadian, _endRadian, false);
                context.arc(_this2.centerX, _this2.centerY, _this2.insideRadius, _endRadian, _startRadian, true);
                context.fill();
                context.restore();

                // 绘制图片
                if (_this2.awards[i].substr(0, 3) === 'img') {
                    var drawImage = function drawImage(self, context) {
                        var size = Math.sin(self.awardRadian) * self.outsideRadius / 2.5;
                        context.save();
                        context.translate(self.centerX + Math.cos(_startRadian + self.awardRadian / 2) * self.textRadius, self.centerY + Math.sin(_startRadian + self.awardRadian / 2) * self.textRadius);
                        context.rotate(_startRadian + self.awardRadian / 2 + Math.PI / 2);
                        context.drawImage(image, -size / 2, 0, size, size);
                        context.restore();
                    };

                    // 如果图片未加载，则加载
                    // 如果图片已经加载完成，则直接使用


                    var self = _this2,
                        image = new Image();
                    image.src = _this2.awards[i].replace('img-', '');

                    if (!image.complete) {
                        image.onload = function (e) {
                            drawImage(self, context);
                        };
                    } else {
                        drawImage(self, context);
                    }
                }
                // 绘制文字
                else {
                        var award = _this2.awards[i].substr(0, 3) === 'los' ? '未中奖' : _this2.awards[i];
                        context.save();
                        context.fillStyle = _this2.textColor;
                        context.font = _this2.font;
                        context.translate(_this2.centerX + Math.cos(_startRadian + _this2.awardRadian / 2) * _this2.textRadius, _this2.centerY + Math.sin(_startRadian + _this2.awardRadian / 2) * _this2.textRadius);
                        context.rotate(_startRadian + _this2.awardRadian / 2 + Math.PI / 2);
                        context.fillText(award, -context.measureText(award).width / 2, 0);
                        context.restore();
                    }
            };

            for (var i = 0; i < this.awardsCount; i++) {
                _loop(i);
            }
            // ----------

            // ---------- 绘制按钮指针
            var moveX = this.centerX,
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
            var gradient_1 = context.createLinearGradient(this.centerX - this.arrowRadius, this.centerY - this.arrowRadius, this.centerX - this.arrowRadius, this.centerY + this.arrowRadius);
            context.save();
            gradient_1.addColorStop(0, this.arrowColorFrom);
            gradient_1.addColorStop(1, this.arrowColorTo);
            context.fillStyle = gradient_1;

            context.shadowColor = 'rgba(0, 0, 0, .12)';
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 5;
            context.shadowBlur = 15;

            context.beginPath();
            context.arc(this.centerX, this.centerY, this.arrowRadius, 0, Math.PI * 2, false);
            context.fill();
            context.restore();
            // ---------- 

            // ---------- 绘制按钮
            var gradient_2 = context.createLinearGradient(this.centerX - this.buttonRadius, this.centerY - this.buttonRadius, this.centerX - this.buttonRadius, this.centerY + this.buttonRadius);
            context.save();
            gradient_2.addColorStop(0, this.buttonColorFrom);
            gradient_2.addColorStop(1, this.buttonColorTo);
            context.fillStyle = gradient_2;
            context.beginPath();
            context.arc(this.centerX, this.centerY, this.buttonRadius, 0, Math.PI * 2, false);
            context.fill();
            context.restore();
            // ----------

            // ---------- 绘制按钮文字
            context.save();
            context.fillStyle = this.buttonFontColor;
            context.font = "bold " + this.buttonRadius / 2 + "px helvetica";
            _get(RouletteWheel.prototype.__proto__ || Object.getPrototypeOf(RouletteWheel.prototype), "drawText", this).call(this, context, this.buttonFont, this.centerX - this.buttonRadius / 2, this.centerY - this.buttonRadius / 2 - 4, this.buttonRadius * .8, this.buttonRadius / 2 + 4);
            context.restore();
            // ----------
        }
    }, {
        key: "rotateWheel",


        /**
         * 开始旋转
         * @param {Obj} context 
         */
        value: function rotateWheel(context) {
            this.spinningTime += 30;

            if (this.spinningTime >= this.spinTotalTime) {
                this.isAnimate = false;
                this.achieveAward = this.getValue();
                this.finish();
                return;
            }

            var _spinningChange = (this.spinningChange - _get(RouletteWheel.prototype.__proto__ || Object.getPrototypeOf(RouletteWheel.prototype), "easeOut", this).call(this, this.spinningTime, 0, this.spinningChange, this.spinTotalTime)) * (Math.PI / 180);
            this.startRadian += _spinningChange;

            this.drawRouletteWheel(context);
            window.requestAnimationFrame(this.rotateWheel.bind(this, context));
        }
    }, {
        key: "getValue",


        /**
         * 获取奖品的值
         */
        value: function getValue() {
            var degrees = this.startRadian * 180 / Math.PI + 90,
                arcd = this.awardRadian * 180 / Math.PI,
                index = Math.floor((360 - degrees % 360) / arcd);

            return { val: this.awards[index], index: index };
        }
    }, {
        key: "spin",


        /**
         * 执行旋转，用于绑定在按钮上
         * @param {Obj} context 
         */
        value: function spin(context) {
            this.isAnimate = true;
            this.value = '';
            this.spinningTime = 0;
            this.spinTotalTime = Math.random() * 500 + this.duration;
            this.spinningChange = Math.random() * 100 + this.velocity;
            this.rotateWheel(context);
        }
    }, {
        key: "render",


        /**
         * 初始化转盘
         * @param {obj} canvas
         * @param {Obj} context 
         */
        value: function render(canvas, context) {
            var _this3 = this;

            this.drawRouletteWheel(context);

            ['touchstart', 'mousedown'].forEach(function (event) {
                canvas.addEventListener(event, function (e) {
                    if (!_this3.isAnimate) {
                        var loc = _get(RouletteWheel.prototype.__proto__ || Object.getPrototypeOf(RouletteWheel.prototype), "windowToCanvas", _this3).call(_this3, canvas, e);
                        context.beginPath();
                        context.arc(_this3.centerX, _this3.centerY, _this3.buttonRadius, 0, Math.PI * 2, false);
                        if (context.isPointInPath(loc.x, loc.y)) {
                            _this3.spin(context);
                        }
                    }
                });
            });

            canvas.addEventListener('mousemove', function (e) {
                var loc = _get(RouletteWheel.prototype.__proto__ || Object.getPrototypeOf(RouletteWheel.prototype), "windowToCanvas", _this3).call(_this3, canvas, e);
                context.beginPath();
                context.arc(_this3.centerX, _this3.centerY, _this3.buttonRadius, 0, Math.PI * 2, false);
                if (context.isPointInPath(loc.x, loc.y)) {
                    canvas.setAttribute('style', 'cursor: pointer');
                } else {
                    canvas.setAttribute('style', '');
                }
            });
        }
    }]);

    return RouletteWheel;
}(Global);

/**
 * 刮刮卡
 * 可配置参数
 * @param {Str} style                 可选，传入一个 css 字符串，设置刮刮卡的样式
 * @param {Str} awardBackgroundImage  必选，传入一个图片路径，设置刮刮卡的奖品类型
 * @param {Num} eraserSize            可选，默认15px，橡皮擦的半径大小
 * @param {Str} coverColor            可选，默认 #b5b5b5，涂层的颜色
 */


var ScratchCard = function (_Global2) {
    _inherits(ScratchCard, _Global2);

    function ScratchCard(options) {
        _classCallCheck(this, ScratchCard);

        var _this4 = _possibleConstructorReturn(this, (ScratchCard.__proto__ || Object.getPrototypeOf(ScratchCard)).call(this));

        _this4.dragging = false;

        _this4.style = options.style;
        _this4.awardBackgroundImage = options.awardBackgroundImage;

        _this4.eraserSize = options.eraserSize || 15;
        _this4.coverColor = options.coverColor || '#b5b5b5';
        return _this4;
    }

    _createClass(ScratchCard, [{
        key: "drawCover",


        /**
         * 绘制刮涂层
         * @param {Obj} context 
         */
        value: function drawCover(context) {
            context.save();
            context.fillStyle = this.coverColor;
            context.beginPath();
            context.rect(0, 0, context.canvas.width, context.canvas.height);
            context.fill();
            context.restore();
        }
    }, {
        key: "drawEraser",


        /**
         * 绘制橡皮擦
         * @param {Obj} context 
         * @param {Obj} loc 
         */
        value: function drawEraser(context, loc) {
            context.save();
            context.beginPath();
            context.arc(loc.x, loc.y, this.eraserSize, 0, Math.PI * 2, false);
            context.clip();
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
        }
    }, {
        key: "drawAwardBackgroundImage",
        value: function drawAwardBackgroundImage(canvas) {
            canvas.setAttribute('style', "background: url(" + this.awardBackgroundImage + ") no-repeat center / cover;" + this.style);
        }
    }, {
        key: "render",
        value: function render(canvas, context) {
            var _this5 = this;

            this.drawCover(context);
            this.drawAwardBackgroundImage(canvas);

            ['touchstart', 'mousedown'].forEach(function (event) {
                canvas.addEventListener(event, function (e) {
                    var loc = _get(ScratchCard.prototype.__proto__ || Object.getPrototypeOf(ScratchCard.prototype), "windowToCanvas", _this5).call(_this5, canvas, e);
                    _this5.dragging = true;
                    _this5.drawEraser(context, loc);
                });
            });

            ['touchmove', 'mousemove'].forEach(function (event) {
                canvas.addEventListener(event, function (e) {
                    var loc = void 0;
                    if (_this5.dragging) {
                        loc = _get(ScratchCard.prototype.__proto__ || Object.getPrototypeOf(ScratchCard.prototype), "windowToCanvas", _this5).call(_this5, canvas, e);
                        _this5.drawEraser(context, loc);
                    }
                });
            });

            ['touchend', 'mouseup'].forEach(function (event) {
                canvas.addEventListener(event, function (e) {
                    _this5.dragging = false;
                });
            });
        }
    }]);

    return ScratchCard;
}(Global);
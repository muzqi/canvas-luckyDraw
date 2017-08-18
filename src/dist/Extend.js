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
    }, {
        key: "roundedRect",


        /**
         * 定义圆角矩形的方法
         * @param {Obj} context
         * @param {Num} cornerX 
         * @param {Num} cornerY 
         * @param {Num} width 
         * @param {Num} height 
         * @param {Num} cornerRadius 
         */
        value: function roundedRect(context, cornerX, cornerY, width, height, cornerRadius) {
            if (width > 0) context.moveTo(cornerX + cornerRadius, cornerY);else context.moveTo(cornerX - cornerRadius, cornerY);

            context.arcTo(cornerX + width, cornerY, cornerX + width, cornerY + height, cornerRadius);

            context.arcTo(cornerX + width, cornerY + height, cornerX, cornerY + height, cornerRadius);

            context.arcTo(cornerX, cornerY + height, cornerX, cornerY, cornerRadius);

            if (width > 0) {
                context.arcTo(cornerX, cornerY, cornerX + cornerRadius, cornerY, cornerRadius);
            } else {
                context.arcTo(cornerX, cornerY, cornerX - cornerRadius, cornerY, cornerRadius);
            }
        }
    }]);

    return Global;
}();

// 小写变量为用户定义值，
// 小写并带前缀 _ 为对象体中进行计算的值
// 大写变量为无需定义，自动根据条件计算的值

var RouletteWheel = function (_Global) {
    _inherits(RouletteWheel, _Global);

    function RouletteWheel(options) {
        _classCallCheck(this, RouletteWheel);

        var _this = _possibleConstructorReturn(this, (RouletteWheel.__proto__ || Object.getPrototypeOf(RouletteWheel)).call(this));

        _this.centerX = options.centerX;
        _this.centerY = options.centerY;
        _this.outsideRadius = options.outsideRadius;

        _this.evenColor = options.evenColor || '#FF6766';
        _this.oddColor = options.oddColor || '#FD5757';
        _this.loseColor = options.loseColor || '#F79494';
        _this.textColor = options.textColor || 'White';

        _this.arrowColorFrom = options.arrowColorFrom || '#FFFC95';
        _this.arrowColorTo = options.arrowColorTo || '#FF9D37';
        _this.buttonFont = options.buttonFont || '开始抽奖';
        _this.buttonColorFrom = options.buttonColorFrom || '#FDC964';
        _this.buttonColorTo = options.buttonColorTo || '#FFCB65';
        _this.buttonFontColor = options.buttonFontColor || '#88411F';

        _this.awards = options.awards;

        _this.startRadian = options.startRadian || 0;
        _this.duration = options.duration || 4000;
        _this.velocity = options.velocity || 10;

        _this.finish = options.finish;

        _this.INSIDE_RADIUS = 0;
        _this.TEXT_RADIAS = _this.outsideRadius * .8;
        _this.FONT_STYLE = "bold " + _this.outsideRadius * .07 + "px Helvetica, Arial";

        _this.ARROW_RADIUS = _this.outsideRadius / 3; // 圆盘指针的半径
        _this.BUTTON_RADIUS = _this.ARROW_RADIUS * .8; // 圆盘内部按钮的半径

        _this.AWARDS_COUNT = _this.awards.length;
        _this.AWARD_RADIAN = Math.PI * 2 / _this.AWARDS_COUNT;

        _this._isAnimate = false;
        _this._spinningTime = 0;
        _this._spinTotalTime;
        _this._spinningChange;

        _this._canvasStyle;
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

                var _startRadian = _this2.startRadian + _this2.AWARD_RADIAN * i,
                    _endRadian = _startRadian + _this2.AWARD_RADIAN;

                context.beginPath();
                context.arc(_this2.centerX, _this2.centerY, _this2.outsideRadius - 5, _startRadian, _endRadian, false);
                context.arc(_this2.centerX, _this2.centerY, _this2.INSIDE_RADIUS, _endRadian, _startRadian, true);
                context.fill();
                context.restore();

                // 绘制图片
                if (_this2.awards[i].substr(0, 3) === 'img') {
                    var drawImage = function drawImage(self, context) {
                        var size = Math.sin(self.AWARD_RADIAN) * self.outsideRadius / 2.5;
                        context.save();
                        context.translate(self.centerX + Math.cos(_startRadian + self.AWARD_RADIAN / 2) * self.TEXT_RADIAS, self.centerY + Math.sin(_startRadian + self.AWARD_RADIAN / 2) * self.TEXT_RADIAS);
                        context.rotate(_startRadian + self.AWARD_RADIAN / 2 + Math.PI / 2);
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
                        context.font = _this2.FONT_STYLE;
                        context.translate(_this2.centerX + Math.cos(_startRadian + _this2.AWARD_RADIAN / 2) * _this2.TEXT_RADIAS, _this2.centerY + Math.sin(_startRadian + _this2.AWARD_RADIAN / 2) * _this2.TEXT_RADIAS);
                        context.rotate(_startRadian + _this2.AWARD_RADIAN / 2 + Math.PI / 2);
                        context.fillText(award, -context.measureText(award).width / 2, 0);
                        context.restore();
                    }
            };

            for (var i = 0; i < this.AWARDS_COUNT; i++) {
                _loop(i);
            }
            // ----------

            // ---------- 绘制按钮指针
            var moveX = this.centerX,
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
            var gradient_1 = context.createLinearGradient(this.centerX - this.ARROW_RADIUS, this.centerY - this.ARROW_RADIUS, this.centerX - this.ARROW_RADIUS, this.centerY + this.ARROW_RADIUS);
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
            var gradient_2 = context.createLinearGradient(this.centerX - this.BUTTON_RADIUS, this.centerY - this.BUTTON_RADIUS, this.centerX - this.BUTTON_RADIUS, this.centerY + this.BUTTON_RADIUS);
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
            context.font = "bold " + this.BUTTON_RADIUS / 2 + "px helvetica";
            _get(RouletteWheel.prototype.__proto__ || Object.getPrototypeOf(RouletteWheel.prototype), "drawText", this).call(this, context, this.buttonFont, this.centerX - this.BUTTON_RADIUS / 2, this.centerY - this.BUTTON_RADIUS / 2 - 4, this.BUTTON_RADIUS * .8, this.BUTTON_RADIUS / 2 + 4);
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
            this._spinningTime += 30;

            if (this._spinningTime >= this._spinTotalTime) {
                this._isAnimate = false;
                if (this.finish) this.finish(this.getValue());
                return;
            }

            var __spinningChange = (this._spinningChange - _get(RouletteWheel.prototype.__proto__ || Object.getPrototypeOf(RouletteWheel.prototype), "easeOut", this).call(this, this._spinningTime, 0, this._spinningChange, this._spinTotalTime)) * (Math.PI / 180);
            this.startRadian += __spinningChange;

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
                arcd = this.AWARD_RADIAN * 180 / Math.PI,
                index = Math.floor((360 - degrees % 360) / arcd);

            return index;
        }
    }, {
        key: "spin",


        /**
         * 执行旋转，用于绑定在按钮上
         * @param {Obj} context 
         */
        value: function spin(context) {
            this._isAnimate = true;
            this.value = '';
            this._spinningTime = 0;
            this._spinTotalTime = Math.random() * 500 + this.duration;
            this._spinningChange = Math.random() * 100 + this.velocity;
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

            this._canvasStyle = canvas.getAttribute('style');
            this.drawRouletteWheel(context);

            ['touchstart', 'mousedown'].forEach(function (event) {
                canvas.addEventListener(event, function (e) {
                    if (!_this3._isAnimate) {
                        var loc = _get(RouletteWheel.prototype.__proto__ || Object.getPrototypeOf(RouletteWheel.prototype), "windowToCanvas", _this3).call(_this3, canvas, e);
                        context.beginPath();
                        context.arc(_this3.centerX, _this3.centerY, _this3.BUTTON_RADIUS, 0, Math.PI * 2, false);
                        if (context.isPointInPath(loc.x, loc.y)) {
                            _this3.spin(context);
                        }
                    }
                });
            });

            canvas.addEventListener('mousemove', function (e) {
                var loc = _get(RouletteWheel.prototype.__proto__ || Object.getPrototypeOf(RouletteWheel.prototype), "windowToCanvas", _this3).call(_this3, canvas, e);
                context.beginPath();
                context.arc(_this3.centerX, _this3.centerY, _this3.BUTTON_RADIUS, 0, Math.PI * 2, false);
                if (context.isPointInPath(loc.x, loc.y)) {
                    canvas.setAttribute('style', "cursor: pointer;" + _this3._canvasStyle);
                } else {
                    canvas.setAttribute('style', _this3._canvasStyle);
                }
            });
        }
    }]);

    return RouletteWheel;
}(Global);

var ScratchCard = function (_Global2) {
    _inherits(ScratchCard, _Global2);

    function ScratchCard(options) {
        _classCallCheck(this, ScratchCard);

        var _this4 = _possibleConstructorReturn(this, (ScratchCard.__proto__ || Object.getPrototypeOf(ScratchCard)).call(this));

        _this4.style = options.style;
        _this4.awardBackgroundImage = options.awardBackgroundImage;

        _this4.eraserSize = options.eraserSize || 15;
        _this4.coverColor = options.coverColor || '#b5b5b5';

        _this4._dragging = false;
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
                    _this5._dragging = true;
                    _this5.drawEraser(context, loc);
                });
            });

            ['touchmove', 'mousemove'].forEach(function (event) {
                canvas.addEventListener(event, function (e) {
                    var loc = void 0;
                    if (_this5._dragging) {
                        loc = _get(ScratchCard.prototype.__proto__ || Object.getPrototypeOf(ScratchCard.prototype), "windowToCanvas", _this5).call(_this5, canvas, e);
                        _this5.drawEraser(context, loc);
                    }
                });
            });

            ['touchend', 'mouseup'].forEach(function (event) {
                canvas.addEventListener(event, function (e) {
                    _this5._dragging = false;
                });
            });
        }
    }]);

    return ScratchCard;
}(Global);

var Sudoku = function (_Global3) {
    _inherits(Sudoku, _Global3);

    function Sudoku(options) {
        _classCallCheck(this, Sudoku);

        var _this6 = _possibleConstructorReturn(this, (Sudoku.__proto__ || Object.getPrototypeOf(Sudoku)).call(this));

        _this6.awardsRowLen = options.awardsRowLen || 3;
        _this6.awards = options.awards;
        _this6.sudokuSize = options.sudokuSize;
        _this6.sudokuItemRadius = options.sudokuItemRadius || 8;

        _this6.sudokuItemUnactiveColor = options.sudokuItemUnactiveColor || 'rgb(255, 235, 236)';
        _this6.sudokuItemUnactiveTxtColor = options.sudokuItemUnactiveTxtColor || 'rgb(48, 44, 43)';
        _this6.sudokuItemUnactiveShadowColor = options.sudokuItemUnactiveShadowColor || 'rgb(255, 193, 200)';

        _this6.sudokuItemActiveColor = options.sudokuItemActiveColor || 'rgb(254, 150, 51)';
        _this6.sudokuItemActiveTxtColor = options.sudokuItemActiveTxtColor || 'rgb(255, 255, 255)';
        _this6.sudokuItemActiveShadowColor = options.sudokuItemActiveShadowColor || 'rgb(255, 193, 200)';

        _this6.buttonColor = options.buttonColor || 'rgb(255, 216, 1)';
        _this6.buttonTxtColor = options.buttonTxtColor || 'rgb(172, 97, 1)';
        _this6.buttonShadowColor = options.buttonShadowColor || 'rgb(253, 177, 1)';

        _this6.duration = options.duration || 4000;
        _this6.velocity = options.velocity || 300;

        _this6.finish = options.finish;

        _this6.AWARDS_STEP = _this6.awardsRowLen - 1;
        _this6.AWARDS_LEN = _this6.AWARDS_STEP * 4;

        _this6.LETF_TOP_POINT = 0;
        _this6.RIGHT_TOP_POINT = _this6.AWARDS_STEP;
        _this6.RIGHT_BOTTOM_POINT = _this6.AWARDS_STEP * 2;
        _this6.LEFT_BOTTOM_POINT = _this6.AWARDS_STEP * 2 + _this6.AWARDS_STEP;

        _this6.SUDOKU_ITEM_MARGIN = _this6.sudokuSize / _this6.awardsRowLen / 6;
        _this6.SUDOKU_ITEM_SIZE = _this6.sudokuSize / _this6.awardsRowLen - _this6.SUDOKU_ITEM_MARGIN;
        _this6.SUDOKU_ITEM_TXT_SIZE = "bold " + _this6.SUDOKU_ITEM_SIZE * .12 + "px Helvetica";

        _this6.BUTTON_SIZE = _this6.sudokuSize - (_this6.SUDOKU_ITEM_SIZE * 2 + _this6.SUDOKU_ITEM_MARGIN * 3);
        _this6.BUTTON_TXT_SIZE = "bold " + _this6.BUTTON_SIZE * .12 + "px Helvetica";

        _this6._positions = [];
        _this6._buttonPosition = [];

        _this6._isAnimate = false;
        _this6._jumpIndex = Math.floor(Math.random() * _this6.AWARDS_LEN);
        _this6._jumpingTime = 0;
        _this6._jumpTotalTime;
        _this6._jumpChange;

        _this6._canvasStyle;

        return _this6;
    }

    _createClass(Sudoku, [{
        key: "drawSudoku",
        value: function drawSudoku(context) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // 顶点坐标
            var maxPosition = this.AWARDS_STEP * this.SUDOKU_ITEM_SIZE + this.AWARDS_STEP * this.SUDOKU_ITEM_MARGIN;

            for (var i = 0; i < this.AWARDS_LEN; i++) {
                // ----- 左上顶点
                if (i >= this.LETF_TOP_POINT && i < this.RIGHT_TOP_POINT) {
                    var row = i,
                        x = row * this.SUDOKU_ITEM_SIZE + row * this.SUDOKU_ITEM_MARGIN,
                        y = 0;

                    this._positions.push({ x: x, y: y });

                    this.drawSudokuItem(context, x, y, this.SUDOKU_ITEM_SIZE, this.sudokuItemRadius, this.awards[i], this.SUDOKU_ITEM_TXT_SIZE, this.sudokuItemUnactiveTxtColor, this.sudokuItemUnactiveColor, this.sudokuItemUnactiveShadowColor);
                }
                // -----

                // ----- 右上顶点
                if (i >= this.RIGHT_TOP_POINT && i < this.RIGHT_BOTTOM_POINT) {
                    var _row = Math.abs(this.AWARDS_STEP - i),
                        _x2 = maxPosition,
                        _y = _row * this.SUDOKU_ITEM_SIZE + _row * this.SUDOKU_ITEM_MARGIN;

                    this._positions.push({ x: _x2, y: _y });

                    this.drawSudokuItem(context, _x2, _y, this.SUDOKU_ITEM_SIZE, this.sudokuItemRadius, this.awards[i], this.SUDOKU_ITEM_TXT_SIZE, this.sudokuItemUnactiveTxtColor, this.sudokuItemUnactiveColor, this.sudokuItemUnactiveShadowColor);
                }
                // -----

                // ----- 左下顶点
                if (i >= this.RIGHT_BOTTOM_POINT && i < this.LEFT_BOTTOM_POINT) {
                    var _row2 = Math.abs(this.AWARDS_STEP * 2 - i),
                        reverseRow = Math.abs(_row2 - this.AWARDS_STEP),
                        _x3 = reverseRow * this.SUDOKU_ITEM_SIZE + reverseRow * this.SUDOKU_ITEM_MARGIN,
                        _y2 = maxPosition;

                    this._positions.push({ x: _x3, y: _y2 });

                    this.drawSudokuItem(context, _x3, _y2, this.SUDOKU_ITEM_SIZE, this.sudokuItemRadius, this.awards[i], this.SUDOKU_ITEM_TXT_SIZE, this.sudokuItemUnactiveTxtColor, this.sudokuItemUnactiveColor, this.sudokuItemUnactiveShadowColor);
                }
                // -----

                // ----- 左上顶点
                if (i >= this.LEFT_BOTTOM_POINT) {
                    var _row3 = Math.abs(this.AWARDS_STEP * 3 - i),
                        _reverseRow = Math.abs(_row3 - this.AWARDS_STEP),
                        _x4 = 0,
                        _y3 = _reverseRow * this.SUDOKU_ITEM_SIZE + _reverseRow * this.SUDOKU_ITEM_MARGIN;

                    this._positions.push({ x: _x4, y: _y3 });

                    this.drawSudokuItem(context, _x4, _y3, this.SUDOKU_ITEM_SIZE, this.sudokuItemRadius, this.awards[i], this.SUDOKU_ITEM_TXT_SIZE, this.sudokuItemUnactiveTxtColor, this.sudokuItemUnactiveColor, this.sudokuItemUnactiveShadowColor);
                }
            };

            this.drawButton(context);
        }
    }, {
        key: "drawSudokuItem",
        value: function drawSudokuItem(context, x, y, size, radius, text, txtSize, txtColor, bgColor, shadowColor) {
            // ----- 绘制方块
            context.save();
            context.fillStyle = bgColor;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 4;
            context.shadowBlur = 0;
            context.shadowColor = shadowColor;
            context.beginPath();
            _get(Sudoku.prototype.__proto__ || Object.getPrototypeOf(Sudoku.prototype), "roundedRect", this).call(this, context, x, y, size, size, radius);
            context.fill();
            context.restore();
            // -----

            // ----- 绘制图片与文字
            if (text) {
                if (text.substr(0, 3) === 'img') {
                    var drawImage = function drawImage() {
                        context.drawImage(image, x + size * .2 / 2, y + size * .2 / 2, size * .8, size * .8);
                    };

                    var textFormat = text.replace('img-', ''),
                        image = new Image();
                    image.src = textFormat;

                    ;

                    if (!image.complete) {
                        image.onload = function (e) {
                            drawImage();
                        };
                    } else {
                        drawImage();
                    }
                } else {
                    context.save();
                    context.fillStyle = txtColor;
                    context.font = txtSize;
                    context.translate(x + this.SUDOKU_ITEM_SIZE / 2 - context.measureText(text).width / 2, y + this.SUDOKU_ITEM_SIZE / 2 + 6);
                    context.fillText(text, 0, 0);
                    context.restore();
                }
            }
            // -----
        }
    }, {
        key: "drawButton",
        value: function drawButton(context) {
            var x = this.SUDOKU_ITEM_SIZE + this.SUDOKU_ITEM_MARGIN,
                y = this.SUDOKU_ITEM_SIZE + this.SUDOKU_ITEM_MARGIN;

            // ----- 绘制背景
            context.save();
            context.fillStyle = this.buttonColor;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 4;
            context.shadowBlur = 0;
            context.shadowColor = this.buttonShadowColor;
            context.beginPath();
            _get(Sudoku.prototype.__proto__ || Object.getPrototypeOf(Sudoku.prototype), "roundedRect", this).call(this, context, x, y, this.BUTTON_SIZE, this.BUTTON_SIZE, this.sudokuItemRadius, this.buttonColor, this.buttonShadowColor);
            context.fill();
            context.restore();
            // -----

            // ----- 绘制文字
            context.save();
            context.fillStyle = this.buttonTxtColor;
            context.font = this.BUTTON_TXT_SIZE;
            context.translate(x + this.BUTTON_SIZE / 2 - context.measureText('立即抽奖').width / 2, y + this.BUTTON_SIZE / 2 + 10);
            context.fillText('立即抽奖', 0, 0);
            context.restore();
            // -----

            this._buttonPosition = { x: x, y: y };
        }
    }, {
        key: "createButtonPath",
        value: function createButtonPath(context) {
            context.beginPath();
            _get(Sudoku.prototype.__proto__ || Object.getPrototypeOf(Sudoku.prototype), "roundedRect", this).call(this, context, this._buttonPosition.x, this._buttonPosition.y, this.BUTTON_SIZE, this.BUTTON_SIZE, this.sudokuItemRadius);
        }
    }, {
        key: "animate",
        value: function animate(context) {
            this.isAnimate = true;

            if (this._jumpIndex < this.AWARDS_LEN - 1) this._jumpIndex++;else if (this._jumpIndex >= this.AWARDS_LEN - 1) this._jumpIndex = 0;

            this._jumpingTime += 100;

            if (this._jumpingTime >= this._jumpTotalTime) {
                this.isAnimate = false;
                if (this.finish) {
                    if (this._jumpIndex != 0) this.finish(this._jumpIndex - 1);else if (this._jumpIndex === 0) this.finish(this.AWARDS_LEN - 1);
                }
                return;
            };

            this.drawSudoku(context);
            this.drawSudokuItem(context, this._positions[this._jumpIndex].x, this._positions[this._jumpIndex].y, this.SUDOKU_ITEM_SIZE, this.sudokuItemRadius, this.awards[this._jumpIndex], this.SUDOKU_ITEM_TXT_SIZE, this.sudokuItemActiveTxtColor, this.sudokuItemActiveColor, this.sudokuItemActiveShadowColor);

            setTimeout(this.animate.bind(this, context), 50 + _get(Sudoku.prototype.__proto__ || Object.getPrototypeOf(Sudoku.prototype), "easeOut", this).call(this, this._jumpingTime, 0, this._jumpChange, this._jumpTotalTime));
        }
    }, {
        key: "render",
        value: function render(canvas, context) {
            var _this7 = this;

            this._canvasStyle = canvas.getAttribute('style');
            this.drawSudoku(context);

            ['mousedown', 'touchstart'].forEach(function (event) {
                canvas.addEventListener(event, function (e) {
                    var loc = _get(Sudoku.prototype.__proto__ || Object.getPrototypeOf(Sudoku.prototype), "windowToCanvas", _this7).call(_this7, canvas, e);

                    _this7.createButtonPath(context);

                    if (context.isPointInPath(loc.x, loc.y) && !_this7.isAnimate) {
                        _this7._jumpingTime = 0;
                        _this7._jumpTotalTime = Math.random() * 1000 + _this7.duration;
                        _this7._jumpChange = Math.random() * 3 + _this7.velocity;
                        _this7.animate(context);
                    }
                });
            });

            canvas.addEventListener('mousemove', function (e) {
                var loc2 = _get(Sudoku.prototype.__proto__ || Object.getPrototypeOf(Sudoku.prototype), "windowToCanvas", _this7).call(_this7, canvas, e);
                _this7.createButtonPath(context);

                if (context.isPointInPath(loc2.x, loc2.y)) {
                    canvas.setAttribute('style', "cursor: pointer;" + _this7._canvasStyle);
                } else {
                    canvas.setAttribute('style', _this7._canvasStyle);
                }
            });
        }
    }]);

    return Sudoku;
}(Global);
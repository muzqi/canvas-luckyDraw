## 引入：
> [下载](https://github.com/Musiky/canvas-luckyDraw/blob/master/src/dist/luckyDraw.min.js) `luckyDraw.min.js` 并引入。不依赖任何第三方库

``` html
<script src="./src/dist/luckyDraw.min.js"></script>
```

## 使用：

### 九宫格抽奖

[查看演示效果](https://musiky.github.io/canvas-luckyDraw/sudoku.html)

**最简单的使用：**
``` html
<body>
     <canvas id="canvas" width="500px" height="500px"></canvas>
</body>
<script src="./src/dist/luckyDraw.min.js"></script>
<script>
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    new Sudoku({
        sudokuSize: canvas.width,
        awardsRowLen: 3,

        awards: [
            '30元话费', 'iphone8', '未中奖', 
            'Macbook pro', '洗衣粉一袋', '火星一日游',
            'img-http://tse2.mm.bing.net/th?id=OIP.lnWeNzoVmFXNZXe4bXh7lQDHEs&w=193&h=291&c=7&qlt=90&o=4&dpr=2&pid=1.7'
        ],
        
        finish: function (index) {
            alert('🎉恭喜您中得：' + this.awards[index])
        }

    }).render(canvas, context);
</script>
```

<br>

**可配置参数：**
``` javascript
new Sudoku({
    sudokusize: canvas.width,                   // 必选，九宫格的尺寸，一般为 canvas 的尺寸
    awardsRowLen: 3,                            // 必选，每行每列显示奖项数量
    awards: [                                   // 必选，奖品，若要显示图片，则以 'img-imageurl' 格式输入
        '30元话费', 'img-imageurl', ...
    ],

    sudokuItemRadius: 8,                        // 可选，奖项小方块的圆角大小
    sudokuItemUnactiveColor: 'red',             // 可选，奖项方块的颜色
    sudokuItemUnactiveTxtColor: 'white',        // 可选，奖项方块文字的颜色
    sudokuItemUnactiveShadowColor: 'black'      // 可选，奖项方块阴影的颜色

    sudokuItemActiveColor: 'yellow',            // 可选，跳动方块的颜色
    sudokuItemActiveTxtColor: 'black',          // 可选，跳动方块文字的颜色
    sudokuItemActiveShadowColor: 'black'        // 可选，跳动方块阴影的颜色

    buttonColor: 'rgb(2, 168, 2)',              // 可选，按钮的颜色
    buttonTxtColor: '#333',                     // 可选，按钮文字的颜色
    buttonShadowColor: 'blue',                  // 可选，按钮阴影的颜色

    duration: 4000,                             // 可选，默认4000；动画时长
    velocity: 300,                              // 可选，默认300；动画速率变化值（峰值）

    finish: function (index) {                  // 可选，获取奖品信息后的回调，返回一个下标，根据该下标查找抽到什么奖品
        alert(this.awards[index])
    }
})
```

<br>

## 大转盘抽奖

[查看演示效果](https://musiky.github.io/canvas-luckyDraw/rouletteWheel.html)

**最简单的使用：**
``` html
<body>
    <canvas id="canvas" width="500" height="500">
        Canvas not supported
    </canvas>
</body>

<script src="./src/dist/luckyDraw.min.js"></script>
<script>
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    new RouletteWheel({
        centerX:       canvas.width / 2,
        centerY:       canvas.height / 2,
        outsideRadius: 200,

        awards: [
            'iphone 8', 'MacBook Pro',
            '20元停车券', '大保健', '10元话费',
            'los-未中奖', 'img-http://tse2.mm.bing.net/th?id=OIP.lnWeNzoVmFXNZXe4bXh7lQDHEs&w=193&h=291&c=7&qlt=90&o=4&dpr=2&pid=1.7'
        ],

        finish: function (index) {
            alert('🎉恭喜您中得：' + this.awards[index])
        }
        
    }).render(canvas, context);

</script>
```

<br>

**可配置参数：**
``` javascript
new RouletteWheel({
    centerX: canvas.width / 2,              // 必选，大转盘圆心x轴坐标，一般为画布宽度的一半
    centerY: canvas.height / 2,             // 必选，大转盘圆心y轴坐标，一般为画布高度的一半
    outsideRadius: 250,                     // 必选，大转盘的半径
    
    awards: [                               // 必选，大转盘的奖品项。
                                            // 如果为图片，以 'img-imageurl' 格式输入;
                                            // 如果为未中奖项，以 'los-text' 格式输入
        '话费30元', 'img-imageurl', 'los-text'
    ],
    
    evenColor: 'red',                       // 可选，大转盘第偶数个奖品盘颜色
    oddColor: 'yellow',                     // 可选，大转盘第奇数个奖品盘颜色
    loseColor: 'gray',                      // 可选，大转盘未中奖表盘颜色
    textColor: 'white',                     // 可选，大转盘奖品文字颜色
    
    arrowColorFrom: 'gray',                 // 可选，指针渐变色的第一个颜色
    arrowColorTo: 'darkgray',               // 可选，指针渐变色的第二个颜色
    
    buttonFont: '开始抽奖',                  // 可选，抽奖按钮的文字，默认为 ‘开始抽奖’
    buttonFontColor: 'grown',               // 可选，抽奖按钮文字的颜色
    buttonColorFrom: 'yellow',              // 可选，抽奖按钮渐变色的第一个颜色
    buttonColorTo: 'orange',                // 可选，抽奖按钮渐变色的第二个颜色
    
    startRadian: 0,                         // 可选，大转盘绘制的起始角度，默认0
    duration: 4000,                         // 可选，大转盘旋转的时间，默认 4000ms
    velocity: 10,                           // 可选，大转盘旋转的速率峰值，默认 10
    
    finish: function (index) {              // 可选，获取奖品信息后的回调，返回一个下标，根据该下标查找抽到什么奖品
        alert(awards[index])
    }
})
```

<br>

## 刮刮卡抽奖

[查看演示效果](https://musiky.github.io/canvas-luckyDraw/scratchCard.html)

**最简单的使用：**
``` html
<body>
    <canvas id="canvas" width="250" height="50">
        Canvas not supported
    </canvas>
</body>

<script src="./src/dist/luckyDraw.min.js"></script>
<script>
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    new ScratchCard({
        awardBackgroundImage: 'http://tse3.mm.bing.net/th?id=OIP.X7zblF16pKGur6refGZsWQEsDg&pid=15.1'
    }).render(canvas, context);
</script>
```

<br>

**可配置参数：**
``` javascript
new ScratchCard({
    awardBackgroundImage: 'https://imageurl',   // 必选，canvas 的背景图片，刮开涂层后的奖项

    style: 'margin-top: 100px',                 // 可选，控制 canvas 的样式
    eraserSize: 20,                             // 可选，默认 15；控制橡皮擦的半径大小
    coverColor: '#333',                         // 可选，默认 '#b5b5b5'；控制表面涂层的颜色
})
```


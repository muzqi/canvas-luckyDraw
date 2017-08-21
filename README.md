## 更新日志：
> v0.01

* 首次提交

<br>

> v0.02

* 大转盘与九宫格 `awards` 奖品数组结构，由字符串，修改为对象；该对象包含两个属性，`type` 和 `content`，使用 `type` 属性来决定奖项是否为文字，或者图片。更加灵活，并且清晰；

* 九宫格去除可配置属性 `awardsRowLen`，而是以 `awards` 属性的长度，来决定每行每列显示几个奖项；

* 文档变得更友好更易于阅读了。


<br>

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

        awards: [
            {type: 'text', content: '30元话费'},
            {type: 'text', content: 'iphone8'},
            {type: 'losing', content: '未中奖'},
            {type: 'text', content: 'MackBook Pro'},
            {type: 'image', content: 'https://img12.360buyimg.com/n7/jfs/t4807/209/1436278963/496606/8e486549/58f0884eNcec87657.jpg'},
            {type: 'losing', content: '未中奖'},
            {type: 'image', content: 'https://img11.360buyimg.com/n7/jfs/t3187/325/423764794/213696/f4eb1dbd/57b68142Nbe104228.jpg'},
            {type: 'text', content: '火星一日游'}
        ],
        
        finish: function (index) {
            switch(this.awards[index].type) {
                case 'text':
                    alert('🎉恭喜您中得：' + this.awards[index].content);
                    break;
                case 'image':
                    if (index === 4)      alert('🎉恭喜您中得战争磨坊水冷机');
                    else if (index === 6) alert('🎉恭喜您中得魔声耳机');
                    break;
                case 'losing':
                    alert('💔很遗憾，您没有中奖~');
                    break;
            }
        }

    }).render(canvas, context);
</script>
```

<br>

**可配置参数：**

| 属性 | 是否必选 | 类型 | 备注 | 默认值 |
| :-- | :--: | :-- | :-- | :--: |
| sudokusize | 是 | *Number* | 九宫格的尺寸，一般为 canvas 的尺寸 | ø |
| awards     | 是 | *Object* | 奖品信息，每组对象代表一个奖项，对象中有两个属性，type 和 content；<br>type 有三个可能的值：<br><br>`text：`将 content 中的值输出为普通文本；<br> `losing：`将 content 中的值输出普通文本，状态为未中奖；<br>`image：`将 content 中的图片地址渲染为图片。 | ø |
| sudokuItemRadius | 否 | *Number* | 奖项小方块的圆角大小 | 8 |
| sudokuItemUnactiveColor | 否 | *String* | 奖项方块的颜色 | rgb(255, 235, 236) |
| sudokuItemUnactiveTxtColor | 否 | *String* | 奖项方块文字的颜色 | rgb(48, 44, 43) |
| sudokuItemUnactiveShadowColor | 否 | *String* | 奖项方块阴影的颜色 | rgb(255, 193, 200) |
| sudokuItemActiveColor | 否 | *String* | 跳动方块的颜色 | rgb(254, 150, 51) |
| sudokuItemActiveTxtColor | 否 | *String* | 跳动方块文字的颜色 | rgb(255, 255, 255) |
| sudokuItemActiveShadowColor | 否 | *String* | 跳动方块阴影的颜色 | rgb(255, 193, 200) |
| buttonColor | 否 | *String* | 按钮的颜色 | rgb(255, 216, 1) |
| buttonTxtColor | 否 | *String* | 按钮文字的颜色 | rgb(172, 97, 1) |
| buttonShadowColor | 否 | *String* | 按钮阴影的颜色 | rgb(253, 177, 1) |
| duration | 否 | *Number* | 动画时长 | 4000 |
| velocity | 否 | *Number* | 动画速率变化值（峰值） | 300 |
| finish | 否 | *Callback* | 获取奖品信息后的回调，返回一个下标，根据该下标查找抽到什么奖品 | ø


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
            {type: 'text', content: 'iphone8'},
            {type: 'text', content: '大保健'},
            {type: 'text', content: '10元话费'},
            {type: 'image', content: 'https://img12.360buyimg.com/n7/jfs/t4807/209/1436278963/496606/8e486549/58f0884eNcec87657.jpg'},
            {type: 'losing', content: '未中奖'}
        ],

        finish: function (index) {
            switch(this.awards[index].type) {
                case 'text':
                    alert('🎉恭喜您中得：' + this.awards[index].content);
                    break;
                case 'image':
                    alert('🎉恭喜您中得：战争磨坊水冷机箱');
                    break;
                case 'losing':
                    alert('💔很遗憾，您没有中奖~');
                    break;
            }
        }
        
    }).render(canvas, context);

</script>
```

<br>

**可配置参数：**

| 属性 | 是否必选 | 类型 | 备注 | 默认值 |
| :-- | :--: | :-- | :-- | :--: |
| centerX | 是 | *Number* | 大转盘圆心x轴坐标，一般为画布宽度的一半 | ø |
| centerY | 是 | *Number* | 大转盘圆心y轴坐标，一般为画布高度的一半 | ø |
| outsideRadius | 是 | *Number* | 大转盘的半径，这个值乘以二不能大于 canvas 画布的宽或者高哟！ | ø |
| awards | 是 | *Object* | 奖品信息，每组对象代表一个奖项，对象中有两个属性，type 和 content；<br>type 有三个可能的值：<br><br>`text：`将 content 中的值输出为普通文本；<br> `losing：`将 content 中的值输出普通文本，状态为未中奖；<br>`image：`将 content 中的图片地址渲染为图片。| ø |
| evenColor | 否 | *String* | 大转盘第偶数个奖品盘颜色 | #FF6766 |
| oddColor | 否 | *String* | 大转盘第奇数个奖品盘颜色 | #FD5757 |
| loseColor | 否 | *String* | 大转盘未中奖表盘颜色 | #F79494 |
| textColor | 否 | *String* | 大转盘奖品文字颜色 | White |
| arrowColorFrom | 否 | *String* | 指针渐变色的第一个颜色 | #FFFC95 |
| arrowColorTo | 否 | *String* | 指针渐变色的第二个颜色 | #FF9D37 |
| buttonFont | 否 | *String* | 抽奖按钮的文字 | 开始抽奖 |
| buttonFontColor | 否 | *String* | 抽奖按钮文字的颜色 | #88411F |
| buttonColorFrom | 否 | *String* | 抽奖按钮渐变色的第一个颜色 | #FDC964 |
| buttonColorTo | 否 | *String* | 抽奖按钮渐变色的第二个颜色 | #FFCB65 |
| startRadian | 否 | *Number* | 大转盘绘制的起始角度 | 0 |
| duration | 否 | *Number* | 大转盘旋转的时间 | 4000 |
| velocity | 否 | *Number* | 大转盘旋转的速率峰值 | 10 |
| finish | 否 | *Callback* | 获取奖品信息后的回调，返回一个下标，根据该下标查找抽到什么奖品 | ø |

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

| 属性 | 是否必选 | 类型 | 备注 | 默认值 |
| :-- | :--: | :-- | :-- | :--: |
| awardBackgroundImage | 是 | *String* | canvas 的背景图片，刮开涂层后的奖项 | ø |
| style | 否 | *String* | 控制 canvas 的样式 | ø |
| eraserSize | 否 | *String* | 控制橡皮擦的半径大小，单位 px | 15 |
| coverColor | 否 | *String* | 控制表面涂层的颜色 | #B5B5B5 |
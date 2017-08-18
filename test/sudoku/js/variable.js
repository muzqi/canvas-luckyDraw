let canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    AWARDS_ROW_LEN = 3,                        // 单行单列的矩形的数量
    AWARDS_TOP_DRAW_LEN = AWARDS_ROW_LEN - 1,  // 矩形一共有4个顶点，每个顶点会向后绘制矩形，直到碰到下一个顶点为止，
                                               // 该变量是每个顶点绘制的方块个数，包括该处在该顶点的方块
    AWARDS_LEN = AWARDS_TOP_DRAW_LEN * 4,      // 奖品的总数，从 1 开始

    // ----- 九宫格四个角的序号
    LETF_TOP_POINT =     0,
    RIGHT_TOP_POINT =    AWARDS_TOP_DRAW_LEN,
    RIGHT_BOTTOM_POINT = AWARDS_TOP_DRAW_LEN * 2,
    LEFT_BOTTOM_POINT =  AWARDS_TOP_DRAW_LEN * 2 + AWARDS_TOP_DRAW_LEN,
    // -----

    SUDOKU_SIZE = context.canvas.width,                                      // 整个九宫格的尺寸
    SUDOKU_ITEM_MARGIN = (SUDOKU_SIZE / AWARDS_ROW_LEN) / 6,                 // 每个方块之间的间距
    SUDOKU_ITEM_SIZE = (SUDOKU_SIZE / AWARDS_ROW_LEN) - SUDOKU_ITEM_MARGIN,  // 每个方块的尺寸
    SUDOKU_ITEM_TXT_SIZE = `bold ${SUDOKU_ITEM_SIZE * .12}px Helvetica`,     // 方块内的字体大小
    SUDOKU_ITEM_RADIUS = 8,                                                  // 方块圆角的弧度
    SUDOKU_ITEM_UNACTIVE_COLOR =     'rgb(255, 235, 236)',
    SUDOKU_ITEM_UNACTIVE_TXT_COLOR = 'rgb(48, 44, 43)',
    SUDOKU_ITEM_ACTIVE_COLOR =       'rgb(254, 150, 51)',
    SUDOKU_ITEM_ACTIVE_TXT_COLOR =   'rgb(255, 255, 255)',
    SUDOKU_ITEM_SHADOW_COLOR =       'rgb(255, 193, 200)',

    BUTTON_SIZE =         SUDOKU_SIZE - (SUDOKU_ITEM_SIZE * 2 + SUDOKU_ITEM_MARGIN * 3),
    BUTTON_TXT_SIZE =     `bold ${BUTTON_SIZE * .12}px Helvetica`,
    BUTTON_TXT_COLOR =    'rgb(172, 97, 1)',
    BUTTON_COLOR =        'rgb(255, 216, 1)',
    BUTTON_SHADOW_COLOR = 'rgb(253, 177, 1)',

    button_position,    // 按钮方块的坐标位置
    positions = [],     // 记录了所有奖品方块的位置坐标的数组

    jump_index = Math.floor(Math.random() * AWARDS_LEN),  // 抽奖轮跳时的序号，第一次点击产生一个随机数，第二次点击则从当前选中序号开始
    jumping_time,                                         // 正在轮跳的时间
    jumping_total_time,                                   // 轮跳的时间总量，基于 duration 变量加上一个 0~1000 之间的随机数组成
    jumping_change,                                       // 轮跳速率峰值，基于 velocity 变量加上一个 0~3 之间的随机数组成

    is_animate = false,    // 动画是否在播放状态
    duration = 4000,
    velocity = 300,
    
    awards = [             // 奖品信息
        '30元话费', 'iphone8', '未中奖', 
        'Macbook pro', 'img-http://tse4.mm.bing.net/th?id=OIP.5Oa_ZZeDMu0JOFKu-5NDGADIEs&w=137&h=201&c=7&qlt=90&o=4&dpr=2&pid=1.7', '火星一日游', 
        '未中奖', 'img-http://tse2.mm.bing.net/th?id=OIP.lnWeNzoVmFXNZXe4bXh7lQDHEs&w=193&h=291&c=7&qlt=90&o=4&dpr=2&pid=1.7'
    ];
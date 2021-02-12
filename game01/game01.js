//メモ 横幅を8段階にしてその八段階の値を100倍にして800pxに合わせる
(()=>{
    //windowの処理が終えたときに呼び出される
    window.addEventListener("load",()=>{
        initialize();
        render();
    },false)

    const initialize = () =>{
        $canvas = document.getElementById("canvas");
        ctx = $canvas.getContext("2d");
        console.log("canvas x:",$canvas.width," y:",$canvas.height)
    };

    const render = ()=>{
        CREATE_CANVAS();
        DRAW_LINE(20,$canvas.height/2,$canvas.width-20,$canvas.height/2,4,"#666")
    };

    //グレーの線のやや内側を白塗りする
    //@param {string} [color = rgb(255,255,255)] 色の指定
    const CREATE_CANVAS = (color= "rgb(255,255,255)")=>{
        ctx.fillStyle = color
        ctx.fillRect(0,0,800,600)
    };

    /*線を描画する
    * @param {number} x1,y1 - 始点
    * @param {number} x2,y2 - 終点
    * @param {number} [width = 1] - 幅
    * @param {string} [color = #000] - 色
    */
    const DRAW_LINE = (x1,y1,x2,y2,width = 1,color="#000")=>{
        ctx.fillStyle = (color);
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.closePath();
        ctx.stroke();
    }
})();
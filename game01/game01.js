let canvas,width,height,ctx,player;
let count = 0;
let jump_ste = false;
let flag = {"canv":false,"start":false,"lv1s":false}
let start_count;
let game = true;
let map = [];

let death = 0

//fps 決定部分
let fps_in = 30;
const fps_req = ()=>{
    var result = prompt('fps値(1秒に更新される画面回数)を入力して下さい (推奨30)');
    if( isFinite(result)) {
        var result_ys = confirm("fps値："+result+"でよろしいですか？");
        if(result_ys) {
        fps_in = result;
        }
        else {
        fps_req();
        }
    }
    else {
        alert("数字を入力して下さい")
        fps_req();
    }
}
// fps_req();

//fps表示変更
const inf = document.getElementById("information");
inf.innerHTML = "fps:"+fps_in+" death:"+death;
//fpsによるゲームの速度調整(30を基本とした設定)
let fps_speed = 30 / fps_in


on_lode = ()=>{
    canvas = document.getElementById("canvas");
    width = canvas.width
    height = canvas.height
    if (canvas.getContext){
        flag.canv = true;
        ctx = canvas.getContext('2d');
        load(ctx); //初期画面表示
    }
};


//初期画面
const load = (ctx)=>{
    inf.innerHTML = "fps:"+fps_in+" death:"+death;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.textAlign= "center";
    ctx.font = "48px serif";
    ctx.fillStyle = "#000";
    ctx.fillText("Pencil Run",width*1/2,height/3);
    ctx.fillStyle = "#666";
    ctx.strokeStyle = "#666";
    ctx.fillRect(0, height/2, width, height/2);
    ctx.fillStyle = "#fff";
    ctx.fillText("left click",width*1/4,height * 2/3 +28);
    ctx.fillText("or"        ,width*1/2,height * 2/3 +28);
    ctx.fillText("space"     ,width*3/4,height * 2/3 +28);
    ctx.strokeStyle = "#fff";
    roundedRect(ctx,width * 1/4 -150,height * 2/3 -20,300,60,5);
    roundedRect(ctx,width * 3/4 -150,height * 2/3 -20,300,60,5);
}

//アニメーション呼び出し部分
const tick = ()=>{
    if(game){
        if(flag.canv){
            if(flag.start == true){//タイトルからゲーム画面への画面遷移
                movestart()
            }
            if(flag.start=="end"){
                lv1();
            }
        count++;
        }
    }
}


//アニメーション：初期画面から画面遷移画面・ゲーム画面へ
const movestart = () => {
    if(!start_count)start_count = count;
    var step_count = count-start_count;
    step_count = step_count * fps_speed;
    if(step_count<200){
        //テキスト等を左に
        ctx.fillStyle = "#666";
        ctx.strokeStyle = "#666";
        ctx.fillRect(0, height/2, width, height/2);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height/2);


        ctx.fillStyle = "#000";
        ctx.fillText("Pencil Run",width*1/2 - step_count*5,height/3);
        ctx.fillStyle = "#fff";
        ctx.fillText("left click",width*1/4 - step_count*5,height * 2/3 +28);
        ctx.fillText("or"        ,width*1/2 - step_count*5,height * 2/3 +28);
        ctx.fillText("space"     ,width*3/4 - step_count*5,height * 2/3 +28);
        ctx.strokeStyle = "#fff";
        roundedRect(ctx,width * 1/4 -150 - step_count*5,height * 2/3 -20,300,60,5);
        roundedRect(ctx,width * 3/4 -150 - step_count*5,height * 2/3 -20,300,60,5);
    }else{
        //地面を下げる
        //地面が低くなりすぎないように
        if(height/2 + (step_count-200)*2>500){
            flag.start = "end"
        }
        ctx.fillStyle = "#666";
        ctx.fillRect(0, height/2 + (step_count-200)*2, width, height/2);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, height/2 , width, (step_count-200)*2);
    }
}

//アニメーション：レベル1
const lv1 =()=>{
    //配置物を消す
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    //初回のみ
    if(!flag.lv1s){
        flag.lv1s = true;
        player = new Player();
    }
    //床生成
    map.push(new Block(0,width+100,500))
    //ブロック生成乱数
    if(count % 30 == 0){
        rand = Math.floor((Math.random()*6))
        if(rand == 0 || rand == 1){
            map.push(new Block(width,width+300,400))
        }else if(rand ==2){
            map.push(new Block(width,width+300,300))
        }
    };
    //床生成、移動、削除処理
    relist = [];
    map.forEach((cv)=>{
        if(cv.move()==0){
            relist.push(cv);
        }
        cv.show();
    });
    map = relist;

    //player処理
    player.colide(map,"map_block");//衝突判定及びゲーム終了判定
    player.show();
}





class Block{
    constructor(x,x2,y){
        this.x = x;
        this.x2 = x2;
        this.width = x2-x
        this.y = y;
        this.height = 100;
    }
    move(){
        this.x = this.x - fps_speed*8
        this.x2 = this.x2 - fps_speed*8
        if(this.x2 <0){
            return 1;
        }else{
            return 0;
        }
    }
    show(){
        ctx.fillStyle = "#666";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    colide(){
        return [this.x ,this.y,this.x + this.width, this.y + this.height]
    }
}


class Player{
    constructor(){
        this.x = 100;
        this.y = 500;
        this.jump_num = false;
        this.jump_speed = fps_speed*15;
        this.fall_speed = fps_speed*15;
        this.max_jump = 270;
        this.situation = "none";
        this.ongrand = true;
        this.before_jump = false;
        this.jump_fre = 0
    }
    // jumpcall(){
    //     if(this.jump_num==false && this.ongrand){
    //         this.jump_num = this.max_jump;
    //     }
    // }
    jump(){
        //ジャンプ処理
        if(jump_ste){
            if(this.jump_fre<=18 && !this.before_jump){
                this.y -= this.jump_speed;
                this.jump_fre ++;
            }else if(this.jump_fre>=36){
                this.jump_fre = 0
            }else{
                this.jump_fre ++;
                this.before_jump = true;
            }
        }else if(this.ongrand){
            this.jump_fre = 0;
        }else{
            this.before_jump = true;
        }
    }
    show(){
        this.jump();
        //着地処理
        if(!this.ongrand){
            if(!jump_ste || this.before_jump){
                this.y += this.fall_speed;
            }
        }
        //描画
        ctx.fillStyle = "#f00";
        ctx.fillRect(this.x, this.y - 40, 20, 20);
    }
    colide(list,things){
        var _inside = false;
        var _ongrand = false;
        list.forEach((cv)=>{
            var co;
            co = cv.colide()
            if(co[0]<this.x && this.x <co[2]){
                if(co[1]<this.y-40 && this.y-40<co[3]){
                    this.situation = "inside"
                    _inside = true;
                }
                if(things == "map_block"){
                    if(co[1]<this.y && this.y<co[3]){
                        this.ongrand = true;
                        _ongrand = true;
                    }
            }}
        });
        if(!_ongrand){
            this.ongrand = false
        }else{
            this.before_jump = false;
            this.jump_fre = 0
        };
        if(!_inside){
            this.situation = "non"
        };
        if(_inside == true)this.situation = "inside";
        console.log(this.situation,this.ongrand)
        if(this.situation == "inside"){
            game = false;
            fin("ブロックと衝突");
        }
    }
}

//線を引く
const line_make = (ctx,start_x , start_y,end_x,end_y)=>{
    ctx.lineWidth = "10px";
    ctx.beginPath();
    ctx.moveTo(start_x,start_y);
    ctx.lineTo(end_x,end_y);
    ctx.stroke();
}
//囲い作成
const roundedRect= (ctx, x, y, width, height, radius)=>{
    ctx.lineWidth = "10px";
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.stroke();
}

//終了処理
const fin = (mes)=>{
    game = false;
    alert(mes+"したため死亡した")
    // location.reload();
    death++;
    count = 0;
    flag = {"canv":true,"start":false,"lv1s":false}
    start_count = undefined;
    game = true;
    map = [];
    setTimeout(()=>{load(ctx)},500);
}

//ジャンプ取得
window.addEventListener("mousedown",function(){
    if(flag.lv1s){
        jump_ste = true;
    };
    if(!flag.start){
        movestart();
        flag.start = true;
    }
});

window.addEventListener('keydown',
    (event) => {
    if (event.key === ' ') {
        if(flag.lv1s){
            jump_ste = true;
        };
        if(!flag.start){
            movestart();
            flag.start = true;
        }
    };
});
window.addEventListener("mouseup",function(){
    jump_ste = false;
});
window.addEventListener('keyup',
    (event) => {
    if (event.key === ' ') {
        jump_ste = false;
    };
});

window.onload = on_lode
setInterval("tick()",1000/fps_in); //アニメーション呼び出し

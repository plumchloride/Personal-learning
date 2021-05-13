let canvas,width,height,ctx;
let count = 0;
let flag = {"canv":false,"start":false}
let start_count;

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
inf.innerHTML = "fps:"+fps_in;
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
  if(flag.canv){
    if(flag.start == true){
      movestart()
    }
    count++;
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

//ジャンプ
const jump=()=>{
  ;
};
//ジャンプ取得
window.addEventListener("mousedown",function(){
  jump();
  if(!flag.start){
    movestart();
    flag.start = true;
  }
});

window.addEventListener('keydown',
  (event) => {
    if (event.key === ' ') {
      jump();
      if(!flag.start){
        movestart();
        flag.start = true;
      }
    };
});

window.onload = on_lode
setInterval("tick()",1000/fps_in); //アニメーション呼び出し

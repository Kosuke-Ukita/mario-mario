
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

let can = document.getElementById("can");
let con = can.getContext("2d");

vcan.width  = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

can.width  = SCREEN_SIZE_W * 3;
can.height = SCREEN_SIZE_H * 3;

//見やすくなる
con.mozimageSmoothingEnabled    = false;
con.imageSmoothingEnabled       = false;
con.webkitimageSmoothingEnabled = false;
con.msimageSmoothingEnabled     = false;

//フレームレート維持
let frameCount = 0;
let startTime;

let chImg = new Image();
chImg.src = "./assets/sprite.png";
//chImg.onload = draw;

//おじさん情報　//座標
let ojisan = new Ojisan(100,100);
//フィールド情報
let field = new Field();
//ブロックのオブジェクト
let block = [];

//敵のオブジェクト
let enemy1 = new Enemy(400,150,96,false);
let enemy2 = new Enemy(1800,150,162,true);
let enemy3 = new Enemy(2100,150,96,false);
let enemy4 = new Enemy(2116,150,96,false);
let enemy5 = new Enemy(2600,150,96,false);

//更新処理
function update()
{
    //マップの更新
    field.update();

    //スプライトのブロックを更新
    for(let i = block.length - 1;i >= 0;i--)
    {
        block[i].update();
        if(block[i].kill)block.splice(i,1);
    }

    //おじさんの更新
    ojisan.update();

    enemy1.update();
    enemy2.update();
    enemy3.update();
    enemy4.update();
    enemy5.update();
}

//スプライトの描画
function drawSprite(snum, x, y, heigher=true)
{
    let sx = (snum & 15) * 16;
    let sy = (snum >> 4) * 16;

    if( heigher ) { vcon.drawImage(chImg, sx,sy,16,32, x,y,16,32);
    } else { vcon.drawImage(chImg, sx,sy,16,16, x,y,16,16); }
}

//描画処理
//描画処理
function draw()
{
    //背景
    vcon.fillStyle = "#66AAFF";
    // 修正前: vcon.fillRect(0,64,SCREEN_SIZE_W,SCREEN_SIZE_H);
    // 修正後: Y座標を0にします
    vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H);

    //マップ
    field.draw();

    //スプライトのブロックを表示
    for(let i = 0;i < block.length;i++)
    {
        block[i].draw();
    }

    //おじさん
    ojisan.draw();

    enemy1.draw();
    enemy2.draw();
    enemy3.draw();
    enemy4.draw();
    enemy5.draw();

    //デバッグ情報
    //vcon.font = "20px 'MSゴッシク'";
    //vcon.fillStyle = "#FFFFFF";
    //vcon.fillText("frame:" + frameCount,10,20);
    
    //コメント
    
    //move : → キー  or  ← キー　　junp : xキー  
    
    //仮想画面から実画面へ拡大転送
    // 修正前: con.drawImage(vcan, 0,64,SCREEN_SIZE_W,SCREEN_SIZE_H, 0,64,SCREEN_SIZE_W * 3,SCREEN_SIZE_H * 3);
    // 修正後: 転送元のY座標(第2引数)と，転送先のY座標(第6引数)を0にします
    con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H,
         0, 0, SCREEN_SIZE_W * 3, SCREEN_SIZE_H * 3);
}

//setInterval(mainLoop, 1000/60);

//ループ開始
window.onload = function()
{
    startTime = performance.now();
    mainLoop();
}

//メインループ
function mainLoop()
{
    let nowTime  = performance.now();
    let nowFrame = (nowTime - startTime) / GAME_FPS;

    if(nowFrame > frameCount)
    {
        let c = 0;

        while(nowFrame > frameCount)
        {
            frameCount++;

            //更新
            update();

            if(++c >= 4)
            {
                break;
            }
        }
        //描画
        draw();
    }
    requestAnimationFrame(mainLoop);
}
//キーボード情報
let keyb = {};

//キーボードが押された時に呼ばれる
document.onkeydown = function(e)
{
    if(e.keyCode == 37 || e.keyCode == 65) keyb.Left  = true;
    if(e.keyCode == 39 || e.keyCode == 68) keyb.Right = true;
    if(e.keyCode == 32) keyb.ABUTTON = true; //space
    if(e.keyCode == 17) keyb.BBUTTON = true; //ctrl
    

    //if(e.keyCode == 65) block.push(new Block(368,5,5));

    //if(e.keyCode == 65) field.scx--;//a
    //if(e.keyCode == 83) field.scx++;//s
}
//キーボードが離された時に呼ばれる
document.onkeyup = function(e)
{
    if(e.keyCode == 37 || e.keyCode == 65) keyb.Left  = false;
    if(e.keyCode == 39 || e.keyCode == 68) keyb.Right = false;
    if(e.keyCode == 32) keyb.ABUTTON = false; //space
    if(e.keyCode == 17) keyb.BBUTTON = false; //ctrl
    
}


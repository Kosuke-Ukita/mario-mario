//
//おじさんクラス
//

const ANIME_STAND = 1;
const ANIME_WALK  = 2;
const ANIME_BRAKE = 4;
const ANIME_JUMP  = 8;
const GRVITY      = 4;
const MAX_SPEED   = 32;

class Ojisan
{
    constructor(x,y)
    {
        this.x         = x << 4;
        this.y         = y << 4;
        this.vx        = 0;
        this.vy        = 0;
        this.anime     = 0;
        this.sprite    = 0;
        this.acount    = 0;
        this.direction = 0;
        this.jump      = 0;
    }

    //床の判定
    checkFloor()
    {
        if(this.vy <= 0) return;

        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        if(field.isBlock(lx + 1,ly + 31) || (field.isBlock(lx + 14,ly + 31)))
        {
            if(this.anime == ANIME_JUMP) this.anime = ANIME_WALK;
            this.jump = 0;
            this.vy = 0;
            this.y = ((((ly + 31) >> 4) << 4) - 32) << 4;
        }
    }

    //横の壁の判定
    checkWall()
    {
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);
        
        //右側のチェック
        if(field.isBlock(lx + 15,ly +  9) || 
           field.isBlock(lx + 15,ly + 15) ||
           field.isBlock(lx + 15,ly + 23))
        {
            this.vx = 0;
            this.x -= 8;
        }
        //左側のチェック
        else
            if(field.isBlock(lx,ly +  9) || 
               field.isBlock(lx,ly + 15) ||
               field.isBlock(lx,ly + 23))
        {
            this.vx = 0;
            this.x += 8;
        }
    }

    //天井の判定
    checkCeil()
    {
        if(this.vy >= 0) return;

        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        let bl;
        if(bl = field.isBlock(lx + 8,ly + 5))
        {
            this.jump = 15;
            this.vy = 0;

            block.push(new Block(bl,lx + 8 >> 4,ly + 5 >> 4,0,20,-60));
        }
    }

    //ジャンプ処理
    upsateJump()
    {
        
        //ジャンプ
        if(keyb.ABUTTON)
        {
            if(this.jump == 0)
            {
                this.anime = ANIME_JUMP;
                this.jump = 1;
            }
            if(this.jump < 15) this.vy = -(64 - this.jump);
        }
        if(this.jump) this.jump++;

    }

    //横方向の移動
    updateWalkSub(direction)
    {

        //最高速まで加速
        if(direction == 0 && this.vx <  MAX_SPEED) this.vx++; //右
        if(direction == 1 && this.vx > -MAX_SPEED) this.vx--; //左

        //ジャンプをしていない時
        if(!this.jump)
        {
            
            if(this.anime == ANIME_STAND) this.acount = 0;//立ちポーズの時カウンタリセット
            this.anime = ANIME_WALK;                      //歩く
            this.direction = direction;                   //方向転換
            
            //逆方向のときはブレーキ
            if(direction == 0 && this.vx < 0) this.vx++;   //右
            if(direction == 1 && this.vx > 0) this.vx--;   //左
            //逆に強い加速のときブレーキアニメ
            if(direction == 1 && this.vx > 8 || direction == 0 && this.vx < -8)this.anime = ANIME_BRAKE;

        }

        
        
    }

    //歩く処理
    updateWalk()
    {
        //横移動
        if(keyb.Left)
        {
            this.updateWalkSub(1);
        }
        else if(keyb.Right)
        {
            this.updateWalkSub(0);
        }
        else
        {
            if(!this.jump)
            {
                if(this.vx > 0) this.vx -= 1;
                if(this.vx < 0) this.vx += 1;
                if(!this.vx)  this.anime = ANIME_STAND;
            }
        }
    }

    //スプライト処理
    updateAnime()
    {
        //スプライトの決定
        switch(this.anime)
        {
            case ANIME_STAND:
                this.sprite = 0;
                break;
            case ANIME_WALK:
                this.sprite = 2 + ((this.acount/6) % 3);
                break;
            case ANIME_JUMP:
                this.sprite = 6;
                break;
            case ANIME_BRAKE:
                this.sprite = 5;
                break;
                
                        
        }

        //左向きの時+48する
        if(this.direction) this.sprite += 48;
    }

    //毎フレームごとの更新処理
    update()
    {
        //アニメ用のカウンタ
        this.acount++;
        if(Math.abs(this.vx) == MAX_SPEED) this.acount++;

        this.upsateJump();
        this.updateWalk();
        this.updateAnime();

        //重力
        if(this.vy < 4 << 4) this.vy += GRVITY;

        //横の壁のチェック
        this.checkWall();

        //床のチェック
        this.checkFloor();

        //天井のチェック
        this.checkCeil();

        //実際に座標を変換
        this.x += this.vx;
        this.y += this.vy;
        
        
        /*
        //床にぶつかる
        if(this.y > 160 << 4)
        {
            if(this.anime == ANIME_JUMP) this.anime = ANIME_WALK;
            this.jump = 0;
            this.vy = 0;
            this.y = 160 << 4;
        }
        */
    }

    //毎フレームごとの描画処理
    draw()
    {
        let px = (this.x >> 4) - field.scx;
        let py = (this.y >> 4) - field.scy;
        drawSprite(this.sprite, px, py);
    }
}










//
//敵クラス
//

class Enemy
{
    constructor(x, y, acount=96, heigher=false)
    {
        this.x = x << 4;
        this.y = y << 4;
        this.vx = -4;  // 左方向に移動
        this.vy = 0;
        this.type = 0;
        this.sprite = 0;
        this.acount = acount;
        this.stateacount = acount;
        this.active = true;
        this.heigher=heigher;
        this.width = 16;
        if (heigher) { this.height = 32;
        } else { this.height=16; }
    }

    // 床の判定
    checkFloor()
    {
        if(this.vy <= 0) return;

        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        if(field.isBlock(lx + 1, ly + this.height - 1) || field.isBlock(lx + this.width - 2, ly + this.height - 1))
        {
            this.vy = 0;
            this.y = ((((ly + this.height - 1) >> 4) << 4) - this.height) << 4;
        }
    }

    // 横の壁の判定
    checkWall()
    {
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);
        
        // 壁にぶつかったら方向転換
        if(field.isBlock(lx + this.width - 1, ly + 8) || field.isBlock(lx, ly + 8))
        {
            this.vx = -this.vx;
        }
    }

    // アニメーション更新
    updateAnime()
    {
        this.sprite = this.stateacount + ((this.acount / 16) % 2);
    }

    // 更新処理
    update()
    {
        if(!this.active) return;

        this.acount++;
        this.updateAnime();

        // 重力
        if(this.vy < 4 << 4) this.vy += GRVITY;

        // 壁のチェック
        this.checkWall();

        // 床のチェック
        this.checkFloor();

        // 座標を更新
        this.x += this.vx;
        this.y += this.vy;
    }

    // 描画処理
    draw()
    {
        if(!this.active) return;

        let px = (this.x >> 4) - field.scx;
        let py = (this.y >> 4) - field.scy;
        drawSprite(this.sprite, px, py, this.heigher);
    }
}
//
// 敵管理クラス
//

class EnemyManager
{
    constructor()
    {
        this.enemies = [];
    }

    // 敵を追加
    add(x, y, type = 0)
    {
        this.enemies.push(new Enemy(x, y, type));
    }

    // おじさんとの当たり判定
    checkCollisionWithOjisan(ojisan)
    {
        for(let i = 0; i < this.enemies.length; i++)
        {
            if(!this.enemies[i].active) continue;

            let ex = this.enemies[i].x >> 4;
            let ey = this.enemies[i].y >> 4;
            let ox = ojisan.x >> 4;
            let oy = ojisan.y >> 4;

            // 矩形の当たり判定
            if(ox + 15 > ex && ox < ex + 15 &&
               oy + 31 > ey && oy < ey + 15)
            {
                // おじさんが上から踏んだ場合
                if(ojisan.vy > 0 && oy + 24 < ey + 8)
                {
                    this.enemies[i].active = false;
                    ojisan.vy = -48; // 踏んだ時にジャンプ
                }
                else
                {
                    // ゲームオーバー処理などをここに追加
                    return true;
                }
            }
        }
        return false;
    }

    // ブロックとの当たり判定
    checkCollisionWithBlocks()
    {
        for(let i = 0; i < this.enemies.length; i++)
        {
            if(!this.enemies[i].active) continue;

            for(let j = 0; j < block.length; j++)
            {
                let ex = this.enemies[i].x >> 4;
                let ey = this.enemies[i].y >> 4;
                let bx = block[j].x;
                let by = block[j].y;

                // ブロックとの当たり判定
                if(ex + 15 > bx && ex < bx + 16 &&
                   ey + 15 > by && ey < by + 16)
                {
                    this.enemies[i].active = false;
                }
            }
        }
    }

    // 全ての敵を更新
    update()
    {
        for(let i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].update();
        }
    }

    // 全ての敵を描画
    draw()
    {
        for(let i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].draw();
        }
    }
}
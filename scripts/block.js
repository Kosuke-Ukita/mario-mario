//
//ブロックオブジェクトのクラス
//

class Block
{
    constructor(block, x, y, type, vx, vy)
    {
        if(type == undefined)type = 0;
        this,type  = type;
        if(vx == undefined)vx = 0;
        this,vx  = vx;
        if(vy == undefined)vy = 0;
        this,vy  = vy;

        this.block = block;
        this.ox = x;
        this.oy = y;
        this.x  = x << 8;
        this.y  = y << 8;

        this.kill  = false;
        this.count = 0;

        fieldDate[y * FIELD_SIZE_W + x] = 367;
    }

    //更新処理
    update()
    {
        if(this.kill)return;
        if(++this.count == 11 && this.type == 0)
        {
            this.kill = true;
            fieldDate[this.oy * FIELD_SIZE_W + this.ox] = this.block;
            return;
        }
        if(this.type == 0)return;
        
        if(this.vy < 64)this.vy += GRVITY;
        this.x += this.vx;
        this.y += this.vy;
    }

    //描画処理
    draw()
    {
        if(this.kill)return;

        let sx = (this.block & 15) << 4;
        let sy = (this.block >> 4) << 4;

        let px = (this.x >> 4) - (field.scx);
        let py = (this.y >> 4) - (field.scy);

        if(this.type == 0)
        {
            const anim = [0,2,4,5,6,5,4,2,0,-2,-1];
            py -= anim[this.count];
        }
        vcon.drawImage(chImg, sx,sy,16,16, px,py,16,16);
    }
}

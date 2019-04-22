import GameEventListener from "./GameEventListener";
import GameActor from "./GameActor";
import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameFlyObj extends GameEventListener {

    @property(cc.Sprite)
    spImage: cc.Sprite = null;

    @property([cc.SpriteFrame])
    sfFlys: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    sfElosions: cc.SpriteFrame[] = [];

    target: GameActor = null;

    trigger: GameActor = null;

    speed: number = 1000; //速度

    statusTime: number = 0; // 状态的时间

    statusType: GameFlyObjectStatus = GameFlyObjectStatus.None; //当前状态

    flyAnimTotalTime: number = 0.5; //0.5秒切换一次

    explotionAnimTotalTime: number = 0.5; //爆炸总时间

    onLoad(){
        super.onLoad();
    }

    startFly(target, trigger){
        this.target = target;
        this.trigger = trigger;
        this.statusType = GameFlyObjectStatus.Fly;
        this.statusTime = 0;
    }

    update(dt){
        super.update(dt);

        this.statusTime += dt;

        if(this.statusType == GameFlyObjectStatus.Fly){
            let percent = (this.statusTime / this.flyAnimTotalTime) % 1;
            Utils.preferAnimFrame(this.spImage, this.sfFlys, percent);
            
            let ad = this.node.position.sub(this.target.node.position);
            let moveDir = ad.normalize(); 
            let currentPos = this.node.position;
            let speed = this.speed;
            let radians = Math.atan2(moveDir.x, moveDir.y);
            let angle = cc.misc.radiansToDegrees(radians);
            this.node.rotation = angle;

            this.node.x = cc.misc.clampf(
                currentPos.x + moveDir.x * dt * speed, 
                Math.min(currentPos.x, this.target.node.x), 
                Math.max(currentPos.x, this.target.node.x)
            );
            this.node.y = cc.misc.clampf(
                currentPos.y + moveDir.y * dt * speed, 
                Math.min(currentPos.y, this.target.node.y), 
                Math.max(currentPos.y, this.target.node.y)
            );

            if(this.node.x == this.target.node.x && this.node.y == this.target.node.y){
                this.statusType = GameFlyObjectStatus.Explosion;
            }
        }

        if(this.statusType == GameFlyObjectStatus.Explosion){
            let percent = (this.statusTime / this.explotionAnimTotalTime) % 1;
            Utils.preferAnimFrame(this.spImage, this.sfElosions, percent);
            if(percent > 1){
                this.node.removeFromParent(true);
            }
        }
    }
    
}

export enum GameFlyObjectStatus{
    None,
    Fly,
    Explosion
}
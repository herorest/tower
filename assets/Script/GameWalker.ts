import GameActor from "./GameActor";
import {GameActorStatusBase, GameActorStatusType, GameActorStatusWalk} from './GameActorStatusMachine'
import { GameDirection } from "./Config";
import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameWalker extends GameActor {

    @property(cc.Sprite)
    spWalker: cc.Sprite = null;

    @property([cc.SpriteFrame])
    spWalkUp: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spWalkDown: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spWalkRight: cc.SpriteFrame[] = [];

    @property(Number)
    animWalkTotalTime: number = 1;
    
    @property(Number)
    speed: number = 20;

    onLoad(){
        super.onLoad();
    }

    getPaths(): cc.Vec2[]{
        let paths: cc.Vec2[] = [];

        paths.push(cc.v2(0,0));
        paths.push(cc.v2(50,50));
        paths.push(cc.v2(-100,30));
        paths.push(cc.v2(-10,-100));

        return paths;
    }

    //接收状态，转换精灵图
    preferStatus(status: GameActorStatusBase){
        if(status.status == GameActorStatusType.Walk){
            let walkStatus = status as GameActorStatusWalk;
            let percent = (walkStatus.statusTime / this.animWalkTotalTime) % 1;
            let spriteFrames: cc.SpriteFrame[];
            let scaleX = 1; //用right翻转做left

            if(walkStatus.dir === GameDirection.Up){
                spriteFrames = this.spWalkUp;
            }else if(walkStatus.dir === GameDirection.Down){
                spriteFrames = this.spWalkDown;
            }else if(walkStatus.dir === GameDirection.Left){
                spriteFrames = this.spWalkRight;
                scaleX = -1;
            }else{
                spriteFrames = this.spWalkRight;
            }

            Utils.preferAnimFrame(this.spWalker, spriteFrames, percent);
            this.spWalker.node.scaleX = scaleX;
        }
    }

    
}

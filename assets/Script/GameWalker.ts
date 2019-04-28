import GameActor from "./GameActor";
import {GameActorStatusBase, GameActorStatusType, GameActorStatusWalk, GameActorStatusDead} from './GameActorStatusMachine'
import { GameDirection } from "./Config";
import Utils from "./Utils";
import {GameEventType} from "./GameEventDefine";
import GameHpBar from "./GameHpBar";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameWalker extends GameActor {

    @property(cc.Prefab)
    prefabHpBar: cc.Prefab = null;

    @property(cc.Sprite)
    spWalker: cc.Sprite = null;

    @property([cc.SpriteFrame])
    spWalkUp: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spWalkDown: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spWalkRight: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spDead: cc.SpriteFrame[] = [];

    @property(Number)
    animWalkTotalTime: number = 1;

    @property(Number)
    animDeadTotalTime: number = 0.5;
    
    @property(Number)
    speed: number = 20;

    hpbar = null;

    onLoad(){
        super.onLoad();
        let hpbar = cc.instantiate(this.prefabHpBar);
        hpbar.parent = this.node;
        hpbar.y = 30;
        this.hpbar = hpbar.getComponent("GameHpBar") as GameHpBar;
        this.eventComponent.registEvent(GameEventType.Hit, this.onEventHit);
        this.currHealth = this.maxHealth;
    }

    onEventHit(e){
        if(e.beHitter === this){
            let power = e.hitter.power;
            this.currHealth -= power;
            this.hpbar.setHpPercent(this.currHealth / this.maxHealth);
        }
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
        }else if(status.status == GameActorStatusType.Dead){
            let deadStatus = status as GameActorStatusDead;
            let percent = Math.min(deadStatus.statusTime / this.animDeadTotalTime);
            let currentFrame = Utils.preferAnimFrame(this.spWalker, this.spDead, percent);
        }
    }
}
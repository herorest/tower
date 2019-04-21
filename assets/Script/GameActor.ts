import GameActorStatusMachine, {GameActorStatusBase, GameActorStatusAttack} from './GameActorStatusMachine'
import Utils from './Utils';
import { GameDirection } from './Config';
import Main from './main';
import GameEventListener from './GameEventListener';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameActor extends GameEventListener {

    machine: GameActorStatusMachine = null;

    // 攻击间隔时间
    attackCoolDownTime: number = 1;

    attackAnimTotalTime: number = 1;

    paths: cc.Vec2[];

    //发射子弹时的帧
    @property(Number) 
    attackKeyFrame: number = 7;

    // 默认攻击范围
    @property(Number) 
    attackRange: number = 200;

    onLoad(){
        super.onLoad();
        this.machine = new GameActorStatusMachine(this);
    }

    //接收状态，转换精灵图
    preferStatus(status: GameActorStatusBase){

    }

    getEnemysInRange(): GameActor[]{
        return Main.getInstance().enemys;
    }

    update(dt){
        this.machine.update(dt);
    }
   
    getEnemyDir(enemys: GameActor[]): GameDirection{
        let enemy = enemys[0];
        let ad = enemy.node.position.sub(this.node.position);
        return Utils.getDir(ad);
    }

    attack(){
        let attackStatus = this.machine.currentStatus as GameActorStatusAttack;
        attackStatus.isAttacked = true;
        console.log('attack');
    }

    //展示动画，根据百分比
    preferAnimFrame(sprite: cc.Sprite, frames: cc.SpriteFrame[], percent: number): SpriteFrame{
        sprite.spriteFrame = frames[Math.floor(frames.length * percent)];
        return sprite.spriteFrame;
    }
}

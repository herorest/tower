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

    // 攻击总时长
    attackAnimTotalTime: number = 1;

    // 路径点
    paths: cc.Vec2[];

    // 发射子弹时的帧
    @property(Number) 
    attackKeyFrame: number = 7;

    // 默认攻击范围
    @property(Number) 
    attackRange: number = 200;

    // 攻击力
    @property(Number) 
    power: number = 10;

    // 生命
    @property(Number) 
    maxHealth: number = 25;

    // 剩余生命
    currHealth: number;

    onLoad(){
        super.onLoad();

        //每个actor有自己的一个状态机
        this.machine = new GameActorStatusMachine(this);
    }

    //接收状态，转换精灵图
    preferStatus(status: GameActorStatusBase){

    }

    getEnemysInRange(): GameActor[]{
        let enemys = Main.getInstance().enemys;
        enemys = enemys.filter((i) => {
            return !i.isDead() && i.node.position.sub(this.node.position).mag() < this.attackRange
        });

        return enemys;
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

    isDead(){
        return this.currHealth <= 0;
    }

    
}

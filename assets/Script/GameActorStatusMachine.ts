import Utils from './Utils'
import { GameDirection } from './Config';
import GameActor from './GameActor';
import GameWalker from './GameWalker';
import {GameEventDead} from './GameEventDefine';
import GameEventDispatcher from './GameEventDispatcher';

export enum GameActorStatusType{
    None,
    Idle,   //空闲状态
    Walk,   //移动
    Attack, //攻击
    Dead     //死亡
}

export default class GameActorStatusMachine {
    currentStatus: GameActorStatusBase = null;
    actor: GameActor = null;

    constructor(actor: GameActor){
        this.actor = actor;
    }

    onStatusChange(status: GameActorStatusBase){
        if(this.currentStatus){
            this.currentStatus.onExitStatus();     
        }
        this.currentStatus = status;
        this.currentStatus.machine = this;
        this.currentStatus.onEnterStatus();
    }

    update(dt){
        if(this.currentStatus){
            this.currentStatus.update(dt);
        }
    }
    
}

export class GameActorStatusBase {
    status: GameActorStatusType = GameActorStatusType.None;
    machine: GameActorStatusMachine = null;

    statusTime: number = 0;
    onEnterStatus(){

    }

    onExitStatus(){
        this.machine = null;
    }

    update(dt){
        this.statusTime += dt;
    }
    
}

export class GameActorStatusIdle extends GameActorStatusBase {
    status = GameActorStatusType.Idle;

    //接收状态，转换精灵图
    onEnterStatus(){
        this.machine.actor.preferStatus(this);
    }

    update(dt){
        super.update(dt);
        let enemys = this.machine.actor.getEnemysInRange();
        if(enemys && enemys.length > 0 && this.statusTime > this.machine.actor.attackCoolDownTime){
            let attack = new GameActorStatusAttack();
            this.machine.onStatusChange(attack);
            attack.dir = attack.getEnemyDir(enemys);
        }
    }
}

export class GameActorStatusWalk extends GameActorStatusBase {
    status = GameActorStatusType.Walk;
    paths: cc.Vec2[];
    currentPathPointIndex: number = 0;
    nextPathPoint: cc.Vec2;
    moveDir: cc.Vec2;
    dir: GameDirection;
    
    onEnterStatus(){
        this.currentPathPointIndex = 0;
        this.machine.actor.node.x = this.paths[0].x;
        this.machine.actor.node.y = this.paths[0].y;
        this.goToNextPoint();
    }

    goToNextPoint(){
        this.nextPathPoint = this.getNextPathPoint();

        if(this.nextPathPoint){
            this.moveDir = this.nextPathPoint.sub(this.machine.actor.node.position).normalize();
            this.dir = Utils.getDir(this.moveDir);
            this.currentPathPointIndex ++;
        }
    }

    getNextPathPoint(): cc.Vec2{
        if(this.currentPathPointIndex + 1 < this.paths.length){
            return this.paths[this.currentPathPointIndex + 1]
        }
        return null;
    }

    update(dt: number){
        super.update(dt);

        // 判断是否死亡
        if(this.machine.actor.isDead()){
            let die = new GameActorStatusDead();
            this.machine.onStatusChange(die);
            return;

        }
        this.machine.actor.preferStatus(this);

        if(!this.nextPathPoint){
            return;
        }

        let currentPos = this.machine.actor.node.position;
        let speed = (this.machine.actor as GameWalker).speed;
        this.machine.actor.node.x = cc.misc.clampf(
            currentPos.x + this.moveDir.x * dt * speed, 
            Math.min(currentPos.x, this.nextPathPoint.x), 
            Math.max(currentPos.x, this.nextPathPoint.x)
        );
        this.machine.actor.node.y = cc.misc.clampf(
            currentPos.y + this.moveDir.y * dt * speed, 
            Math.min(currentPos.y, this.nextPathPoint.y), 
            Math.max(currentPos.y, this.nextPathPoint.y)
        );

        if(this.machine.actor.node.x == this.nextPathPoint.x && this.machine.actor.node.y == this.nextPathPoint.y){
            this.goToNextPoint();
        }
    }
}

export class GameActorStatusAttack extends GameActorStatusBase {
    status = GameActorStatusType.Attack;
    dir: GameDirection;
    isAttacked: boolean = false;

    onEnterStatus(){
        super.onEnterStatus();
    }

    update(dt: number){
        super.update(dt);
        this.machine.actor.preferStatus(this);
        let percent = this.statusTime / this.machine.actor.attackAnimTotalTime;
        if(percent > 1){
            // 重新进入空闲状态
            let idle = new GameActorStatusIdle();
            this.machine.onStatusChange(idle);
        }
    }

    getEnemyDir(enemys: GameActor[]): GameDirection{
        return this.machine.actor.getEnemyDir(enemys);
    }
}

export class GameActorStatusDead extends GameActorStatusBase {
    status = GameActorStatusType.Dead;

    //接收状态，转换精灵图
    onEnterStatus(){
        let deadEvent = new GameEventDead();
        deadEvent.trigger = this.machine.actor;
        GameEventDispatcher.getInstance().dispatchEvent(deadEvent);
    }

    update(dt){
        super.update(dt);
        this.machine.actor.preferStatus(this);

        // 大于2秒时，移除
        if(this.statusTime > 2){
            this.machine.actor.node.destroy();

        }
    }
}


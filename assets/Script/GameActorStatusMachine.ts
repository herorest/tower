import Utils from './Utils'
import { GameDirection } from './Config';
import GameActor from './GameActor';
import GameWalker from './GameWalker';

export enum GameActorStatusType{
    None,
    Idle,   //空闲状态
    Walk,   //移动
    Attack, //攻击
    Die     //死亡
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
}

export class GameActorStatusWalk extends GameActorStatusBase {
    status = GameActorStatusType.Walk;
    paths: cc.Vec2[];
    currentPathPointIndex: number = 0;
    nextPathPoint: cc.Vec2;
    moveDir: cc.Vec2;
    dir: GameDirection;
    
    onEnterStatus(){
        // this.paths = (this.machine.actor as GameWalker).getPaths();
        this.currentPathPointIndex = 0;
        this.machine.actor.node.x = this.paths[0].x;
        this.machine.actor.node.y = this.paths[0].y;
        this.goToNextPoint();
    }

    goToNextPoint(){
        this.nextPathPoint = this.getNextPathPoint();

        if(this.nextPathPoint){
            let ad = this.nextPathPoint.sub(this.machine.actor.node.position);
            this.moveDir = ad.normalize();
            this.dir = this.getDir(this.machine.actor.node.position, this.nextPathPoint);
            this.currentPathPointIndex ++;
        }
    }

    getDir(from: cc.Vec2, to: cc.Vec2): GameDirection{
        let ad = to.sub(from);
        let angle = cc.radiansToDegrees(Math.atan2(ad.y, ad.x));

        // console.log(angle);

        if(angle > 360){
            angle -= 360;
        }else if(angle < 0){
            angle += 360;
        }

        if(angle > 45 && angle <= 135){
            return GameDirection.Up;
        }if(angle > 225 && angle <= 315){
            return GameDirection.Down;
        }if(angle > 135 && angle <= 225){
            return GameDirection.Left;
        }else{
            return GameDirection.Right;
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
            console.log(this.nextPathPoint);
            this.goToNextPoint();
        }
    }
}

export class GameActorStatusAttack extends GameActorStatusBase {
    status = GameActorStatusType.Attack;
}

export class GameActorStatusDie extends GameActorStatusBase {
    status = GameActorStatusType.Die;
}


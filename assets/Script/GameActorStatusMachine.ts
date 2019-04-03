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
    
}

export class GameActorStatusBase {
    status: GameActorStatusType = GameActorStatusType.None;
    machine: GameActorStatusMachine = null;

    onEnterStatus(){

    }

    onExitStatus(){
        this.machine = null;
    }

    update(dt){

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
        this.paths = (this.machine.actor as GameWalker).getPaths();
        this.currentPathPointIndex = 0;
        this.goToNextPoint();

    }

    goToNextPoint(){
        this.nextPathPoint = this.getNextPathPoint();

        if(this.nextPathPoint){
            this.moveDir = cc.pNormalize(cc.pSub(this.nextPathPoint, this.machine.actor.node.position));
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
    }
}

export class GameActorStatusAttack extends GameActorStatusBase {
    status = GameActorStatusType.Attack;
}

export class GameActorStatusDie extends GameActorStatusBase {
    status = GameActorStatusType.Die;
}


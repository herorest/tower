import GameActorStatusMachine, {GameActorStatusBase} from './GameActorStatusMachine'
import Utils from './Utils';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameActor extends cc.Component {

    machine: GameActorStatusMachine = null;

    attackCoolDownTime: number = 1;

    onLoad(){
        this.machine = new GameActorStatusMachine(this);
    }

    //接收状态，转换精灵图
    preferStatus(status: GameActorStatusBase){

    }

    getEnemysInRange(): GameActor[]{
        return null;
    }

    update(dt){
        this.machine.update(dt);
    }
   
    getEnemyDir(enemys: GameActor[]): GameDirection{
        let enemy = enemys[0];
        let ad = enemy.node.position.sub(this.node.position);
        return Utils.getDir(ad);
    }
}

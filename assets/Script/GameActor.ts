import GameActorStatusMachine, {GameActorStatusBase} from './GameActorStatusMachine'

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameActor extends cc.Component {

    machine: GameActorStatusMachine = null;

    onLoad(){
        this.machine = new GameActorStatusMachine(this);
    }

    //接收状态，转换精灵图
    preferStatus(status: GameActorStatusBase){

    }

    update(dt){
        this.machine.update(dt);
    }
   
}

import GameEventComponent from "./GameEventComponent";

const { ccclass, property, requireComponent } = cc._decorator;


@ccclass
@requireComponent(GameEventComponent)   // 强依赖
export default class GameEventListener extends cc.Component {
    eventComponent: GameEventComponent = null;

    onLoad(){
        this.eventComponent = this.getComponent("GameEventComponent") as GameEventComponent;
    }
}

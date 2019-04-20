import { GameEventBase, GameEventType } from './GameEventDefine';
import GameEventDispatcher from './GameEventDispatcher';
import GameEventListener from './GameEventListener';
const { ccclass, property } = cc._decorator;


@ccclass
export default class GameEventComponent extends cc.Component {

    // 每个角色会注册很多个事件
    private events = new Map<GameEventType ,(event: GameEventBase) => boolean>();

    target = null;

    onLoad(){
        this.target = this.getComponent("GameEventListener") as GameEventListener;
        GameEventDispatcher.getInstance().registComponent(this);
    }

    registEvent(eventType, callback): void{
        this.events.set(eventType, callback);
        console.log('-------registEvent', this.events);
    }

    // 传入event事件，eventBase
    onReceiveEvent(event){
        if(this.events.has(event.eventType)){
            return this.events.get(event.eventType).call(this.target, event);
        }
        return false;
    }

}

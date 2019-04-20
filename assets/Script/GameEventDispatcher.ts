import GameEventComponent from "./GameEventComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameEventDispatcher {

    private static _instance: GameEventDispatcher = null;

    static getInstance(){
        if(GameEventDispatcher._instance == null){
            GameEventDispatcher._instance = new GameEventDispatcher();
        }
        return GameEventDispatcher._instance;
    }

    allComponents: GameEventComponent[] = [];

    registComponent(component: GameEventComponent){
        this.allComponents.push(component);

    }

    removeComponent(component: GameEventComponent){
        let idx = this.allComponents.indexOf(component);
        if(idx != -1){
            this.allComponents.splice(idx,1);
        }
    }

    dispatchEvent(event){
        for(let i = 0; i< this.allComponents.length; i++){
            let component = this.allComponents[i];
            if(component.onReceiveEvent(event)){
                break;
            }

        }
    }
}

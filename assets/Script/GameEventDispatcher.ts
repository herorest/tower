const { ccclass, property } = cc._decorator;

@ccclass
export default class GameEventDispatcher extends cc.Component {

    private static _instance: GameEventDispatcher = null;

    getInstance(): GameEventDispatcher{
        if(GameEventDispatcher._instance == null){
            GameEventDispatcher._instance = new GameEventDispatcher();
        }
        return GameEventDispatcher._instance;
    }

    onLoad(){

    }

}

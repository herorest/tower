const { ccclass, property } = cc._decorator;

@ccclass
export default class GameHpBar extends cc.Component {

    @property(cc.Sprite) 
    greenBar: cc.Sprite = null;

    setHpPercent(percent){
        this.greenBar.fillRange = Math.min(1, Math.max(0, percent));
    }
}

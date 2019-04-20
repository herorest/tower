import { GameEventCreateTower } from './GameEventDefine';
import { DefenceTowerType } from "./Config";
import GameEventDispatcher from './GameEventDispatcher';

/*
** 1 箭塔 archer
** 2 兵营 barrack
** 3 法师塔 mage
** 4 炮塔 artillery
*/
const {ccclass, property} = cc._decorator;

export enum TowerCreatorStatus{
    None,
    Common,
    SelectTower,
    choseTower,
    Constructing
}

@ccclass
export default class TowerCreator extends cc.Component {

    @property(cc.Node)
    commonBg: cc.Node = null;

    @property(cc.Node)
    nodeRangeParent: cc.Node = null;

    @property(cc.Node)
    nodePreviewParent: cc.Node = null;

    @property([cc.Node])
    nodePreviews: cc.Node[] = [];

    @property(cc.Node)
    nodeSelectorParent: cc.Node = null;

    @property([cc.Node])
    nodeSelector: cc.Node[] = [];

    @property(cc.Node)
    nodeConstructorParent: cc.Node = null;

    @property([cc.Node])
    nodeConstructoring: cc.Node[] = [];

    @property(cc.Node)
    nodeBarParent: cc.Node = null;

    @property(cc.Sprite)
    spBar: cc.Sprite = null;

    currentSelectTower: DefenceTowerType = DefenceTowerType.None;
    status: TowerCreatorStatus = TowerCreatorStatus.None;

    start () {

    }

    setStatus(status: TowerCreatorStatus){
        this.commonBg.active = status == TowerCreatorStatus.Common || status == TowerCreatorStatus.SelectTower;
        this.nodeRangeParent.active = status == TowerCreatorStatus.choseTower;
        this.nodePreviewParent.active = status == TowerCreatorStatus.choseTower;
        this.nodeSelectorParent.active = status == TowerCreatorStatus.SelectTower || status == TowerCreatorStatus.choseTower;
        this.nodeConstructorParent.active = status == TowerCreatorStatus.Constructing;
        this.nodeBarParent.active = status == TowerCreatorStatus.Constructing;
        this.status = status;
    }

    setCurrentSelectTower(towerType: DefenceTowerType){
        this.currentSelectTower = towerType;
    }

    refreshCurrentStatus(){
        for(let i = 0; i < this.nodePreviews.length; i++){
            if(this.nodePreviews[i]){
                this.nodePreviews[i].active = this.currentSelectTower == i;
            }
        }

        for(let i = 0; i < this.nodeConstructoring.length; i++){
            if(this.nodeConstructoring[i]){
                this.nodeConstructoring[i].active = this.currentSelectTower == i;
            }
        }

        for(let i = 0; i < this.nodeSelector.length; i++){
            if(this.nodeSelector[i]){
                this.nodeSelector[i].children[0].children[0].active = false;
            }
        }
    }

    onClickCommonBg(){
        this.setStatus(TowerCreatorStatus.SelectTower);
    }

    onClickSelectTower(event: cc.Event.EventCustom, type: string){
        this.setStatus(TowerCreatorStatus.choseTower);
        this.setCurrentSelectTower(parseInt(type));
        this.refreshCurrentStatus();
        event.getCurrentTarget().children[0].active = true;
    }

    onClickCreatTower(event: cc.Event.EventCustom, type: string){
        this.setStatus(TowerCreatorStatus.Constructing);
        this.setCurrentSelectTower(parseInt(type));
        // this.refreshCurrentStatus();
    }

    update(dt: number){
        if(this.status == TowerCreatorStatus.Constructing){
            this.spBar.fillRange += dt;
            this.spBar.fillRange = Math.min(1, this.spBar.fillRange);
            if(this.spBar.fillRange === 1){
                this.status = TowerCreatorStatus.None;

                let  event = new GameEventCreateTower();
                event.pos = this.node.position;
                event.towerType = this.currentSelectTower;
                GameEventDispatcher.getInstance().dispatchEvent(event);
            }
        }
    }
}

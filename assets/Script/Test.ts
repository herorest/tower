/*
** 1 箭塔 archer
** 2 兵营 barrack
** 3 法师塔 mega
** 4 炮塔 artillery
*/

import TowerCreator, {TowerCreatorStatus} from './TowerCreator';
import {DefenceTowerType} from './Config';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    prefabTowerCreator: cc.Prefab = null;

    start () {
        let towerCreator = cc.instantiate(this.prefabTowerCreator).getComponent<TowerCreator>(TowerCreator);
        console.log('-=------', towerCreator);
        towerCreator.node.parent = this.node;
        towerCreator.setStatus(TowerCreatorStatus.SelectTower);
        towerCreator.setCurrentSelectTower(DefenceTowerType.Mega);
        towerCreator.refreshCurrentStatus();
    }

}

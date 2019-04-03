import Utils from './Utils'
import TowerCreator, {TowerCreatorStatus} from './TowerCreator';
import {DefenceTowerType} from './Config';


const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.TiledMap)
    map: cc.TiledMap = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.Node)
    towersParent: cc.Node = null;

    @property(cc.Prefab)
    prefabTowerCreator: cc.Prefab = null;

    onLoad() {
        let towers = this.map.getObjectGroup('towers');
        let tower0 = towers.getObject('tower0');

        // this.sprite.node.position = Utils.tileCoordForPosition(this.map, tower0.offset);

        let towerCreator = cc.instantiate(this.prefabTowerCreator);
        towerCreator.parent = this.node;
        towerCreator.position = Utils.tileCoordForPosition(this.map, tower0.offset);

        let node = towerCreator.getComponent<TowerCreator>(TowerCreator)
    }
}

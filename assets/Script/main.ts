import Utils from './Utils'
import TowerCreator, {TowerCreatorStatus} from './TowerCreator';
import {DefenceTowerType} from './Config';
import { GameActorStatusWalk } from './GameActorStatusMachine';
import GameWalker from './GameWalker';


const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.TiledMap)
    map: cc.TiledMap = null;

    @property(cc.Node)
    towersParent: cc.Node = null;

    @property(cc.Prefab)
    prefabTowerCreator: cc.Prefab = null;

    @property(cc.Prefab)
    prefabEnemy: cc.Prefab = null;

    onLoad() {
        // 创建塔
        let towers = this.map.getObjectGroup('towers');
        let tower0 = towers.getObject('tower0');

        let towerCreator = cc.instantiate(this.prefabTowerCreator);
        towerCreator.parent = this.towersParent;
        towerCreator.position = Utils.tileCoordForPosition(this.map, tower0.offset);

        // let node = towerCreator.getComponent<TowerCreator>(TowerCreator)

        // 测试路径
        let paths = this.map.getObjectGroup('paths');
        let path0 = paths.getObject('path0');

        // 测试敌人
        let enemy = cc.instantiate(this.prefabEnemy).getComponent<GameWalker>(GameWalker);
        enemy.node.parent = this.towersParent;
        
        let walk = new GameActorStatusWalk();
        walk.paths = Utils.tilePolylineForPositions(Utils.tileCoordForPosition(this.map, path0.offset), path0.polylinePoints);
        console.log(walk);
        enemy.machine.onStatusChange(walk);
    }
}

import { DefenceTowerType } from './Config';
import { GameEventType } from './GameEventDefine';
import Utils from './Utils'
import { GameActorStatusWalk, GameActorStatusIdle } from './GameActorStatusMachine';
import GameWalker from './GameWalker';
import GameActor from './GameActor';
import DefenceTowerMega from './DefenceTowerMega';
import GameEventListener from './GameEventListener';


const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends GameEventListener {

    private static _instance: Main = null

    static getInstance(): Main{
        return Main._instance;
    }

    @property(cc.TiledMap)
    map: cc.TiledMap = null;

    @property(cc.Node)
    towersParent: cc.Node = null;

    @property(cc.Prefab)
    prefabTowerCreator: cc.Prefab = null;

    @property(cc.Prefab)
    prefabEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    prefabTowerMeta: cc.Prefab = null;

    enemys: GameActor[] = [];


    onLoad() {
        super.onLoad();
        Main._instance =  this;

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
        let startPos = Utils.tileCoordForPosition(this.map, path0.offset);

        // 测试敌人
        let enemy = cc.instantiate(this.prefabEnemy).getComponent("GameWalker") as GameWalker;
        enemy.node.parent = this.towersParent;
        enemy.node.position = startPos;
        enemy.paths = Utils.tilePolylineForPositions(startPos, path0.polylinePoints);
        this.enemys.push(enemy);

        let walk = new GameActorStatusWalk();
        walk.paths = Utils.tilePolylineForPositions(startPos, path0.polylinePoints);
        enemy.machine.onStatusChange(walk);

        this.eventComponent.registEvent(GameEventType.CreateTower, this.onEventCreateTower);

    }

    onEventCreateTower(event){
        let towerType = event.towerType;

        if(towerType == DefenceTowerType.Mega){
            let tower = cc.instantiate(this.prefabTowerMeta).getComponent('DefenceTowerMega') as DefenceTowerMega;
            tower.node.parent = this.towersParent;
            tower.node.position = event.pos
            tower.machine.onStatusChange(new GameActorStatusIdle());
    
        }

        return false;
    }
}

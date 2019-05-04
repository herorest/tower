import { DefenceTowerType } from './Config';
import { GameEventType } from './GameEventDefine';
import Utils from './Utils'
import { GameActorStatusWalk, GameActorStatusIdle } from './GameActorStatusMachine';
import GameWalker from './GameWalker';
import GameActor from './GameActor';
import DefenceTowerMega from './DefenceTowerMega';
import GameEventListener from './GameEventListener';
import TowerCreator, { TowerCreatorStatus } from './TowerCreator';


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
    prefabPoolManager: cc.Prefab = null;

    @property(cc.Prefab)
    prefabTowerCreator: cc.Prefab = null;

    @property(cc.Prefab)
    prefabEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    prefabTowerMeta: cc.Prefab = null;

    enemys: GameActor[] = [];

    startPos: cc.Vec2 = null;

    path0: any = null;


    onLoad() {
        super.onLoad();
        Main._instance =  this;

        // 子弹池
        let poolManager = cc.instantiate(this.prefabPoolManager);
        poolManager.parent = this.node;

        this.generateTowerCreator();

        //注册通用的创建塔事件，具体使用放在towerCreator中dispatch
        this.eventComponent.registEvent(GameEventType.CreateTower, this.onEventCreateTower);
        this.eventComponent.registEvent(GameEventType.Dead, this.onEventDead);

        // 测试路径
        let paths = this.map.getObjectGroup('paths');
        this.path0 = paths.getObject('path0');
        this.startPos = Utils.tileCoordForPosition(this.map, this.path0.offset);

        this.schedule(this.generateEnemy, 3, 20, 5);
    }

    onEventCreateTower(event){
        let towerType = event.towerType;

        if(towerType == DefenceTowerType.Mega){
            let tower = cc.instantiate(this.prefabTowerMeta).getComponent('DefenceTowerMega') as DefenceTowerMega;
            tower.node.parent = this.towersParent;
            tower.node.position = event.pos;

            let idle = new GameActorStatusIdle();
            tower.machine.onStatusChange(idle);
    
        }

        return false;
    }

    onEventDead(event){
        this.enemys = this.enemys.filter((i) => {
            return i !== event.trigger
        });
    }

    generateTowerCreator(){
        // 创建一个towerCreator
        let towers = this.map.getObjectGroup('towers');
        let groups = towers.getObjects();

        for(let i=0, length = groups.length; i < length; i++){
            let tower = groups[i];
            let towerCreator = cc.instantiate(this.prefabTowerCreator);
            let creator = towerCreator.getComponent('TowerCreator') as TowerCreator;
            creator.node.parent = this.towersParent;
            creator.node.position = Utils.tileCoordForPosition(this.map, tower.offset);
            creator.setStatus(TowerCreatorStatus.Common);
        }
    }

    generateEnemy(){        
        // 测试敌人
        let enemy = cc.instantiate(this.prefabEnemy).getComponent("GameWalker") as GameWalker;
        enemy.node.parent = this.towersParent;
        enemy.node.position = this.startPos;
        enemy.paths = Utils.tilePolylineForPositions(this.startPos, this.path0.polylinePoints);
        this.enemys.push(enemy);

        let walk = new GameActorStatusWalk();
        walk.paths = Utils.tilePolylineForPositions(this.startPos, this.path0.polylinePoints);
        enemy.machine.onStatusChange(walk);

    }
}

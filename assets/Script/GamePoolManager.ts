const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePoolManager extends cc.Component{

    private static _instance: GamePoolManager = null;

    static getInstance(){
        return GamePoolManager._instance;
    }

    @property([cc.Prefab])
    prefabs: cc.Prefab[] = [];

    allPools = new Map<PoolType, cc.Node[]>();

    onLoad(){
        if(GamePoolManager._instance == null){
            GamePoolManager._instance = this;
        }
    } 

    getObj(poolType){
        let pool: cc.Node[] = this.allPools.get(poolType);

        if(!pool){
            pool = [];
            this.allPools.set(poolType, pool);
        }

        if(pool.length > 0){
            let node = pool.shift();
            return node;
        }else{
            // 这里容易有顺序问题， this.prefabs中的是在cocos中配置的
            let flyObj = cc.instantiate(this.prefabs[poolType]);
            return flyObj;
        }

    }

    recycleObj(poolType, node){
        let pool = this.allPools.get(poolType);
        pool.push(node);
    }

}

export enum PoolType{
    None,
    MegaTowerFlyObj,
}
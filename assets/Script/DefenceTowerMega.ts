import { GameFlyObjectStatus } from './GameFlyObj';
import GameActor from './GameActor'
import { GameActorStatusBase, GameActorStatusType, GameActorStatusAttack } from './GameActorStatusMachine';
import { GameDirection } from './Config';
import Utils from './Utils';
import GameFlyObj from './GameFlyObj';

const { ccclass, property } = cc._decorator;

@ccclass
export default class DefenceTowerMega extends GameActor {

    @property(cc.Prefab)
    prefabFlyObj: cc.Prefab = null;

    @property(cc.Sprite)
    spMega: cc.Sprite = null;

    @property(cc.Sprite)
    spTower: cc.Sprite = null;

    @property([cc.SpriteFrame])
    sfMegaAttackFronts: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    sfMegaAttackBacks: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    sfMegaIdleFronts: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    sfMegaIdleBack: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    sfTowerIdle: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    sfTowerAttacks: cc.SpriteFrame[] = [];

    onLoad(){
        super.onLoad();
    }

    update(dt){
        super.update(dt);
    }

    preferStatus(status: GameActorStatusBase){
        if(status.status == GameActorStatusType.Attack){
            let attackStatus = status as GameActorStatusAttack;
            let percent = (status.statusTime / this.attackAnimTotalTime) % 1;
            let frames = attackStatus.dir === GameDirection.Up ? this.sfMegaAttackBacks : this.sfMegaAttackFronts;
            let currentFrame = Utils.preferAnimFrame(this.spMega, frames, percent);
            if(!attackStatus.isAttacked && currentFrame == frames[this.attackKeyFrame]){
                this.attack();
            }
        }
    }

    getEnemyDir(enemys: GameActor[]): GameDirection{
        let enemy = enemys[0];
        if(enemy.node.y > this.node.y){
            return GameDirection.Up;
        }else{
            return GameDirection.Down;
        }
    }

    attack(){
        super.attack();
        let enemys = this.getEnemysInRange();
        if(enemys && enemys.length > 0){
            let flyObj = cc.instantiate(this.prefabFlyObj).getComponent("GameFlyObj") as GameFlyObj;
            flyObj.node.parent = this.node.parent;
            flyObj.node.position = cc.v2(this.node.x, this.node.y + 70);
            flyObj.startFly(enemys[0], this);
        }
    }
   
}

import GameActor from './GameActor'
import { GameActorStatusBase, GameActorStatusType, GameActorStatusAttack } from './GameActorStatusMachine';
import { GameDirection } from './Config';

const { ccclass, property } = cc._decorator;

@ccclass
export default class DefenceTowerMega extends GameActor {

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
            let currentFrame = this.preferAnimFrame(this.spMega, frames, percent);
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
   
}

import { DefenceTowerType } from "./Config";
import GameActor from "./GameActor";

export enum GameEventType{
    None,
    CreateTower,
    Hit,
    Dead
}

export class GameEventBase{
    eventType: GameEventType = GameEventType.None;
}

export class GameEventCreateTower extends GameEventBase{
    eventType: GameEventType = GameEventType.CreateTower;
    towerType: DefenceTowerType;
    pos: cc.Vec2
}

export class GameEventHit extends GameEventBase{
    eventType: GameEventType = GameEventType.Hit;
    hitter: GameActor ;
    beHitter: GameActor ;
}

export class GameEventDead extends GameEventBase{
    eventType: GameEventType = GameEventType.Dead;
    trigger: GameActor ;
}


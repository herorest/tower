import { DefenceTowerType } from "./Config";

export enum GameEventType{
    None,
    CreateTower,
}

export class GameEventBase{
    eventType: GameEventType = GameEventType.None;
}

export class GameEventCreateTower extends GameEventBase{
    eventType: GameEventType = GameEventType.CreateTower;
    towerType: DefenceTowerType;
    pos: cc.Vec2
}




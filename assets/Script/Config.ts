import Main from "./main";

export enum DefenceTowerType{
    None,
    Archer,
    Barrack,
    Mega,
    Artillery
}

export enum GameDirection{
    None,
    Up,
    Down,
    Left,
    Right
}

export class GameConfig{
    static config = null;
    static loadConfig(){
        cc.loader.loadRes("config", (error, resource) => {
            GameConfig.config = resource.json;
            Main.getInstance().startGame();
        });
    } 
}

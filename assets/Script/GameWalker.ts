const { ccclass, property } = cc._decorator;

@ccclass
export default class GameWalker extends cc.Component {

    @property(cc.Sprite)
    spWalker: cc.Sprite = null;

    @property([cc.SpriteFrame])
    spWalkUp: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spWalkDown: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spWalkRight: cc.SpriteFrame[] = [];

    @property(Number)
    animWalkTotalTime: number = 1;
    
    @property(Number)
    speed: number = 20;

    getPaths(): cc.Vec2[]{
        let paths: cc.Vec2[] = [];

        paths.push(cc.v2(0,0));
        paths.push(cc.v2(50,50));
        paths.push(cc.v2(-100,30));
        paths.push(cc.v2(-10,-100));

        return paths;
    }
}

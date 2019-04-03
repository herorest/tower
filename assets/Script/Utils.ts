export default class Utils {

    /**
     * 物品(塔、角色)的坐标从cocos坐标转为opengl坐标
     * @param map TiledMap
     * @param pos Object
     */
    static tileCoordForPosition(map: cc.TiledMap, pos: cc.Vec2): cc.Vec2{
        let mapSize = map.getMapSize();

        //一格的尺寸，64*64
        let tileSize = map.getTileSize();

        let x = pos.x - mapSize.width * tileSize.width * 0.5;
        let y = mapSize.height * tileSize.height * 0.5 - pos.y;

        return cc.v2(x, y);
    }

    static tilePolylineForPositions(startPos: cc.Vec2, points: cc.Vec2[]): cc.Vec2[]{
        let paths: cc.Vec2[] = [];
        paths[0] = startPos;
        for(let i = 1;i < points.length; i++){
            paths[i] = cc.v2(startPos.x + points[i].x, startPos.y - points[i].y);
        }
        return paths;
    }
}
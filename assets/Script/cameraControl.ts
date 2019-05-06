import Main from "./main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class cameraControl extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;

    main = null;

    onLoad(){
        this.main = Main.getInstance();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(e){
        
    }

    onTouchMove(e){
        this.camera.node.position = this.camera.node.position.sub(e.getDelta());
    }

    onTouchEnd(e){
        
    }

    onTouchCancel(e){
        
    }
}

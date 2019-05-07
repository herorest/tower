import Main from "./main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class cameraControl extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;

    // 记录手指按下的序号
    touchIndex: number = 0;

    // 记录手指按下的位置
    touchPos: any[] = [];

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(e){
        this.touchIndex ++;
        this.setTouchStart(this.touchIndex, e.getLocation());
    }

    onTouchMove(e){
        if(this.touchIndex === 1){
            // getDelta 距离上次移动的距离对象
            this.camera.node.position = this.camera.node.position.sub(e.getDelta());
        }else{
            // 先比较下当前位置与两个手指的距离，距离短的就是当前手指
            // getLocation 当前点击的位置对象
            // mag 距离对象转距离
            let curr = e.getLocation(), touchPos1 = this.touchPos[0], touchPos2 = this.touchPos[1];

            let distance1 = touchPos1.sub(curr).mag();
            let distance2 = touchPos2.sub(curr).mag();

            // 距离这里可以先视为一个手指为轴，计算另一个手指
            let lastDis = touchPos1.sub(touchPos2).mag();
            let currDis = Math.max(distance1, distance2);

            // 计算偏移量，折算放大缩小比例
            // 0.5 - 2倍
            let delta = currDis - lastDis;
            let ratio = this.camera.zoomRatio + delta / 400;
            this.camera.zoomRatio = Math.min(2, Math.max(0.5, ratio));

            distance1 > distance2 ? this.setTouchStart(2, curr) : this.setTouchStart(1, curr);
        }
    }

    onTouchEnd(e){
        this.touchIndex --;
    }

    onTouchCancel(e){
        this.touchIndex --;
    }

    setTouchStart(index, pos){
        this.touchPos[index] = pos;
    }
}

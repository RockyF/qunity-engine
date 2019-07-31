/**
 * Created by rockyl on 2018/11/7.
 *
 * 交互上下文
 */
import { QunityEngine } from "../QunityEngine";
interface InteractContextOption {
    /**
     * 画布
     */
    canvas: any;
    /**
     * 触摸句柄
     */
    touchHandlers: any;
    /**
     * 触摸开关
     */
    touchEnabled: boolean;
}
/**
 * 交互上下文
 */
export default class InteractContext {
    protected canvas: any;
    protected touchHandlers: any;
    protected scaleX: any;
    protected scaleY: any;
    protected rotation: any;
    private engine;
    constructor(engine: QunityEngine);
    /**
     * 装配上下文
     * @param options
     */
    setup(options?: InteractContextOption): void;
    /**
     * 更新缩放模式
     * @param scaleX
     * @param scaleY
     * @param rotation
     */
    updateScale(scaleX: any, scaleY: any, rotation: any): void;
    /**
     * 适配鼠标事件
     */
    private addListeners;
    /**
     * 阻断页面拖动
     * @param event
     */
    private prevent;
    /**
     * 增加鼠标事件
     */
    private addMouseListener;
    /**
     * 增加触摸事件
     */
    private addTouchListener;
    private onTouchBegin;
    private onMouseMove;
    private onTouchMove;
    private onTouchEnd;
    private getLocation;
}
export {};

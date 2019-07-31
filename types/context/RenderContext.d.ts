/**
 * Created by rockyl on 2018/11/5.
 *
 * 渲染上下文
 */
import { QunityEngine } from "../QunityEngine";
/**
 * 缩放模式
 *
 * SHOW_ALL: 全可见
 * FIXED_WIDTH: 宽度固定
 * FIXED_HEIGHT: 高度固定
 */
export declare enum ScaleMode {
    SHOW_ALL = "showAll",
    FIXED_WIDTH = "fixedWidth",
    FIXED_HEIGHT = "fixedHeight",
    NO_SCALE = "noScale",
    NO_FIXED = "noFixed"
}
interface RenderContextOption {
    /**
     * 画布实例
     */
    canvas: any;
    /**
     * 设计宽度
     */
    designWidth: number;
    /**
     * 设计高度
     */
    designHeight: number;
    /**
     * 缩放模式
     */
    scaleMode: ScaleMode;
    /**
     * 是否修改画布尺寸
     */
    modifyCanvasSize?: boolean;
    /**
     * 是否自动调整舞台尺寸
     */
    autoAdjustSize?: boolean;
    /**
     * 当缩放模式修改时
     */
    onUpdateScale: Function;
}
/**
 * 渲染上下文
 */
export default class RenderContext {
    protected canvas: HTMLCanvasElement;
    protected canvasContext: CanvasRenderingContext2D;
    protected stageWidth: number;
    protected stageHeight: number;
    private _scaleX;
    private _scaleY;
    private _rotation;
    protected dirtyFieldTriggerLock: boolean;
    private onUpdateScale;
    private engine;
    constructor(engine: QunityEngine);
    /**
     * 设计宽度
     */
    designWidth: any;
    /**
     * 设计高度
     */
    designHeight: any;
    /**
     * 缩放模式
     */
    scaleMode: ScaleMode;
    /**
     * 是否修改画布的尺寸
     */
    modifyCanvasSize: any;
    /**
     * 是否自动调整舞台尺寸
     */
    autoAdjustSize: any;
    private onModify;
    /**
     * 装配上下文
     * @param options
     */
    setup(options?: RenderContextOption): void;
    /**
     * 缩放x
     */
    readonly scaleX: number;
    /**
     * 缩放y
     */
    readonly scaleY: number;
    /**
     * 旋转
     */
    readonly rotation: number;
    /**
     * 清空渲染上下文
     */
    clear(): void;
    /**
     * 获取渲染上下文
     */
    readonly context: CanvasRenderingContext2D;
    /**
     * 获取舞台尺寸
     */
    readonly stageSize: {
        width: number;
        height: number;
    };
    /**
     * 获取舞台缩放
     */
    readonly stageScale: {
        x: number;
        y: number;
    };
    /**
     * 获取舞台中心
     */
    readonly stageCenter: {
        x: number;
        y: number;
    };
    /**
     * 更新缩放模式
     */
    private updateScaleModeSelf;
}
/**
 * 创建canvas
 */
export declare function createCanvas(): HTMLCanvasElement;
export {};

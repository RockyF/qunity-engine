/**
 * Created by rockyl on 2018/11/23.
 *
 * 引擎
 */
import InteractContext from "./context/InteractContext";
import RenderContext, { ScaleMode } from "./context/RenderContext";
import './requestAnimationFrame-polyfill';
import { Entity } from "qunity-core";
interface EngineConfig {
    canvas?: string | HTMLCanvasElement;
    fps?: number;
    designWidth?: number;
    designHeight?: number;
    scaleMode?: ScaleMode;
    touchEnabled?: boolean;
    modifyCanvasSize?: boolean;
}
/**
 * 引擎类
 */
export declare class QunityEngine {
    /**
     * 默认配置
     */
    readonly engineConfig: EngineConfig;
    /**
     * 自定义配置
     */
    readonly customConfig: any;
    private _root;
    private _canvasElement;
    private _flush;
    private _currentFlush;
    private tsStart;
    private tsLast;
    private lastFPS;
    private tickId;
    private _renderContext;
    private _interactContext;
    private nextTicks;
    private defMap;
    /**
     * 注册组件
     * @param name
     * @param def
     */
    registerDef(name: string, def: any): void;
    /**
     * 注册组件
     * @param name
     */
    unregisterDef(name: string): void;
    /**
     * 根据名称获取定义
     * @param name
     * @param showWarn
     */
    getDefByName(name: string, showWarn?: boolean): any;
    constructor();
    /**
     * 装配引擎
     * @param _engineConfig
     * @param _customConfig
     * @param _dataCenterConfig
     */
    setup(_engineConfig?: EngineConfig, _customConfig?: any, _dataCenterConfig?: any): void;
    /**
     * 开始引擎
     */
    start(): void;
    /**
     * 暂停引擎
     */
    pause(): void;
    /**
     * 获取根Entity
     */
    readonly root: Entity;
    /**
     * 获取实体路径
     * @param entity
     */
    getEntityPath(entity?: Entity): string;
    /**
     * 根据实体路径获取实体
     * @param path
     */
    getEntityByPath(path?: string): Entity;
    /**
     * 获取当前帧率
     */
    getFPS(): number;
    /**
     * 获取渲染上下文
     */
    readonly renderContext: RenderContext;
    /**
     * 获取交互上下文
     */
    readonly interactContext: InteractContext;
    readonly canvasElement: HTMLCanvasElement;
    private onUpdateScale;
    /**
     * 开始时钟
     */
    private startTick;
    /**
     * 停止时钟
     */
    private stopTick;
    /**
     * 时钟触发
     */
    private flush;
    /**
     * 下一帧执行
     * @param func
     * @param tickCount
     */
    nextTick(func: any, tickCount?: number): void;
    private onFrameTick;
    /**
     * 代理出来的onTouchBegin方法
     * @param event
     */
    private onTouchBegin;
    /**
     * 代理出来的onTouchMove方法
     * @param event
     */
    private onTouchMove;
    /**
     * 代理出来的onTouchEnd方法
     * @param event
     */
    private onTouchEnd;
}
export {};

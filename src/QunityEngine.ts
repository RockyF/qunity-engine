/**
 * Created by rockyl on 2018/11/23.
 *
 * 引擎
 */

import InteractContext from "./context/InteractContext";
import RenderContext, {ScaleMode} from "./context/RenderContext";
import './requestAnimationFrame-polyfill';
import {Entity, injectProp, RootEntity, traverse, traversePostorder} from "qunity-core";

interface EngineConfig {
	canvas?: string | HTMLCanvasElement,
	fps?: number,
	designWidth?: number,
	designHeight?: number,
	scaleMode?: ScaleMode
	touchEnabled?: boolean,
}

/**
 * 引擎类
 */
export class QunityEngine {
	/**
	 * 默认配置
	 */
	readonly engineConfig: EngineConfig = {
		canvas: 'gameCanvas',
		fps: 60,
		designWidth: 750,
		designHeight: 1334,
		scaleMode: ScaleMode.FIXED_WIDTH,
		touchEnabled: true,
	};
	/**
	 * 自定义配置
	 */
	readonly customConfig: any = {};

	private _root: RootEntity;
	private _canvasElement: HTMLCanvasElement;

	private _flush = 0;
	private _currentFlush = 0;
	private tsStart;
	private tsLast;
	private lastFPS = 0;
	private tickId;

	private _renderContext: RenderContext;
	private _interactContext: InteractContext;

	private nextTicks = [];

	private defMap = {};

	/**
	 * 注册组件
	 * @param name
	 * @param def
	 */
	registerDef(name: string, def) {
		this.defMap[name] = def;
		def.__class__ = name;
	}

	/**
	 * 注册组件
	 * @param name
	 */
	unregisterDef(name: string) {
		delete this.defMap[name];
	}

	/**
	 * 根据名称获取定义
	 * @param name
	 * @param showWarn
	 */
	getDefByName(name: string, showWarn: boolean = true): any {
		let def;
		/*if (name.indexOf('/') >= 0) {//addition
			name = name.substr(name.lastIndexOf('/') + 1);
		}*/

		def = this.defMap[name];
		if (!def && showWarn) {
			console.warn('missing def:', name);
			return;
		}

		return def;
	}

	constructor() {

	}

	/**
	 * 装配引擎
	 * @param _engineConfig
	 * @param _customConfig
	 * @param _dataCenterConfig
	 */
	setup(_engineConfig?: EngineConfig, _customConfig?, _dataCenterConfig?) {
		injectProp(this.engineConfig, _engineConfig);
		injectProp(this.customConfig, _customConfig);

		const {canvas, designWidth, designHeight, scaleMode, modifyCanvasSize, touchEnabled} = this.engineConfig;

		this._canvasElement = typeof canvas == 'string' ? <HTMLCanvasElement>document.getElementById(canvas) : canvas;

		this._interactContext = new InteractContext(this);
		this._interactContext.setup({
			canvas: this._canvasElement,
			touchHandlers: {
				onTouchBegin: this.onTouchBegin.bind(this),
				onTouchMove: this.onTouchMove.bind(this),
				onTouchEnd: this.onTouchEnd.bind(this),
			},
			touchEnabled,
		});

		this._renderContext = new RenderContext(this);
		this._renderContext.setup({
			canvas: this._canvasElement,
			designWidth,
			designHeight,
			scaleMode,
			modifyCanvasSize,
			onUpdateScale: this.onUpdateScale.bind(this),
		});

		this._root = new RootEntity();
	}

	/**
	 * 开始引擎
	 */
	start() {
		this._root.enabled = true;

		this.tsStart = -1;
		this.startTick();
	}

	/**
	 * 暂停引擎
	 */
	pause() {
		this._root.enabled = false;

		this.stopTick();
	}

	/**
	 * 获取根Entity
	 */
	get root(): Entity {
		return this._root;
	}

	/**
	 * 获取实体路径
	 * @param entity
	 */
	getEntityPath(entity?: Entity): string {
		let path = '';
		let current = entity || this._root;
		while (current.parent) {
			path = current.parent.children.indexOf(current) + (path.length > 0 ? '|' : '') + path;
			current = current.parent;
		}
		return path;
	}

	/**
	 * 根据实体路径获取实体
	 * @param path
	 */
	getEntityByPath(path?: string): Entity {
		let target = this._root;

		if (path.length > 0) {
			let arr = path.split('|');
			for (let item of arr) {
				target = target.children[item];
				if (!target) {
					target = null;
					break;
				}
			}
		}
		return target;
	}

	/**
	 * 获取当前帧率
	 */
	getFPS() {
		return this.lastFPS;
	}

	/**
	 * 获取渲染上下文
	 */
	get renderContext(): RenderContext {
		return this._renderContext;
	}

	/**
	 * 获取交互上下文
	 */
	get interactContext(): InteractContext {
		return this._interactContext;
	}

	get canvasElement(): HTMLCanvasElement {
		return this._canvasElement;
	}

	private onUpdateScale(scaleX, scaleY, rotation) {
		this._interactContext.updateScale(scaleX, scaleY, rotation)
	}

	/**
	 * 开始时钟
	 */
	private startTick() {
		this._flush = 60 / this.engineConfig.fps - 1 >> 0;
		if (this._flush < 0) {
			this._flush = 0;
		}

		this.tickId = requestAnimationFrame(this.flush);
	}

	/**
	 * 停止时钟
	 */
	private stopTick() {
		cancelAnimationFrame(this.tickId);
	}

	/**
	 * 时钟触发
	 */
	private flush = (tsNow): void => {
		if (this._flush == 0) {
			this.onFrameTick(tsNow);
		} else {
			if (this._currentFlush == 0) {
				this.onFrameTick(tsNow);
				this._currentFlush = this._flush;
			} else {
				this._currentFlush--;
			}
		}

		this.tickId = requestAnimationFrame(this.flush);
	};

	/**
	 * 下一帧执行
	 * @param func
	 * @param tickCount
	 */
	nextTick(func, tickCount = 1) {
		this.nextTicks.push({func, tickCount});
	}

	private onFrameTick(tsNow) {
		if (this.tsStart < 0) {
			this.tsStart = tsNow;
		}

		this._renderContext.clear();
		this.lastFPS = Math.floor(1000 / (tsNow - this.tsLast));
		this.tsLast = tsNow;
		const ts = tsNow - this.tsStart;
		traverse(this._root, function (child) {
			if (!child.isFree && child.enabled) {
				child.components.onUpdate(ts);
			} else {
				return true;
			}
		}, -1, true, function (current) {
			current.components.afterUpdate(ts);
		});

		for (let i = 0, li = this.nextTicks.length; i < li; i++) {
			const item = this.nextTicks[i];

			item.tickCount--;
			if (item.tickCount <= 0) {
				item.func(ts);

				this.nextTicks.splice(i, 1);
				i--;
				li--;
			}
		}
	}

	/**
	 * 代理出来的onTouchBegin方法
	 * @param event
	 */
	private onTouchBegin(event) {
		traversePostorder(this._root, function (child) {
			return child.components.onInteract(0, event);
		})
	}

	/**
	 * 代理出来的onTouchMove方法
	 * @param event
	 */
	private onTouchMove(event) {
		traversePostorder(this._root, function (child) {
			return child.components.onInteract(1, event);
		})
	}

	/**
	 * 代理出来的onTouchEnd方法
	 * @param event
	 */
	private onTouchEnd(event) {
		traversePostorder(this._root, function (child) {
			return child.components.onInteract(2, event);
		})
	}
}

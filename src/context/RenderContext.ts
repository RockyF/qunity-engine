/**
 * Created by rockyl on 2018/11/5.
 *
 * 渲染上下文
 */

import {dirtyFieldTrigger} from "qunity-core";
import {QunityEngine} from "../QunityEngine";

/**
 * 缩放模式
 *
 * SHOW_ALL: 全可见
 * FIXED_WIDTH: 宽度固定
 * FIXED_HEIGHT: 高度固定
 */
export enum ScaleMode {
	SHOW_ALL = 'showAll',
	FIXED_WIDTH = 'fixedWidth',
	FIXED_HEIGHT = 'fixedHeight',
	NO_SCALE = 'noScale',
	NO_FIXED = 'noFixed',
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
	protected canvasContext;

	protected stageWidth: number;
	protected stageHeight: number;

	private _scaleX: number;
	private _scaleY: number;
	private _rotation: number = 0;

	protected dirtyFieldTriggerLock: boolean = false;

	private onUpdateScale: Function;

	private engine: QunityEngine;

	constructor(engine: QunityEngine) {
		this.engine = engine;
	}

	/**
	 * 设计宽度
	 */
	@dirtyFieldTrigger
	designWidth;
	/**
	 * 设计高度
	 */
	@dirtyFieldTrigger
	designHeight;
	/**
	 * 缩放模式
	 */
	@dirtyFieldTrigger
	scaleMode: ScaleMode;
	/**
	 * 是否修改画布的尺寸
	 */
	@dirtyFieldTrigger
	modifyCanvasSize;
	/**
	 * 是否自动调整舞台尺寸
	 */
	@dirtyFieldTrigger
	autoAdjustSize;

	private onModify(value, key, oldValue) {
		if (!this.dirtyFieldTriggerLock) {
			this.updateScaleModeSelf();
		}
	}

	/**
	 * 装配上下文
	 * @param options
	 */
	setup(options: RenderContextOption = <RenderContextOption>{}) {
		const {canvas, designWidth, designHeight, scaleMode = ScaleMode.SHOW_ALL, modifyCanvasSize = false, autoAdjustSize = false, onUpdateScale} = options;

		this.canvas = canvas;
		this.canvasContext = canvas.getContext('2d');

		this.dirtyFieldTriggerLock = true;

		this.designWidth = designWidth;
		this.designHeight = designHeight;
		this.scaleMode = scaleMode;
		this.modifyCanvasSize = modifyCanvasSize;
		this.autoAdjustSize = autoAdjustSize;
		this.onUpdateScale = onUpdateScale;

		this.dirtyFieldTriggerLock = false;

		this.updateScaleModeSelf();
	}

	/**
	 * 缩放x
	 */
	get scaleX(): number {
		return this._scaleX;
	}

	/**
	 * 缩放y
	 */
	get scaleY(): number {
		return this._scaleY;
	}

	/**
	 * 旋转
	 */
	get rotation(): number {
		return this._rotation;
	}

	/**
	 * 清空渲染上下文
	 */
	clear() {
		this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * 获取渲染上下文
	 */
	get context() {
		return this.canvasContext;
	}

	/**
	 * 获取舞台尺寸
	 */
	get stageSize() {
		return {
			width: this.stageWidth,
			height: this.stageHeight,
		}
	}

	/**
	 * 获取舞台缩放
	 */
	get stageScale() {
		return {
			x: this._scaleX,
			y: this._scaleY,
		}
	}

	/**
	 * 获取舞台中心
	 */
	get stageCenter() {
		return {
			x: this.stageWidth / 2,
			y: this.stageHeight / 2,
		}
	}

	/**
	 * 更新缩放模式
	 */
	private updateScaleModeSelf() {
		let {canvas, designWidth, designHeight, scaleMode, _rotation, modifyCanvasSize} = this;

		let parent = canvas.parentElement;
		let containerWidth = parent.clientWidth;
		let containerHeight = parent.clientHeight;

		const dWidth = designWidth || containerWidth;
		const dHeight = designHeight || containerHeight;

		let width, stageWidth;
		let height, stageHeight;

		let scaleX = containerWidth / dWidth;
		let scaleY = containerHeight / dHeight;

		let styleWidth;
		let styleHeight;

		//scale
		switch (scaleMode) {
			case ScaleMode.SHOW_ALL:

				break;
			case ScaleMode.NO_SCALE:
				scaleX = scaleY = 1;
				break;
			case ScaleMode.NO_FIXED:
				scaleX = scaleY = 1;
				break;
			case ScaleMode.FIXED_WIDTH:
			case ScaleMode.FIXED_HEIGHT:
				break;
		}

		//size
		switch (scaleMode) {
			case ScaleMode.SHOW_ALL:
				width = dWidth;
				height = dHeight;

				stageWidth = dWidth;
				stageHeight = dHeight;
				break;
			case ScaleMode.NO_SCALE:
				width = dWidth;
				height = dHeight;

				stageWidth = dWidth;
				stageHeight = dHeight;
				break;
			case ScaleMode.NO_FIXED:
				width = containerWidth;
				height = containerHeight;

				stageWidth = dWidth;
				stageHeight = dHeight;
				break;
			case ScaleMode.FIXED_WIDTH:
				width = dWidth;
				if (modifyCanvasSize) {
					height = dHeight;
				} else {
					height = containerHeight / scaleX;
				}
				scaleY = scaleX;

				stageWidth = width;
				stageHeight = height;
				break;
			case ScaleMode.FIXED_HEIGHT:
				if (modifyCanvasSize) {
					width = dWidth;
				} else {
					width = containerWidth / scaleY;
				}
				height = dHeight;
				scaleX = scaleY;

				stageWidth = width;
				stageHeight = height;
				break;
		}

		//styleSize
		switch (scaleMode) {
			case ScaleMode.SHOW_ALL:
				styleWidth = containerWidth;
				styleHeight = containerHeight;
				break;
			case ScaleMode.NO_FIXED:
				styleWidth = containerWidth;
				styleHeight = containerHeight;
				break;
			case ScaleMode.NO_SCALE:
				styleWidth = designWidth;
				styleHeight = designHeight;
				break;
			case ScaleMode.FIXED_WIDTH:
			case ScaleMode.FIXED_HEIGHT:
				styleWidth = modifyCanvasSize ? designWidth * scaleX : containerWidth;
				styleHeight = modifyCanvasSize ? designHeight * scaleY : containerHeight;
				break;
		}

		this.onUpdateScale(scaleX, scaleY, _rotation);

		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;
		this._scaleX = scaleX;
		this._scaleY = scaleY;

		canvas.width = width;
		canvas.height = height;
		canvas.style.display = 'block';
		canvas.style.width = styleWidth + 'px';
		canvas.style.height = styleHeight + 'px';
	}
}

/**
 * 创建canvas
 */
export function createCanvas() {
	return document.createElement('canvas');
}

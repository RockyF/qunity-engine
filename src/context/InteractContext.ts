/**
 * Created by rockyl on 2018/11/7.
 *
 * 交互上下文
 */

import {QunityEngine} from "../QunityEngine";

const ua = navigator.userAgent.toLowerCase();
const isMobile = (ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1);

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
	protected canvas;
	protected touchHandlers;
	protected scaleX;
	protected scaleY;
	protected rotation;

	private engine: QunityEngine;

	constructor(engine: QunityEngine) {
		this.engine = engine;
	}

	/**
	 * 装配上下文
	 * @param options
	 */
	setup(options: InteractContextOption = <InteractContextOption>{}) {
		const {canvas, touchHandlers, touchEnabled} = options;

		this.touchHandlers = touchHandlers;

		this.canvas = canvas;

		if (touchEnabled) {
			this.addListeners();
		}
	}

	/**
	 * 更新缩放模式
	 * @param scaleX
	 * @param scaleY
	 * @param rotation
	 */
	updateScale(scaleX, scaleY, rotation) {
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.rotation = rotation;
	}

	/**
	 * 适配鼠标事件
	 */
	private addListeners() {
		if (window.navigator.msPointerEnabled) {
			this.canvas.addEventListener("MSPointerDown", (event) => {
				event.identifier = event.pointerId;
				this.onTouchBegin(event);
				this.prevent(event);
			}, false);
			this.canvas.addEventListener("MSPointerMove", (event) => {
				event.identifier = event.pointerId;
				this.onTouchMove(event);
				this.prevent(event);
			}, false);
			this.canvas.addEventListener("MSPointerUp", (event) => {
				event.identifier = event.pointerId;
				this.onTouchEnd(event);
				this.prevent(event);
			}, false);
		} else {
			if (!isMobile) {
				this.addMouseListener();
			}
			this.addTouchListener();
		}
	}

	/**
	 * 阻断页面拖动
	 * @param event
	 */
	private prevent(event) {
		event.stopPropagation();
		if (event["isScroll"] != true && !this.canvas['userTyping']) {
			event.preventDefault();
		}
	}

	/**
	 * 增加鼠标事件
	 */
	private addMouseListener() {
		this.canvas.addEventListener("mousedown", this.onTouchBegin.bind(this));
		this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
		this.canvas.addEventListener("mouseup", this.onTouchEnd.bind(this));
	}

	/**
	 * 增加触摸事件
	 */
	private addTouchListener() {
		this.canvas.addEventListener("touchstart", (event) => {
			for (let touch of event.changedTouches) {
				this.onTouchBegin(touch);
			}
			this.prevent(event);
		}, false);
		this.canvas.addEventListener("touchmove", (event) => {
			for (let touch of event.changedTouches) {
				this.onTouchMove(touch);
			}
			this.prevent(event);
		}, false);
		this.canvas.addEventListener("touchend", (event) => {
			for (let touch of event.changedTouches) {
				this.onTouchEnd(touch);
			}
			this.prevent(event);
		}, false);
		this.canvas.addEventListener("touchcancel", (event) => {
			for (let touch of event.changedTouches) {
				this.onTouchEnd(touch);
			}
			this.prevent(event);
		}, false);
	}

	private onTouchBegin(event) {
		let location = this.getLocation(event);
		this.touchHandlers.onTouchBegin(location);
	}

	private onMouseMove(event) {
		if (event.buttons === 0) {
			this.onTouchEnd(event);
		} else {
			this.onTouchMove(event);
		}
	}

	private onTouchMove(event) {
		let location = this.getLocation(event);
		this.touchHandlers.onTouchMove(location);

	}

	private onTouchEnd(event) {
		let location = this.getLocation(event);
		this.touchHandlers.onTouchEnd(location);
	}

	private getLocation(event) {
		//return this.engine.pagePosToCanvasPos(event.pageX, event.pageY, event.identifier)
	}
}

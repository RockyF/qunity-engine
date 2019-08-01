/**
 * Created by rockyl on 2019-08-01.
 */
import {Component} from "qunity-core";

const interactiveMap = [
	'dealGlobalTouchBegin',
	'dealGlobalTouchMove',
	'dealGlobalTouchEnd',
];

export class QComponent extends Component {
	interactive: boolean = false;

	/**
	 * 当交互时
	 * @param type
	 * @param event
	 */
	onInteract(type, event) {
		try {
			return this['$' + interactiveMap[type]](event);
		} catch (e) {
			console.warn(e);
		}
	}

	/**
	 * @private
	 * @param e
	 */
	$dealGlobalTouchBegin(e) {
		return this.onGlobalTouchBegin(e);
	}

	/**
	 * @private
	 * @param e
	 */
	$dealGlobalTouchMove(e) {
		return this.onGlobalTouchMove(e);
	}

	/**
	 * @private
	 * @param e
	 */
	$dealGlobalTouchEnd(e) {
		return this.onGlobalTouchEnd(e);
	}

	/**
	 * 当全局触摸开始
	 * @param e
	 */
	onGlobalTouchBegin(e) {
		return false;
	}

	/**
	 * 当全触摸移动
	 * @param e
	 */
	onGlobalTouchMove(e) {
		return false;
	}

	/**
	 * 当全触摸结束
	 * @param e
	 */
	onGlobalTouchEnd(e) {
		return false;
	}
}

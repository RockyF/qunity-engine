/**
 * Created by rockyl on 2018/11/5.
 */

import {Component} from "qunity-core";
import {deepDirtyFieldDetector, dirtyFieldDetector, dirtyFieldTrigger, Matrix, Vector2D} from "../../../src";

/**
 * 矩阵处理顺序
 * SCALE_ROTATE: 先缩放后旋转
 * ROTATE_SCALE: 先旋转后缩放
 */
export enum MATRIX_ORDER {
	SCALE_ROTATE,
	ROTATE_SCALE,
}

/**
 * 矩阵转换组件
 * 缩放、旋转、位移
 */
export default class Transform extends Component {
	protected localPos: any = {};

	/**
	 * 坐标
	 */
	@dirtyFieldTrigger
	position: Vector2D = new Vector2D(0, 0);

	/**
	 * 全局坐标
	 */
	private _globalPosition: Vector2D = new Vector2D(0, 0);

	/**
	 * 节点透明度
	 */
	@dirtyFieldDetector
	alpha: number = 1;

	/**
	 * 节点渲染透明度
	 */
	private _renderAlpha: number;

	get renderAlpha(): number {
		return this._renderAlpha;
	}

	/**
	 * 影响子节点
	 */
	@dirtyFieldDetector
	affectChildren: boolean = true;

	/**
	 * 缩放
	 */
	@deepDirtyFieldDetector
	scale: Vector2D = new Vector2D(1, 1);
	/**
	 * 轴距
	 */
	@deepDirtyFieldDetector
	pivot: Vector2D = new Vector2D(0.5, 0.5);
	/**
	 * 旋转
	 */
	@dirtyFieldDetector
	rotation = 0;

	private order: MATRIX_ORDER = MATRIX_ORDER.SCALE_ROTATE;

	protected _localMatrix: Matrix = new Matrix();
	protected _globalMatrix: Matrix = new Matrix();
	protected _globalInvertMatrix: Matrix = new Matrix();
	protected _globalPivotMatrix: Matrix = new Matrix();
	protected dirty: boolean;

	/**
	 * 获取全局坐标
	 */
	get globalPosition() {
		this._globalPosition.setXY(this._globalMatrix.tx, this._globalMatrix.ty);
		return this._globalPosition;
	}

	/**
	 * 获取全局角度
	 */
	get globalRotation() {
		return this._globalMatrix.rotation * 180 / Math.PI;
	}

	/**
	 * 全局坐标转本地坐标
	 * @param position
	 */
	globalPositionToLocal(position?) {
		const matrix = this.getMatrix(true, true, true, true);
		matrix.transformPoint(position ? position.x : 0, position ? position.y : 0, this.localPos);

		return this.localPos;
	}

	/**
	 * 更新本地矩阵
	 */
	protected updateLocalMatrix() {
		const {
			position: {x, y},
			scale: {x: sx, y: sy}, rotation,
		} = this;

		const matrix = this._localMatrix;
		matrix.identity();

		if (this.order === MATRIX_ORDER.SCALE_ROTATE) {
			matrix.scale(sx, sy);
			matrix.rotate(rotation * Math.PI / 180);
		} else {
			matrix.rotate(rotation * Math.PI / 180);
			matrix.scale(sx, sy);
		}

		matrix.translate(
			x,
			y,
		);
	}

	/**
	 * 更新全局矩阵
	 */
	protected updateGlobalMatrix() {
		const {
			entity, _globalMatrix, _localMatrix, _globalPivotMatrix,
			pivot: {x: px, y: py},
			width, height,
		} = this;

		_globalMatrix.copyFrom(_localMatrix);

		if (entity.parent) {
			const parentTransform: Transform = entity.parent.components.getOne(Transform);
			if (parentTransform) {
				this._renderAlpha = parentTransform._renderAlpha * this.alpha;
				_globalMatrix.concat(parentTransform.getMatrix(true, false));
			} else {
				this._renderAlpha = this.alpha;
			}
		} else {
			this._renderAlpha = this.alpha;
		}

		if (this.entity.name === 'Miner') {
			console.log();
		}
		_globalPivotMatrix.copyFrom(_globalMatrix);
		const {a, d} = _globalMatrix;
		_globalPivotMatrix.translate(
			-(px - 0.5) * width * a,
			-(py - 0.5) * height * d,
		);
	}

	/**
	 * 获取矩阵
	 */
	getMatrix(withPivot: boolean = false, invert: boolean = false, affectChildren = false, invertOnlyTranslate = false): Matrix {
		let matrix;
		if (this.affectChildren || affectChildren) {
			matrix = withPivot ? this._globalPivotMatrix : this._globalMatrix;
			if (invert) {
				const invertMatrix = this._globalInvertMatrix;
				invertMatrix.copyFrom(matrix);
				if (invertOnlyTranslate) {
					invertMatrix.a = 1;
					invertMatrix.d = 1;
				}
				invertMatrix.invert();

				return invertMatrix;
			}
		} else {
			matrix = this.entity.parent.components.getOne(Transform).getMatrix(withPivot, invert);
		}

		return matrix;
	}

	onUpdate(t) {
		if (this.dirty) {
			this.updateLocalMatrix();
			this.dirty = false;
		}

		this.updateGlobalMatrix();

		super.onUpdate(t);
	}

	onEditorUpdate(t) {
		this.onUpdate(t);
	}
}

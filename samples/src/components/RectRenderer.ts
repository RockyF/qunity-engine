import {Component} from "qunity-core";
import {engine} from "../engine";
import Transform from "./Transform";

/**
 * Created by rockyl on 2019-08-01.
 */

export default class RectRenderer extends Component {
	private _ctx: CanvasRenderingContext2D;

	onCreate(): void {
		this._ctx = engine.renderContext.context;
	}

	onUpdate(t: number): void {
		const transform = this.entity.components.getOne(Transform);
		const ctx = this._ctx;

		if (transform) {
			ctx.setTransform.apply(ctx, transform.getMatrix().toArray());
		} else {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		}

		ctx.fillStyle = 'yellow';
		ctx.fillRect(-50, -50, 100, 100);
	}
}

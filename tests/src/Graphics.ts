/**
 * Created by rockyl on 2019-07-29.
 */

import {Entity, Component} from "qunity-core";
import {Matrix, QunityEngine} from "../../src";

let engine = new QunityEngine();
engine.setup({});

let root = engine.root;

let ctx = engine.renderContext.context;

class Graphics extends Component {
	private _matrix = new Matrix();

	onAwake(): void {

	}

	onUpdate(t: number): void {
		const r = t * 0.002;

		const matrix = this._matrix;

		matrix.identity();
		matrix.rotate(r * 2);
		matrix.translate(Math.cos(r) * 50 + 200, Math.sin(r) * 50 + 200);

		ctx.setTransform.apply(ctx, matrix.toArray());
		ctx.fillStyle = 'yellow';
		ctx.fillRect(-50, -50, 100, 100);
	}
}

let comp = new Graphics();
root.components.add(comp);

engine.start();

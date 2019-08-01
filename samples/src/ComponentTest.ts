/**
 * Created by rockyl on 2019-07-29.
 */

import {engine} from "./engine";
import Transform from "./components/Transform";
import RectRenderer from "./components/RectRenderer";
import Rotate from "./components/Rotate";

let root = engine.root;

let transform = new Transform();
transform.position.setXY(100, 100);
root.components.add(transform);

let rectRenderer = new RectRenderer();
root.components.add(rectRenderer);

let rotate = new Rotate();
setTimeout(()=>{
	root.components.add(rotate);
}, 1000);

engine.start();

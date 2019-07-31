/**
 * Created by rockyl on 2019-07-29.
 */

import {Entity, Component} from "qunity-core";
import {QunityEngine} from "../../src/QunityEngine";

let entity1 = new Entity('entity1');
let entity2 = new Entity('entity2');
let entity3 = new Entity('entity3');

entity1.enabled = true;
entity2.enabled = true;
entity3.enabled = true;

//entity1.addChild(entity2);
//entity2.addChild(entity3);

let engine = new QunityEngine();
engine.setup({});

let root = engine.root;

//root.addChild(entity1);

class TestComponent extends Component {
	onUpdate(t: number): void {
		console.log(t);
	}
}

let comp = new TestComponent();
root.components.add(comp);

engine.start();
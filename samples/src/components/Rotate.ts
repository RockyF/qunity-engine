/**
 * Created by rockyl on 2019-08-01.
 */

import {Component} from "qunity-core";
import Transform from "./Transform";

export default class Rotate extends Component {
	private _playing;
	private _timeStart;

	autoPlay = true;

	onAwake(): void {
		if(this.autoPlay){
			this.play();
		}
	}

	onUpdate(t: number): void {
		const transform = this.entity.components.getOne(Transform);

		if(this._playing){
			if(this._timeStart < 0){
				this._timeStart = t;
			}

			const dealtTime = t - this._timeStart;
			transform.rotation = dealtTime * 0.1;
		}
	}

	play(){
		this._playing = true;
		this._timeStart = -1;
	}

	stop(){
		this._playing = false;
	}
}

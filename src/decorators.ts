/**
 * Created by rockyl on 2018/11/9.
 *
 * 装饰器
 */

/**
 * 属性修改时触发
 * @param onModify
 */
export function fieldChanged(onModify) {
	return function (target: any, key: string) {
		const privateKey = '_' + key;
		Object.defineProperty(target, key, {
			enumerable: true,
			get: function () {
				return this[privateKey];
			},
			set: function (v) {
				const oldValue = this[privateKey];
				if (oldValue !== v) {
					this[privateKey] = v;
					onModify.apply(this, [v, key, oldValue]);
				}
			}
		})
	}
}

/**
 * 属性变脏时设置宿主的dirty属性为true
 */
export const dirtyFieldDetector = fieldChanged(
	function (value, key, oldValue) {
		this['dirty'] = true;
	}
);

/**
 * 深度属性变脏时设置宿主的dirty属性为true
 */
export const deepDirtyFieldDetector = fieldChanged(
	function (value, key, oldValue) {
		const scope = this;
		scope['dirty'] = true;
		if (typeof value === 'object') {
			value['onModify'] = function(){
				scope['dirty'] = true;
			};
		}
	}
);

/**
 * 属性变脏时触发onModify方法
 */
export const dirtyFieldTrigger = fieldChanged(
	function (value, key, oldValue) {
		this['onModify'] && this['onModify'](value, key, oldValue);
	}
);

/**
 * 深入属性变脏时触发onModify方法
 */
export const deepDirtyFieldTrigger = fieldChanged(
	function (value: any, key, oldValue) {
		if (this['onModify']) {
			this['onModify'](value, key, oldValue);

			if (typeof value === 'object') {
				value['onModify'] = this['onModify'];
			}
		}
	}
);

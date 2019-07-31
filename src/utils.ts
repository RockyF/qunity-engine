/**
 * Created by rockyl on 2019-04-22.
 *
 * 实体相关工具
 */

/**
 * 属性注入方法
 * @param target 目标对象
 * @param data 被注入对象
 * @param callback 自定义注入方法
 * @param ignoreMethod 是否忽略方法
 * @param ignoreNull 是否忽略Null字段
 *
 * @return 是否有字段注入
 */
export function injectProp(target: any, data?: any, callback?: Function, ignoreMethod: boolean = true, ignoreNull: boolean = true): boolean {
	if (!target || !data) {
		return false;
	}

	let result = false;
	for (let key in data) {
		let value: any = data[key];
		if ((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null) && key.indexOf('_') !== 0 && key.indexOf('$') !== 0) {
			if (callback) {
				callback(target, key, value);
			} else {
				try {
					target[key] = value;
				} catch (e) {

				}
			}

			result = true;
		}
	}
	return result;
}

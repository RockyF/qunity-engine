/**
 * Created by rockyl on 2018-12-05.
 *
 * 引擎配置
 */

import {injectProp} from "./utils";

/**
 * 针对引擎的配置
 */
export const EngineConfig = {
	/**
	 * 是否是编辑器模式
	 */
	editorMode: false,
};

/**
 * 注入配置
 * @param _options
 */
export function modifyEngineConfig(_options) {
	injectProp(EngineConfig, _options);
}

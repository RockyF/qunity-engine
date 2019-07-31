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
export declare function injectProp(target: any, data?: any, callback?: Function, ignoreMethod?: boolean, ignoreNull?: boolean): boolean;

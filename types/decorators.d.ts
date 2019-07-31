/**
 * Created by rockyl on 2018/11/9.
 *
 * 装饰器
 */
/**
 * 属性修改时触发
 * @param onModify
 */
export declare function fieldChanged(onModify: any): (target: any, key: string) => void;
/**
 * 属性变脏时设置宿主的dirty属性为true
 */
export declare const dirtyFieldDetector: (target: any, key: string) => void;
/**
 * 深度属性变脏时设置宿主的dirty属性为true
 */
export declare const deepDirtyFieldDetector: (target: any, key: string) => void;
/**
 * 属性变脏时触发onModify方法
 */
export declare const dirtyFieldTrigger: (target: any, key: string) => void;
/**
 * 深入属性变脏时触发onModify方法
 */
export declare const deepDirtyFieldTrigger: (target: any, key: string) => void;

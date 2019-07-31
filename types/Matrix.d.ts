/**
 * Created by rockyl on 2018/11/6.
 *
 * 矩阵 3x3
 */
/**
 * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
 * 您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix
 * 对象应用于显示对象的 matrix 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
 */
export declare class Matrix {
    a: any;
    b: any;
    c: any;
    d: any;
    tx: any;
    ty: any;
    /**
     * 释放一个Matrix实例到对象池
     * @param matrix 需要回收的 matrix
     */
    static release(matrix: any): void;
    /**
     * 从对象池中取出或创建一个新的Matrix对象。
     */
    static create(): any;
    /**
     * 使用指定参数创建一个 Matrix 对象
     * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
     * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
     * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
     * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
     * @param tx 沿 x 轴平移每个点的距离。
     * @param ty 沿 y 轴平移每个点的距离。
     */
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
    /**
     * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
     */
    clone(): any;
    /**
     * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。在数学术语中，将两个矩阵连接起来与使用矩阵乘法将它们结合起来是相同的。
     * @param other 要连接到源矩阵的矩阵。
     */
    concat(other: any): void;
    /**
     * 将源 Matrix 对象中的所有矩阵数据复制到调用方 Matrix 对象中。
     * @param other 要拷贝的目标矩阵
     */
    copyFrom(other: any): this;
    /**
     * 为每个矩阵属性设置一个值，该值将导致矩阵无转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。
     * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
     */
    identity(): void;
    /**
     * 执行原始矩阵的逆转换。
     * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
     */
    invert(): void;
    /**
     * @private
     */
    $invertInto(target: any): void;
    /**
     * 对 Matrix 对象应用旋转转换。
     * rotate() 方法将更改 Matrix 对象的 a、b、c 和 d 属性。
     * @param radian 以弧度为单位的旋转角度。
     */
    rotate(radian: any): void;
    /**
     * 获取弧度
     */
    readonly rotation: number;
    /**
     * 对矩阵应用缩放转换。x 轴乘以 sx，y 轴乘以 sy。
     * scale() 方法将更改 Matrix 对象的 a 和 d 属性。
     * @param sx 用于沿 x 轴缩放对象的乘数。
     * @param sy 用于沿 y 轴缩放对象的乘数。
     */
    scale(sx: any, sy: any): void;
    /**
     * 将 Matrix 的成员设置为指定值
     * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
     * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
     * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
     * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
     * @param tx 沿 x 轴平移每个点的距离。
     * @param ty 沿 y 轴平移每个点的距离。
     */
    setTo(a: any, b: any, c: any, d: any, tx: any, ty: any): this;
    /**
     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
     * @param pointX 想要获得其矩阵转换结果的点的x坐标。
     * @param pointY 想要获得其矩阵转换结果的点的y坐标。
     * @param resultPoint 框架建议尽可能减少创建对象次数来优化性能，可以从外部传入一个复用的Point对象来存储结果，若不传入将创建一个新的Point对象返回。
     * @returns Object 由应用矩阵转换所产生的点。
     */
    transformPoint(pointX: any, pointY: any, resultPoint: any): any;
    /**
     * 如果给定预转换坐标空间中的点，则此方法返回发生转换后该点的坐标。
     * 与使用 transformPoint() 方法应用的标准转换不同，deltaTransformPoint() 方法的转换不考虑转换参数 tx 和 ty。
     * @param pointX 想要获得其矩阵转换结果的点的x坐标。
     * @param pointY 想要获得其矩阵转换结果的点的y坐标。
     * @param resultPoint 框架建议尽可能减少创建对象次数来优化性能，可以从外部传入一个复用的Point对象来存储结果，若不传入将创建一个新的Point对象返回。
     */
    deltaTransformPoint(pointX: any, pointY: any, resultPoint: any): any;
    /**
     * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
     * @param dx 沿 x 轴向右移动的量（以像素为单位）。
     * @param dy 沿 y 轴向下移动的量（以像素为单位）。
     */
    translate(dx: any, dy: any): void;
    /**
     * 是否与另一个矩阵数据相等
     * @param other 要比较的另一个矩阵对象。
     * @returns 是否相等，ture表示相等。
     */
    equals(other: any): boolean;
    /**
     * 前置矩阵
     * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值
     * @param b 缩放或旋转图像时影响像素沿 y 轴定位的值
     * @param c 缩放或旋转图像时影响像素沿 x 轴定位的值
     * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值
     * @param tx 沿 x 轴平移每个点的距离
     * @param ty 沿 y 轴平移每个点的距离
     * @returns 矩阵自身
     */
    prepend(a: any, b: any, c: any, d: any, tx: any, ty: any): this;
    /**
     * 后置矩阵
     * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值
     * @param b 缩放或旋转图像时影响像素沿 y 轴定位的值
     * @param c 缩放或旋转图像时影响像素沿 x 轴定位的值
     * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值
     * @param tx 沿 x 轴平移每个点的距离
     * @param ty 沿 y 轴平移每个点的距离
     * @returns 矩阵自身
     */
    append(a: any, b: any, c: any, d: any, tx: any, ty: any): this;
    /**
     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
     * @returns 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
     */
    toString(): string;
    /**
     * 包括用于缩放、旋转和转换的参数。当应用于矩阵时，该方法会基于这些参数设置矩阵的值。
     * @param scaleX 水平缩放所用的系数
     * @param scaleY 垂直缩放所用的系数
     * @param rotation 旋转量（以弧度为单位）
     * @param tx 沿 x 轴向右平移（移动）的像素数
     * @param ty 沿 y 轴向下平移（移动）的像素数
     */
    createBox(scaleX: any, scaleY: any, rotation?: number, tx?: number, ty?: number): void;
    /**
     * 创建 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法所需的矩阵的特定样式。
     * 宽度和高度被缩放为 scaleX/scaleY 对，而 tx/ty 值偏移了宽度和高度的一半。
     * @param width 渐变框的宽度
     * @param height 渐变框的高度
     * @param rotation 旋转量（以弧度为单位）
     * @param tx 沿 x 轴向右平移的距离（以像素为单位）。此值将偏移 width 参数的一半
     * @param ty 沿 y 轴向下平移的距离（以像素为单位）。此值将偏移 height 参数的一半
     */
    createGradientBox(width: any, height: any, rotation?: number, tx?: number, ty?: number): void;
    /**
     * @private
     */
    $transformBounds(bounds: any): void;
    /**
     * @private
     */
    getDeterminant(): number;
    /**
     * @private
     */
    $getScaleX(): any;
    /**
     * @private
     */
    $getScaleY(): any;
    /**
     * @private
     */
    $getSkewX(): number;
    /**
     * @private
     */
    $getSkewY(): number;
    /**
     * @private
     */
    $updateScaleAndRotation(scaleX: any, scaleY: any, skewX: any, skewY: any): void;
    /**
     * @private
     * target = other * this
     */
    $preMultiplyInto(other: any, target: any): void;
    toArray(): any[];
}

export default {
  plugins: {
    // px 自动转 rem：设计稿量出多少 px 就写多少 px，构建时自动换算
    // rootValue: 16 → 1rem = 16px（与 html font-size: clamp(14px,...,18px) 对应）
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],          // 转换所有 CSS 属性
      unitPrecision: 4,         // 保留 4 位小数
      minPixelValue: 2,         // 小于 2px 的不转（避免边框变成 0.xx rem）
      exclude: /node_modules/,
    },
    // 命名断点支持：@media (--desktop) { } 语法
    'postcss-custom-media': {},
    // 其他现代 CSS 语法降级（嵌套、:is() 等）
    'postcss-preset-env': {
      stage: 2,
      features: {
        'nesting-rules': true,
      },
    },
  },
}

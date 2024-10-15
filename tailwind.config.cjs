/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 10:26:27
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-07-15 18:23:20
 */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,vue,html}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      animation: {
        blink: "blink 0.4s infinite"
      },
      keyframes: {
        blink: {
          "0%": {
            transform: "scaleY(1)"
          },
          "50%": {
            transform: "scaleY(0.8)"
          },
          "100%": {
            transform: "scaleY(1)"
          }
        }
      }
    }
  }
};

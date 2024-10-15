/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 09:47:44
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-10-15 14:35:26
 */
import autoprefixer from "autoprefixer";
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createHtmlPlugin } from "vite-plugin-html";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path, { resolve } from "path";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  console.log(`\n\t\x1B[1m当前环境：\x1B[22m \x1B[32m${mode}\x1B[39m`);
  console.log(`\t\x1B[1m接口地址：\x1B[22m \x1B[32m${env.VITE_APP_SERVER || ""}\x1B[39m\n`);

  return {
    server: {
      host: "0.0.0.0",
      port: 8000,
      proxy: {
        "/gpt/": {
          target: env.VITE_GPT_SERVER,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gpt\//, "/")
        }
      }
    },
    resolve: {
      alias: {
        "@/": `/${resolve(__dirname, "src")}/`
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false // css in js
          })
        ]
      }),
      createSvgIconsPlugin({
        symbolId: "icon-[dir]-[name]",
        iconDirs: [path.resolve(process.cwd(), "src/assets")]
      }),
      createHtmlPlugin({
        entry: "src/main.ts",
        template: "index.html",
        inject: {
          data: {
            title: env.VITE_APP_TITLE
          }
        }
      })
    ],
    build: {
      assetsDir: "static",
      cssCodeSplit: true,
      outDir: "dist",
      rollupOptions: {
        onwarn: () => {
          return;
        },
        input: {
          index: resolve(__dirname, "index.html")
        },
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      },
      minify: "esbuild",
      target: "es2020",
      sourcemap: true
    },
    optimizeDeps: {
      include: ["ant-design-vue"]
    },
    css: {
      preprocessorOptions: {
        less: {
          math: "always",
          javascriptEnabled: true,
          globalVars: {
            "primary-color": "#3569E9"
          }
        }
      },
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer({ grid: true }) as any,
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule: { name: string; remove: () => void }) => {
                if (atRule.name === "charset") atRule.remove();
              }
            }
          }
        ]
      }
    }
  };
});

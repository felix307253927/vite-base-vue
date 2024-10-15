/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 09:47:44
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-10-15 14:35:26
 */
import { createApp } from "vue";
import App from "./App.vue";
import store from "@/store";
import router from "@/router";
import "virtual:svg-icons-register";
import "nprogress/nprogress.css";
import "./style/tailwind.css";
import "./style/index.less";
const app = createApp(App);
app.config.errorHandler = (err) => {
  console.log("Vue error:", err);
};
app.use(store).use(router).mount("#app");

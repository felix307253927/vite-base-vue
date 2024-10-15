/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 17:55:29
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-08-26 09:52:50
 */
import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Index.vue")
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/error/403.vue")
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue")
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/error/500.vue")
  }
];

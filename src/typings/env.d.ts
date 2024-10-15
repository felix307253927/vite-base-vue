/*
 * @Author             : ssh
 * @Email              : shanshenghui@unisound.com
 * @Date               : 2024-07-18 11:12:42
 * @LastEditors: cm
 * @LastEditTime: 2024-07-18 15:38:13
 */
/// <reference types="vite/client" />

declare module "*.vue" {
  import { Component } from "vue";
  const component: Component;
  export default component;
}
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

declare module "segmentit";

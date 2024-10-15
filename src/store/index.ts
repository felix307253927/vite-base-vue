/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 11:12:21
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-07-08 11:12:26
 */

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

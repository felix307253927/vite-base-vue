/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-09 17:54:43
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-10-15 15:03:21
 */
import { useAppStore } from "@/store/appStore";
import { useUserStore } from "@/store/userStore";
import { Router } from "vue-router";

const LoginName = "Login";
// 运营平台
export const whiteList: string[] = ["/login", "/404", "/403", "/500"];

export async function permissions(router: Router) {
  router.beforeEach(async (to, from) => {
    // 不需要权限判断，正常跳转
    if (whiteList.includes((to.name as string) || "")) {
      return true;
    }

    const { token, isLogoutAction } = useUserStore();
    const appStore = useAppStore();
    if (token && !isLogoutAction) {
      if (!appStore.menus.length /* || (to.name == Path404 && from.path == "/") */) {
        // 加载菜单和字典项
        await appStore.loadMenu();
      }
      // 权限判断
      // if (!appStore.authMap.has(to.path)) {
      //   return { name: "404" };
      // }

      // 登录拦截
      if (to.name === LoginName) {
        // 已登录时，如果输入的login路由，则跳转到首页
        // const app = appStore.apps.find((m) => m.resourceStatus === 0);
        // if (app) {
        //   const path = app.children ? app.children[0].path : app.path;
        //   return path;
        // }
      }

      return true;
    } else if (LoginName !== (to.name as string)) {
      return { name: LoginName };
    }
  });
}

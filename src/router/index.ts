/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 11:57:44
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-10-15 14:53:56
 */
import { createRouter, createWebHashHistory, RouteRecordName, RouteRecordRaw } from "vue-router";
import { routes as constantRoutes } from "./routes";
import { asyncRoutes } from "./asyncRoutes";
import { permissions, whiteList } from "./permissions";

export const ROUTE_MAP = new Map();

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...constantRoutes,
    ...asyncRoutes,
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404"
    }
  ] as RouteRecordRaw[]
});
router.afterEach((_to, _from, failure) => {
  // 捕获动态导入模块失败的错误(尝试解决每次更新后，动态导入模块失败，导致页面无法跳转的问题)
  if (failure) {
    console.log("Router failure", failure);
  }
});

permissions(router);

const addRouter = (routes: RouteRecordRaw[]) => {
  routes.forEach((route: RouteRecordRaw) => {
    if (route.name && !router.hasRoute(route.name)) {
      router.addRoute(route as RouteRecordRaw);
    }
    if (route.children) {
      addRouter(route.children);
    }
  });
  if (!router.hasRoute("NotFound"))
    router.addRoute({
      path: "/:pathMatch(.*)*",
      redirect: "/404",
      name: "NotFound",
      meta: {
        title: "404",
        hidden: true
      }
    });
};

export const resetRouter = (routes: RouteRecordRaw[] = []) => {
  router.getRoutes().forEach((route) => {
    if (route.name) {
      const routeName: RouteRecordName = route.name;
      router.hasRoute(routeName) && router.removeRoute(routeName);
    }
  });
  addRouter([...constantRoutes, ...routes]);
};

export function authPathMap(menu: MenuItem, parentPath: string = "", map?: Map<string, boolean>) {
  if (!map) {
    map = new Map<string, boolean>();
    whiteList.forEach((key) => map?.set(key, true));
  }
  const path = menu.path?.startsWith("/") ? menu.path : `${parentPath ? `${parentPath}/` : ""}${menu.path}`;
  map.set(path, true);
  menu.childList?.forEach((it) => authPathMap(it, path, map));
  return map;
}

export default router;

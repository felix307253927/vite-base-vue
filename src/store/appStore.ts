/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 19:21:47
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-10-15 14:58:03
 */
import { defineStore } from "pinia";
import { loadMenu } from "@/api/user";
import { authPathMap } from "@/router";
import { pick } from "lodash-es";

function initApp() {
  return {
    appType: 0,
    terrace: import.meta.env.VITE_APP_TERRACE,
    apps: [] as MenuItem[],
    menus: [] as MenuItem[],
    authMap: new Map<string, boolean>()
  };
}

export const useAppStore = defineStore("app", {
  state: initApp,
  actions: {
    async resetAll() {
      const state = initApp();
      Object.assign(this, pick(state, ["apps", "menus", "authMap"]));
    },
    async loadMenu() {
      return loadMenu().then((res: any) => {
        const data = res?.data ?? {};
        const menu = data?.menu ?? {};
        this.apps = [];
        this.authMap = authPathMap(menu);
        this.menus = this.initMenus(menu).children || [];
      });
    },
    /** 重置菜单
     * @param menus 可选如果传了则使用传入的menus重置， 否则根据接口加载的菜单进行重置
     */
    resetMenus(menus: MenuItem[]) {
      this.menus = [...menus];
    },
    /**
     * 初始化菜单，不要在外部调用
     * @param menu 菜单
     * @returns
     */
    initMenus(menu: MenuItem): MenuItem {
      menu.key = menu.path;
      menu.title = menu.name;
      menu.label = menu.title;
      if (menu.childList) {
        const childrens = menu.childList.map((m) => this.initMenus(m));
        if (childrens.length) {
          menu.children = childrens;
        }
      }
      delete menu.childList;
      if (menu.resourceStatus === 0) {
        menu.appType = 0;
        this.apps.push(menu);
      }
      return menu;
    },
    setTerrace(terrace: string) {
      this.terrace = terrace;
    }
  },
  persist: {
    serializer: {
      serialize: (value) => {
        let authMap: any[] = [];
        if (value.authMap instanceof Map) {
          authMap = Array.from(value.authMap.entries());
        }
        return JSON.stringify({ ...value, authMap });
      },
      deserialize: (value) => {
        try {
          const state = JSON.parse(value);
          state.authMap = new Map(state.authMap || []);
          return state;
        } catch (error) {
          console.log("persist parse Error", value);
        }
      }
    }
  }
});

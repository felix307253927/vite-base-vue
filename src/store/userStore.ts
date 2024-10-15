/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 11:11:22
 * @LastEditors: cm
 * @LastEditTime: 2024-07-18 14:31:01
 */

import { defineStore } from "pinia";
import { router } from "@/router/index.ts";
import { message } from "ant-design-vue";
import { useAppStore } from "./appStore.ts";

function initUser() {
  return {
    token: "", // token
    tenantId: 0, // 租户 id
    tenantList: [] as { name: string; id: number }[],
    userInfo: {
      avatar: "",
      mobile: "",
      token: "",
      userId: 0,
      userName: "",
      tenantList: []
    },
    menuExpand: true, // 是否收起菜单
    menuWidth: 310, // 菜单宽
    domain: "",
    spaceId: "4b581bcaab97473dbd84381885e434b0",
    spaceList: [], //空间列表
    permissions: [], //功能权限
    isLogoutAction: false // 点击退出登录时将其设为true，表示这次的路由跳转是退出登录，在router.beforeEach中会使用到
  };
}

export const useUserStore = defineStore("user", {
  state: initUser,
  getters: {
    currentEnterprise: (state) => state.tenantList.find((item) => item.id === state.tenantId),
    getDomain(state) {
      return state.domain;
    },
    getSpaceId(state) {
      return state.spaceId;
    },
    getMenuExpand(state) {
      return state.menuExpand;
    },
    getSpaceList: (state) => {
      return state.spaceList || [];
    },
    getMenuWidth: (state) => {
      return state.menuWidth || [];
    },
    getPermissions: (state) => {
      return state.permissions || [];
    },
    getUserInfo: (state) => {
      return state.userInfo || [];
    }
  },
  actions: {
    setPermissions(list: any) {
      this.permissions = list;
    },
    setSpaceList(list: any) {
      this.spaceList = list;
    },
    setToken(payload: string) {
      this.token = payload;
    },
    setSpaceId(payload: string) {
      this.spaceId = payload;
    },
    setDomain(payload: string) {
      this.domain = payload;
    },
    setMenuExpand(payload: boolean) {
      this.menuExpand = payload;
    },
    setMenuWidth(payload: number) {
      this.menuWidth = payload;
    },
    // 设置企业列表，默认选中第一个企业
    setTenantList(tenantList: { name: string; id: number }[]) {
      this.tenantList = tenantList;
      this.setTenantId(tenantList[0].id);
    },
    // 设置当前企业
    setTenantId(tenantId: number) {
      this.tenantId = tenantId;
    },
    // 设置用户信息
    setUserInfo(userInfo: any) {
      Object.assign(this.userInfo, userInfo);
      this.token = this.userInfo.token;
    },
    async resetAll() {
      Object.assign(this, initUser());
      useAppStore().resetAll();
    },
    async login() {
      console.log(useAppStore().menus);
      await useAppStore().loadMenu();
      const app = useAppStore().apps.find((m) => m.resourceStatus === 0);
      if (app) {
        const path = app.children ? app.children[0].path : app.path;
        await router.push({ path: path });
        message.success("登录成功");
      }
    },
    async logout() {
      this.isLogoutAction = true;
      try {
        const res = await router.push({ name: "Login", params: { logout: "true" } });
        if (!res) {
          // 退出登录的导航成功
          this.resetAll();
          message.success("退出登录成功");
        }
      } finally {
        this.isLogoutAction = false;
      }
    }
  },
  persist: true
});

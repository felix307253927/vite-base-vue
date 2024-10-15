<script setup lang="tsx">
import { Avatar, ItemType, Menu } from "ant-design-vue";
import { useAppStore } from "@/store/appStore";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PersonalCenter from "./PersonalCenter.vue";

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const whiteList = ["/home/server"];

const menus = computed(() => {
  return appStore.menus.map((m) => {
    m = { ...m };
    if (typeof m.icon == "string") {
      (m as any).icon = (
        <span>
          <Avatar size={36} src={`/imgs/icon_${m.icon}.svg`} />
          <Avatar class="hidden" size={36} src={`/imgs/icon_${m.icon}_selected.svg`} />
        </span>
      );
    }
    m.id = `${m.id}`; // menu 组件的id类型为 string
    return m as ItemType;
  });
});

const activeKey = computed(() => {
  const arr = route.matched.map((m) => {
    // 默认定位到路由菜单首页
    if (typeof m.redirect == "string") {
      return m.redirect;
    }
    return m.path;
  });
  if (arr.length > 1 && whiteList.includes(arr[0])) {
    return arr.slice(1);
  }
  return arr;
});

function handleClick(e: any) {
  if (appStore.authMap.has(e.key)) {
    router.push(e.key);
  } else {
    router.push("/404");
  }
}
</script>
<template>
  <a-layout-sider :collapsed="true" theme="light" class="!w-16 !min-w-16 !basis-16">
    <div class="h-screen flex flex-col justify-between py-4 shadow-lg">
      <div class="flex flex-col items-center grow">
        <!-- <Avatar class="w-9 h-14 mb-4" shape="square" src="/imgs/icon_logo.svg" /> -->
        <img class="mb-[40px]" style="width: 48px; height: 54px" src="/imgs/icon_logo1.svg" />
        <Menu
          class="!w-full border-e-0"
          mode="inline"
          theme="light"
          :selectedKeys="activeKey"
          collapsed
          :items="menus"
          @click="handleClick"
        ></Menu>
      </div>
      <!-- <Menu class="!w-full border-e-0" mode="inline" collapsed @click="handleClick">
        <SubMenu>
          <template #icon>
            <Avatar class="w-9 h-9" shape="square" src="/imgs/img_avatar@2x.png" />
          </template>
          <div>11111111111</div>
          <MenuItem key="/profile/index" title="个人中心">个人中心</MenuItem>
          <MenuDivider />
          <MenuItem key="/logout" title="退出">退出</MenuItem>
        </SubMenu>
      </Menu> -->
      <PersonalCenter></PersonalCenter>
    </div>
  </a-layout-sider>
</template>
<style lang="less" scoped>
:deep(.ant-menu) {
  &.ant-menu-vertical {
    border-inline-end: none;
  }
  > .ant-menu-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0;
    height: 64px;
    .ant-menu-title-content {
      color: #5d6982;
      margin: -4px 0 0;
      font-size: 13px;
      opacity: 1;
      line-height: 1.25;
    }
    &.ant-menu-item-selected {
      .ant-menu-title-content {
        color: #1677ff;
      }
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 12px;
        border-right: 4px solid #1677ff;
      }
      .ant-avatar {
        display: none;
        &.hidden {
          display: block;
        }
      }
    }
  }
  .ant-menu-submenu {
    .ant-menu-submenu-title {
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

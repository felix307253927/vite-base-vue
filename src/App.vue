<script setup lang="ts">
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { RouterView } from "vue-router";
import { throttle } from "lodash-es";

dayjs.locale("cn");

const inputConfig = { autocomplete: "off" };

const getPopupContainer = throttle((el: HTMLDivElement, dialogContext: any) => {
  if (dialogContext) {
    return dialogContext.getDialogWrap();
  }
  // else if (el && el.parentElement) {
  //   let parent: HTMLElement | null = el.parentElement;
  //   // console.log("getPopupContainer");
  //   while (parent) {
  //     // table 表格有overflow导致显示不全
  //     if (parent.classList.contains("ant-table")) {
  //       return parent;
  //     }
  //     parent = parent.parentElement;
  //   }
  //   return el.parentElement;
  // }
  else {
    return document.body;
  }
}, 400);
</script>

<template>
  <a-config-provider :locale="zhCN" :getPopupContainer="getPopupContainer" :input="inputConfig">
    <RouterView />
  </a-config-provider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

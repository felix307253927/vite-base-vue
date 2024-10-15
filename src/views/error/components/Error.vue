<template>
  <div class="error-container">
    <div class="error-content">
      <div class="pic-error">
        <SvgIcon class="error-svg" :name="icon" />
      </div>
      <div class="bullshit">
        <div class="bullshit-oops">{{ oops }}</div>
        <div class="bullshit-headline">{{ headline }}</div>
        <div class="bullshit-info">{{ info }}</div>
        <router-link v-slot="{ navigate }" custom :to="url || home">
          <Button type="primary" @click="navigate">{{ btn }}</Button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "ant-design-vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { useAppStore } from "@/store/appStore";
import { computed } from "vue";

const appStore = useAppStore();

withDefaults(
  defineProps<{
    oops: string;
    headline: string;
    info: string;
    btn: string;
    icon: string;
    url: string;
  }>(),
  {
    oops: "抱歉！",
    btn: "返回首页"
  }
);
const home = computed(() => {
  const app = appStore.apps.find((m) => m.resourceStatus === 0);
  if (app) {
    const path = app.children ? app.children[0].path : app.path;
    return path;
  }
  return "/login";
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>

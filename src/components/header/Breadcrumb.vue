<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from "ant-design-vue";
import { useRoute } from "vue-router";

defineProps<{ desc?: string }>();

const route = useRoute();
const matched = route.matched.filter((m) => !!m.meta?.name && !!m.redirect);
// console.log(route, matched);
</script>
<template>
  <div class="px-10 bg-white shadow-lg shadow-slate-100" :class="desc ? 'h-28 py-7' : 'h-16 py-5'">
    <Breadcrumb>
      <BreadcrumbItem v-for="m in matched" :key="m.path">
        <RouterLink :to="m.path">{{ m.meta?.name }}</RouterLink>
      </BreadcrumbItem>
      <BreadcrumbItem>{{ route.meta?.name }}</BreadcrumbItem>
    </Breadcrumb>
    <slot name="desc">
      <div v-if="desc" class="text-gray-400 mt-4">{{ desc }}</div>
    </slot>
  </div>
</template>
<style lang="less" scoped></style>

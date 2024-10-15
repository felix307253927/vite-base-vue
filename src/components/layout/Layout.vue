<script setup lang="ts">
import { RouterView } from "vue-router";
import Sidebar from "./Sidebar.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <a-layout class="h-full">
    <Sidebar />
    <a-layout class="h-full">
      <a-layout-content
        class="h-full bg-[#F7F8FC]"
        :class="route.path == '/knowledge/editor' ? 'overflow-hidden' : 'overflow-auto'"
      >
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

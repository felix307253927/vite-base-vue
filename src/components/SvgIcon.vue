<script setup lang="ts">
import { computed } from "vue";
defineOptions({ name: "SvgIcon" });
const props = withDefaults(defineProps<{ name: string; color?: string }>(), {
  color: "#636975"
});

const symbolId = computed(() => `#icon-${props.name}`);
</script>
<template>
  <svg>
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

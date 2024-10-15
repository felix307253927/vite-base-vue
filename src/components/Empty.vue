<script setup lang="ts">
import { Empty, EmptyProps } from "ant-design-vue";
import emptyImg from "@/assets/image/empty.png";
withDefaults(defineProps<EmptyProps>(), {
  image: () => emptyImg,
  imageStyle: () => ({
    height: "200px"
  })
});
</script>
<template>
  <Empty :description="description" :image="image" :imageStyle="imageStyle" />
</template>

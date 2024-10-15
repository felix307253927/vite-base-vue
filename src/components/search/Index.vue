<template>
  <a-input class="w-[320px]" :size="size" :placeholder="placeholder" v-model:value="value" @change="handleChange">
    <template #prefix>
      <SearchOutlined style="color: #8b929f" />
    </template>
  </a-input>
</template>

<script setup lang="ts">
import { SearchOutlined } from "@ant-design/icons-vue";
import { debounce } from "lodash-es";

withDefaults(defineProps<{ placeholder: string; size?: string }>(), {
  placeholder: "请输入"
});
const value = defineModel("value");
const emit = defineEmits(["search", "change"]);

const handleChange = debounce(function handleChange(event: any) {
  emit("search", event);
  emit("change", event);
}, 300);
</script>

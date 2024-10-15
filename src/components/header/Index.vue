<template>
  <div class="page-header">
    <div class="flex items-center">
      <img class="back mr-[15px]" src="@/assets/icon_back.svg" @click="handleClickBack" />
      <div>
        <div class="name">
          <a-typography-text class="w-full" :content="name" :ellipsis="{ tooltip: name }"></a-typography-text>
        </div>
        <div class="creator" v-if="creator">
          <img src="@/assets/image/agent/icon_from.svg" alt="" />
          {{ creator }}
        </div>
      </div>
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ name?: string; creator?: string; title: string }>();
const emit = defineEmits(["back"]);

function handleClickBack() {
  emit("back");
}
</script>

<style scoped lang="less">
.page-header {
  height: 72px;
  display: flex;
  align-items: center;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 4px 24px 0px rgba(79, 97, 161, 0.06);
  .back {
    cursor: pointer;
    margin-left: 32px;
  }
  .name {
    width: 200px;
    :deep(.ant-typography) {
      font-weight: 600;
      font-size: 20px;
      color: #232730;
    }
  }
  .creator {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #8b929f;
    line-height: 14px;
    margin-top: 4px;
    img {
      margin-right: 4px;
    }
  }
  .title {
    font-size: 24px;
    font-weight: 500;
    color: #232730;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<template>
  <div :class="[className]">
    <a-table v-bind="$attrs">
      <template v-for="(_slot, key) in $slots" #[key]="slotProps" :key="key">
        <slot :name="key" v-bind="slotProps"></slot>
      </template>
      <template #emptyText>
        <Empty></Empty>
        <slot name="extraEmpty"></slot>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Empty from "@/components/Empty.vue";

const props = withDefaults(defineProps<{ type?: string }>(), { type: "large" });
const className = computed(() => `sy-table-${props.type}`);
</script>

<style lang="less">
.sy-table-large {
  // 外部白色包围
  .ant-table-wrapper .ant-table table {
    border-radius: 8px;
    padding: 0 32px;
    background-color: #fff;
    border-collapse: separate;
    border-spacing: 0 24px;
    .ant-table-thead > tr .ant-table-cell {
      background-color: transparent;
      color: #636975;
      font-weight: 400;
      border-bottom: 0;
      padding-block: 0;
      line-height: 1;
    }
    .ant-table-tbody > tr.ant-table-row {
      height: 88px;
      background-color: #f7f8fc;
      border-radius: 8px;
      padding-inline: 1px;
      td.ant-table-cell:first-child {
        border-bottom-left-radius: 8px;
        border-top-left-radius: 8px;
      }
      td.ant-table-cell:last-child {
        border-bottom-right-radius: 8px;
        border-top-right-radius: 8px;
      }
      td.ant-table-cell {
        background-color: #f7f8fc;
        border: none;
      }
    }
    // fix 解决 table 使用了border-spacing之后多选框样式错乱的问题
    .ant-table-selection-column {
      border-spacing: 0;
    }
  }
  // 解决 body 离表头间距大的问题
  .ant-table-body table {
    transform: translateY(calc(-48px + 2px));
  }
}
.sy-table-small {
  border-radius: 8px;
  border: 1px solid #dbe0f1;
  overflow: hidden;
  // 外部白色包围
  .ant-table-wrapper .ant-table table {
    padding: 0 32px;
    border-collapse: separate;
    border-spacing: 0 12px;
    .ant-table-thead > tr .ant-table-cell {
      background-color: transparent;
      color: #636975;
      font-weight: 400;
      border-bottom: 0;
      padding-block: 0;
      line-height: 1;
    }
    .ant-table-tbody > tr.ant-table-row {
      height: 72px;
      background-color: #f7f8fc;
      td.ant-table-cell:first-child {
        border-bottom-left-radius: 8px;
        border-top-left-radius: 8px;
      }
      td.ant-table-cell:last-child {
        border-bottom-right-radius: 8px;
        border-top-right-radius: 8px;
      }
      td.ant-table-cell {
        background-color: #f7f8fc;
        border: none;
      }
    }
    // fix 解决 table 使用了border-spacing之后多选框样式错乱的问题
    .ant-table-selection-column {
      border-spacing: 0;
    }
  }
  .ant-table-body table {
    transform: translateY(calc(-24px + 2px));
  }
}

.ant-table-row:hover {
  outline: 1px solid #85bdff;
}
</style>

<template>
  <div class="visibility-permission">
    <div class="title">可见成员设置</div>
    <div class="flex justify-between my-[20px]">
      <Search placeholder="请输入姓名搜索用户" v-model:value="name" @change="search"></Search>
      <a-button type="primary" @click="handleAdd">添加成员</a-button>
    </div>
    <Table :columns="columns" :dataSource="filteredUserList" type="small" :scroll="{ y: '50vh' }" :pagination="false">
      <template #bodyCell="{ column, index, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button v-if="!record.isCreator" type="link" danger @click="handleDelete(index)">删除</a-button>
        </template>
      </template>
    </Table>

    <!-- 人员选择弹窗 -->
    <SelectUser :exclude="[createUserId ?? 0]" ref="selectUserRef" @ok="handleOk"></SelectUser>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Search from "@/components/search/Index.vue";
import Table from "@/components/table/Index.vue";
import SelectUser from "@/components/selectUser/Index.vue";
import { Modal } from "ant-design-vue";

interface User {
  id: number;
  key?: string; // a-transfer 会自动根据rowKey属性自动生成
  userName: string;
}

const columns = [
  {
    title: "姓名",
    dataIndex: "userName",
    key: "userName",
    width: "30%"
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime"
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: 170
  }
];

defineProps<{ createUserId?: number }>();
const name = ref("");
const selectUserRef = ref();
const userList = defineModel<User[]>("userList");
const filteredUserList = computed(() => {
  const filtered = userList.value?.filter((item) => {
    return item.userName.indexOf(name.value) > -1;
  });
  return filtered;
});
function handleAdd() {
  const ids = userList.value ? userList.value.map((item) => item.id) : [];
  // 只更新除第一个以外的用户
  selectUserRef.value.showModal(ids.slice(1));
}
function handleDelete(index: number) {
  Modal.confirm({
    title: "提示",
    content: "确认删除该条吗？",
    maskClosable: false,
    onOk() {
      userList.value?.splice(index, 1);
    }
  });
}
function search() {}

function handleOk(selectedUser: any) {
  // 只更新除第一个以外的用户
  userList.value = userList.value?.slice(0, 1).concat(selectedUser);
}
</script>

<style scoped lang="less">
.visibility-permission {
  .title {
    line-height: 60px;
    background: #f7f8fc;
    border-bottom: 1px solid #dbe0f1;
    border-radius: 8px 8px 0 0;
    font-weight: bold;
    font-size: 16px;
    color: #232730;
    padding-left: 32px;
  }
}
</style>

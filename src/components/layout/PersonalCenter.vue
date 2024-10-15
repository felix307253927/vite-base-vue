<template>
  <a-popover title="" :arrow="false" placement="rightTop">
    <div class="personal-center">
      <a-avatar class="w-9 h-9" shape="square" src="/imgs/img_avatar@2x.png" />
    </div>
    <template #content>
      <div class="top">
        <a-avatar class="w-9 h-9" shape="square" :src="userInfo.avatar" />
        <div class="ml-[8px]">
          <div class="name">{{ userInfo.userName }}</div>
          <div class="company">
            <div class="company-name">{{ currentEnterprise?.name }}</div>
            <img src="@/assets/image/login/enterprise.svg" alt="" />
          </div>
        </div>
      </div>
      <div>
        <div class="item" @click="handleClickPersonalCenter">个人中心</div>
        <div v-if="appStore.terrace === 'sy-ai'" class="item" @click="handleClickEnterprise">切换企业</div>
        <div v-if="showBack" class="item" @click="handleBack">返回主页面</div>
        <div class="item" @click="handleClickLogout">退出登录</div>
      </div>
    </template>
  </a-popover>
  <a-modal :maskClosable="false" title="个人信息" :width="720" :open="personInfoOpen" @cancel="personInfoOpen = false">
    <div class="mt-[40px] text-center">
      <a-upload action="" :beforeUpload="beforeUpload" :showUploadList="false" accept="image/png,image/jpg,image/jpeg">
        <div class="avatar">
          <a-avatar style="width: 88px; height: 88px" :src="formState.avatar" />
          <img src="@/assets/image/login/edit.svg" alt="" />
        </div>
      </a-upload>
    </div>
    <div class="pl-[34px] pr-[74px] pt-[20px]">
      <a-form :model="formState" name="basic" :label-col="{ style: { width: '60px' } }" disabled>
        <a-form-item label="姓名" name="userName">
          <a-input v-model:value="formState.userName" />
        </a-form-item>
        <a-form-item label="手机号" name="mobile">
          <a-input v-model:value.trim="formState.mobile" :maxlength="11" />
        </a-form-item>
        <template v-if="appStore.terrace === 'sy-ai'">
          <a-form-item label="企业" name="company">
            <a-input v-model:value="formState.company" />
          </a-form-item>
          <a-form-item label="角色" name="role">
            <a-input v-model:value="formState.roleName" />
          </a-form-item>
        </template>
      </a-form>
    </div>
    <template #footer>
      <a-button :loading="confirmLoading" type="primary" @click="handlePersonalInfoOk">确定</a-button>
    </template>
  </a-modal>

  <SelectEnterprise ref="selectEnterpriseRef" @ok="handleEnterpriseOk"></SelectEnterprise>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import SelectEnterprise from "@/components/selectEnterprise/Index.vue";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { getUserInfo, edit, uploadAvatar } from "@/api/user.ts";
import { message } from "ant-design-vue";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "vue-router";
import { isEqual } from "lodash-es";

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();
const { currentEnterprise, userInfo } = storeToRefs(userStore);

const personInfoOpen = ref(false);
const formState = reactive({
  avatar: "",
  userName: "",
  mobile: "",
  company: "",
  roleName: "",
  id: 0
});
const confirmLoading = ref(false);

const app = computed(() => appStore.apps.find((m) => m.resourceStatus === 0));
const showBack = computed(() => {
  if (app.value) {
    if (isEqual(app.value.children, appStore.menus)) {
      return false;
    }
    return true;
  }
  return false;
});

function handleClickPersonalCenter() {
  personInfoOpen.value = true;
  getUserInfo(userInfo.value.userId).then((res) => {
    const data = res?.data ?? {};
    formState.avatar = data.avatar;
    formState.userName = data.userName;
    formState.mobile = data.mobile;
    formState.company = currentEnterprise.value?.name ?? "";
    formState.roleName = data.role.roleName;
    formState.id = data.id;
  });
}
// const avatarFile = shallowRef();
function beforeUpload(file: File) {
  // 文件类型检查
  const type = file.type;
  if (!["image/png", "image/jpg", "image/jpeg"].includes(type)) {
    message.warning("请上传 png、jpg、jpeg文件");
    return false;
  }

  // 前端预览头像
  // const reader = new FileReader();
  // reader.readAsDataURL(file);
  // reader.addEventListener("load", function () {
  //   formState.avatar = reader.result as string;
  //   avatarFile.value = file;
  // });
  // reader.addEventListener("error", function () {
  //   message.error("选择文件失败");
  // });
  const formData = new FormData();
  formData.append("file", file);
  uploadAvatar(formData).then((res) => {
    formState.avatar = res?.data?.filePath;
    message.success("文件上传成功");
  });

  return false;
}
function handlePersonalInfoOk() {
  // 先将头像文件上传
  // const formData = new FormData();
  // formData.append("file", avatarFile.value);
  // confirmLoading.value = true;
  // let avatarSrc = "";
  // uploadAvatar(formData)
  //   .then((res) => {
  //     avatarSrc = res?.data?.filePath;
  //     return edit({ id: formState.id, avatar: avatarSrc });
  //   })
  //   .then((_res) => {
  //     message.success("保存成功");
  //     userStore.setUserInfo({ avatar: avatarSrc });
  //     personInfoOpen.value = false;
  //   })
  //   .finally(() => {
  //     confirmLoading.value = false;
  //   });
  confirmLoading.value = true;
  edit({ id: formState.id, avatar: formState.avatar })
    .then((_res) => {
      message.success("保存成功");
      userStore.setUserInfo({ avatar: formState.avatar });
      personInfoOpen.value = false;
    })
    .finally(() => {
      confirmLoading.value = false;
    });
}
// 选择企业
const selectEnterpriseRef = ref();
function handleClickEnterprise() {
  selectEnterpriseRef.value.showModal();
}
async function handleEnterpriseOk(tenantId: number) {
  userStore.setTenantId(tenantId);
  // 切换企业后需要重新获取用户的权限，因为同一个用户在不同的企业下权限是不一样的
  appStore.resetAll();
  await appStore.loadMenu();
  const app = appStore.apps.find((m) => m.resourceStatus === 0);
  console.log(app);
  if (app) {
    const path = app.children ? app.children[0].path : app.path;
    await router.replace({ path: path });
  }
}

function handleBack() {
  if (app.value?.children?.length) {
    appStore.resetMenus(app.value.children);
    router.push(app.value.children[0].path);
  }
}

// 退出登录
function handleClickLogout() {
  userStore.logout();
}
</script>

<style scoped lang="less">
.personal-center {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.top {
  border-bottom: 1px solid #dbe0f1;
  display: flex;
  align-items: center;
  padding: 8px 0 16px;
  margin-bottom: 12px;
  .name {
    font-weight: bold;
    font-size: 16px;
    color: #232730;
  }
  .company {
    font-size: 12px;
    line-height: 12px;
    color: #8b929f;
    display: flex;
    align-items: center;
    .company-name {
      margin-right: 4px;
    }
  }
}
.item {
  cursor: pointer;
  width: 180px;
  line-height: 40px;

  font-size: 14px;
  color: #232730;
  padding-left: 14px;
}
.item:hover {
  background: #ebf2ff;
  border-radius: 8px 8px 8px 8px;
  font-weight: bold;
  color: #015cff;
}
.avatar {
  width: 88px;
  height: 88px;
  border-radius: 100%;
  cursor: pointer;
  position: relative;
  img {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>

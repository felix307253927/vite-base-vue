<!--
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-10-15 13:54:09
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-10-15 15:06:21
-->
<template>
  <div class="login">
    <img class="logo" src="@/assets/img_logo.svg" alt="" />
    <div class="form-box">
      <div class="title">登录</div>
      <a-form ref="formRef" :model="formState" name="login" autocomplete="off">
        <a-form-item label="" name="account" :rules="[{ trigger: ['change'], validator: validatePhone }]">
          <a-input
            class="h-12 border-color"
            v-model:value="formState.account"
            placeholder="请输入手机号"
            :maxlength="11"
          >
            <template #prefix>
              <a-select v-model:value="formState.prefix" :bordered="false" style="width: 80px">
                <a-select-option value="+86">+86</a-select-option>
              </a-select>
              <a-divider type="vertical" class="h-[20px] ml-0" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="" name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input
            class="h-12 border-color"
            v-model:value="formState.password"
            :maxlength="6"
            placeholder="请输入密码"
          />
        </a-form-item>

        <a-form-item label="" name="imageCode" :rules="[{ required: true, message: '请输入图中字母和数字组合' }]">
          <div class="flex items-center">
            <a-input
              class="h-12 border-color"
              v-model:value="formState.imageCode"
              placeholder="请输入图中字母和数字组合"
              :maxlength="5"
            />
            <img class="graphic-code" :src="graphicSrc" alt="" @click="refresh" />
          </div>
        </a-form-item>

        <a-button class="h-12 w-full mt-[16px]" type="primary" :loading="loginLoading" @click="handleClickLogin">
          登录
        </a-button>
      </a-form>
    </div>
    <footer>
      <div>友情链接：云知声学院官网 云知声AI开放平台 云知声官网</div>
      <div>
        云知声智能科技股份有限公司 Copyright © 2023 All Right Reserved 京ICP备12032250号-2 京公网安备11010802013422号
        网信算备110108172572101230023号
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import { useUserStore } from "@/store/userStore.ts";
import { login } from "@/api/user.ts";
import { useAppStore } from "@/store/appStore";
import { onBeforeRouteUpdate } from "vue-router";

const appStore = useAppStore();

const formState = reactive({
  prefix: "+86",
  account: localStorage?.getItem("account") || "", // 手机号
  password: "", // 密码
  imageCode: "", // 图片验证码
  random: 0
});
const formRef = ref();

function validatePhone(_rule: Rule, value: string) {
  if (!value) return Promise.reject("请输入手机号");
  return /^1[3-9]\d{9}$/.test(value) ? Promise.resolve() : Promise.reject("请输入正确的手机号");
}

// 图形验证码
const { refresh, graphicSrc, random } = useGraphicVerificationCode("/sy-auth/auth/v1/verify-code");

// 登录
const userStore = useUserStore();
const loginLoading = ref(false);
async function handleClickLogin() {
  await formRef.value.validate();

  loginLoading.value = true;
  formState.random = random.value;
  await login({ ...formState })
    .then(async (res) => {
      localStorage?.setItem("account", formState.account);

      const data = res?.data;
      const tenantList = data?.tenantList ?? [];
      if (tenantList.length === 0) return;

      // 设置用户信息
      userStore.setUserInfo(data);
      // 设置企业列表
      userStore.setTenantList(tenantList);

      // 只有一个企业，直接登录
      if (tenantList.length === 1) {
        userStore.login();
        return;
      }
    })
    .finally(() => {
      loginLoading.value = false;
    });
}

function useGraphicVerificationCode(url: string) {
  const graphicSrc = ref("");
  const random = ref(0);

  function refresh() {
    random.value = new Date().getTime();
    graphicSrc.value = `${import.meta.env.VITE_APP_SERVER}${url}?random=${random.value}`;
  }

  return { refresh, graphicSrc, random };
}

onMounted(() => {
  appStore.setTerrace(import.meta.env.VITE_APP_TERRACE);
});
onBeforeRouteUpdate(() => {
  appStore.setTerrace(import.meta.env.VITE_APP_TERRACE);
});
onBeforeMount(() => {
  refresh();
});
</script>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/login_bg.png");
  background-size: cover;
  background-position: center;
  position: relative;
  .logo {
    position: absolute;
    left: 56px;
    top: 56px;
  }
  .form-box {
    box-sizing: content-box;
    width: 400px;
    padding: 40px;
    background: #ffffff;
    border-radius: 12px;
    position: absolute;
    top: 50%;
    // left: 62.5%;
    right: 12.5%;
    transform: translateY(-50%);

    .title {
      height: 28px;
      font-family:
        DingTalk JinBuTi,
        DingTalk JinBuTi;
      font-size: 28px;
      color: #015cff;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .border-color {
      border-color: #dbe0f1;
    }
    .graphic-code {
      height: 48px;
      border-radius: 8px;
      border: 1px solid #dbe0f1;
      margin-left: 8px;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
  footer {
    width: 100%;
    position: absolute;
    bottom: 48px;
    left: 50%;
    transform: translateX(-50%);
    font-family:
      Source Han Sans CN,
      Source Han Sans CN;
    font-size: 13px;
    color: #8b929f;
    line-height: 15px;
    text-align: center;
  }
}
</style>

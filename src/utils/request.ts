/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-08 11:09:40
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-09-13 16:04:23
 */
import axios, { Axios, AxiosResponse, AxiosRequestConfig } from "axios";
import { useUserStore } from "@/store/userStore";
import { message } from "ant-design-vue";
import NProgress from "nprogress";
import router from "@/router";
import { useAppStore } from "@/store/appStore";
const CODE_MESSAGE: any = {
  200: "服务器成功返回请求数据",
  201: "新建或修改数据成功",
  202: "一个请求已经进入后台排队(异步任务)",
  204: "删除数据成功",
  400: "发出信息有误",
  401: "用户没有权限(令牌失效、用户名、密码错误、登录过期)",
  402: "令牌过期",
  403: "用户得到授权，但是访问是被禁止的",
  404: "访问资源不存在",
  406: "请求格式不可得",
  410: "请求资源被永久删除，且不会被看到",
  500: "服务器发生错误",
  502: "网关错误",
  503: "服务不可用，服务器暂时过载或维护",
  504: "网关超时"
};

function startProcess() {
  NProgress.start();
}
function stopProcess() {
  NProgress.done();
}

/**
 * axios请求拦截器配置
 * @param config
AxiosRequestConfig */
const requestConf = (config: AxiosRequestConfig) => {
  const { token, tenantId } = useUserStore();
  const { terrace } = useAppStore();
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["terrace"] = terrace;
  if (token) {
    config.headers["token"] = token;
  }
  if (tenantId) {
    config.headers["tenantid"] = tenantId;
  }
  if (config.data instanceof FormData) {
    config.timeout = 10 * 60000;
  }
  if (config.data instanceof File) {
    // miniio 上传超时时间
    config.timeout = 10 * 60000;
  }
  if (!config.data) {
    config.data = {};
  }
  startProcess();
  return config;
};

/**
 * axios响应拦截器
 * @param config {any} 请求配置
 * @param data {any} response数据
 * @param status {any} HTTP status
 * @param statusText {any} HTTP status text
 * @returns {Promise<*|*>}
 */
const handleData = async ({ config, data, status, headers }: AxiosResponse<any, any>) => {
  const { resetAll } = useUserStore();
  //responseType==blob是导出的流直接在data里，没有retcode, 不走这
  if (config.responseType === "blob" && data instanceof Blob) {
    const fileName = /filename=([^;]*)/.exec(headers["content-disposition"])?.[1] || "default_name";
    stopProcess();
    return new File([data as unknown as Blob], decodeURIComponent(fileName), {
      type: headers["content-type"]
    });
  }
  stopProcess();
  let code = data?.retcode ?? status;
  switch (code) {
    case 0:
    case 200:
      return data;
    case 401:
    case 1012:
    case 1001:
      resetAll().then(() => {
        if (location.href.includes("/operation/")) {
          router.push({ path: "/operation/login", replace: true });
        } else {
          router.push({ path: "/login", replace: true });
        }
      });
      break;
    case 403:
      router.push({ path: "/403" }).then(() => {});
      break;
  }
  // 异常处理
  // 若data.msg存在，覆盖默认提醒消息
  const errMsg = data.msg ?? CODE_MESSAGE[code];
  if (errMsg) {
    message.error(errMsg);
  }
  return Promise.reject(data);
};

Axios.prototype.downLoad = function <D = Record<string, any>>(url: string, params: D, config?: AxiosRequestConfig) {
  if (!config) {
    config = {} as AxiosRequestConfig;
  }
  if (!config.responseType) {
    config.headers = {
      "Content-Type": "application/json"
    };
    config.responseType = "blob";
  }
  config.timeout = 600000;
  return this.post(url, params, config);
};

/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER,
  timeout: 30000
});

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(requestConf, (error) => {
  stopProcess();
  return Promise.reject(error);
});

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    stopProcess();
    const { response, config } = error;
    if (response === undefined) {
      console.error(
        "连接后台接口失败，可能由以下原因造成：后端不支持跨域CORS、接口地址不存在、请求超时等",
        config?.url
      );
      return Promise.reject({});
    } else {
      return handleData(response);
    }
  }
);
export default instance;

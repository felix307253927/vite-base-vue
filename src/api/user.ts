import http from "@/utils/request";

// 发送短信验证码
export function sendSmsCode(params: { mobile: string }) {
  return http.post(`/sy-auth/auth/v1/captcha`, params);
}

// 登录
export function login(params: { account: string; password: string; imageCode: string }) {
  return http.post(`/sy-auth/auth/v1/login`, params);
}

export function loadMenu() {
  return http.post(`/sy-user/u/auth/v1/load-menu`);
}

// 修改用户信息
export function edit(params: { avatar: string; id: number }) {
  return http.post(`/sy-user/u/user/v1/user-info/add-or-edit`, params);
}

// 获取当前用户信息
export function getUserInfo(id: number | string) {
  return http.get(`/sy-user/u/user/v1/user-info/find-by-id/${id}`);
}

// 上传头像
export function uploadAvatar(params: any) {
  return http.post(`/sy-system/u/system/v1/common/file/upload`, params);
}

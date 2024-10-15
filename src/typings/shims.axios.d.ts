/// <reference types="./typings.d.ts" />
import { Axios } from "axios";

declare module "axios" {
  // 重新定义 axios的接口参数和响应类型
  interface Axios {
    request<T = any, R = ServerResponse<T>, D = any>(config: AxiosRequestConfig): Promise<R>;
    get<T = any, R = ServerResponse<T>, D = any>(url: string, parmas?: D, config?: AxiosRequestConfig): Promise<R>;
    delete<T = any, R = ServerResponse<T>, D = any>(url: string, config?: AxiosRequestConfig): Promise<R>;
    head<T = any, R = ServerResponse<T>, D = any>(url: string, config?: AxiosRequestConfig): Promise<R>;
    options<T = any, R = ServerResponse<T>, D = any>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<T = any, R = ServerResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
    put<T = any, R = ServerResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
    patch<T = any, R = ServerResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
    postForm<T = any, R = ServerResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
    putForm<T = any, R = ServerResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
    patchForm<T = any, R = ServerResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
    downLoad<D = Record<string, any>>(url: string, params: D, config?: AxiosRequestConfig): Promise<any>;
  }

  // 重新定义axios拦截器响应类型
  export interface AxiosInterceptorManager<V> {
    use(
      onFulfilled?: ((value: V) => ServerResponse | Promise<ServerResponse>) | null,
      onRejected?: ((error: any) => any) | null,
      options?: AxiosInterceptorOptions
    ): number;
  }
}

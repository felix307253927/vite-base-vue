/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-09 16:57:08
 * @LastEditors: cm
 * @LastEditTime: 2024-07-18 14:57:57
 */
type ServerResponse<T> = {
  retcode: number;
  msg: string;
  data: T;
};

type MenuItem = {
  id?: number | string;
  key?: string;
  meta?: Record<string, any>;
  title?: string;
  label?: string;
  name: string;
  path: string;
  icon?: string;
  appType: number;
  redirect?: string;
  childList?: MenuItem[];
  children?: MenuItem[];
  hasChild?: boolean;
  resourceStatus?: number;
  sort?: number;
  remark?: string;
};
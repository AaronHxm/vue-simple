import request from "@/service/request";

export const insertDicType = (params) => request('/datadic/addDicType',params,'get')
export const insertDicItem = (params) => request('/datadic/addDicItem',params,'get')

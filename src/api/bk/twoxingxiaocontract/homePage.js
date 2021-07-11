import request from "@/service/request";

export const twoyingxiaoList = (params) => request('/preleasing/twoyingxiao/twoyingxiaoList', params,
  'get')

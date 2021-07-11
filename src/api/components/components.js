import request from "@/service/request";

export const queryData = (url,params,type) => request(url,params,type)


export const queryProvincialData = (params)  => request('datadic/ProvincialCtrl/queryProvincial',params,'get')


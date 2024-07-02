// 平台属性管理的接口
import request from '@/utils/request'

// 获取一级分类的数据接口 GET /admin/product/getCategory1 
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1 `, method: 'get' })

// 获取二级分类的数据接口 GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 获取三级分类的数据接口 GET /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 获取商品属性的数据接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// ※存储商品属性信息 POST /admin/product/saveAttrInfo 带参
/*
{
  "attrName": "string",
  "attrValueList": [
    {
      "attrId": 0,
      "valueName": "string"
    }
  ],
  "categoryId": 0,
  "categoryLevel": 0,
}
*/
export const reqAddOrUpdateAttr = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data })
import request from '@/utils/request'
// 通过3id 获取spu商品属性高 GET /admin/product/{page}/{limit} category3Id
export const reqGetSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 修改SPu 需要发4次请求 依次拿到需要修改的全部信息
// 获取Spu信息GET /admin/product/getSpuById/{spuId} 名称与描述
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌信息 GET /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取图片信息 GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台中全部的销售属性（一共最多3个） GET /admin/product/baseSaleAttrList
export const reqSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

// 保存信息
export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
    } else {
        return request({
            url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo
        })
    }
}

// 删除SPU /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 添加sku 需要发三个请求

// 获取图片数据 GET /admin/product/spuImageList/{spuId}

// 获取销售属性数据 GET /admin/product/spuSaleAttrList/{spuId}
export const reqSupSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取商品信息  GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加sku /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: "post", data: skuInfo })

// 展示sku GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: "get" })
<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="Spu名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格（元）"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in saleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttr.saleAttrIdAndValueId"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            type="selection"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            label="图片"
          >
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; hight: 100px" />
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="imgName"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            label="操作"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 存储图片数据
      spuImageList: [],
      // 存储销售属性
      saleAttrList: [],
      // 存储平台属性的数据
      attInfoList: [],
      // 收集sku数据的字段
      skuInfo: {
        // 第一类收集的数据是父组件给子组件的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类需要进行双向绑定
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 第三类自己写代码
        // 默认图片
        skuDefaultImg: "",
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],

        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],

        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      // 存储spu
      spu: {},
      // 收集图片的字段.最后进行数据的整理
      imageList: [],
    };
  },
  methods: {
    // 获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片数据。[添加isDefault属性]
      let imgResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (imgResult.code == 200) {
        let list = imgResult.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 获取销售属性数据
      let saleAttrResult = await this.$API.spu.reqSupSaleAttrList(spu.id);
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
      // 获取商品数据
      let attrInfoResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrInfoResult.code == 200) {
        this.attInfoList = attrInfoResult.data;
      }
    },
    // 全选框的操作
    handleSelectionChange(params) {
      // 获取到图片的信息， 但缺少isDefault 按钮的显示
      this.imageList = params;
    },
    // 改变按钮状态 【排他思想】
    changeDefault(row) {
      // 初始isDefault全为0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      // 点击之后将isdefault变成1
      row.isDefault = 1;
      // 收集默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消按钮事件回调
    cancel() {
      // 通知父组件 将更换场景
      this.$emit("changeScenes", 0);
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮
    async save() {
      const { attInfoList, skuInfo, saleAttrList } = this;
      // // 写法1 整理平台属性attInfoList参数，上传给服务器的参数需是对象
      // attInfoList.forEach((item) => {
      //   // 新建数组,存放obj
      //   let arr = [];
      //   // 代表已选的属性
      //   if (item.attrIdAndValueId) {
      //     // 解构两个id 并转换为对象
      //     const [attrId, valueId] = item.attrIdAndValueId.split(":");
      //     let obj = { attrId, valueId };
      //     arr.push(obj);
      //   }
      //   // 将收集好的参数赋值给skuInfo.skuAttrValueList
      //   skuInfo.skuAttrValueList = arr;
      // });
      // 整理平台属性attInfoList参数。将收集好的参数赋值给skuInfo.skuAttrValueList
      skuInfo.skuAttrValueList = attInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性 写法2
      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      // 整理图片的数据 map 将新的数据存入  skuInfo.skuImageList 中
      skuInfo.skuImageList = this.imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加Sku成功" });
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style>
</style>
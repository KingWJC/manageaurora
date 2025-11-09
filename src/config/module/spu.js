const spu = {
    /*
    /hsapi/Product/QueryPagedProduct
    /hsapi/Product/QueryProductFormulation
    /hsapi/Product/QueryFactory
    /hsapi/Product/QueryProductType
    /hsapi/Product/SaveProduct
    /hsapi/Product/QueryProductById
    /hsapi/Product/DeleteProduct
    /*产品基本信息医药类*/ 
    queryPagedProduct: { module: 'spu', url: '/product/queryPagedProduct', method: 'POST', comment: '查询基本信息列表' }, // queryPagedProduct
    queryProductFormulation: { module: 'spu', url: '/product/queryProductFormulation', method: 'POST', comment: '查询产品剂型' }, // queryProductFormulation
    queryFactory: { module: 'spu', url: '/product/queryFactory', method: 'POST', comment: '查询批文持有企业/生产企业' }, // queryFactory
    queryProductType: { module: 'spu', url: '/product/queryProductType', method: 'POST', comment: '查询产品类别' }, // queryProductType
    saveProduct: { module: 'spu', url: '/product/saveProduct', method: 'POST', comment: '添加修改产品基本信息' }, // saveProduct
    deleteProduct: { module: 'spu', url: '/product/deleteProduct', method: 'POST', comment: '删除产品基本信息' }, // deleteProduct
    
    // queryProductById: { module: 'spu', url: '/product/queryProductById', method: 'POST', comment: '修改产品基本信息 详情查询' }, // 海洋改造spu之后，这个接口废弃了
    /*产品基本信息宣促品类*/ 
    queryPagedProductXCP: { module: 'spu', url: '/productXCP/queryPagedProductXCP', method: 'POST', comment: '查询基本信息列表' }, // queryPagedProduct
    saveProductXCP: { module: 'spu', url: '/productXCP/saveProductXCP', method: 'POST', comment: '添加修改产品基本信息' }, // saveProduct
    //扩展 宣促品
    queryPagedProductMedicineXCP: {module: 'spu', url: '/productXCP/queryPagedProductMedicineXCP', method: 'POST', comment: '药品明细列表'},
    //宣促品 图片
    queryPagedProductMediaXCP: {module: 'spu', url: '/productXCP/queryPagedProductMediaXCP', method: 'POST', comment: '分页查询药品信息'},
    //保存新增宣促品扩展信息
    saveProductXcpExtend: {module: 'spu', url: '/productXCP/saveProductXcpExtend', method: 'POST', comment: '添加宣促品扩展信息'},

    // 产品说明书
    queryPagedProductManual: {module: 'spu', url: '/product/queryPagedProductManual', method: 'POST', comment: '产品说明书列表查询'},
    insertOrUpdateProductManual: {module: 'spu', url: '/product/insertOrUpdateProductManual', method: 'POST', comment: '新增或修改产品说明'},
    // 产品图片管理
    queryPagedProductMedia: {module: 'spu', url: '/product/queryPagedProductMedia', method: 'POST', comment: '分页查询药品信息'},
    queryProductPackingAndFactory: {module: 'spu', url: '/product/queryProductPackingAndFactory', method: 'POST', comment: '查询一种产品的包装规格与生产企业'},
    queryAllStatusProductNames: {module: 'spu', url: '/product/queryAllStatusProductNames', method: 'POST', comment: '查询所有产品名称'},
    saveQueryProductMedia: {module: 'spu', url: '/product/saveQueryProductMedia', method: 'POST', comment: '保存产品图片'},
    queryProductMediaById: {module: 'spu', url: '/product/queryProductMediaById', method: 'POST', comment: '按编号查询'},
    deleteProductMediaByVersionId: {module: 'spu', url: '/product/deleteProductMediaByVersionId', method: 'POST', comment: '删除保存产品图片'},
    queryProductMedia: {module: 'spu', url: '/product/queryProductMedia', method: 'POST', comment: '获取产品图片'},
    queryProductMulityMedia: {module: 'spu', url: '/product/queryProductMulityMedia', method: 'POST', comment: '取产品详情图片+html'},
    
    // 产品扩展信息
    queryPagedProductMedicine: {module: 'spu', url: '/product/queryPagedProductMedicine', method: 'POST', comment: '药品明细列表'}, // 药品明细列表换个接口
    updateProductFlag: {module: 'spu', url: '/product/updateProductFlag', method: 'POST', comment: '更新上下架状态' },
    queryProductExtendById: {module: 'spu', url: '/product/queryProductExtendById', method: 'POST', comment: '查询产品商标'}, // 修改产品扩展信息 详情查询
    queryProductTradeMark: {module: 'spu', url: '/product/queryProductTradeMark', method: 'POST', comment: ''}, // 查询产品商标
    queryProductOrigin: {module: 'spu', url: '/product/queryProductOrigin', method: 'POST', comment: '查询产地'}, // 查询产地
    queryProductUnit: {module: 'spu', url: '/product/queryProductUnit', method: 'POST', comment: '查询产品单位'}, // 查询产品单位
    // queryFactory: {module: 'spu', url: '/product/queryFactory', method: 'POST', comment: ''}, // 查询批文持有企业/生产企业
    saveProductExtend: {module: 'spu', url: '/product/saveProductExtend', method: 'POST', comment: '添加扩展信息'}, // 添加扩展信息
    /**
     * 物料基础信息其他
     */
    queryPagedOther: {module: 'spu', url: '/other/queryPagedOther', method: 'POST', comment: '查询所有产品其他名称'},
    deleteOther: {module: 'spu', url: '/other/deleteOther', method: 'POST', comment: '删除其他产品'},
    saveOrUpdateOther: {module: 'spu', url: '/other/saveOrUpdateOther', method: 'POST', comment: '新增或修改其他信息'},
    queryPagedOtherExtends: {module: 'spu', url: '/other/queryPagedOtherExtends', method: 'POST', comment: '查询所有产品其他扩展信息'},
    saveOrUpdateOtherExtend: {module: 'spu', url: '/other/saveOrUpdateOtherExtend', method: 'POST', comment: '新增或修改其他扩展信息'},
    deleteOtherExtend: {module: 'spu', url: '/other/deleteOtherExtend', method: 'POST', comment: '删除其他扩展信息'},
    queryProductOtherById: {module: 'spu', url: '/other/queryProductOtherById', method: 'POST', comment: '查询图片基础信息'},
    /**
     * 商品计量单位维护
     */
    querySpuUnit: {module: 'spu', url: '/unit/queryUnit', method: 'POST', comment: '查询商品计量单位'},
    deleteSpuUnit: {module: 'spu', url: '/unit/deleteUnit', method: 'POST', comment: '删除商品计量单位'},
    saveOrUpdateSpuUnit: {module: 'spu', url: '/unit/saveOrUpdateUnit', method: 'POST', comment: '保存或新增商品计量单位'},

    /**
     * 商品分类管理
     */
     selectSpuProductTypeLevelOneAndTwo: {module: 'spu', url: '/classification/selectSpuProductTypeLevelOneAndTwo', method: 'POST', comment: '查询物料一二级分类'},

    selectSpuProductType: {module: 'spu', url: '/classification/selectSpuProductType', method: 'POST', comment: '查询所有查询分类'},
    insertOrUpdateSpuProductType: {module: 'spu', url: '/classification/insertOrUpdateSpuProductType', method: 'POST', comment: '新增或更新分类'},
    deleteSpuProductType: {module: 'spu', url: '/classification/deleteSpuProductType', method: 'POST', comment: '删除分类'},
    selectSpuByType: {module: 'spu', url: '/classification/selectSpuByType', method: 'POST', comment: '分类查询商品'},
    insertBiSpuProductTypeRelation: {module: 'spu', url: '/classification/insertBiSpuProductTypeRelation', method: 'POST', comment: '新增分类商品关系'},
    deleteBiSpuProductTypeRelation: {module: 'spu', url: '/classification/deleteBiSpuProductTypeRelation', method: 'POST', comment: '删除商品分类关系'},
    
    /**
     * 标签管理
     */
    deleteLabel: {module: 'spu', url: '/label/deleteLabel', method: 'POST', comment: '删除标签'},
    examineLabel: {module: 'spu', url: '/label/examineLabel', method: 'POST', comment: '审核标签'},
    insertOrUpdateLabel: {module: 'spu', url: '/label/insertOrUpdateLabel', method: 'POST', comment: '新增或修改标签'},
    selectLabel: {module: 'spu', url: '/label/selectLabel', method: 'POST', comment: '查询标签'},
    selectLabelRelation: {module: 'spu', url: '/label/selectLabelRelation', method: 'POST', comment: '查询标签关系'},
    deleteRelation: {module: 'spu', url: '/label/deleteRelation', method: 'POST', comment: '删除标签关系'},
    insertLabelRelation: {module: 'spu', url: '/label/insertLabelRelation', method: 'POST', comment: '新增标签关系'},

    insertOrUpdateLabelGroup: {module: 'spu', url: '/label/insertOrUpdateLabelGroup', method: 'POST', comment: '新增或者修改标签组'},
    deleteLabelGroup: {module: 'spu', url: '/label/deleteLabelGroup', method: 'POST', comment: '删除标签组'},
    selectLabelGroup: {module: 'spu', url: '/label/selectLabelGroup', method: 'POST', comment: '查询标签组'},
    insertLabelGroupRelation: {module: 'spu', url: '/label/insertLabelGroupRelation', method: 'POST', comment: '给标签组新增标签'},
    deleteBiLabelGroupRelation: {module: 'spu', url: '/label/deleteBiLabelGroupRelation', method: 'POST', comment: '删除标签组下的标签'},
    selectLabelGroupRelation: {module: 'spu', url: '/label/selectLabelGroupRelation', method: 'POST', comment: '查询标签组下的标签'},
    selectLabelUnUse: {module: 'spu', url: '/label/selectLabelUnUse', method: 'POST', comment: '查询某个标签组下没有分配的标签'},
    
    /**
    * 产品分类管理
    */
    queryAllProductNames: {module: 'spu', url: '/product/queryAllProductNames', method: 'POST', comment: '查询所有产品名称'},
    productQueryPagedProductCategory: { module: 'spu', url: '/product/queryPagedProductCategory', method: 'POST', comment: '分页查询产品分类' },
    productQueryProductCategoryTree: { module: 'spu', url: '/product/queryProductCategoryTree', method: 'POST', comment: '查询产品分类树' },
    productQueryProductCategoryById: { module: 'spu', url: '/product/queryProductCategoryById', method: 'POST', comment: '查询产品分类详情' },
    productSaveProductCategory: { module: 'spu', url: '/product/saveProductCategory', method: 'POST', comment: '保存产品分类' },
    productQueryAllProductNames: { module: 'spu', url: '/product/queryAllProductNames', method: 'POST', comment: '查询所有产品名称' },
    
    // 产品基础信息
    queryPagedElectronicProduct: { module: 'spu', url: '/electronic/queryPagedElectronicProduct', method: 'POST', comment: '分页查询电子产品基本信息' }, // 分页查询电子产品基本信息
    saveElectronicProduct: { module: 'spu', url: '/electronic/saveElectronicProduct', method: 'POST', comment: '保存电子产品信息' }, // 保存电子产品信息
    deleteElectronicProduct: { module: 'spu', url: '/electronic/deleteElectronicProduct', method: 'POST', comment: '删除电子产品信息' },
    // 产品扩展信息
    queryPagedElectronicProductExtend: { module: 'spu', url: '/electronic/queryPagedElectronicProductExtend', method: 'POST', comment: '' }, // 分页查询电子产品扩展信息
    saveElectronicProductExtend: { module: 'spu', url: '/electronic/saveElectronicProductExtend', method: 'POST', comment: '保存扩展信息' }, // 保存扩展信息
    queryElectronicProductExtendById: { module: 'spu', url: '/electronic/queryElectronicProductExtendById', method: 'POST', comment: '电子产品详情' },
    deleteElectronicProductExtend: { module: 'spu', url: '/electronic/deleteElectronicProductExtend', method: 'POST', comment: '删除电子产品扩展信息', protocolVersion: '1.0' },
    // 电子类（耗材）管理
    queryPagedMaterialElectronic: { module: 'spu', url: '/electronic/queryPagedMaterialElectronic', method: 'POST', comment: '电子类（耗材）列表' }, // hsapi原来是product，2021.06.30改成electronic
    queryMaterialElectronicById: { module: 'spu', url: '/electronic/queryMaterialElectronicById', method: 'POST', comment: '电子类（耗材）详情', protocolVersion: '1.0' },
    saveMaterialElectronicd: { module: 'spu', url: '/electronic/saveMaterialElectronicd', method: 'POST', comment: '保存电子类（耗材）' },
    deleteMaterialElectronic: { module: 'spu', url: '/electronic/deleteMaterialElectronic', method: 'POST', comment: '删除电子类（耗材）', protocolVersion: '1.0' },
    // 软件使用服务
    queryPagedVirtualSoftware: { module: 'spu', url: '/product/queryPagedVirtualSoftware', method: 'POST', comment: '软件列表' },
    queryVirtualSoftwareById: { module: 'spu', url: '/product/queryVirtualSoftwareById', method: 'POST', comment: '软件详情' },
    saveVirtualSoftware: { module: 'spu', url: '/product/saveVirtualSoftware', method: 'POST', comment: '软件新增' },
    deleteVirtualSoftwareById: { module: 'spu', url: '/product/deleteVirtualSoftwareById', method: 'POST', comment: '软件删除' },
    // 许可授权
    queryPagedVirtualAuthorization: {module: 'spu', url: '/product/queryPagedVirtualAuthorization', method: 'POST', comment: '授权列表' },
    queryVirtualAuthorizationById: {module: 'spu', url: '/product/queryVirtualAuthorizationById', method: 'POST', comment: '授权详情' },
    saveVirtualAuthorization: {module: 'spu', url: '/product/saveVirtualAuthorization', method: 'POST', comment: '授权新增' },
    deleteVirtualAuthorizationById: {module: 'spu', url: '/product/deleteVirtualAuthorizationById', method: 'POST', comment: '授权删除' },
    // 增值服务
    queryPagedVirtualService: {module: 'spu', url: '/product/queryPagedVirtualService', method: 'POST', comment: '服务列表' },
    queryVirtualServiceById: {module: 'spu', url: '/product/queryVirtualServiceById', method: 'POST', comment: '服务详情' },
    saveVirtualService: {module: 'spu', url: '/product/saveVirtualService', method: 'POST', comment: '服务新增' },
    deletePcaVirtualServiceById: {module: 'spu', url: '/product/deletePcaVirtualServiceById', method: 'POST', comment: '服务删除' },

    /**
     * 商品管理新增商品
     */
    spuQueryPagedSpu: {module: 'spu', url: '/spu/queryPagedSpu', method: 'POST', comment: '查询商品'},
    spuInsertOrUpdateSpu: {module: 'spu', url: '/spu/insertOrUpdateSpu', method: 'POST', comment: '新增或修改商品'},
    spuApprovalSpu: {module: 'spu', url: '/spu/approvalSpu', method: 'POST', comment: '审批商品'},
    spuExamineSpu: {module: 'spu', url: '/spu/examineSpu', method: 'POST', comment: '审核商品'},
    spuInsertOrUpdateSpuOutId: {module: 'spu', url: '/spu/insertOrUpdateSpuOutId', method: 'POST', comment: '录入外系统ID'},
    // productQueryPagedProduct: {module: 'spu', url: '/product/queryPagedProduct', method: 'POST', comment: '药品产品列表'},
    electronicQueryPagedElectronicProduct: {module: 'spu', url: '/electronic/queryPagedElectronicProduct', method: 'POST', comment: '电子产品列表'},
    productQueryPagedVirtualSoftware: {module: 'spu', url: '/product/queryPagedVirtualSoftware', method: 'POST', comment: '软件产品列表'},
    querySpuMediaById: {module: 'spu', url: '/spu/querySpuMediaById', method: 'POST', comment: '根据id查询商品图片详情'},
    saveSpuQueryProductMedia: {module: 'spu', url: '/spu/saveQueryProductMedia', method: 'POST', comment: '新增或修改商品图片'},
    selectProductManualBySpuId: {module: 'spu', url: '/spu/selectProductManualBySpuId', method: 'POST', comment: '根据id查询商品说明书'},
    insertSpuOrUpdateProductManual: {module: 'spu', url: '/spu/insertOrUpdateProductManual', method: 'POST', comment: '新增或修改产品说明书'},
    queryBiInvoiceProductCategory: {module: 'spu', url: '/spu/queryBiInvoiceProductCategory', method: 'POST', comment: '新增或修改产品说明书'},
    
    

    /**
    * 质量标准项维护
    */
    queryPagedRawMateriaCheckitem: { module: 'spu', url: '/material/queryPagedRawMateriaCheckitem', method: 'POST', comment: '分页查找鉴别、检查项' },
    queryRawMateriaCheckitemById: { module: 'spu', url: '/material/queryPagedRawMateriaCheckitem', method: 'POST', comment: '按主键查询鉴别、检查项' },
    saveRawMateriaCheckitem: { module: 'spu', url: '/material/saveRawMateriaCheckitem', method: 'POST', comment: '保存鉴别、检查项' },
    deleteRawMateriaCheckitemById: { module: 'spu', url: '/material/deleteRawMateriaCheckitemById', method: 'POST', comment: '删除鉴别、检查项', protocolVersion: '1.0' },
    queryRawMateriaCheckitemType: { module: 'spu', url: '/material/queryRawMateriaCheckitemType', method: 'POST', comment: '询中药材质量标准类型' },
    
    /**
    * 原辅料基本信息
    */
    queryPagedPcaRawMaterial: { module: 'spu', url: '/material/queryPagedPcaRawMaterial', method: 'POST', comment: '分页查询PcaRawMaterial信息' },
    saveRawMaterial: { module: 'spu', url: '/material/saveRawMaterial', method: 'POST', comment: '保存原辅料基本信息' },
    deleteRawMaterialById: { module: 'spu', url: '/material/deleteRawMaterialById', method: 'POST', comment: '删除PcaRawMaterial' },
    UpdateRawMaterialFlag: { module: 'spu', url: '/material/updateRawMaterialFlag', method: 'POST', comment: '更新上下架状态' },
    QueryRawMaterialImages: { module: 'spu', url: '/material/queryRawMaterialImages', method: 'POST', comment: '查询图片列表' },

     /**
      * 原辅料质量标准
      */
     queryPagedRawChineseMedicineQualityStandard: { module: 'spu', url: '/material/queryPagedRawChineseMedicineQualityStandard', method: 'POST', comment: '分页查询中药材质量标准' },
     queryRawChineseMedicineQualityStandardById: { module: 'spu', url: '/material/queryRawChineseMedicineQualityStandardById', method: 'POST', comment: '按主键查询中药材质量标准' },
     saveRawChineseMedicineQualityStandard: { module: 'spu', url: '/material/saveRawChineseMedicineQualityStandard', method: 'POST', comment: '新建中药材质量标准' },
     deleteRawChineseMedicineQualityStandardById: { module: 'spu', url: '/material/deleteRawChineseMedicineQualityStandardById', method: 'POST', comment: '删除中药材质量标准' },

    /**
    * 包材
    */
    queryPackagingType: { module: 'spu', url: '/material/queryPackagingType', method: 'POST', comment: '查询包装类型' },
    queryMaterialUnit: { module: 'spu', url: '/material/queryMaterialUnit', method: 'POST', comment: '查询计量单位' },
    queryPagedPackaging: { module: 'spu', url: '/material/queryPagedPackaging', method: 'POST', comment: '分页查询PcaPackaging信息' },
    savePcaPackaging: { module: 'spu', url: '/material/savePcaPackaging', method: 'POST', comment: '新建包材' },
    deletePackagingById: { module: 'spu', url: '/material/deletePackagingById', method: 'POST', comment: '删除包材' },

    /**
    * 半成品
    */
    queryPagedHalfProduct: { module: 'spu', url: '/material/queryPagedHalfProduct', method: 'POST', comment: '分页查询半成品信息' },
    // QueryHalfProductById: { module: 'spu', url: '/material/queryHalfProductById', method: 'POST', comment: '按主键查询半成品' },
    saveHalfProduct: { module: 'spu', url: '/material/saveHalfProduct', method: 'POST', comment: '新建半成品' },
    DeleteHalfProductById: { module: 'spu', url: '/material/deleteHalfProductById', method: 'POST', comment: '删除半成品' },

    /**
    * 商品引进提议
    */
    selectPagedSpuIntroduction: { module: 'spu', url: '/spuIntroduction/selectPagedSpuIntroduction', method: 'POST', comment: '' },
    insertOrUpdateSpuIntroduction: { module: 'spu', url: '/spuIntroduction/insertOrUpdateSpuIntroduction', method: 'POST', comment: '' },
    deleteSpuIntroduction: { module: 'spu', url: '/spuIntroduction/deleteSpuIntroduction', method: 'POST', comment: '' },
  }

export default spu
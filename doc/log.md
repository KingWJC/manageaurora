- `Preprocess.vue`：列表解析 MCP `serviceResult.data`，将“是否已初始化”居中显示为“是/否”，初始化/更新时间格式化为标准日期时间，并在触发初始化/更新任务时显示全局等待遮罩、禁止重复操作。
- `InvoiceDownloadList.vue`：接口切换至 `services.kailing`，统一解析返回结果、格式化时间并保持 Mock 兜底；申请下载使用同一解析逻辑。
- `InvoiceBlueList.vue` / `InvoiceRedList.vue`：分页查询改用统一解析函数并格式化关键时间字段，审核/列表调用返回信息提示。
- `RedConfirmationSellerList.vue` / `RedConfirmationBuyerList.vue`：全部动作改用 `services.kailing`，统一处理接口返回并格式化录入/确认时间。
- `InvoiceBlueDetail.vue` / `InvoiceRedDetail.vue` / `RedConfirmationCreate.vue`：表单提交改用 `services.kailing` 并解析返回状态，失败场景给出提示。
- `QuotaOps.vue`：额度查询、下载/退回与有效期调整改为统一解析流程，增加 Mock 兜底与操作结果提示。
- `SelectOrgList.vue` 表格新增列：省、市、县、地址；同时更新 Mock 数据，包含完整的地址信息字段。
  - 回填逻辑优化：选择组织/自然人后写入 sessionStorage，并自动返回；`InvoiceBlueDetail.vue` 新增 `fillSelectedData()` 方法，仅填充表单中空值字段，保留已有数据不被覆盖；支持 `activated` 生命周期（keep-alive 场景）。
  - **修复数据清空问题**：由于路由配置 `keepAlive: false`，返回时组件重新创建导致表单数据丢失。新增 `saveFormData()` 和 `restoreFormData()` 方法，在跳转到选择页面前保存表单数据到 sessionStorage，返回后在 `mounted`/`activated` 中先恢复数据再执行回填，确保表单数据不丢失；提交成功后清理保存的数据。
  - 将 `taxInvoiceBlueDetail` 的路由改为 `keepAlive: true`，配合上述恢复策略，进一步避免返回时组件被销毁导致的数据丢失。
  - 添加明细回填：`SelectGoodsList.vue` 选择后把数据写入 `sessionStorage(taxInvoice.selectedGoods)` 并返回；`InvoiceBlueDetail.vue` 在恢复后读取并追加到 `form.fpmxList`，自动计算金额与合计。
  - 选择商品多选：`SelectGoodsList.vue` 支持表格多选，新增“添加所选”按钮；批量写入 `sessionStorage(taxInvoice.selectedGoodsList)`；`InvoiceBlueDetail.vue` 支持批量回填并联动计算。
  - 商品/服务主 Tab 改为左侧纵向排列：`SelectGoodsList.vue` 顶层 `el-tabs` 使用 `tab-position="left"`，便于快速切换。
  - 新增销方红字确认单创建流：从列表“新增”先跳转至蓝字发票查询页，点击“选择并继续”后写入 `sessionStorage(taxInvoice.selectedBlueInvoice)` 并跳转到 `RedConfirmationSellerCreate`，在 `mounted` 中回填蓝票号码与购方名称。
  - 修复 `SelectGoodsList.vue` 显示问题：添加 `pager` 到 data，统一所有表格使用 `getPaged` 分页，统一操作列为“详情”链接样式，添加分页组件，添加 watch 监听 Tab 切换并更新分页总数。
  - 修复 `SelectGoodsList.vue` 选择列无法勾选问题：为所有 `el-table` 添加 `row-key="_uniqueId"` 属性，在 `getData()` 中为每条数据生成唯一的 `_uniqueId` 字段（基于 barcode + 索引 + 时间戳 + 随机数），确保 Element UI 的选择功能正常工作。
  - 修复选择商品/服务后名称回写问题：
    1. 在 `InvoiceBlueDetail.vue` 的 `fillSelectedData()` 方法中添加处理单个商品选择的逻辑（`taxInvoice.selectedGoods`）
    2. 修改 `appendGoodsRows()` 方法，将商品数据的 `name` 字段映射到发票明细的 `xmmc`（项目名称）字段
    3. 同时支持 `spec`（规格）映射到 `ggxh`（规格型号），`packSpec`（包装规格）映射到 `dw`（单位）
    4. 修复 `SelectGoodsList.vue` 中 `add()` 方法的提示信息，使用 `name` 字段
  - 修复 `InvoiceBlueQuery.vue` 查询条件布局问题：
    1. 将两个输入框从同一个 `search-bar-item` 中分离，每个输入框使用独立的 `search-bar-item`，使其在同一行显示
    2. 将外层容器改为使用 `search-bar` 类，保持与其他页面一致的样式
    3. 修复 `data` 中缺少 `gfdw` 字段的问题
    4. 修复查询结果展示部分所有字段都绑定到 `result.gmfmc` 的错误，正确绑定到对应的字段（`xsfmc`, `fplxDm`, `fphm`, `gmfmc`, `gmfnsrsbh`, `kprq`, `hjjc`, `hjs`, `jshj`）
    5. 修复 `el-label` 的错误使用，改为 `el-input` 组件
    6. 完善 mock 数据，包含所有展示字段
  - 修改 `InvoiceBlueQuery.vue` 查询结果展示方式：将所有 `el-input` 组件改为使用 `<span>` 标签显示数据，使用 `{{ result.xxx || '-' }}` 格式，当数据为空时显示 `-`，更符合只读展示的语义。
  - 修改 `InvoiceBlueQuery.vue` 查询结果为列表形式：
    1. 将 `result` 改为 `resultList` 数组，支持多条数据展示
    2. 使用 `v-for` 循环渲染多个卡片，每条数据一个卡片
    3. 添加 `getPaged()` 方法实现分页功能
    4. 修改 `onSearch()` 方法返回多条 mock 数据（3条示例数据）
    5. 修改 `chooseAndNext()` 方法接收选中的卡片数据作为参数
    6. 更新分页总数逻辑，查询后自动更新 `pager.total`
  - 修改 `RedConfirmationSellerCreate.vue` 基础信息字段：
    1. 将基础信息字段改为：销方单位、蓝字发票号码、购货单位类型、购货单位、发票类型、开具红字发票原因、特定要素
    2. 从蓝字发票信息卡片中移除"蓝字发票号码"和"蓝票票种代码"（移到基础信息）
    3. 从红字信息卡片中移除"冲红原因"（移到基础信息为"开具红字发票原因"）
    4. 更新 form 数据对象，添加 `gmfzrrbz`（购货单位类型）和 `tdys`（特定要素）字段，移除 `lrfsf`、`xsfnsrsbh`、`gmfnsrsbh` 字段
    5. 更新表单验证逻辑，移除旧字段验证，添加新字段验证
  - 更新 `RedConfirmationSellerCreate.vue` 表单内容和数据对象：
    1. 重新组织表单结构，分为：基础信息、销售方信息、购买方信息、其他信息四个卡片
    2. 添加销售方信息字段：销售方税号、销售方名称、地址、手机号、销售方开户行、销售方账号、差额征税类型
    3. 添加购买方信息字段：购买方名称、购买方税号、地址、手机号、购买方开户行、购买方账号
    4. 将所有字段设为只读（`disabled`），只有"开具红字发票原因"（`chyyDm`）和"备注"（`bz`）可以编辑
    5. 更新 form 数据对象，添加所有新字段：`xsfnsrsbh`, `xsfdz`, `xsfdh`, `xsfkhh`, `xsfzh`, `cezzslx`, `gmfnrsbh`, `gmfdz`, `gmfdh`, `gmfkhh`, `gmfzh`
    6. 更新验证逻辑，只验证可编辑的必填字段（开具红字发票原因）
    7. 完善 `mounted` 方法，从蓝字发票查询数据中自动填充更多字段
  - 实现 `InvoiceBlueList.vue` 发票预览功能：
    1. 添加 `previewData` 数据字段存储预览数据
    2. 修改 `previewRow()` 方法，设置预览数据并打开弹窗
    3. 实现完整的发票预览弹窗，包括：
       - 弹窗标题和关闭按钮
       - 提示文字："发票预览仅作概览,以实际发票为准"
       - 主标题："数电票(增值税普通发票)"
       - 发票号码和开票日期（右上角）
       - 购买方信息和销售方信息（左右布局，垂直标签）
       - 明细表格（项目名称、规格型号、单位、数量、单价、金额、税率/征收率、税额）
       - 合计金额、合计税额
       - 价税合计（大写和小写）
       - 备注和开票人
    4. 添加 `numberToChinese()` 方法，实现数字转中文大写
    5. 添加完整的预览样式，参考发票实际样式
    6. 更新 mock 数据，添加预览所需字段
- 统一“状态列”样式：参考 `RedConfirmationSellerList.vue`，将 `InvoiceBlueList.vue`、`InvoiceRedList.vue`、`InvoiceDownloadList.vue` 的状态列改为 `<span>` 文本渲染并居中（去除 `el-tag`），增加简单码值映射方法，保持样式一致。
- 统一“操作列”样式：参考 `Preprocess.vue`，将 `InvoiceBlueList.vue`、`RedConfirmationSellerList.vue`、`RedConfirmationBuyerList.vue`、`InvoiceRedList.vue` 的操作列统一为 `<p><span class="link">...`+`ml10` 分隔，固定在右侧，提升一致性与可读性。
  - 按规范限制“一行最多两个链接”，多余操作自动换行分组（2/行）。
  - `QuotaOps.vue` 操作列改为链接样式：第一行“下载/退回”，第二行“调整有效期”。
  - `Preprocess.vue` 操作列优化：已初始化（`ztsxbz=是/Y/1/true`）的行，"初始化" 链接禁用（灰色、不可点），仅保留“更新”。
- 权限门槛调整：`src/views/admin/taxInvoice/blueDetail.vue` 去除权限混入与 v-if 门槛，避免“新增”时因为权限判定不通过导致页面空白（卡死体验）。
- 列表优先使用 Mock：在以下列表页增加 `VUE_APP_USE_MOCK` 判断，默认走本地 Mock 数据；当设置为 `false` 时再调用后端服务：
  - `InvoiceBlueList.vue`、`InvoiceRedList.vue`、`RedConfirmationSellerList.vue`、`RedConfirmationBuyerList.vue`、`InvoiceDownloadList.vue`。
  - 为缺少 `useMock` 的组件补充了 `useMock()` 方法，统一数据结构与分页统计。
- 新增组件：`src/components/admin/taxInvoice/RedConfirmationSellerCreate.vue`，实现销方红字确认单新增单据（表单采用 lc-row/lc-col-*、手动校验、底部固定保存按钮，保存调用 `applyRedConfirm`，失败/未配走 Mock，成功返回 `taxInvoiceRedSellerList`）。
- 视图接入：`src/views/admin/taxInvoice/redSellerCreate.vue` 引入并渲染 `RedConfirmationSellerCreate`，纳入权限控制。
2025-11-03

### 2025-11-09
- 接口调用切换至 `this.CFG.services.kailing.queryPreprocess`：恢复 `Preprocess.vue` 的服务引用，保持与后端网关约定一致。
- `src/config/env-config.js` 在各环境模块映射中补充 `kailing: '/kailing'`，确保请求路径正确拼接。

### 2025-11-04
- SelectGoodsList.vue：恢复商品各子 Tab 表格的自适应高度，新增 `tableHeight` 动态计算（窗口变化与 Tab 切换时重算），为各子表绑定 `:height="tableHeight"`，减去子 Tab 标题高度以铺满页面，无空滚动条。
- RedConfirmationSellerCreate.vue：完善“开票详情信息”逻辑：
  - 新增表单字段：`fpmxList`、`hjjc`、`hjs`、`jshj`。
  - 新增方法：`openSelectGoods`（跳转选择商品/服务并保存表单）、`deleteDetailRow`、`onRowChange`、`recalcRow`、`recalcTotals`、`toFixedNumber`、`formatMoney`、`fillSelectedGoods`（回填 session 选择的商品，支持多选）、`addGoodsRowFromItem`、`defaultTaxRate`、`saveFormData`、`restoreFormData`。
  - 行内计算：金额(含税)=数量×单价，税额=金额×税率，含税金额=金额+税额；动态汇总合计金额/税额/价税合计。

- 菜单/路由重构：按“乐企开票”新层级调整 `src/views/admin/taxInvoice/router.js`，新增以下页面路由：
  - 数电蓝字发票开具：`/admin/taxInvoice/blue/list`、`/admin/taxInvoice/blue/detail`、组织/自然人/商品选择页。
  - 销方红字确认单：列表与新增页，蓝字单据查询页。
  - 购方红字确认单：列表页。
  - 数电红字发票开具：列表页。
  - 发票额度操作：列表页（沿用 `QuotaOps`）。
  - 批量发票下载：列表页（映射 `InvoiceDownloadList`）。
- 新增视图包装文件（views）：`blueList.vue`、`blueDetail.vue`、`selectOrg.vue`、`selectPerson.vue`、`selectGoods.vue`、`redSellerList.vue`、`redSellerCreate.vue`、`blueInvoiceQuery.vue`、`redBuyerList.vue`、`redList.vue`、`downloadBatch.vue`。
- 新增基础选择页面组件（components）：`SelectOrgList.vue`、`SelectPersonList.vue`、`SelectGoodsList.vue`，均实现查询与选择/添加按钮，统一列表样式。
- 组件联动修复：`InvoiceBlueList.vue` 新增按钮跳转路由改为 `taxInvoiceBlueDetail`；`InvoiceBlueDetail.vue` 保存后返回改为 `taxInvoiceBlueList`。
- 接口配置补充：在 `src/config/module/invoice.js` 新增 `queryRates(CXYKYSL)`、`queryDiffTaxCodes(CXCEZSBM)`、红字确认单相关接口 `pageRedConfirmList(CXQDHZQRDLB)`、`queryRedConfirmDetail(CXQDHZQRDMX)`、`applyRedConfirm(QDHZQRDSQ)`、`confirmRedConfirm(QDHZQRDQR)`。
- 红字确认单列表联调：
  - `RedConfirmationSellerList.vue`：接入 `pageRedConfirmList`，支持查询/重置与分页；新增按钮跳转 `taxInvoiceRedSellerCreate`；保留本地 Mock 兜底。
  - `RedConfirmationBuyerList.vue`：接入 `pageRedConfirmList`（购方视角），支持查询/重置与分页；保留本地 Mock 兜底。
- 页面操作完善：
  - 蓝字开具列表 `InvoiceBlueList.vue`：实现 查看/编辑/预览/审核 按钮；查看/编辑跳转到 `taxInvoiceBlueDetail`（携带 mode）。
  - 红字确认卖方列表：实现 查看、提交（申请接口占位）、确认/撤销（确认接口占位）、开票（跳转红字列表）。
  - 红字确认买方列表：实现 查看、确认/拒绝（确认接口占位）。
- 自定义接口定义并接入：
  - `invoice.auditBlueInvoice`（蓝字审核）、`invoice.createRedInvoice`（红字开票）、`invoice.pageRedInvoices`（红票列表）。
  - `InvoiceBlueList` 审核按钮调用 `auditBlueInvoice`；`RedConfirmationSellerList` 开票按钮调用 `createRedInvoice`（成功后跳转红票列表）；`InvoiceRedList` 改为使用 `pageRedInvoices`（无服务走 Mock）。

## 2025-10-29

- 新增税票开具模块页面与路由：
  - 新建 `src/views/admin/taxInvoice/` 下 6 个视图包装：`preprocess.vue`、`invoiceList.vue`、`invoiceCreate.vue`、`downloadList.vue`、`summaryList.vue`、`summaryForm.vue`；
  - 新建组件 `src/components/admin/taxInvoice/`：`Preprocess.vue`、`InvoiceList.vue`、`InvoiceForm.vue`、`DownloadList.vue`、`SummaryList.vue`、`SummaryForm.vue`；
  - 新建并接入路由 `src/views/admin/taxInvoice/router.js`，主路由已加载该子路由；
- 新增乐企接口前端服务配置：
  - 在 `src/config/index.js` 新增 `services.lq` 节点，包含：前置处理（预赋码、基本信息、风险信息、税编）、发票上传/分页、额度记录分页、汇总确认提交/分页。
  - 后续已切换为使用模块 `src/config/module/invoice.js` 并在 `src/config/index.js` 通过 `import invoice from './module/invoice'` 注入为 `services.invoice`。
 
- 样式统一：将 taxInvoice 下各组件统一为现有页面布局结构（viewport-fixed/viewport-view/panel/search-bar/表格分页/小尺寸控件）。

- 新增页面：发票额度操作记录
  - 路由：`/admin/taxInvoice/quota`（`taxInvoiceQuotaOps`）
  - 组件：`src/components/admin/taxInvoice/QuotaOps.vue`
  - 功能：查询发票额度、下载/退回额度、调整额度有效期、分页查看操作记录
  - 新增服务：`services.invoice.queryQuota`、`services.invoice.operateQuota`、`services.invoice.adjustQuotaExpire`

# 修改日志

## 2025-10-28 - 根据后端接口文档重构项目

### 完成的工作

#### 1. 路由配置优化
- 根据菜单结构调整路由，移除不需要的页面
- 保留9个核心页面：
  - 数电发票：开票记录列表、上传记录列表
  - 数电红字确认单：乐企确认单列表、本地确认单列表
  - 发票汇总：发票汇总信息列表
  - 发票额度：本地发票额度列表、乐企发票额度列表
  - 税率：本地税率列表
  - 纳税人：本地纳税人列表
  - 预赋码号段：本地预赋码号段列表

#### 2. 删除不需要的文件
- 删除了以下页面文件：
  - `src/views/invoice/InvoiceCreate.vue` - 发票开具
  - `src/views/invoice/InvoiceDetail.vue` - 发票详情
  - `src/views/red-confirmation/Apply.vue` - 申请
  - `src/views/red-confirmation/Confirm.vue` - 确认
  - `src/views/invoice-summary/SummaryCreate.vue` - 新增发票汇总
  - `src/views/quota/ValidityAdjust.vue` - 有效期调整
  - `src/views/quota/Download.vue` - 下载/退回
  - `src/views/tax-rate/Sync.vue` - 税率同步
  - `src/views/taxpayer/SyncSingle.vue` - 同步单个纳税人
  - `src/views/code-segment/Apply.vue` - 申请号段

#### 3. 创建 API 请求工具
- 新增 `src/api/request.js`
  - 使用 axios 创建请求实例
  - 配置 baseURL: `/lqadapter`
  - 统一请求方法为 POST
  - 添加请求和响应拦截器
  - 统一错误处理

#### 4. 安装依赖
- axios@1.13.0 - HTTP 请求库
- decimal.js@10.6.0 - 金额计算库
- dayjs@1.11.18 - 日期处理库
- element-ui@2.15.14 - UI组件库（已安装）
- vue-router@3 - 路由库（已安装）

#### 5. 更新核心页面
- 更新 `src/views/invoice/InvoiceList.vue`
  - 添加查询表单（发票号码、销方税号、购方税号、开票日期范围）
  - 添加数据表格（Element UI 的 el-table）
  - 添加分页组件
  - 添加查看、下载操作按钮

#### 6. 菜单优化
- 根据用户修改更新菜单名称
- 使用 Element UI 的 el-menu 组件
- 添加图标
- 优化样式

### 待完成的工作

#### 1. 更新所有页面组件
需要根据后端接口文档，为每个页面添加完整功能：
- 数电发票管理（DigitalInvoiceController）
- 纳税人管理（TaxpayerController）
- 税率管理（TaxRateController）
- 发票额度管理（InvoiceQuotaController）
- 预赋码管理（PreCodeController）
- 发票汇总管理（InvoiceSummaryController）
- 税收分类编码（TaxCatalogController）

#### 2. 创建 API 模块
为每个 Controller 创建对应的 API 模块文件：
- `src/api/modules/invoice.js`
- `src/api/modules/taxpayer.js`
- `src/api/modules/taxRate.js`
- `src/api/modules/quota.js`
- `src/api/modules/codeSegment.js`
- `src/api/modules/invoiceSummary.js`
- `src/api/modules/taxCatalog.js`

#### 3. 创建类型定义
创建 `src/types/index.js` 包含所有 DTO 的 JSDoc 类型定义

#### 4. 配置代理
需要在 `vue.config.js` 中配置代理到后端服务

### 技术栈
- Vue 2.6.14
- Element UI 2.15.14
- Vue Router 3.x
- axios 1.13.0
- decimal.js 10.6.0
- dayjs 1.11.18

### 后端接口
- 基础路径：`/lqadapter`
- 所有接口使用 POST 方法
- 返回格式：`ResultInfo<T>`

### 重要说明
1. 所有金额字段使用 decimal.js 计算，类型为字符串
2. 日期使用时间戳，前端用 dayjs 格式化显示
3. 分页策略：首页查总数，翻页时传递 `total=-1`
4. 使用 Vue 2.x Options API

### 2025-10-29 - 根据乐企接口文档完善页面字段

#### 完善发票列表页面
- 完善查询表单字段，添加购买方名称、蓝红字标志、导出Excel
- 完善表格字段，添加价税合计列
- 金额、税额、价税合计添加货币符号显示

#### 完善新增发票表单
- 使用 el-tabs 实现多标签页表单结构
- 基本信息：发票请求流水号、发票票种、蓝字发票标志
- 销售方信息：税号、名称、地址、电话、开户行、账号
- 购买方信息：税号(开具专票时必填)、名称、地址、电话、开户行、账号
- 发票明细：使用 el-table 展示明细列表，支持新增、删除
  - 字段：序号、项目名称、商品服务简称、规格型号、单位、数量、单价、金额、税率、税额、含税金额
- 其他信息：开票人、开票日期、收款人姓名、复核人姓名、备注

#### 完善纳税人管理页面
- 添加批量同步功能（批量同步对话框）
- 查询表单添加日期范围
- 添加导出按钮
- 表格字段：税号、名称、行业代码、有效期起止、状态

#### 完善上传管理页面
- 执行上传、查询上传结果按钮
- 表格显示上传结果和错误信息

#### 完善下载管理页面
- 申请下载对话框，包含所有必要字段
- 执行待处理任务按钮
- 完整的下载任务列表展示

#### 完善所有基础数据页面
- 税率管理、税收分类编码、发票额度管理、预赋码管理已具备基本功能
- 所有页面统一添加表格、分页、操作按钮

所有页面字段已按照乐企开票能力说明文档和后端接口文档完善，可以正常运行。
 
#### 发票汇总表头优化
- 将分组表头（“蓝字发票”、“红字发票”）改为扁平列名：蓝字数量/金额/税额、红字数量/金额/税额，消除表头空白单元格，避免列名出现空白。
 - 将固定 width 改为 min-width，启用弹性填充，空数据时列名也能占满整表。

#### 发票列表“查看”复用新增表单（只读）
- 在 `src/views/invoice/InvoiceList.vue` 中复用“新增发票”表单，用于“查看发票”对话框。
- 新增 `isViewMode` 状态；查看模式下：
  - 表单整体 `:disabled="true"`（禁用输入/选择/日期）。
  - 隐藏“新增明细/附加要素/凭证”和各列表的“删除”操作列。
  - 对话框标题根据模式切换为“查看发票/新增发票”，底部仅保留“关闭”按钮（查看时不显示确认）。

#### 列表填充测试数据并兼容后端
- 新增 `src/api/mock.js`，提供各列表的本地 Mock：发票、上传、下载、纳税人、税率、税收分类编码、发票额度、预赋码、发票汇总。
- 各列表页面 `handleQuery` 改造为优先后端（预留调用位），失败回退 Mock，并更新分页 total：
  - `src/views/invoice/InvoiceList.vue`
  - `src/views/invoice/UploadList.vue`
  - `src/views/invoice/DownloadList.vue`
  - `src/views/base/TaxpayerList.vue`
  - `src/views/base/TaxRateList.vue`
  - `src/views/base/TaxCatalogList.vue`
  - `src/views/base/QuotaList.vue`
  - `src/views/base/PreCodeList.vue`
  - `src/views/summary/SummaryList.vue`

#### 接入后端接口清单（API 模块化）
- 新增 API 模块：
  - `src/api/modules/invoice.js`：add、executeUpload、queryUploadResult、apply、executePending、list
  - `src/api/modules/taxpayer.js`：list、sync
  - `src/api/modules/taxRate.js`：sync、list、queryEnabled
  - `src/api/modules/quota.js`：query、download、return、adjustValidity、validate
  - `src/api/modules/preCode.js`：apply、allocate、ensure
  - `src/api/modules/invoiceSummary.js`：create、list
  - `src/api/modules/taxCatalog.js`：sync、list、queryByCode
- 页面调用对接：
  - 发票列表使用 `/digitalInvoice/list`，上传/下载管理调用 executeUpload、apply、executePending；
  - 纳税人列表使用 `/taxpayer/list`，同步调用 `/taxpayer/sync`；
  - 税率列表使用 `/taxRate/list`，同步调用 `/taxRate/sync`；
  - 税收分类编码使用 `/taxCatalog/list`、`/taxCatalog/sync`、`/taxCatalog/queryByCode`；
#### 税收分类编码-查看详情增强
- `src/views/base/TaxCatalogList.vue` 查看对话框改为只读详情：
  - Tab1 基本信息：使用 `el-descriptions` 展示编码主体信息（含差额征税/不征税 Y/N 友好化）。
  - Tab2 征收品目列表：新增 `el-table` 展示品目编码、品目名称、征收率、增值税税率、即征即退、备注。
  - 点击行内“查看详情”自动查询并填充详情和品目列表，兼容不同后端字段名（pmList/zspmList/levyItems）。
  - 优化体验：打开对话框时先用列表行数据进行预填充，再异步拉取后端详情覆盖。
 - 根据最新需求调整：点击“查看详情”仅使用列表行数据进行预填充展示，不再调用后端接口。

#### 发票额度管理 Mock 数据对齐表格列
- 更新 `src/api/mock.js` 的 `mockQuotaList`：
  - `fplx` 改为月份字符串（用于表格“发票额度属期/操作类型”两列展示）。
  - `ed` 为操作额度数值。
  - `yxq` 改为业务流水号占位（表格复用列“业务流水号/使用区间起/使用区间止/错误信息”）。
  - `status` 保持启用/停用标识（1/0）。
  - 额度管理调用 `/quota/query`、`/download`、`/return`、`/adjustValidity`、`/validate`；
  - 预赋码管理调用 `/preCode/apply`；
  - 发票汇总页面使用 `/invoiceSummary/list` 与 `/invoiceSummary/create`。

#### 发票汇总-查看详情
- `src/views/summary/SummaryList.vue` 新增“汇总详情”对话框：
  - 点击“详情”时展示当前行数据；
  - 使用 `el-descriptions` 展示月份、上传状态、蓝字/红字数量、金额、税额，金额统一货币格式；
  - 仅保留关闭按钮。

#### 纳税人详情-风险信息改为表单
- `src/views/base/TaxpayerList.vue` 将“纳税人风险信息”从表格改为只读表单：
  - 对 `riskList` 中的每一条，使用 `el-form` 展示以下字段：
    - 风险纳税人类型(fxnsrlx)
    - 纳税人信用等级(nsrxydj)
    - 纳税人预警级别(nsryjjb)
    - 风险纳税人标志(fxnsrbz)
  - 支持多条风险信息，逐条以 Card 分段展示；无数据时显示“暂无风险信息”。
 - 若风险信息仅有一条，界面以单个只读表单呈现（已支持）。

## 2025-10-30

- 发票开具表单布局统一
  - 在 `src/components/admin/taxInvoice/InvoiceForm.vue` 顶部加入 `crumbs-bar` 返回/面包屑；
  - 新增底部固定保存区（`viewport-footer viewport-footer-padded`），保存按钮调用原有 `submit`；
  - 按需异步注册 `crumbsBar` 组件。
  - 将表单内各分组卡片包裹于单列弹性容器（`flex flex-column`），确保卡片纵向单列展示。

- 发票汇总确认表单布局与服务统一
  - 在 `src/components/admin/taxInvoice/SummaryForm.vue` 顶部加入 `crumbs-bar`，新增底部固定保存区；
  - 将提交接口从 `this.CFG.services.lq.uploadSummaryConfirm` 调整为 `this.CFG.services.lqadapter.uploadSummaryConfirm`；
  - 按需异步注册 `crumbsBar` 组件。
  - 移除 `el-form/el-form-item`，改为 `div + label + 控件` 布局；提交使用手工校验（`this.$toast` 提示）。

- 发票开具表单校验与布局对齐
  - `src/components/admin/taxInvoice/InvoiceForm.vue` 移除 `el-form/el-form-item`，字段改为 `div + label + 控件`；
  - 所有字段统一 `class="full-width"` 并移除行内 `style="width:100%"`；
  - 使用手工必填校验（参考 financeManage/create.vue 风格），提交前逐项校验并提示；
  - 网格改为 `lc-row/lc-col-*`，卡片单列纵向排列，与引用页面一致。

- 发票额度操作记录弹窗改造
  - 更新 `src/components/admin/taxInvoice/QuotaOps.vue` 两个弹窗（下载/退回、调整有效期）为 div+label+控件弹性布局；
  - 统一控件 `size="small"`、`class="full-width"`，移除 `el-form/el-form-item`；
  - 保持 `append-to-body` 与 footer 操作按钮不变。
  - 新增“查询乐企额度”弹窗：含查询条件（纳税人识别号、额度属期），查询按钮与结果展示；
  - 顶部搜索条新增“重置”按钮；下载/退回弹窗支持编辑纳税人识别号。
  - 新增本地操作记录“查询”按钮：重置页码并根据当前筛选条件刷新列表。
  - taxInvoice 模块支持 mock：当接口异常时，InvoiceList、SummaryList、QuotaOps 回退到内置测试数据，便于本地联调。
  - 扩展 mock：`DownloadList.vue` 下载列表、`Preprocess.vue` 前置处理动作（预赋码/基本信息/风险信息/税编）在接口异常时回退本地模拟数据。
- 新增：蓝字发票预览改版（InvoiceBlueList.vue）
  - 绑定抬头信息：发票号码、开票日期
  - 绑定购方/销方信息：名称、统一社会信用代码/纳税人识别号
  - 新增发票明细表格（项目名称、规格型号、单位、数量、单价、金额、税率/征收率、税额）
  - 增加合计区域（金额合计、税额合计）与价税合计（大写/小写）
  - 备注区显示绑定 `previewData.bz`
  - 增添表格边框与区块样式，视觉贴近示意图
  - 调整发票预览抬头布局：购买方信息与销售方信息设置为同一行各占 50% 宽度。
  - 修复发票预览边框与抬头重叠：为 `.invoice-info--body` 增加 `margin-top: 8px`，避免边框出现在 `invoice-info-header` 中。
  - 修复 header 与 body 重叠：为 `.invoice-info-header` 增加 clearfix（::after 清除浮动），并将 `.invoice-info--body` 的外边距改为 0，彻底避免重叠。
  - 预览明细表格优化：将 `.invoice-table td` 设置为 `vertical-align: top`，使项目信息靠上显示而非垂直居中。
  - 价税合计（大写）样式：在文字右侧增加与表格一致的右边框（2px #a15f3b），通过 `.amount-cn__label` 实现，边框后再显示大写金额。
  - 更新 `Preprocess.vue` mock 数据：与列表列一致（纳税人识别号、纳税人名称、是否已初始化、初始化时间、更新时间），补充 5 条示例数据并更新总数。
  - 对齐 `Preprocess.vue` 表格列字段：按 label 调整 prop -> `nsrsbh/"纳税人识别号"`、`nsrmc/"纳税人名称"`、`ztsxbz/"是否已初始化"`、`cjsj/"初始化时间"`、`gxsj/"更新时间"`，并与 mock 数据保持一致。
  - 修复商品 Tab 空数据仍出现内部滚动条的问题：空数据判断改为依据“当前分页后的可见行数”，从而在商品各子 Tab 当前页无数据时使用 `max-height`，不再出现竖向滚动条。
  - `SelectGoodsList.vue` 表高修正：在 `activeMain==='goods'` 时，动态减去商品子 Tab 顶部标题的高度（含余量 12px），并在 `activeMain/activeGoods` 切换时重算，确保铺满且无多余滚动条。
- InvoiceRedList.vue：修改 `viewRow` 方法，点击"查看"按钮时跳转到 `InvoiceRedDetail.vue` 详情页：
  - 创建 `src/views/admin/taxInvoice/redDetail.vue` 视图文件，引入 `InvoiceRedDetail` 组件
  - 在路由配置中添加 `taxInvoiceRedDetail` 路由（路径：`/admin/taxInvoice/red/detail`）
  - 修改 `viewRow` 方法：将行数据保存到 `sessionStorage('taxInvoice.redInvoiceDetail')`，并通过路由跳转到详情页，传递 `sllsh` 查询参数
- RedConfirmationSellerCreate.vue 重命名为 RedConfirmationCreate.vue：
  - 将 `src/components/admin/taxInvoice/RedConfirmationSellerCreate.vue` 重命名为 `RedConfirmationCreate.vue`
  - 更新 `src/views/admin/taxInvoice/redSellerCreate.vue` 中的组件引用
  - 新增 `readonly` prop 和 `formData` prop，支持只读查看模式
  - 当 `readonly` 为 true 时，所有字段禁用，隐藏保存按钮和面包屑，标题改为"红字确认单 - 查看"
  - 当 `readonly` 为 false 时，保持原有逻辑（只有 `chyyDm` 和 `bz` 可编辑）
- RedConfirmationBuyerList.vue：修改"查看"按钮功能：
  - 添加 `el-dialog` 弹窗，用于显示红字确认单详情
  - 引入 `RedConfirmationCreate` 组件
  - 修改 `handleView` 方法：将行数据转换为表单数据格式，并显示在弹窗中
  - 弹窗中的 `RedConfirmationCreate` 组件设置 `readonly: true`，所有字段不可编辑
- RedConfirmationBuyerList.vue：将查看功能改为路由跳转：
  - 移除弹窗相关代码（`el-dialog` 和 `RedConfirmationCreate` 组件引入）
  - 创建 `src/views/admin/taxInvoice/redBuyerDetail.vue` 视图文件，引入 `RedConfirmationCreate` 组件并设置 `readonly: true`
  - 在路由配置中添加 `taxInvoiceRedBuyerDetail` 路由（路径：`/admin/taxInvoice/red/buyer/detail`）
  - 修改 `handleView` 方法：将行数据转换为表单数据格式，保存到 `sessionStorage('taxInvoice.redBuyerConfirmDetail')`，并通过路由跳转到详情页，传递 `sllsh` 查询参数
  - 修改 `RedConfirmationCreate.vue` 的 `mounted` 方法：在只读模式下，优先从 `sessionStorage` 读取购方红字确认单详情数据
- QuotaOps.vue：调整发票额度有效期弹窗中的属期字段：
  - 将"额度属期(yyyyMM)"的输入框改为日期选择器（`el-date-picker`）
  - 设置日期选择器类型为 `month`（只选择年月）
  - 设置 `value-format="yyyyMM"`，选择后自动格式化为 yyyyMM 格式（如：202510）
  - 添加 `placeholder="选择年月"` 提示文字
- QuotaOps.vue：优化下载/退回弹窗：
  - 移除申请类型选择器，根据按钮自动设置申请类型（下载='0'，退回='1'）
  - 弹窗标题根据申请类型动态显示（"下载发票额度"或"退回发票额度"）
  - 点击"下载"按钮时自动设置 `sqlx='0'`，点击"退回"按钮时自动设置 `sqlx='1'`
  - 关闭弹窗时重置申请额度为0

## 2025-11-05 - taxInvoice 模块严重缺陷修复

### 严重缺陷修复（立即修复）

1. **表单字段绑定错误修复**：
   - `InvoiceBlueDetail.vue`：修复"差额征税类型"字段绑定错误（从 `form.xsfzh` 改为 `form.cezzslx`）
   - 在 `form` 数据对象中添加 `cezzslx` 字段

2. **日期字段重复检查**：
   - `InvoiceRedDetail.vue`：检查确认无重复的日期字段定义

3. **重复代码删除**：
   - `RedConfirmationBuyerList.vue`：删除重复的 API 服务检查代码（`if (!svc)` 重复判断）

4. **错误处理改进**：
   - 所有组件的空 `catch` 块改为有意义的错误日志和用户提示
   - 统一错误处理：`console.error` 记录错误，`$message.error` 提示用户
   - 修复的文件：
     - `InvoiceBlueDetail.vue`：fillSelectedData、saveFormData、restoreFormData、submit 中的错误处理
     - `InvoiceRedDetail.vue`：mounted、fillSelectedGoods、saveFormData、restoreFormData 中的错误处理
     - `RedConfirmationCreate.vue`：mounted、fillSelectedGoods、saveFormData、restoreFormData 中的错误处理
     - `RedConfirmationBuyerList.vue`：handleView 中的错误处理
     - `InvoiceRedList.vue`：viewRow 中的错误处理
     - `InvoiceBlueQuery.vue`：chooseAndNext 中的错误处理
     - `SelectGoodsList.vue`：add、addSelected 中的错误处理
     - `SelectOrgList.vue`：choose 中的错误处理
     - `SelectPersonList.vue`：choose 中的错误处理
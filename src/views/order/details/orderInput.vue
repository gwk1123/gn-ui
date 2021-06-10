<template>
  <div class="app-container">


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['order/order_info/add']"
        >新增
        </el-button>
      </el-col>
    </el-row>


    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-card>
          <div slot="header">
            <span>订单信息</span>
          </div>
          <div>


            <el-row>
              <el-col :span="6">
                <el-form-item label="站点" prop="otaSiteCode">
                  <el-input v-model="form.otaSiteCode" placeholder="请输入大写字母" disabled="disabled"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="OTA平台的订单号" prop="otaOrderNo">
                  <el-input v-model="form.otaOrderNo" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订位PNR" prop="urgency">
                  <el-input v-model="form.bookPnrNo" placeholder="只能录入航司二字码"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总订单费用" prop="urgency">
                  <el-input v-model="form.totalAmount" placeholder="只能录入航司二字码"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item label="总票价" prop="orderNo">
                  <el-input v-model="form.totalTicketPrice" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总税费" prop="otaOrderNo">
                  <el-input v-model="form.totalTaxPrice" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="销售佣金%比" prop="orderInputType">
                  <el-input v-model="form.commissionPrice" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品类型" prop="otaOrderNo">
                  <el-input v-model="form.productType" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="票单最晚出票时间" prop="otaOrderNo">
                  <el-input v-model="form.lastIssueTime" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="保险总费用" prop="otaOrderNo">
                  <el-input v-model="form.insuranceFee" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="保险总份数" prop="orderInputType">
                  <el-input v-model="form.insuranceCount" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系人" prop="otaOrderNo">
                  <el-input v-model="form.contactPerson" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="联系电话" prop="orderInputType">
                  <el-input v-model="form.contactPhone" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系人邮箱" prop="urgency">
                  <el-input v-model="form.contactEmail" placeholder="只能录入航司二字码"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报销发票类型" prop="urgency">
                  <el-input v-model="form.invoiceType" placeholder="只能录入航司二字码"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="政策ID" prop="orderNo">
                  <el-input v-model="form.policyId" placeholder="请输入大写字母"/>
                </el-form-item>
              </el-col>
            </el-row>

          </div>
        </el-card>

        <el-card>
          <div slot="header">
            <span>航段信息</span>
          </div>
          <div>

            <el-button @click="addTableItem">添加</el-button>
            <el-button @click="delTableItem">删除</el-button>

            <el-table
              :data="form.orderInfoSegments"
              style="width: 100%"
              border
              @selection-change="addSegmentSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">航程序号</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.journeySequence'"
                                :rules="form.orderInfoSegments.journeySequence"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.journeySequence"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">航段序号</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.segmentSequence'"
                                :rules="form.orderInfoSegments.segmentSequence"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.segmentSequence"
                      align="center"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">航班号</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.flightNumber'"
                                :rules="form.orderInfoSegments.flightNumber"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.flightNumber"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">出发地</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.depCity'"
                                :rules="form.orderInfoSegments.depCity"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.depCity"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">抵达地</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.arrCity'"
                                :rules="form.orderInfoSegments.arrCity"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.arrCity"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">舱等</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.cabinGrade'"
                                :rules="form.orderInfoSegments.cabinGrade"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.cabinGrade"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">舱位</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.cabin'"
                                :rules="form.orderInfoSegments.cabin"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.cabin"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">出发时间</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.depTime'"
                                :rules="form.orderInfoSegments.depTime"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.depTime"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">抵达时间</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.arrTime'"
                                :rules="form.orderInfoSegments.arrTime"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.arrTime"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">销售航司</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoSegments.' + scope.$index + '.marketingAirline'"
                                :rules="form.orderInfoSegments.marketingAirline"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.marketingAirline"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

            </el-table>
          </div>
        </el-card>

        <el-card>
          <div slot="header">
            <span>乘客信息</span>
          </div>
          <div>


            <el-button @click="addPassengerItem">添加</el-button>
            <el-button @click="delPassengerItem">删除</el-button>

            <el-table
              :data="form.orderInfoPassengers"
              style="width: 100%"
              border
              @selection-change="addPassengerSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">乘客姓名</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoPassengers.' + scope.$index + '.passengerName'"
                                :rules="form.orderInfoPassengers.passengerName"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.passengerName"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">性别</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoPassengers.' + scope.$index + '.gender'"
                                :rules="form.orderInfoPassengers.gender"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.gender"
                      align="center"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">证书类型</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoPassengers.' + scope.$index + '.certType'"
                                :rules="form.orderInfoPassengers.certType"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.certType"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">证书编号</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoPassengers.' + scope.$index + '.certNo'"
                                :rules="form.orderInfoPassengers.certNo"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.certNo"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">乘客类别</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoPassengers.' + scope.$index + '.passengerType'"
                                :rules="form.orderInfoPassengers.passengerType"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.passengerType"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">乘客移动号码</span>
                  <i style="color:#F56C6C;">*</i>
                </template>
                <template slot-scope="scope">
                  <el-form-item class="aa"
                                :prop="'orderInfoPassengers.' + scope.$index + '.passengerMobile'"
                                :rules="form.orderInfoPassengers.passengerMobile"
                  >
                    <el-input
                      type="text"
                      v-model="scope.row.passengerMobile"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

            </el-table>

          </div>
        </el-card>


        <!--        <el-form-item label="状态">-->
        <!--          <el-radio-group v-model="form.status">-->
        <!--            <el-radio-->
        <!--              v-for="dict in statusOptions"-->
        <!--              :key="dict.dictValue"-->
        <!--              :label="dict.dictValue"-->
        <!--            >{{dict.dictLabel}}</el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="备注">-->
        <!--          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listOrderInput,
    getOrderInput,
    delOrderInput,
    addOrderInput,
    updateOrderInput,
    changeOrderInputStatus
  } from "@/api/order/details/orderInput";

  export default {
    name: "orderInput",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // orderInfo表格数据
        orderInputList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          depAirport: undefined,
          arrAirport: undefined,
          status: undefined
        },
        // 表单参数
        form: {
          orderInfoSegments: [],
          orderInfoPassengers: []
        },
        // 表单校验
        rules: {
          airline: [
            {required: true, message: "航司不能为空", trigger: "blur"}
          ],
          depAirport: [
            {required: true, message: "出发地不能为空", trigger: "blur"}
          ],
          arrAirport: [
            {required: true, message: "目的地不能为空", trigger: "blur"}
          ]
        },
        addJsonMultiple: [],
        addPassenger: []
      };
    },
    created() {
      // this.getList();
      // this.getDicts("sys_normal_disable").then(response => {
      //   this.statusOptions = response.data;
      // });
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listOrderInput(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.orderInputList = response.records;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 状态修改
      changeStatus(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.id + '"编码吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return changeOrderInputStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          airline: undefined,
          depAirport: undefined,
          arrAirport: undefined,
          status: "0",
          orderInfoSegments: [],
          orderInfoPassengers: [],
          remark: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.current = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加订单确定";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getOrderInput(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改订单录入";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateOrderInput(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addOrderInput(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除id为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delOrderInput(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      addTableItem() {
        this.tabItemId = "T" + this.RndNum(6); //生成以T开头的七位随机数
        this.form.orderInfoSegments.push({
          journeySequence: "",
          flightNumber: "",
          segmentSequence: "",
          depCity: "",
          arrCity: "",
          cabinGrade: "",
          cabin: "",
          depTime: "",
          arrTime: "",
          marketingAirline: "",
          tabItemId: this.tabItemId
        });
      },
      RndNum(n) {
        // 生成随机数
        let rdmNum = "";
        for (let i = 0; i < n; i++) {
          rdmNum += Math.floor(Math.random() * 10); // [0,10)的整数
        }
        return rdmNum;
      },
      addSegmentSelectionChange(val) {
        this.addJsonMultiple = val;
      },
      delTableItem() {
        // 确认删除
        if (this.form.orderInfoSegments.length > 0) {
          let arrs = [];
          let ids = this.addJsonMultiple.map(val => val.tabItemId); //拿到选中的数据id,
          this.form.orderInfoSegments.forEach(item => {
            if (!ids.includes(item.tabItemId)) {
              // 当id在params中，表示数据被选中，该将其删除，即将不被选中的保留
              arrs.push(item);
            }
          });
          this.form.orderInfoSegments = arrs;
        } else {
          this.$message.warning("请选择要删除的数据");
        }
      },
      addPassengerItem() {
        this.tabItemId = "T" + this.RndNum(6); //生成以T开头的七位随机数
        this.form.orderInfoPassengers.push({
          passengerName: "",
          gender: "",
          certType: "",
          certNo: "",
          passengerType: "",
          passengerMobile: "",
          tabItemId: this.tabItemId
        });
      },
      delPassengerItem() {
        // 确认删除
        if (this.form.orderInfoPassengers.length > 0) {
          let arrs = [];
          let ids = this.addPassenger.map(val => val.tabItemId); //拿到选中的数据id,
          this.form.orderInfoPassengers.forEach(item => {
            if (!ids.includes(item.tabItemId)) {
              // 当id在params中，表示数据被选中，该将其删除，即将不被选中的保留
              arrs.push(item);
            }
          });
          this.form.orderInfoPassengers = arrs;
        } else {
          this.$message.warning("请选择要删除的数据");
        }
      },
      addPassengerSelectionChange(val) {
        this.addPassenger = val;
      }
    }
  };
</script>
<style scoped>
  .aa >>> .el-form-item__content {
    margin-left: 0px !important;
  }
</style>


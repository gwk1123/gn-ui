<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="GDS状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manual/order_change/add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manual/order_change/remove']"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="orderChangeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" prop="id" width="120"/>
      <el-table-column label="订单编码" prop="orderNo" width="100"/>
      <el-table-column label="状态" align="supplierCode" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manual/order_info_issue/edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manual/order_info_issue/remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-card>
          <div slot="header">
            <span>订单信息</span>
          </div>


          <el-card>
            <div slot="header">
              <span>航程信息</span>
            </div>
            <el-table v-loading="loading" :data="orderSegmentList" @selection-change="handleSelectionChange">
              <el-table-column label="id" prop="id" width="80"/>
              <el-table-column label="订单编码" prop="orderNo" width="80"/>
              <el-table-column label="订单id" prop="orderInfoId" width="80"/>
              <el-table-column label="航程序号" prop="journeySequence" width="80"/>
              <el-table-column label="航段序号" prop="segmentSequence" width="80"/>
              <el-table-column label="销售航司" prop="marketingAirline" width="80"/>
              <el-table-column label="航班号" prop="flightNumber" width="80"/>
              <el-table-column label="出发机场" prop="arrAirport" width="80"/>
              <el-table-column label="舱等" prop="cabinGrade" width="80"/>
              <el-table-column label="舱位" prop="cabin" width="80"/>
              <el-table-column label="出发时间" prop="depTime" width="80"/>
              <el-table-column label="抵达时间" prop="arrTime" width="80"/>
              <el-table-column label="是否共享" prop="codeShare" width="80"/>
              <el-table-column label="共享航司" prop="operatingAirline" width="80"/>
              <el-table-column label="共享航班号" prop="operatingFlightNumber" width="80"/>
              <el-table-column label="出发航站楼" prop="depTerminal" width="80"/>
              <el-table-column label="飞行时长" prop="durationMinute" width="80"/>
              <el-table-column label="经停分钟数" prop="stopMinute" width="80"/>
            </el-table>
          </el-card>

          <el-card>
            <div slot="header">
              <span>乘客信息</span>
            </div>
            <el-table v-loading="loading" :data="orderPassengerList" @selection-change="handleSelectionChange">
              <el-table-column label="id" prop="id" width="80"/>
              <el-table-column label="订单编码" prop="orderNo" width="80"/>
              <el-table-column label="订单id" prop="orderInfoId" width="80"/>
              <el-table-column label="乘客姓名" prop="passengerName" width="80"/>
              <el-table-column label="性别" prop="gender" width="80"/>
              <el-table-column label="证书发行国家" prop="certissueCountry" width="80"/>
              <el-table-column label="证书类型" prop="certType" width="80"/>
              <el-table-column label="证书编号" prop="certNo" width="80"/>
              <el-table-column label="证件有效期" prop="cardExpired" width="80"/>
              <el-table-column label="生日" prop="birthday" width="80"/>
              <el-table-column label="乘客类别" prop="passengerType" width="80"/>
              <el-table-column label="乘客移动号码" prop="passengerMobile" width="80"/>
              <el-table-column label="国籍" prop="nationality" width="80"/>
            </el-table>
          </el-card>

          <div>
          </div>
        </el-card>

        <el-form-item label="最迟确认时间" prop="latestIssueTime">
          <el-input v-model="form.latestIssueTime" placeholder="请输入类型"/>
        </el-form-item>
        <el-form-item label="申请改签原因" prop="applyChangeReason">
          <el-input v-model="form.applyChangeReason" placeholder="请输入申请改签原因"/>
        </el-form-item>


        <el-card>
          <div slot="header">
            <span>改签航段信息</span>
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


        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
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
    listOrderChange,
    getOrderChange,
    delOrderChange,
    addOrderChange,
    updateOrderChange,
    changeOrderChange
  } from "@/api/order/details/orderChange";

  export default {
    name: "OrderChange",
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
        // OTA表格数据
        orderChangeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        //订单航段信息
        orderSegmentList: [],
        //订单乘客信息
        orderPassengerList: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10
        },
        // 表单参数
        form: {
          orderInfoSegments: [],
          orderSegmentList: [],
          orderPassengerList: []
        },
        // 表单校验
        rules: {
          type: [
            // { required: true, message: "类型不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listOrderChange(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.orderChangeList = response.records;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 角色状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.otaCode + '"编码吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return changeOrderChange(row.id, row.status);
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
          status: "0",
          orderInfoSegments: [],
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
        this.title = "添加改签信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getOrderChange(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改站点";

          const orderDetailsVo = response.data.orderDetailsVo;
          this.orderSegmentList = orderDetailsVo.orderInfoSegments;
          this.orderPassengerList = orderDetailsVo.orderInfoPassengers;
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateOrderChange(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addOrderChange(this.form).then(response => {
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
          return delOrderChange(ids);
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
      }
    }
  };
</script>
<style scoped>
  .aa >>> .el-form-item__content {
    margin-left: 0px !important;
  }
</style>


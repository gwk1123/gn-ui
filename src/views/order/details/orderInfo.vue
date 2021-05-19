<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">

      <el-form-item label="订单编码" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="出发地" prop="depAirport">
        <el-input
          v-model="queryParams.depAirport"
          placeholder="请输入出发地"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目的地" prop="arrAirport">
        <el-input
          v-model="queryParams.arrAirport"
          placeholder="请输入目的地"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="路由状态"
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['order/order_info/add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['order/order_info/edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['order/order_info/remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table border v-loading="loading" :data="orderInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['order/order_info/edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['order/order_info/remove']"
          >删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="changeStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="id" prop="id" width="70" />
      <el-table-column label="订单来源站点" prop="otaSiteCode" width="100" />
      <el-table-column label="订单编码" prop="orderNo" width="100" />
      <el-table-column label="订单录入类型" prop="orderInputType" width="100" />
      <el-table-column label="紧急程度" prop="urgency" width="100" />
      <el-table-column label="订单状态" prop="orderStatus" width="100" />
      <el-table-column label="出票状态" prop="issueStatus" width="100" />
      <el-table-column label="订位PNR" prop="bookPnrNo" width="100" />
      <el-table-column label="产品类型" prop="productType" width="100" />
      <el-table-column label="政策ID" prop="policyId" width="100" />
      <el-table-column label="总结算费用" prop="totalSettlingCharge" width="100" />
      <el-table-column label="总订单费用" prop="totalAmount" width="100" />
      <el-table-column label="总票价" prop="totalTicketPrice" width="100" />
      <el-table-column label="总税费" prop="totalTaxPrice" width="100" />
      <el-table-column label="销售佣金%比" prop="commissionPrice" width="100" />
      <el-table-column label="佣金上限" prop="commitionLimit" width="100" />
      <el-table-column label="锁状态" prop="lockFlag" width="100" />
      <el-table-column label="加锁人姓名" prop="lockOperator" width="100" />
      <el-table-column label="出发地" prop="depAirport" width="100" />
      <el-table-column label="目的地" prop="arrAirport" width="100" />
      <el-table-column label="航司" prop="airline" width="80" />
<!--      <el-table-column label="状态" align="center" width="80">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch-->
<!--            v-model="scope.row.status"-->
<!--            active-value="0"-->
<!--            inactive-value="1"-->
<!--            @change="changeStatus(scope.row)"-->
<!--          ></el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['manual/base_air_route/edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['manual/base_air_route/remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-card >
          <div slot="header" >
            <span>运价信息</span>
          </div>
          <div>
        <el-form-item label="出发地" prop="depAirport">
          <el-input v-model="form.depAirport" placeholder="请输入大写字母" />
        </el-form-item>
        <el-form-item label="目的地" prop="arrAirport">
          <el-input v-model="form.arrAirport" placeholder="请输入大写字母" />
        </el-form-item>
        <el-form-item label="航司" prop="airline">
          <el-input v-model="form.airline" placeholder="只能录入航司二字码" />
        </el-form-item>
          </div>
        </el-card>

        <el-card >
          <div slot="header" >
            <span>航段信息</span>
          </div>
          <div>

              <el-table
                :data="form.orderInfoSegments"
                style="width: 100%">;
                <el-table-column
                  label="航程序号"
                  width="180">
                  <template slot-scope="scope">
                    <el-form-item :prop="`orderInfoSegments.${scope.$index}.journeySequence`" :rules='rules.journeySequence'>
                      <el-input style="width:80px"  v-model="scope.row.journeySequence" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="姓名"
                  width="180">
                  <template slot-scope="scope">
                    <el-form-item :prop="`orderInfoSegments.${scope.$index}.flightNumber`" :rules='rules.flightNumber'>
                      <el-input style="width:80px"  v-model="scope.row.flightNumber" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="地址">
                  <template slot-scope="scope">
                    <el-form-item :prop="`orderInfoSegments.${scope.$index}.depCity`" :rules='rules.depCity'>
                      <el-input style="width:80px"  v-model="scope.row.depCity" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>


          </div>
        </el-card>

        <el-card >
          <div slot="header" >
            <span>乘客信息</span>
          </div>
          <div>

          </div>
        </el-card>


        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
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
  import { listOrderInfo, getOrderInfo, delOrderInfo, addOrderInfo, updateOrderInfo, changeOrderInfoStatus } from "@/api/order/details/orderInfo";

  export default {
    name: "orderInfo",
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
        orderInfoList: [],
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
        form: {},
        // 表单校验
        rules: {
          airline: [
            { required: true, message: "航司不能为空", trigger: "blur" }
          ],
          depAirport: [
            { required: true, message: "出发地不能为空", trigger: "blur" }
          ],
          arrAirport: [
            { required: true, message: "目的地不能为空", trigger: "blur" }
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
        listOrderInfo(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.orderInfoList = response.records;
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
        }).then(function() {
          return changeOrderInfoStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
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
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加航线路由";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getOrderInfo(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改航司航线";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateOrderInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addOrderInfo(this.form).then(response => {
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
        }).then(function() {
          return delOrderInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
    }
  };
</script>

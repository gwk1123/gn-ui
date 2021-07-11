<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="GDS编码" prop="gdsCode">
        <el-input
          v-model="queryParams.gdsCode"
          placeholder="请输入GDS编码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="站点" prop="otaSiteCode">
        <el-input
          v-model="queryParams.otaSiteCode"
          placeholder="请输入站点编码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
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

    <el-table v-loading="loading" :data="reservationOrderList" >
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
          >详细</el-button>
        </template>
      </el-table-column>

      <el-table-column label="id" prop="id" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="站点" prop="otaSiteCode" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="订单编码" prop="reservationNo" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="OTA订单号" prop="otaReservationNo" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="全局政策ID" prop="globalPolicyId" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="明细政策ID" prop="policyId" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="查询GDS系统" rop="searchGdsChannel" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="查询office号" prop="searchOfficeNo" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="订位GDS系统" prop="bookGdsChannel" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="订位office号" prop="bookOfficeNo" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="订位PNR" prop="bookPnrNo" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="主销售航司" prop="validatingCarrier" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="行程类型" prop="tripType" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="联系人" prop="contactPerson" align="center" class-name="small-padding fixed-width" />
      <el-table-column label="创建时间" prop="createTime" align="center" class-name="small-padding fixed-width" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 操作日志详细 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">

        <el-card>
          <div slot="header">
            <span>订单信息</span>
          </div>
          <div>
        <el-row>
          <el-col :span="4">
            <el-form-item label="站点: ">{{ form.otaSiteCode }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单编码：">{{ form.reservationNo }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="全局政策ID：">{{ form.globalPolicyId }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="明细政策ID：">{{ form.policyId }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="主销售航司：">{{ form.validatingCarrier }}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="查询GDS：">{{ form.searchGdsChannel }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="查询配置号：">{{ form.searchOfficeNo }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订位GDS：">{{ form.bookGdsChannel }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订位配置号：">{{ form.bookOfficeNo }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订位PNR：">{{ form.bookPnrNo }}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="行程类型：">{{ form.tripType }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
        </el-row>
          </div>
        </el-card>


        <el-card>
          <div slot="header">
            <span>航段信息</span>
          </div>
          <div>

            <el-table
              :data="form.reservationSegments"
              style="width: 100%"
              border
            >

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">航程序号</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.journeySequence }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">航段序号</span>
                </template>
                <template slot-scope="scope" >
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.segmentSequence }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">销售航司</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.marketingAirline }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center" >
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">航班号</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.flightNumber }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">出发机场</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.depAirport }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">到达机场</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.arrAirport }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">起飞时间</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.depTime }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">到达时间</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.arrTime }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">舱等</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.cabinGrade }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">子舱位</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.cabin }}</el-form-item>
                  </el-col>
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

            <el-table
              :data="form.reservationPassengers"
              style="width: 100%"
              border>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">乘客姓名</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.passengerName }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">乘客类型</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.passengerType }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">证件类型</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.certType }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center" >
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">证件号</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.certNo }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">出生日期</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.birthday }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">手机号</span>
                </template>
                <template slot-scope="scope">
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.passengerMobile }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

              <el-table-column align="center">
                <template slot="header" slot-scope="scope">
                  <span style="color:#2d65dc;">性别</span>
                </template>
                <template slot-scope="scope" >
                  <el-col >
                    <el-form-item class="ro">{{ scope.row.gender }}</el-form-item>
                  </el-col>
                </template>
              </el-table-column>

            </el-table>
          </div>
        </el-card>



        <el-card>
          <div slot="header">
            <span>data信息</span>
          </div>
          <div>

            <el-row>
              <el-col >
                <el-form-item label="data: ">{{ form.dataContent }}</el-form-item>
              </el-col>
            </el-row>



          </div>
        </el-card>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getReservationOrder, listReservationOrder} from "@/api/direct/gds/reservationOrder";

  export default {
    name: "ReservationOrder",
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
        // 表格数据
        reservationOrderList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 表单参数
        form: {
          dataContent:undefined,
          reservationData:undefined,
          reservationSegments: [],
          reservationPassengers: []
        },
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          otaSiteCode: undefined
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listReservationOrder(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.reservationOrderList = response.records;
            this.total = response.total;
            this.loading = false;
          }
        );
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
      /** 详细按钮操作 */
      handleView(row) {
        this.reset();
        const id = row.id || this.ids;
        getReservationOrder(id).then(response => {
          this.form = response.data;
          this.form.dataContent= this.form.reservationData.dataContent;
          this.open = true;
          this.title = "订单信息详情";
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
          otaSiteCode: undefined,
          reservationNo: undefined,
          globalPolicyId: undefined,
          policyId: undefined,
          gdsFullEname: undefined,
          searchGdsChannel: undefined,
          searchOfficeNo: undefined,
          bookGdsChannel: undefined,
          bookOfficeNo: undefined,
          bookPnrNo: undefined,
          validatingCarrier: undefined,
          tripType: undefined,
          createTime: undefined,
          reservationData: undefined,
          reservationSegments: [],
          reservationPassengers: []
        };
        this.resetForm("form");
      }
    }
  };
</script>
<style scoped>
  .ro >>> .el-form-item__content {
    margin-left: 0px !important;
  }
</style>

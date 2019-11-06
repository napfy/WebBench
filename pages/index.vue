<template>
  <el-container>
    <el-main>
      <div class="cont">
        <el-row>
          <el-col :span="22" :offset="1">
            <el-tabs v-model="curtab" type="border-card">
              <el-tab-pane name="setting">
                <span slot="label"> <i class="el-icon-s-operation" /> 基准测试设置</span>
                <el-row>
                  <el-col :span="22" :offset="1">
                    <command-form ref="cfm" @recivedata="reciveData" @runbench="runWebBench" @loading="changeLoading" @showtips="showTips" />
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane name="graph">
                <span slot="label"> <i class="el-icon-s-data" /> 基准测试对比图 </span>
                <el-row>
                  <el-col :span="22" :offset="1" class="min800">
                    <datachart
                      ref="graph"
                      v-loading="loading"
                      element-loading-text="正在进行基准测试..."
                      :height="height"
                      :chartdata="chartdata"
                      :options="options"
                    />
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane name="logs">
                <span slot="label"><i class="el-icon-s-order" /> 基准测试输出</span>
                <log-panel class="min800" :logs="logs" @clearlog="clearLog" />
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script src="./index.js"></script>

<style>
.cont{
  margin:20px auto;
}
.min800{
  min-height:800px;
}
</style>

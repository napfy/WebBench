<template>
  <el-form>
    <el-row v-if="useab">
      <el-col :span="4" :offset="4">
        <el-form-item label="执行次数">
          <el-input-number v-model="runtimes" :step="1" step-strictly />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="总请求数">
          <el-input-number v-model="request_times" :step="1" :change="buildAllCmd" step-strictly />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="并发数">
          <el-input-number v-model="concurrent" :step="1" :change="buildAllCmd" step-strictly />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="超时(秒)">
          <el-input-number v-model="timeout_seconds" :step="1" change="buildAllCmd" step-strictly />
        </el-form-item>
      </el-col>
    </el-row>
    <div v-for="cmds of cmdsList" :key="cmds.guid">
      <command-group
        ref="cmdsList"
        v-bind="cmds"
        :request_times="request_times"
        :concurrent="concurrent"
        :timeout_seconds="timeout_seconds"
        :useab="useab"
        @remove="removeCmd"
        @buildcmd="buildCmd"
        @changename="changeName"
      />
    </div>
    <el-row>
      <el-col :span="3">
        <el-switch
          v-model="useab"
          active-text="使用ab命令"
          inactive-text="自定义命令"
        />
      </el-col>
      <el-col :span="2" :offset="5">
        <el-button type="success" icon="el-icon-plus" @click="addBench">
          新增基准测试
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="show_drawer=true">
          编辑全局参数
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="info" @click="checkInstall">
          检查安装
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="warning" icon="el-icon-arrow-right" @click="checkBench">
          运行测试命令
        </el-button>
      </el-col>
    </el-row>
    <el-drawer
      title="全局参数"
      :visible.sync="show_drawer"
      size="70%"
      direction="btt"
    >
      <el-row>
        <el-col :span="22" :offset="1">
          <el-input v-model="global_params" type="textarea" autosize />
        </el-col>
      </el-row>
    </el-drawer>
  </el-form>
</template>
<style>

</style>
<script src="./CommandForm.js"></script>

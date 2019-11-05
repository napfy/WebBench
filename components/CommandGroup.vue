<template>
  <el-card class="mg20">
    <div slot="header">
      <el-row v-if="!name_edit" :gutter="5">
        <el-col :span="4">
          <el-button type="text" @click="editName">
            {{ name }}
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="editName" />
        </el-col>
        <el-col :span="1" :offset="19">
          <el-button icon="el-icon-delete" circle @click="remove" />
        </el-col>
      </el-row>
      <el-row v-if="name_edit" :gutter="10">
        <el-col :span="6">
          <el-input v-model="name" />
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-check" @click="saveName" />
        </el-col>
      </el-row>
    </div>
    <div class="border">
      <el-input v-if="useinit" v-model="precmd" type="textarea" placeholder="请输入初始化命令" autosize />
      <el-input v-if="!useab" v-model="xcmd" type="textarea" placeholder="请输入命令" autosize />
      <el-row v-if="useab" class="radius" :gutter="20">
        <el-col :span="2" class="middle-height">
          <span class="ccolor">Apache Bench 命令</span>
        </el-col>
        <el-col :span="2">
          <el-select v-model="http_protocol">
            <el-option
              v-for="item in http_prot_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-input v-model="url" placeholder="请输入测试地址" clearable />
        </el-col>
        <el-col :span="2">
          <el-select v-model="http_method">
            <el-option
              v-for="item in http_method_options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col v-if="useab && (http_method=='POST' || http_method=='PUT')" :span="4">
          <el-select v-model="contype" placeholder="Content-Type">
            <el-option
              v-for="ct in content_types"
              :key="ct"
              :label="ct"
              :value="ct"
            />
          </el-select>
        </el-col>
        <el-col v-if="useab && !global_params && (http_method=='POST' || http_method=='PUT')" :span="2">
          <el-button @click="show_drawer=true">
            编辑参数
          </el-button>
        </el-col>
      </el-row>
      <el-input v-if="usefinish" v-model="fincmd" type="textarea" autosize placeholder="请输入清理命令" />
      <el-row class="mt20">
        <el-col :span="2">
          <el-checkbox v-model="useinit" label="启用初始化命令" />
        </el-col>
        <el-col :span="2">
          <el-checkbox v-model="usefinish" label="启用清理命令" />
        </el-col>
        <el-col v-if="useab" :span="2">
          <el-checkbox v-model="keepalive" label="启用KeepAlive" />
        </el-col>
        <el-col v-if="useab && http_method=='POST'" :span="2">
          <el-checkbox v-model="global_params" label="使用全局参数" />
        </el-col>
      </el-row>
    </div>
    <el-drawer
      :title="name+'参数'"
      :visible.sync="show_drawer"
      size="70%"
      direction="btt"
    >
      <el-row>
        <el-col :span="22" :offset="1">
          <el-input v-model="params" type="textarea" autosize />
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<style>
.border .el-textarea{
  margin:10px 0;
}
.middle-height{
  line-height:36px;
}
.mg20{
  margin:20px;
}
.ccolor{
  color:green;
}
.mt20{
  margin-top:20px;
}
.clr{
  clear:both;
}
</style>

<script src="./CommandGroup.js"></script>

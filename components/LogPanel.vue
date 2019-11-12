<template>
  <div>
    <el-row class="blank">
      <el-col :span="20" :offset="1">
        <div class="output">
          <div v-for="log in logs" :key="log.index" class="log">
            {{ log }}
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1" :offset="10">
        <el-button @click="clearLog">
          清除日志
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<style>
.blank{

}
.output {
  padding:20px 0;
}
.output .log{
  font-size:14px;
  line-height:24px;
  color: #555;
}
</style>
<script>
export default {
  props: {
    logs: Array
  },
  methods: {
    clearLog () {
      this.$emit('clearlog')
    }
  }
}
</script>

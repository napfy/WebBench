import CommandGroup from '~/components/CommandGroup.vue'
export default {
  components: {
    CommandGroup
  },
  data () {
    return {
      runtimes: 1,
      cur_runtimes: 0,
      time_results: [],
      time_result_error: false,
      status_running: false,
      request_times: 100,
      concurrent: 1,
      timeout_seconds: 0,
      show_drawer: false,
      global_params: '',
      index: 2,
      cmdsList_index: 0,
      useab: true,
      cmdsList: [
        {
          'name': '测试1',
          'guid': this.genGuid(),
          'xcmd': '',
          'precmd': '',
          'fincmd': ''
        },
        {
          'name': '测试2',
          'guid': this.genGuid(),
          'xcmd': '',
          'precmd': '',
          'fincmd': ''
        }
      ]
    }
  },
  methods: {
    checkBench () {
      if (this.status_running) {
        this.$confirm('测试正在运行中，开启新的测试将会影响测试结果的准确性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.runBench()
        }).catch(() => {

        })
      } else {
        this.runBench()
      }
    },
    runBench () {
      this.$emit('runbench')
      this.saveGlobalParams()
      this.buildAllCmd()
      this.time_results = []
      this.time_result_error = false
      this.status_running = true
      this.cmdsList_index = 0
      this.cur_runtimes = 0
      for (let i = 0; i < this.runtimes; i++) {
        this.time_results.push([])
      }
      if (this.cmdsList.length > 0) {
        console.log('pos 1')
        this.runcmd(this.cmdsList[0])
      }
    },
    nextGroup () {
      this.cmdsList_index++
      if (this.cmdsList_index < this.cmdsList.length) {
        this.$emit('loading', true)
        return this.cmdsList[this.cmdsList_index]
      } else {
        this.checkNextTurn()
        this.$emit('loading', false)
        this.status_running = false
        return null
      }
    },
    checkNextTurn () {
      if (this.cur_runtimes + 1 < this.runtimes) {
        this.cmdsList_index = 0
        this.cur_runtimes += 1

        if (this.cmdsList.length > 0) {
          console.log('pos 2')
          this.runcmd(this.cmdsList[0])
        }
      } else {
        this.$emit('loading', false)
        this.status_running = false
        // 显示当前统计
        console.log('>>>>------>>>>')
        console.log(this.time_results)
        const avgResults = this.countAvg(this.time_results, this.runtimes, this.cmdsList.length)
        this.$emit('showtotal', { data: avgResults })
        return null
      }
    },
    addByIndex (ar, len, idx) {
      let x = 0
      for (let i = 0; i < len; i++) {
        x += ar[i][idx]
      }
      return x
    },
    countAvg (arlist, len, arlen) {
      const r = []
      for (let i = 0; i < arlen; i++) {
        r.push(this.addByIndex(arlist, len, i) / len)
      }
      return r
    },
    hasNextGroup () {
      return this.cmdsList_index < this.cmdsList.length
    },
    runcmd (cmdgrp) {
      if (cmdgrp === undefined || cmdgrp === null) {
        return
      }
      this.$axios.post(document.location.href + 'api/rungroup', {
        'precmd': cmdgrp.precmd,
        'cmd': cmdgrp.xcmd,
        'fincmd': cmdgrp.fincmd,
        'useab': this.useab ? 1 : 0
      }).then((response) => {
        const data = response.data
        this.$emit('recivedata', { 'log': ['收到 /rungroup 响应'] })
        if (response.status === 200) {
          // 处理数据 解析
          if (data.code === 0) {
            // 命令成功执行
            this.$emit('recivedata', { 'log': data.log, 'err': data.err, 'time': data.time, 'guid': cmdgrp.guid })
            // 追加 time 到对应的区域
            console.log('this.time_results.length >>>>>')
            console.log(this.time_results)
            console.log('this.cur_runtimes >>>>>')
            console.log(this.cur_runtimes)
            this.time_results[this.cur_runtimes].push(data.time)
            if (this.hasNextGroup()) {
              console.log('pos 3')
              this.runcmd(this.nextGroup())
            } else {
              this.checkNextTurn()
              this.status_running = false
              this.$emit('loading', false)
            }
          }
          if (data.code < 0) {
            // 初始化出错
            this.$emit('recivedata', { 'log': data.log, 'err': data.err })
          }
          if (data.code > 0) {
            // 程序运行出错
            this.$emit('recivedata', { 'log': data.log, 'err': data.err })
          }
        } else {
          this.status_running = false
          this.$emit('recivedata', { 'err': ['status code:' + data.status] })
          this.$emit('loading', false)
        }
      }).catch((err) => {
        this.$emit('recivedata', { err: [err] })
        this.status_running = false
        this.$emit('loading', false)
      })
    },
    addBench () {
      const uid = this.genGuid()
      this.cmdsList.push({ 'name': '测试' + this.index, 'guid': uid, 'xcmd': '', 'precmd': '', 'fincmd': '' })
    },
    removeCmd (obj) {
      for (let i = 0; i < this.cmdsList.length; i++) {
        if (this.cmdsList[i].guid === obj.guid) {
          this.cmdsList.splice(i, 1)
          return
        }
      }
    },
    checkInstall () {
    },
    saveGlobalParams () {
      this.show_drawer = false
      this.$axios.post(document.location.href + 'api/saveparams', {
        'paramsbody': this.global_params
      }).then((response) => {
        const data = response.data
        this.$emit('recivedata', { 'log': ['收到 /saveparams 响应'] })
        if (response.status === 200) {
          if (data.code === 0) {
            this.$emit('recivedata', { 'log': data.log })
          }
          if (data.code < 0) {
            // 初始化出错
            this.$emit('recivedata', { 'log': data.log, 'err': data.err })
          }
          if (data.code > 0) {
            // 程序运行出错
            this.$emit('recivedata', { 'log': data.log, 'err': data.err })
          }
        } else {
          this.$emit('recivedata', { 'err': ['status code:' + data.status] })
        }
      }).catch((err) => {
        this.$emit('recivedata', { err: [err] })
      })
    },
    buildCmd (obj) {
      for (let i = 0; i < this.cmdsList.length; i++) {
        if (this.cmdsList[i].guid === obj.guid) {
          this.cmdsList[i].xcmd = obj.cmd
          this.cmdsList[i].precmd = obj.precmd
          this.cmdsList[i].fincmd = obj.fincmd
        }
      }
    },
    genGuid () {
      if (this.index === undefined) {
        this.index = 0
      }
      this.index += 1
      return Date.now() + '' + this.index
    },
    buildAllCmd () {
      for (let i = 0; i < this.cmdsList.length; i++) {
        this.$refs.cmdsList[i].genXcmd()
      }
    },
    chartReinit () {
      this.$emit('chartinit')
    },
    changeName (obj) {
      for (let i = 0; i < this.cmdsList.length; i++) {
        if (this.cmdsList[i].guid === obj.guid) {
          this.cmdsList[i].name = obj.name
          return
        }
      }
    }
  },
  watch: {
    request_times: 'buildAllCmd',
    concurrent: 'buildAllCmd',
    timeout_seconds: 'buildAllCmd',
    useab: 'buildAllCmd'
  }
}

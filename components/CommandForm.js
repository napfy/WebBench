import CommandGroup from '~/components/CommandGroup.vue'
export default {
  components: {
    CommandGroup
  },
  data () {
    return {
      runtimes: 1,
      cur_runtimes: 1,
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
    runBench () {
      this.$emit('runbench')
      this.saveGlobalParams()
      this.cur_runtimes = this.runtimes > 0 ? this.runtimes : 1
      this.buildAllCmd()
      this.cmdsList_index = 0
      if (this.cmdsList.length > 0) {
        this.cur_runtimes = this.cur_runtimes - 1
        this.runcmd(this.cmdsList[0])
      }
    },
    nextGroup () {
      this.cmdsList_index++
      if (this.cmdsList_index < this.cmdsList.length) {
        this.$emit('loading', true)
        return this.cmdsList[this.cmdsList_index]
      } else {
        this.$emit('loading', false)
        return null
      }
    },
    hasNextGroup () {
      return this.cmdsList_index < this.cmdsList.length
    },
    runcmd (cmdgrp) {
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
            if (this.hasNextGroup()) {
              this.runcmd(this.nextGroup())
            } else {
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
          this.$emit('recivedata', { 'err': ['status code:' + data.status] })
          this.$emit('loading', false)
        }
      }).catch((err) => {
        this.$emit('recivedata', { err: [err] })
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

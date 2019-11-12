import LogPanel from '~/components/LogPanel.vue'
import CommandForm from '~/components/CommandForm.vue'
import Datachart from '~/components/Datachart.vue'

export default {
  components: {
    CommandForm,
    Datachart,
    LogPanel
  },
  data () {
    return {
      curtab: 'setting',
      logs: [],
      tipnum: 0,
      height: 180,
      loading: false,
      chartdata: {
        labels: ['性能测试'],
        datasets: [
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            offset: false,
            gridLines: {
              offsetGridLines: false
            },
            ticks: {
              min: 0
            }
          }],
          yAxes: [{
            offset: true
          }]
        }
      },
      color_index: 0,
      colors: [
        '#4070FF',
        '#FF4B4B',
        '#2FFF54',
        '#FF20C7',
        '#FFE51E',
        '#0030BF',
        '#BA2B00',
        '#00710D',
        '#F0A400',
        '#B00093'
      ]
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    getNextColor () {
      const color = this.colors[this.color_index]
      this.color_index = this.color_index + 1
      if (this.color_index === this.colors.length) {
        this.color_index = 0
      }
      return color
    },
    runWebBench () {
      this.curtab = 'graph'
      this.log('开始新的测试，初始化图表...')
      this.chartdata.datasets = []
      this.loading = true
      this.$refs.graph.update()
    },
    reciveData (data) {
      this.curtab = 'graph'
      if (data.log !== undefined) {
        for (let i = 0; i < data.log.length; i++) {
          this.log(data.log[i])
        }
      }
      if (data.err !== undefined) {
        for (let j = 0; j < data.err.length; j++) {
          this.log(data.err[j])
          this.tipnum += 1
        }
      }
      if (data.time !== undefined) {
        this.log('运行时间:' + data.time)
        this.chartdata.datasets.push({ label: this.getName(data.guid), data: [data.time], minBarLength: 20, barPercentage: 0.8, backgroundColor: this.getNextColor(), maxBarThickness: 50 })
        this.$refs.graph.update()
      }
    },
    changeLoading (state) {
      this.loading = state
    },
    log (msg) {
      const dt = new Date()
      this.logs.push(dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ' ' + msg)
    },
    clearLog () {
      this.logs = []
    },
    tabChange () {
      if (this.curtab === 'logs') {
        this.tipnum = 0
      }
    },
    getName (guid) {
      const cmds = this.$refs.cfm.cmdsList
      for (let i = 0; i < cmds.length; i++) {
        if (cmds[i].guid === guid) {
          return cmds[i].name
        }
      }
    },
    showTotal (total) {
      const data = total.data
      const cmds = this.$refs.cfm.cmdsList
      //      this.chartdata.datasets = []
      console.log('showtotal')
      console.log(data)
      console.log(cmds)
      for (let i = 0; i < data.length; i++) {
        this.chartdata.datasets.push({ label: cmds[i].name + '平均值', data: [data[i]], minBarLength: 20, barPercentage: 0.8, backgroundColor: this.getNextColor(), maxBarThickness: 50 })
      }
      this.$refs.graph.update()
    }
  }
}

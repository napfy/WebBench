<script>
import { HorizontalBar } from 'vue-chartjs'

export default {
  extends: HorizontalBar,
  props: {
    chartdata: Object,
    options: Object
  },
  data: () => ({
    loaded: false
  }),
  mounted () {
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
    update () {
      this.$data._chart.update()
    }
  }
}
</script>

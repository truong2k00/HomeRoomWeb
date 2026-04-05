
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Chart,
  LegendElement,
} from 'chart.js'
import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'
import { Line } from 'vue-chartjs'
import type { LegendItem, PluginOptionsByType } from 'chart.js'
import type { ChartEvent } from 'chart.js/dist/core/core.plugins'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

export default defineComponent({
  name: 'LineChart',
  props: {
    chartId: {
      type: String,
      default: 'line-chart',
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => ({}),
    },
    plugins: {
      type: Array as PropType<PluginOptionsByType<'line'>[]>,
      default: () => [],
    },
    chartData: {
      type: Object,
      default: () => ({}),
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { expose, emit }) {
    const chartRef = ref<InstanceType<typeof Line> | null>(null)

    // Gắn onClick nếu chưa tồn tại
    if (!props.chartOptions.plugins) {
      props.chartOptions.plugins = {}
    }

    if (!props.chartOptions.plugins.legend) {
      props.chartOptions.plugins.legend = {}
    }

    props.chartOptions.plugins.legend.onClick = function (
      e: ChartEvent,
      legendItem: LegendItem,
      legend: { chart: Chart }
    ) {
      const index = legendItem.datasetIndex!
      const chart = legend.chart
      const meta = chart.getDatasetMeta(index)

      // Toggle ẩn/hiện
      meta.hidden = !meta.hidden
      chart.update()

      // Emit status từng dataset
      const allStatus = chart.data.datasets.map((ds, idx) => {
        const m = chart.getDatasetMeta(idx)
        return {
          label: ds.label,
          hidden: m.hidden ?? false,
        }
      })

      emit('dataset-visibility-change', allStatus)
    }

    // expose chartInstance ra ngoài component
    expose({
      get chart(): Chart<'line'> | undefined {
        return chartRef.value?.chart
      },
    })

    return () =>
      h(h(Line), {
        ref: chartRef,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
        options: props.chartOptions,
        data: props.chartData,
      })
  },
})

// import {
//   CategoryScale,
//   Chart as ChartJS,
//   Legend,
//   LineElement,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Chart,
// } from 'chart.js'
// import type { PropType } from 'vue'
// import { defineComponent, h, ref } from 'vue'
// import { Line } from 'vue-chartjs'
// import type { LegendItem, PluginOptionsByType } from 'chart.js'
// import { ChartEvent } from 'chart.js/dist/core/core.plugins'

// ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

// export default defineComponent({
//   name: 'LineChart',
//   props: {
//     chartId: {
//       type: String,
//       default: 'line-chart',
//     },
//     width: {
//       type: Number,
//       default: 400,
//     },
//     height: {
//       type: Number,
//       default: 400,
//     },
//     cssClasses: {
//       default: '',
//       type: String,
//     },
//     styles: {
//       type: Object as PropType<Partial<CSSStyleDeclaration>>,
//       default: () => ({}),
//     },
//     plugins: {
//       type: Array as PropType<PluginOptionsByType<'line'>[]>,
//       default: () => [],
//     },
//     chartData: {
//       type: Object,
//       default: () => ({}),
//     },
//     chartOptions: {
//       type: Object,
//       default: () => ({}),
//     },
//   },
//   setup(props, { expose, emit }) {

//     const chartRef = ref<InstanceType<typeof Line> | null>(null)
//     props.chartOptions.plugins.legend.onClick = function (
//       e: ChartEvent,
//       legendItem: LegendItem,
//       legend: { chart: Chart }
//     ) {
//       const index = legendItem.datasetIndex!
//       const chart = legend.chart
//       const meta = chart.getDatasetMeta(index)

//       meta.hidden = !meta.hidden
//       chart.update()

//       const allStatus = chart.data.datasets.map((ds, idx) => {
//         const m = chart.getDatasetMeta(idx)
//         return {
//           label: ds.label,
//           hidden: m.hidden ?? false,
//         }
//       })

//       emit('dataset-visibility-change', allStatus)
//     }
//     // expose chartInstance ra ngoài component
//     expose({
//       get chart(): Chart<'line'> | undefined {
//         return chartRef.value?.chart
//       },
//     })

//     return () =>
//       h(h(Line), {
//         ref: chartRef,
//         chartId: props.chartId,
//         width: props.width,
//         height: props.height,
//         cssClasses: props.cssClasses,
//         styles: props.styles,
//         plugins: props.plugins,
//         options: props.chartOptions,
//         data: props.chartData,
//       })
//   },
// })


// import type { PluginOptionsByType } from 'chart.js'
// import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js'
// import type { PropType } from 'vue'
// import { defineComponent } from 'vue'
// import { Line } from 'vue-chartjs'

// ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

// export default defineComponent({
//   name: 'LineChart',
//   props: {
//     chartId: {
//       type: String,
//       default: 'line-chart',
//     },
//     width: {
//       type: Number,
//       default: 400,
//     },
//     height: {
//       type: Number,
//       default: 400,
//     },
//     cssClasses: {
//       default: '',
//       type: String,
//     },
//     styles: {
//       type: Object as PropType<Partial<CSSStyleDeclaration>>,
//       default: () => ({}),
//     },
//     plugins: {
//       type: Array as PropType<PluginOptionsByType<'line'>[]>,
//       default: () => [],
//     },
//     chartData: {
//       type: Object,
//       default: () => ({}),
//     },
//     chartOptions: {
//       type: Object,
//       default: () => ({}),
//     },
//   },
//   setup(props) {
//     return () =>
//       h(h(Line), {
//         chartId: props.chartId,
//         width: props.width,
//         height: props.height,
//         cssClasses: props.cssClasses,
//         styles: props.styles,
//         plugins: props.plugins,
//         options: props.chartOptions,
//         data: props.chartData,
//       })
//   },
// })

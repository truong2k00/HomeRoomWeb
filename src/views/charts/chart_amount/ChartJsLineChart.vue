<script setup lang="ts">
import { useTheme } from "vuetify";
import {
  getLabelsDMDate,
  getLabelsDMDateTos,
  getLineChartAmountConfig,
} from "@core/libs/chartjs/chartjsConfig";
import LineChart from "@core/libs/chartjs/components/LineChart";

import type { ChartJsCustomColors } from "@/views/charts/chartjs/types";
import { Chart } from "chart.js";
import { form } from "@/views/demos/components/dialog/demoCodeDialog";

interface Props {
  colors: ChartJsCustomColors;
}

const props = defineProps<Props>();

const vuetifyTheme = useTheme();

const data = ref({
  labels: getLabelsDMDate(15, [
    "2025-07-17T07:26:06.0197429",
    "2025-07-19T03:04:30.8968193",
    "2025-07-24T09:15:04.6170642",
    "2025-07-25T06:45:01.6167115",
    "2025-07-26T06:32:29.7583554",
    "2025-07-27T08:23:06.7934691",
    "2025-07-30T02:10:17.0765111",
    "2025-07-31T04:07:08.2430582",
  ]),
  datasets: [
    {
      fill: false,
      tension: 0.5,
      pointRadius: 1,
      hidden: false,
      label: "Europe",
      pointHoverRadius: 5,
      pointStyle: "circle",
      borderColor: props.colors.primary,
      backgroundColor: props.colors.primary,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: props.colors.primary,
      data: [
        80, 150, 180, 270, 210, 160, 160, 202, 265, 210, 270, 255, 290, 360,
        375,
      ],
    },
    {
      fill: false,
      tension: 0.5,
      label: "Asia",
      pointRadius: 3,
      hidden: false,
      pointHoverRadius: 5,
      pointStyle: "circle",
      borderColor: props.colors.warningShade,
      backgroundColor: props.colors.warningShade,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: props.colors.warningShade,
      data: [
        80, 125, 105, 130, 215, 195, 140, 160, 230, 300, 220, 170, 210, 200,
        280,
      ],
    },

    {
      fill: false,
      tension: 0.5,
      pointRadius: 1,
      hidden: false,
      label: "Africa",
      pointHoverRadius: 5,
      pointStyle: "circle",
      borderColor: props.colors.yellow,
      backgroundColor: props.colors.yellow,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: props.colors.yellow,
      data: [
        80, 99, 82, 90, 115, 115, 74, 75, 130, 155, 125, 90, 140, 130, 180,
      ],
    },
    {
      fill: true,
      tension: 0.5,
      pointRadius: 1,
      hidden: true,
      label: "Amount",
      pointHoverRadius: 5,
      pointStyle: "circle",
      borderColor: props.colors.polarChartGreen,
      backgroundColor: props.colors.polarChartGreen,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: props.colors.polarChartGreen,
      data: [85, 94, 80, 90, 15, 123, 73, 77, 120, 115, 145, 80, 120, 111, 560],
    },
  ],
});
const chartRef = ref<{ chart?: Chart<"line"> } | null>(null);

onMounted(async () => {
  await nextTick(); // Đảm bảo chart đã render
  const chartInstance = chartRef.value?.chart;

  if (chartInstance) {
    chartInstance.data.datasets.forEach((dataset, index) => {
      const meta = chartInstance.getDatasetMeta(index);
      console.log(
        `Dataset ${index} (${dataset.label}) is ${
          meta.hidden ? "hidden" : "visible"
        }`
      );
    });
  }
});
const chartConfig = computed(() =>
  getLineChartAmountConfig(vuetifyTheme.current.value, 900)
);

const onLegendToggle = (statusList: any) => {
  console.log("Status cập nhật:", statusList);
};
const datasetIdToToggle = ref<string | null>(null);

const toggleDatasetVisibility = () => {
  const chart = chartRef.value?.chart;
  if (!chart || datasetIdToToggle.value == null) return;

  const datasetIndex = chart.data.datasets.findIndex(
    (ds) => ds.label === datasetIdToToggle.value
  );

  if (datasetIndex === -1) {
    console.warn("Không tìm thấy dataset với name:", datasetIdToToggle.value);
    return;
  }

  const meta = chart.getDatasetMeta(datasetIndex);
  meta.hidden = !meta.hidden;
  chart.update();
};

const formDate = ref(Date.now());

onMounted(() => {
  const date = new Date(formDate.value); // chuyển timestamp thành Date
  date.setDate(date.getDate() - 15); // trừ 15 ngày
  formDate.value = date.getTime();
});
const formTo = ref(Date.now());
watch(
  () => [formDate.value, formTo.value],
  ([newFrom, newTo], [oldFrom, oldTo]) => {
    const fromDate = new Date(newFrom);
    const toDate = new Date(newTo);

    data.value.labels = getLabelsDMDateTos(fromDate, toDate, [
      "2025-07-18T07:26:06.0197429",
      "2025-07-19T03:04:30.8968193",
      "2025-07-24T09:15:04.6170642",
      "2025-07-25T06:45:01.6167115",
      "2025-07-26T06:32:29.7583554",
      "2025-07-27T08:23:06.7934691",
      "2025-07-30T02:10:17.0765111",
      "2025-07-31T04:07:08.2430582",
    ]);
    if (chartRef.value?.chart?.update) {
      chartRef.value.chart.update();
    }
  }
);
</script>

<template>
  <div class="mt-4">
    <VRow>
      <VCol cols="12" sm="6" md="4">
        <VRow>
          <VCol cols="1" class="d-flex align-center justify-center">
            <span>Form</span>
          </VCol>
          <VCol cols="5">
            <AppDateTimePicker
              v-model="formDate"
              prepend-inner-icon="tabler-calendar"
              density="compact"
              :config="{ position: 'auto right' }"
            />
          </VCol>

          <VCol cols="1" class="d-flex align-center justify-center">
            <span>To</span>
          </VCol>

          <VCol cols="5">
            <AppDateTimePicker
              v-model="formTo"
              prepend-inner-icon="tabler-calendar"
              density="compact"
              :config="{ position: 'auto right' }"
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12" sm="6" md="4">
        <VSelect
          v-model="datasetIdToToggle"
          :items="data.datasets"
          label="select name"
          item-title="label"
          item-value="label"
        />
      </VCol>

      <VCol cols="12" sm="6" md="4">
        <VBtn @click="toggleDatasetVisibility" block>Ẩn/Hiện Dataset</VBtn>
      </VCol>
    </VRow>
  </div>

  <div>
    <LineChart
      ref="chartRef"
      :chart-options="chartConfig"
      :height="400"
      :chart-data="data"
      @dataset-visibility-change="onLegendToggle"
    />
  </div>
</template>

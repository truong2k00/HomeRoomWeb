<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useTheme } from "vuetify";
import LineChart from "@core/libs/chartjs/components/LineChart";
import { getLineChartAmountConfig } from "@core/libs/chartjs/chartjsConfig";
import type { ChartJsCustomColors } from "@/views/charts/chartjs/types";
import { Chart } from "chart.js";
import AmountAPI from "@/Api/AmountRate/ChartAmountAPI";
import type { ChartAmountDto } from "@/models/AmountRate/ChartAmountDTO";

interface Props {
  colors: ChartJsCustomColors;
}
const props = defineProps<Props>();

// 🟢 Data từ API
const apiData = ref<ChartAmountDto[]>([]);

const getdata = async () => {
  try {
    const res = await AmountAPI.GetDataChart();
    apiData.value = res;
  } catch (err) {
    console.error("GetDataChart error:", err);
  }
};

// 🟢 Xử lý dữ liệu cho ChartJS
function getChartData(fromDate: Date, toDate: Date) {
  const labels: string[] = [];
  const datasetValues: Record<string, number[]> = {};

  apiData.value.forEach((ds) => (datasetValues[ds.label] = []));

  const cur = new Date(fromDate);
  while (cur <= toDate) {
    const isoDay = cur.toISOString().split("T")[0]; // yyyy-MM-dd

    labels.push(
      cur.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );

    apiData.value.forEach((ds) => {
      // convert tất cả ds.dates -> yyyy-MM-dd
      const idx = ds.dates.findIndex(
        (d: string) => new Date(d).toISOString().split("T")[0] === isoDay
      );
      datasetValues[ds.label].push(idx !== -1 ? ds.values[idx] : 0);
    });

    cur.setDate(cur.getDate() + 1);
  }

  return { labels, datasetValues };
}

// 🟢 Chart setup
const vuetifyTheme = useTheme();
const chartRef = ref<{ chart?: Chart<"line"> } | null>(null);

const now = new Date();
const past = new Date();
past.setDate(now.getDate() - 15);

// Gán vào ref (dạng timestamp)
const formDate = ref(past.getTime());
const formTo = ref(now.getTime());

const data = ref({ labels: [] as string[], datasets: [] as any[] });

// 🟢 Toggle dataset
const datasetIdToToggle = ref<string | null>(null);
const toggleDatasetVisibility = () => {
  const chart = chartRef.value?.chart;
  if (!chart || !datasetIdToToggle.value) return;

  const datasetIndex = chart.data.datasets.findIndex(
    (ds) => ds.label === datasetIdToToggle.value
  );
  if (datasetIndex !== -1) {
    const meta = chart.getDatasetMeta(datasetIndex);
    meta.hidden = !meta.hidden;
    chart.update();
  }
};

// 🟢 Chart config (yMax)
const yMax = computed(() => {
  if (!apiData.value.length) return 900;
  const maxValue = Math.max(...apiData.value.flatMap((ds) => ds.values));
  return maxValue < 900 ? 900 : maxValue;
});

const chartConfig = computed(() => {
  const config = getLineChartAmountConfig(
    vuetifyTheme.current.value,
    yMax.value
  );
  return {
    ...config,
    scales: {
      ...config.scales,
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: Math.ceil(yMax.value / 10),
          color: vuetifyTheme.current.value.colors["on-surface"],
        },
        max: yMax.value,
      },
    },
  };
});

// 🟢 Cập nhật chart
const updateChart = () => {
  const { labels, datasetValues } = getChartData(
    new Date(formDate.value),
    new Date(formTo.value)
  );
  data.value = {
    labels,
    datasets: apiData.value.map((ds) => ({
      ...ds,
      data: datasetValues[ds.label],
    })),
  };
};

watch([formDate, formTo], ([newFrom, newTo], [oldFrom, oldTo]) => {
  if (newFrom > newTo) {
    if (newFrom !== oldFrom) formTo.value = newFrom;
    else formDate.value = newTo;
    return;
  }

  const diffDays = Math.floor((newTo - newFrom) / (1000 * 60 * 60 * 24));
  if (diffDays > 15) {
    formTo.value = new Date(newFrom).setDate(new Date(newFrom).getDate() + 15);
    return;
  }

  updateChart();
});

watch(apiData, () => {
  updateChart();
});

onMounted(async () => {
  await getdata();
  updateChart();
});
</script>

<template>
  <div class="mt-4">
    <VRow>
      <!-- Date Range -->
      <VCol cols="12" sm="6" md="4">
        <VRow>
          <VCol cols="6">
            <AppDateTimePicker
              v-model="formDate"
              prepend-inner-icon="tabler-calendar"
              density="compact"
              :config="{ position: 'auto right' }"
            />
          </VCol>
          <VCol cols="6">
            <AppDateTimePicker
              v-model="formTo"
              prepend-inner-icon="tabler-calendar"
              density="compact"
              :config="{ position: 'auto right' }"
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- Dataset selector -->
      <VCol cols="12" sm="6" md="4">
        <VSelect
          v-model="datasetIdToToggle"
          :items="data.datasets"
          label="Select dataset"
          item-title="label"
          item-value="label"
        />
      </VCol>

      <!-- Toggle button -->
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
    />
  </div>
</template>

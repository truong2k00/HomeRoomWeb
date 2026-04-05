<script setup lang="ts">
import type { ChartJsCustomColors } from "@/views/charts/chartjs/types";
import ChartJsLineChart from "@/views/charts/chart_amount/ChartJsLineChart.vue";

const isLocalDialogVisible = ref(false);

const { ctrl_m, meta_m } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === "m" && e.type === "keydown") e.preventDefault();
  },
});

watch([ctrl_m, meta_m], () => {
  isLocalDialogVisible.value = true;
  console.log("sdadssssssssssssssssss");
  // emit("update:isDialogVisible", true);
});

const chartJsCustomColors: ChartJsCustomColors = {
  white: "#fff",
  yellow: "#ffe802",
  primary: "#836af9",
  areaChartBlue: "#2c9aff",
  barChartYellow: "#ffcf5c",
  polarChartGrey: "#4f5d70",
  polarChartInfo: "#299aff",
  lineChartYellow: "#d4e157",
  polarChartGreen: "#28dac6",
  lineChartPrimary: "#9e69fd",
  lineChartWarning: "#ff9800",
  horizontalBarInfo: "#26c6da",
  polarChartWarning: "#ff8131",
  scatterChartGreen: "#28c76f",
  warningShade: "#ffbd1f",
  areaChartBlueLight: "#84d0ff",
  areaChartGreyLight: "#edf1f4",
  scatterChartWarning: "#ff9f43",
};
</script>
<template>
  <div>
    <VRow id="chartjs-wrapper">
      <!-- 👉 Statistics Line Chart  -->
      <VCol cols="12">
        <VCard
          title="Amount Rate"
          subtitle="Commercial networks and enterprises"
        >
          <VCardText>
            <ChartJsLineChart :colors="chartJsCustomColors" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

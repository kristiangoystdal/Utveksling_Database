<!-- src/components/BarChart.vue -->
<template>
  <div ref="chartContainer" class="bar-chart-container"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: {
    items: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);

    // 🔥 Make tooltip bulletproof on mobile
    this.$nextTick(() => {
      if (this.chart) {
        this.chart.on("click", (params) => {
          if (!params || params.componentType !== "series") return;

          this.chart.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            dataIndex: params.dataIndex,
          });
        });
      }
    });


  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) this.chart.dispose();
  },
  watch: {
    items: {
      deep: true,
      handler() {
        this.updateChart();
      },
    },
  },
  methods: {
    initChart() {
      if (!this.$refs.chartContainer) return;

      this.chart = echarts.init(this.$refs.chartContainer);

      this.chart.on("click", (params) => {
        if (!params || params.dataIndex == null) return;

        this.chart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: params.dataIndex,
        });
      });

      this.updateChart();
    },
    updateChart() {
      if (!this.chart || !this.items?.length) return;

      const labels = this.items.map((i) => i.name);
      const values = this.items.map((i) => i.count);

      const option = {
        // title: {
        //   text: this.title,
        //   left: "center",
        //   top: 0,
        //   textStyle: {
        //     fontSize: 14,
        //   },
        // },
        grid: {
          left: "3%",
          right: "8%",
          bottom: "3%",
          top: this.title ? 40 : 20,
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove|click|touchstart",
          enterable: false,
          confine: true,
          formatter: (params) => {
            if (!params || !params.name) return "";
            return `${params.name}<br/>${this.$t("common.count")}: ${params.value}`;
          },
        },
        xAxis: {
          type: "value",
          name: "",
        },
        yAxis: {
          type: "category",
          data: labels,
          axisLabel: {
            fontSize: 12,
            formatter: (value) => {
              const maxCharsPerLine = 20;     // adjust as needed
              const words = value.split(" ");
              let lines = [""];
              let currentLine = 0;

              for (let word of words) {
                if ((lines[currentLine] + " " + word).trim().length <= maxCharsPerLine) {
                  lines[currentLine] += (lines[currentLine] ? " " : "") + word;
                } else {
                  currentLine++;
                  if (currentLine > 2) break; // stop after 3 lines
                  lines[currentLine] = word;
                }
              }

              // If text was too long for 3 lines → add ellipsis to last line
              if (currentLine > 2) {
                lines[2] += "...";
              }

              return lines.join("\n");
            }
          },

          inverse: true,
        },
        series: [
          {
            type: "bar",
            data: values,
          },
        ],
      };

      this.chart.setOption(option);
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
</script>

<style scoped>
.bar-chart-container {
  width: 100%;
  height: 400px;
  min-height: 300px;
  pointer-events: auto !important;
  touch-action: manipulation;
}
</style>

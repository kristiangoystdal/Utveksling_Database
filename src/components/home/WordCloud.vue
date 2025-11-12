<template>
  <div ref="chartContainer" class="wordcloud-container">
    <div ref="chart" class="wordcloud"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-wordcloud";

export default {
  name: "WordCloud",
  props: {
    wordsData: { type: Array, required: true },
  },
  mounted() {
    // render after DOM is ready
    this.$nextTick(() => this.renderChart());
    window.addEventListener("resize", this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeChart);
    if (this.chart) this.chart.dispose();
  },
  methods: {
    renderChart() {
      if (!this.wordsData?.length) return;

      const container = this.$refs.chartContainer;
      const chartEl = this.$refs.chart;

      // Always reset width to 100%
      chartEl.style.width = "100%";
      chartEl.style.height = "100%";

      if (this.chart) this.chart.dispose();
      this.chart = echarts.init(chartEl, null, { renderer: "canvas" });

      const style = getComputedStyle(document.documentElement);
      const colors = [
        style.getPropertyValue("--first-color").trim(),
        style.getPropertyValue("--second-color").trim(),
        "#2E8BC0",
        "#F4A261",
      ];

      // compute dynamic font range
      const containerWidth = container.clientWidth;
      const longest = Math.max(...this.wordsData.map(w => w.name.length));
      const maxFont = Math.max(22, Math.min(110, (containerWidth * 0.7) / longest * 3));
      const minFont = Math.max(14, maxFont * 0.4);

      const option = {
        series: [
          {
            type: "wordCloud",
            shape: "circle",
            gridSize: 6,
            rotationRange: [0, 0],
            sizeRange: [minFont, maxFont],
            width: "100%",
            height: "100%",
            layoutAnimation: true,
            textStyle: {
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              color: () => colors[Math.floor(Math.random() * colors.length)],
            },
            emphasis: {
              focus: "self",
              textStyle: {
                shadowBlur: 8,
                shadowColor: "rgba(0,0,0,0.3)",
              },
            },
            data: this.wordsData.map(w => ({
              name: w.name,
              value: w.count,
            })),
          },
        ],
      };

      this.chart.setOption(option);
      this.resizeChart(); // force-fit right away
    },
    resizeChart() {
      if (this.chart) {
        // Resize dynamically to match parent container
        const container = this.$refs.chartContainer;
        this.chart.resize({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    },
  },
  watch: {
    wordsData() {
      this.renderChart();
    },
  },
};
</script>

<style scoped>
.wordcloud-container {
  width: 100%;
  height: 450px;
  position: relative;
  display: flex;
}

.wordcloud {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
}

/* Force ECharts internal canvas to respect parent */
.wordcloud :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  left: 0;
  top: 0;
}
</style>

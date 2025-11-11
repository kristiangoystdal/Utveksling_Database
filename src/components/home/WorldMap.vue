<template>
	<div ref="mapContainer" class="map-container"></div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";
import worldData from "../../data/countries-110m.json"; // Ensure this path is correct

export default {
	name: "WorldMap",
	props: {
		countries: {
			type: Array,
			required: true,
		},
	},
	mounted() {
		this.createMap();
		window.addEventListener("resize", this.debouncedCreateMap);
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.debouncedCreateMap);
	},
	watch: {
		countries: {
			handler() {
				this.createMap();
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		createMap() {
			const container = this.$refs.mapContainer;
			if (!container) return; // Check if container is available

			const width = container.clientWidth;
			const height = container.clientHeight || width * 0.5625; // Maintain 16:9 aspect ratio if height is not set

			// Clear previous SVG if exists
			d3.select(container).selectAll("*").remove();

			const projection = d3
				.geoMercator()
				.scale(width / 6.5)
				.translate([width / 2, height / 1.5]);
			const path = d3.geoPath().projection(projection);

			const svg = d3
				.select(container)
				.append("svg")
				.attr("width", "100%")
				.attr("height", "100%")
				.attr("viewBox", `0 0 ${width} ${height}`)
				.attr("preserveAspectRatio", "xMidYMid meet");

			const highlightedCountryNames = this.countries.map(
				(country) => country.name
			);

			// Change USA to United States of America for matching
			const adjustedCountryNames = highlightedCountryNames.map(name =>
				name === "USA" ? "United States of America" : name
			);

			const countries = topojson.feature(
				worldData,
				worldData.objects.countries
			).features;

			svg
				.append("g")
				.selectAll("path")
				.data(countries)
				.enter()
				.append("path")
				.attr("d", path)
				.attr("class", (d) =>
					adjustedCountryNames.includes(d.properties.name)
						? "highlighted"
						: "country"
				)
				.style("fill", (d) =>
					adjustedCountryNames.includes(d.properties.name)
						? "var(--second-color)"
						: "lightgray"
				)
				.style("stroke", "#fff")
				.style("stroke-width", "0.5px");
		},
		debouncedCreateMap: function () {
			clearTimeout(this.resizeTimeout);
			this.resizeTimeout = setTimeout(() => {
				this.createMap();
			}, 100);
		},
	},
};
</script>

<style scoped>
.map-container {
	width: 100%;
	height: 100%;
	/* Set a fixed height for the container */
	position: relative;
	border: solid 2px var(--second-color);
	border-radius: 20px;
}

.map-container svg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.country {
	fill: lightgray;
}

.highlighted {
	fill: var(--first-color);
}
</style>

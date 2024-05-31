<template>
	<div>
		<div id="map"></div>
	</div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";
import worldMapData from "@/assets/world-110m.json"; // Adjust the path to your TopoJSON file

export default {
	name: "WorldMap",
	props: {
		countries: {
			type: Array,
			required: true,
		},
	},
	methods: {
		createMap() {
			const width = 960;
			const height = 500;

			const svg = d3
				.select("#map")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

			const projection = d3
				.geoMercator()
				.scale(150)
				.translate([width / 2, height / 1.5]);

			const path = d3.geoPath().projection(projection);

			const countriesToHighlight = this.countries.reduce((acc, country) => {
				acc[country.code] = true;
				return acc;
			}, {});

			d3.json(worldMapData).then((world) => {
				const countries = topojson.feature(
					world,
					world.objects.countries
				).features;

				svg
					.selectAll("path")
					.data(countries)
					.enter()
					.append("path")
					.attr("d", path)
					.attr("fill", (d) =>
						countriesToHighlight[d.id] ? "#FF0000" : "#CCCCCC"
					)
					.attr("stroke", "#FFFFFF");
			});
		},
	},
	mounted() {
		this.createMap();
	},
};
</script>

<style scoped>
#map {
	width: 100%;
	height: 500px; /* Adjust the height as needed */
}
svg {
	width: 100%;
	height: 100%;
}
</style>

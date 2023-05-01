<template>
  <div>
    <div id="my_dataviz"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, PropType } from "vue";
import * as d3 from "d3";
import { range } from "../../../static/range";

export interface HeatMapData {
  x_label: String;
  y_label: String;
  value: number;
}

const props = defineProps({
  data: {
    type: [] as PropType<HeatMapData[]>,
    default: [
      {
        x_label: "x1",
        y_label: "x2",
        value: 4,
      },
      {
        x_label: "x3",
        y_label: "y0",
        value: 10,
      },
      {
        x_label: "x2",
        y_label: "y1",
        value: 50,
      },
      {
        x_label: "x3",
        y_label: "y1",
        value: 90,
      },
    ],
  },
  width: {
    type: Number,
    default: 800,
  },
  height: {
    type: Number,
    default: 800,
  },
});

const margin = { top: 30, right: 30, bottom: 30, left: 50 },
  width = props.width - margin.left - margin.right,
  height = props.height - margin.top - margin.bottom;

const x_axis_labels = range(-50, 50, "");
const y_axis_labels = range(-50, 50, "");

onMounted(() => {
  // append the svg object to the body of the page
  const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Labels of row and columns
  svg
    .append("text")
    .attr("x", -(height / 2))
    .attr("y", -margin.left / 2)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Y-Sectors");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .attr("text-anchor", "middle")
    .text("X-Sectors");

  //const myGroups = ["x0", "x1", "C", "D", "E", "F", "G", "H", "I", "J"];
  //const myVars = ["y0", "y1", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

  // Build X scales and axis:
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(x_axis_labels)
    .padding(0.01);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Build X scales and axis:
  const y = d3
    .scaleBand()
    .range([height, 0])
    .domain(y_axis_labels)
    .padding(0.01);
  svg.append("g").call(d3.axisLeft(y));

  // Build color scale
  const max_value = Math.max(...props.data?.flatMap((d) => d.value));
  const myColor = d3
    .scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([0, max_value]);

  //Mouse Actions
  const tooltip = d3
    .select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  const mouseover = function (event: any, d: any) {
    tooltip.style("opacity", 1);
  };
  const mousemove = function (event: any, d: any) {
    tooltip
      .html(
        "Drops: " + d.value + "</br>x: " + d.x_label + "</br>y: " + d.y_label
      )
      .style("left", event.x / 2 + "px")
      .style("top", event.y / 2 + "px");
  };
  const mouseleave = function (d: any) {
    tooltip.style("opacity", 0);
  };

  //Read the data
  svg
    .selectAll()
    .data(props.data, function (d: any) {
      return d.x_label + ":" + d.y_label;
    })
    .enter()
    .append("rect")
    .attr("x", function (d: any) {
      return x(d.x_label) ?? 0;
    })
    .attr("y", function (d) {
      return y(d.y_label) ?? 0;
    })
    .attr("height", x.bandwidth())
    .attr("width", y.bandwidth())
    .style("fill", function (d) {
      return myColor(d.value);
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
});
</script>

<style lang="sass">
.line-chart
  margin: 25px
  &__line
    fill: none
    stroke: #76BF8A
    stroke-width: 3px
</style>

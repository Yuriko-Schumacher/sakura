const margin = { t: 25, r: 25, b: 25, l: 50 };
const w = document.querySelector("#kyoto1200__scatterplot").clientWidth;
const h = 3000;

const svgH = d3
	.select("#kyoto1200__histogram")
	.append("svg")
	.attr("width", w)
	.attr("height", 250);

const svgS = d3
	.select("#kyoto1200__scatterplot")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

const containerHG = svgH.append("g").classed("container-histogram", true);
const containerSG = svgS.append("g").classed("container-scatterplot", true);
// .attr("transform", `translate(${margin.l}, ${margin.t})`);

Promise.all([d3.csv("data/sakura.csv"), d3.text("asset/patal.svg")]).then(
	function (datasets) {
		// data.forEach(parseData);
		let data = datasets[0];
		let svgEl = datasets[1];

		let defs = containerSG.append("defs").html(svgEl);

		console.log(datasets);
		let filteredData = data.filter((d) => {
			return d.date_doy !== "NA";
		});
		filteredData.forEach(parseData);
		console.log(filteredData);

		let groupedByDate = d3.group(filteredData, (d) => d.date_doy);
		groupedByDate = Array.from(groupedByDate);
		groupedByDate = groupedByDate.sort((a, b) => a[0] - b[0]);
		console.log(groupedByDate);

		// create scales
		let xScale = d3
			.scaleLinear()
			.domain([85, 125])
			.range([margin.l, w - margin.r]);

		let yScaleH = d3
			.scaleLinear()
			.domain([0, d3.max(groupedByDate, (d) => d[1].length) + 1])
			.range([250 - margin.b, margin.t]);

		let yScaleS = d3
			.scaleLinear()
			.domain([800, 2030])
			.range([margin.t, h - margin.b]);

		// 1. diary (fill-bloom)
		// 2. diary (party) -> 1
		// 3. diary (cherry twigs) -> 1
		// 4. poetry
		// 8. estimated by wisteria
		// 9. estimated by Japanese kerria（山吹）
		// 0. modern data

		let colors = [
			"#fbf3ef", // 2. diary (cherry blossom viewing party)
			"#ffdee6", // 4. poetry, light pink
			"#fdcbd6", // 3. diary (presents of cherry twigs)
			"#f9a9be", // 8. estimated by wisteria
			"#eb899d", // 1. diary (full-bloom)
			"#7f2935", // 9. estimated by Japanese kerria（山吹）near brown
			"#ce4b5c", // 0. modern data, near red
		];

		// let colors = [
		// 	"#f9eae3", // 1. diary, near white
		// 	"#f9a9be", // 4. poetry, salmon pink
		// 	"#fe7d6a", // 8. estimated by wisteria, hot pink
		// 	"#7f2935", // 9. estimated by Japanese kerria（山吹, near brown
		// 	"#f25278", // 0. modern data, near red
		// ];

		let groupedByType = d3.group(filteredData, (d) => d.source_type);
		groupedByType = Array.from(groupedByType);

		let colorScale = d3
			.scaleOrdinal()
			.domain(groupedByType.map((d) => d[0]))
			.range(colors);

		let angleScale = d3
			.scaleLinear()
			.domain(d3.extent(filteredData, (d) => d.tempF))
			.range([144, -144]);

		let xAxisBottom = d3.axisBottom(xScale);
		let xAxisTop = d3.axisTop(xScale);

		// ---------- HISTOGRAM -----------
		containerHG
			.append("g")
			.classed("axis", true)
			.attr("transform", `translate(0, ${250 - margin.b})`)
			.call(xAxisBottom);

		let yAxisH = d3.axisLeft(yScaleH);
		containerHG
			.append("g")
			.classed("axis", true)
			.attr("transform", `translate(${margin.l}, 0)`)
			.call(yAxisH);

		let histogramG = containerHG
			.selectAll("g.histogram")
			.data(filteredData)
			.enter()
			.append("g")
			.classed("histogram", true);

		let idx = -1;
		filteredData.forEach((data) => {
			groupedByDate.forEach((el) => {
				idx = el[1].findIndex((d) => d === data);
				if (idx == -1) {
					return;
				} else {
					data.count = idx;
				}
			});
		});

		console.log(filteredData);

		histogramG
			.append("circle")
			.attr("cx", (d) => xScale(d.date_doy))
			.attr("cy", (d) => yScaleH(d.count))
			.attr("r", 5)
			.attr("fill", "gray")
			.attr("fill-opacity", 0.3);

		// ---------- SCATTER PLOT -----------
		// containerSG
		// 	.append("g")
		// 	.classed("axis", true)
		// 	.attr("transform", `translate(0, ${h - margin.b})`)
		// 	.call(xAxisBottom);

		// containerSG
		// 	.append("g")
		// 	.classed("axis", true)
		// 	.attr("transform", `translate(0, ${margin.t})`)
		// 	.call(xAxisTop);

		let yAxisS = d3.axisLeft(yScaleS);
		containerSG
			.append("g")
			.classed("axis", true)
			.attr("transform", `translate(${margin.l}, 0)`)
			.call(yAxisS);

		let patalG = containerSG
			.selectAll("g.patal")
			.data(filteredData)
			.enter()
			.append("g")
			.classed("patal", true)
			.attr(
				"transform",
				(d) =>
					`translate(${xScale(d.date_doy) - 5.7}, ${yScaleS(
						d.year
					)}) rotate(${angleScale(d.tempF)})`
			);

		patalG
			.append("use")
			.attr("xlink:href", "#patal-svg")
			.attr("fill", (d) => colorScale(d.source_type))
			.attr("fill-opacity", 0.8)
			.attr("stroke-width", 0.5)
			.attr("stroke", "#ccc");
	}
);

function drawPatals(filteredData) {}

function parseData(d) {
	d.year = +d.year;
	d.date_doy = +d.date_doy;
	d.tempC = +d.tempC;
	d.tempF = +d.tempF;
}

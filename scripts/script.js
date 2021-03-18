const margin = { t: 50, r: 50, b: 50, l: 50 };
const w = document.querySelector("#kyoto1200__chart").clientWidth;
const h = 5000;

const svg = d3
	.select("#kyoto1200__chart")
	.append("svg")
	.attr("width", w)
	.attr("height", h);
const containerG = svg.append("g").classed("container", true);
// .attr("transform", `translate(${margin.l}, ${margin.t})`);

Promise.all([d3.csv("data/kyoto1200.csv"), d3.text("asset/patal.svg")]).then(
	function (datasets) {
		// data.forEach(parseData);
		let data = datasets[0];
		let svgEl = datasets[1];

		let defs = containerG.append("defs").html(svgEl);

		console.log(datasets);
		let filteredData = data.filter((d) => {
			return d.date_doy !== "NA";
		});
		filteredData.forEach(parseData);
		console.log(filteredData);

		// create scales
		let xScale = d3
			.scaleLinear()
			.domain([85, 125])
			.range([margin.l, w - margin.r]);

		let yScale = d3
			.scaleLinear()
			.domain([800, 2030])
			.range([margin.t, h - margin.b]);

		let colors = [
			"#fbf3ef",
			"#ffdee6",
			"#fdcbd6",
			"#f9a9be",
			"#eb899d",
			"#7f2935",
			"#ce4b5c",
			"red",
			"orange",
		];

		let colorScale = d3
			.scaleOrdinal()
			.domain(Array.prototype.fill(9))
			.range(colors);

		let xAxisBottom = d3.axisBottom(xScale);
		let xAxisTop = d3.axisTop(xScale);
		containerG
			.append("g")
			.attr("transform", `translate(0, ${h - margin.b})`)
			.call(xAxisBottom);
		containerG
			.append("g")
			.attr("transform", `translate(0, ${margin.t})`)
			.call(xAxisTop);

		let yAxis = d3.axisLeft(yScale);
		containerG
			.append("g")
			.attr("transform", `translate(${margin.l}, 0)`)
			.call(yAxis);

		let patalG = containerG
			.selectAll("g.patal")
			.data(filteredData)
			.enter()
			.append("g")
			.classed("patal", true)
			.attr(
				"transform",
				(d) =>
					`translate(${xScale(d.date_doy)}, ${yScale(
						d.year
					)}) rotate(${Math.random() * 180})` // rotation comes with temperature
			);

		patalG
			.append("use")
			.attr("xlink:href", "#patal-svg")
			.attr("fill", (d) => colorScale(d.source_type))
			.attr("fill-opacity", 0.8);
	}
);

function drawPatals(filteredData) {}

function parseData(d) {
	d.year = +d.year;
	d.date_doy = +d.date_doy;
}

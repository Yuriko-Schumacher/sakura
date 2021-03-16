const margin = { t: 50, r: 50, b: 50, l: 50 };
const w = document.querySelector("#kyoto1200__chart").clientWidth;
const h = document.querySelector("#kyoto1200__chart").clientHeight;

const svg = d3
	.select("#kyoto1200__chart")
	.append("svg")
	.attr("width", w)
	.attr("height", h);
const containerG = svg.append("g").classed("container", true);
// .attr("transform", `translate(${margin.l}, ${margin.t})`);

Promise.all([d3.csv("data/kyoto1200.csv"), d3.text("asset/copy.svg")]).then(
	function (datasets) {
		// data.forEach(parseData);
		let data = datasets[0];
		let svgEl = datasets[1];

		svg.append("defs").html(svgEl);

		console.log(datasets);
		let filteredData = data.filter((d) => {
			return d.date_doy !== "NA";
		});
		filteredData.forEach(parseData);
		console.log(filteredData);

		// create scales
		let xScale = d3
			.scaleLinear()
			.domain(d3.extent(filteredData, (d) => d.date_doy))
			.range([margin.l, w - margin.r]);

		let yScale = d3
			.scaleLinear()
			.domain([800, 2020])
			.range([margin.t, h - margin.b]);

		let xAxis = d3.axisBottom(xScale);
		let xAxisG = containerG
			.append("g")
			.attr("transform", `translate(0, ${h - margin.b})`)
			.call(xAxis);

		let yAxis = d3.axisLeft(yScale);
		let yAxisG = containerG
			.append("g")
			.attr("transform", `translate(${margin.l}, 0)`)
			.call(yAxis);

		containerG.append(svgEl.documentElement);
	}
);

function parseData(d) {
	d.year = +d.year;
	d.date_doy = +d.date_doy;
}

d3.xml("asset/hanabira.svg").then((data) => {
	d3.select("#svg-test").node().append(data.documentElement);
});

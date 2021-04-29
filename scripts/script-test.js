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

Promise.all([d3.csv("data/sakura.csv"), d3.text("asset/patal.svg")]).then(
	function (datasets) {
		// data.forEach(parseData);
		let data = datasets[0];
		let svgEl = datasets[1];

		let defs = containerG.append("defs").html(svgEl);

		let filteredData = data.filter((d) => {
			return d.date_doy !== "NA";
		});
		filteredData.forEach(parseData);
		console.log(filteredData);

		// create scales
		let rScale = d3.scaleLinear().domain([800, 2015]).range([10, 400]);

		let angleScale = d3.scaleLinear().domain([85, 125]).range([Math.PI, 0]);

		console.log();

		let xAxis = d3.axisBottom(rScale);
		containerG
			.append("g")
			.classed("axis", true)
			.attr("transform", `translate(400, 400)`)
			.call(xAxis);

		// let axisCircle = containerG
		// 	.selectAll("circle.axes")
		// 	.data(filteredData)
		// 	.join("circle")
		// 	.classed("axes", true)
		// 	.attr("cx", 400)
		// 	.attr("cy", 400)
		// 	.attr("r", (d) => rScale(d.year))
		// 	.attr("stroke", "lightgray")
		// 	.attr("stroke-width", 0.01)
		// 	.attr("fill", "none");

		// let circles = containerG
		// 	.selectAll("circle.patals")
		// 	.data(filteredData)
		// 	.join("circle")
		// 	.classed("patals", true)
		// 	.attr(
		// 		"cx",
		// 		(d) => rScale(d.year) * Math.cos(angleScale(d.date_doy))
		// 	)
		// 	.attr(
		// 		"cy",
		// 		(d) => -rScale(d.year) * Math.sin(angleScale(d.date_doy))
		// 	)
		// 	.attr("r", 5)
		// 	.attr("fill", (d) => (d.year > 1900 ? "#FF007f" : "blue"))
		// 	.attr("fill-opacity", 0.2)
		// 	.attr("transform", "translate(400, 400)");

		let patalG = containerG
			.selectAll("g.patal")
			.data(filteredData)
			.enter()
			.append("g")
			.classed("patal", true)
			.attr(
				"transform",
				(d) =>
					`translate(${
						rScale(d.year) * Math.cos(angleScale(d.date_doy)) + 400
					}, ${
						-rScale(d.year) * Math.sin(angleScale(d.date_doy)) + 400
					}) scale(0.6) rotate(${Math.random() * 360})`
			);

		patalG
			.append("use")
			.attr("xlink:href", "#patal-svg")
			.attr("fill", (d) => (d.year > 1900 ? "#FF007f" : "blue"))
			.attr("fill-opacity", 0.3)
			.attr("stroke-width", 0.5)
			.attr("stroke", "#ccc");
	}
);

function parseData(d) {
	d.year = +d.year;
	d.date_doy = +d.date_doy;
	d.tempC = +d.tempC;
	d.tempF = +d.tempF;
}

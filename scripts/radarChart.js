// -------------- MAKE CENTER PART OF A FLOWER WITH A RADAR CHART --------------
// -------------- USE SEASONAL DATA --------------

function placeFlowers(bloomingData) {
	let xScale = d3
		.scaleLinear()
		.domain([83, 115])
		.range([marginTemp.l, size.w - marginTemp.r]);

	let yScale = d3
		.scaleLinear()
		.domain([1880, 2022])
		.range([marginTemp.t, size.h - marginTemp.b]);

	let xAxis = d3.axisBottom(xScale);
	svg.append("g")
		.attr("transform", `translate(0, ${size.h - marginTemp.b})`)
		.call(xAxis);
	let xAxisLabel = svg
		.append("text")
		.attr("x", size.w / 2 + 20)
		.attr("y", size.h - marginTemp.b / 2)
		.text("Full-bloom date (day of year)")
		.style("text-anchor", "middle");

	let yAxis = d3.axisLeft(yScale).tickFormat(d3.format("d"));
	svg.append("g")
		.attr("transform", `translate(${marginTemp.l}, 0)`)
		.call(yAxis);
	let yAxisLabel = svg
		.append("text")
		.attr("x", -size.h / 2)
		.attr("y", marginTemp.l / 2)
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "middle")
		.text("Year");

	containerG
		.selectAll("g")
		.data(bloomingData)
		.join("g")
		.attr("class", (d) => `year-${d.year}`)
		.attr(
			"transform",
			(d) => `translate(${xScale(d.full_doy)}, ${yScale(d.year)})`
		);
	// 	.append("line")
	// 	// .attr("x1", (d) =>
	// 	// 	d.first_doy === "NA" ? 0 : xScale(1953) - xScale(d.year)
	// 	// )
	// 	.attr("x1", 0)
	// 	.attr("y1", 0)
	// 	.attr("x2", (d) =>
	//   d.first_doy === "NA" ? 0 : xScale(d.first_doy) - xScale(d.full_doy)
	// )
	// 	.attr("y2", 0)
	// 	.attr("stroke", "#25130a")
	// 	.attr("stroke-width", 1)
	// 	.attr("stroke-opacity", 0.5);
}

function drawPetals(monthlyData, selection) {
	let year = monthlyData[0];
	let tempD = monthlyData[1];
	let sel;

	if (selection) {
		sel = selection;
	} else {
		sel = d3.select(`.year-${year}`);
	}

	let xScale = d3
		.scaleBand()
		.domain(tempD.map((d) => d.month))
		.range([0, 2 * Math.PI]);

	let yScale = d3
		.scaleRadial()
		.domain(d3.extent(tempD, (d) => d.avg_tempC)) // min: -0.6, max: 17.1
		.range([8, 15]);

	let colorScale = d3
		.scaleSequential()
		.domain([1800, 2022])
		.interpolator(d3.interpolateRdPu);

	let petalG = sel
		.append("g")
		.classed("petals", true)
		.selectAll("g")
		.data(tempD)
		.join("g")
		.attr(
			"transform",
			(d) => `rotate(${(xScale(d.month) * 180) / Math.PI + 240})`
		);

	petalG
		.append("circle")
		.attr("cx", (d) => xScale(d.month))
		.attr("cy", (d) => yScale(d.avg_tempC) / 2)
		.attr("r", (d) => yScale(d.avg_tempC) / 2)
		.attr("fill", (d) => colorScale(d.year))
		.attr("fill-opacity", 0.3)
		.attr("stroke", (d) => colorScale(d.year))
		.attr("stroke-width", 0.5)
		.attr("stroke-opacity", 0.3);
}

function drawRadarChart(seasonalData, selection) {
	let year = seasonalData[0];
	let tempD = seasonalData[1];

	if (selection) {
		sel = selection;
	} else {
		sel = d3.select(`.year-${year}`);
	}

	let xScale = d3
		.scaleBand()
		.domain(tempD.map((d) => d.month))
		.range([0, 2 * Math.PI]);

	let yScale = d3
		.scaleRadial()
		.domain(d3.extent(tempD, (d) => d.avg_tempC)) // min: -0.6, max: 17.1
		.range([5, 7]);

	let threadG = sel
		.append("g")
		.classed("threads", true)
		.selectAll("g")
		.data(tempD)
		.join("g")
		.attr(
			"transform",
			(d) => `rotate(${(xScale(d.month) * 180) / Math.PI + 216})`
		);

	threadG
		.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d) => xScale(d.month))
		.attr("y2", (d) => yScale(d.avg_tempC))
		.attr("stroke", "rgba(211, 24, 66, 0.8)")
		.attr("stroke-width", 0.8);

	threadG
		.append("circle")
		.attr("cx", (d) => xScale(d.month))
		.attr("cy", (d) => yScale(d.avg_tempC))
		.attr("fill", "rgb(211 24 66)")
		.attr("r", 0.8);
}

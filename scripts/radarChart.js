// -------------- MAKE CENTER PART OF A FLOWER WITH A RADAR CHART --------------
// -------------- USE SEASONAL DATA --------------

// function RadarChart() {
// 	this._data = null;
// 	this._sel = null;
// 	this._size = 180;
// 	this._outerRadius = () => {
// 		return this._size / 2;
// 	};
// 	this._innerRadius = 0;

// 	this.data = function () {
// 		if (arguments.length > 0) {
// 			this._data = arguments[0];
// 			return this;
// 		}
// 		console.log(this._data);
// 		return this._data;
// 	};

// 	this.selection = function () {
// 		if (arguments.length > 0) {
// 			this._sel = arguments[0];
// 			return this;
// 		}
// 		return this._sel;
// 	};

// 	this.size = function () {
// 		if (arguments.length > 0) {
// 			this._size = arguments[0];
// 			this._outerRadius = this._size / 2;
// 			return this;
// 		}
// 		return this._size;
// 	};

// 	this.draw = function () {
// 		let xScale = d3
// 			.scaleBand()
// 			.domain(columns) // this._data.map((d) => d.season)
// 			.range([0, 2 * Math.PI]);

// 		let yScale = d3
// 			.scaleRadial()
// 			.domain([d3.extent(this._data, (d) => d.avg_tempC)]) // min: -0.6, max: 17.1
// 			.range([this._innerRadius, this._outerRadius]);

// 		let threadG = this._sel
// 			.append("g")
// 			.classed("threads", true)
// 			.selectAll("g")
// 			.data(this._data)
// 			.join("g")
// 			.attr(
// 				"transform",
// 				(d) => `rotate(${(xScale(d.season) * 180) / Math.PI})`
// 			);

// 		threadG
// 			.selectAll("line")
// 			.data(this._data)
// 			.join("line")
// 			.attr("x1", 0)
// 			.attr("y1", 0)
// 			.attr("x2", (d) => xScale(d.season))
// 			.attr("y2", (d) => yScale(d.avg_tempC))
// 			.attr("stroke", "orange")
// 			.attr("stroke-width", 5);
// 	};
// 	return this;
// }

function placeFlowers(bloomingData) {
	let xScale = d3
		.scaleLinear()
		.domain([1880, 2022])
		.range([margin.l, size.w]);
	let yScale = d3
		.scaleLinear()
		.domain([70, 115])
		.range([size.h - margin.b, margin.t]);

	let xAxis = d3.axisBottom(xScale);
	svg.append("g")
		.attr("transform", `translate(0, ${size.h - margin.b})`)
		.call(xAxis);

	let yAxis = d3.axisLeft(yScale);
	svg.append("g").attr("transform", `translate(${margin.l}, 0)`).call(yAxis);

	// containerG.attr("transform", `translate(${size.w / 2}, ${size.h / 2})`);

	containerG
		.selectAll("g")
		.data(bloomingData)
		.join("g")
		.attr("class", (d) => `year-${d.year}`)
		.attr(
			"transform",
			(d) => `translate(${xScale(d.year)}, ${yScale(d.full_doy)})`
		)
		.append("line")
		// .attr("x1", (d) =>
		// 	d.first_doy === "NA" ? 0 : xScale(1953) - xScale(d.year)
		// )
		.attr("x1", 0)
		.attr("y1", (d) =>
			d.first_doy === "NA" ? 0 : yScale(d.first_doy) - yScale(d.full_doy)
		)
		.attr("x2", 0)
		.attr("y2", 0)
		.attr("stroke", "#25130a")
		.attr("stroke-width", 1)
		.attr("stroke-opacity", 0.5);
}

function drawPetals(monthlyData) {
	let year = monthlyData[0];
	let tempD = monthlyData[1];

	let sel = d3.select(`.year-${year}`);

	let xScale = d3
		.scaleBand()
		.domain(tempD.map((d) => d.month))
		.range([0, 2 * Math.PI]);

	let yScale = d3
		.scaleRadial()
		.domain(d3.extent(tempD, (d) => d.avg_tempC)) // min: -0.6, max: 17.1
		.range([10, 30]);

	let colorScale = d3
		.scaleSequential()
		.domain(d3.extent(tempD, (d) => d.avg_tempC))
		.interpolator(d3.interpolateRdPu);

	const radialGradient = svg
		.selectAll("defs")
		.data(tempD)
		.join("defs")
		.append("linearGradient")
		.attr("id", "linear-gradient")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d) => xScale(d.month))
		.attr("y2", "100%")
		.selectAll("stop")
		.data([
			{ offset: "0%", color: "rgba(255, 255, 255)" },
			{ offset: "50%", color: "rgba(255, 183, 197)" },
			{ offset: "100%", color: "rgba(250, 89, 120)" },
		])
		.enter()
		.append("stop")
		.attr("offset", (d) => d.offset)
		.attr("stop-color", (d) => d.color);

	let petalG = sel
		.append("g")
		.classed("petals", true)
		.selectAll("g")
		.data(tempD)
		.join("g")
		.attr(
			"transform",
			(d) => `rotate(${(xScale(d.month) * 180) / Math.PI + 216})`
		);

	petalG
		.append("circle")
		.attr("cx", (d) => xScale(d.month))
		.attr("cy", (d) => yScale(d.avg_tempC) / 2)
		.attr("r", (d) => yScale(d.avg_tempC) / 2)
		.attr("fill", "url(#linear-gradient)")
		.attr("fill-opacity", 0.5)
		.attr("stroke", "#ffb7c5")
		.attr("stroke-width", 0.3);
}

function drawRadarChart(seasonalData) {
	let year = seasonalData[0];
	let tempD = seasonalData[1];

	let sel = d3.select(`.year-${year}`);

	let xScale = d3
		.scaleBand()
		.domain(tempD.map((d) => d.season))
		.range([0, 2 * Math.PI]);

	let yScale = d3
		.scaleRadial()
		.domain(d3.extent(tempD, (d) => d.avg_tempC)) // min: -0.6, max: 17.1
		.range([5, 12]);

	let threadG = sel
		.append("g")
		.classed("threads", true)
		.selectAll("g")
		.data(tempD)
		.join("g")
		.attr(
			"transform",
			(d) => `rotate(${(xScale(d.season) * 180) / Math.PI + 216})`
		);

	threadG
		.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d) => xScale(d.season))
		.attr("y2", (d) => yScale(d.avg_tempC))
		.attr("stroke", "rgba(211, 24, 66, 0.5)")
		.attr("stroke-width", 0.8);

	threadG
		.append("circle")
		.attr("cx", (d) => xScale(d.season))
		.attr("cy", (d) => yScale(d.avg_tempC))
		.attr("fill", "rgb(211 24 66)")
		.attr("r", 0.8);
}

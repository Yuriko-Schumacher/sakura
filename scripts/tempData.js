const marginTemp = { t: 50, r: 50, b: 75, l: 100 };
const size = {
	w: document.querySelector("#rader-chart").clientWidth,
	h: document.querySelector("#rader-chart").clientHeight,
};
const svgSample = d3
	.select("#rader-sample__chart")
	.append("svg")
	.attr("width", size.w)
	.attr("height", size.h);
const svg = d3
	.select("#rader-chart")
	.append("svg")
	.attr("width", size.w)
	.attr("height", size.h);
const svgZoomed = d3
	.select("#rader-zoomed-chart")
	.append("svg")
	.attr("width", (size.w / 3) * 2)
	.attr("height", size.h);

const containerSampleG = svgSample
	.append("g")
	.classed("rader-sample__container", true)
	.attr("transform", `translate(${size.w / 2}, ${size.h * 0.5}) scale(10)`);
const containerG = svg.append("g").classed("rader__container", true);
const containerZoomedG = svgZoomed
	.append("g")
	.classed("rader-zoomed__container", true)
	.attr("transform", `translate(${size.w / 3}, ${size.h * 0.5}) scale(10)`);

Promise.all([
	d3.csv("data/kyoto_1881-2021.csv"),
	d3.csv("data/seasonal-temp.csv"),
	d3.csv("data/monthly-temp.csv"),
]).then(function (datasets) {
	let bloomingD = datasets[0];
	bloomingD = bloomingD.map((d) => parseBloomingD(d));
	bloomingD = bloomingD.filter((d) => d.full_doy !== "NA");

	let seasonalTempD = datasets[1];
	seasonalTempD = seasonalTempD.map((d) => parseTempD(d));
	let groupedSeasonalTempD = d3.group(seasonalTempD, (d) => d.year);
	groupedSeasonalTempD = Array.from(groupedSeasonalTempD);

	let monthlyTempD = datasets[2];
	monthlyTempD = monthlyTempD.map((d) => parseTempD(d));
	let groupedMonthlyTempD = d3.group(monthlyTempD, (d) => d.year);
	groupedMonthlyTempD = Array.from(groupedMonthlyTempD);

	drawPetals(groupedMonthlyTempD[50], containerSampleG);
	drawRadarChart(groupedSeasonalTempD[50], containerSampleG);
	scrolly();

	placeFlowers(bloomingD);
	groupedMonthlyTempD.forEach((d) => drawPetals(d));
	groupedSeasonalTempD.forEach((d) => drawRadarChart(d));

	containerG
		.selectChildren("g")
		.style("cursor", "pointer")
		.on("mouseover", function (e, d) {
			let x = +d3.select(this).attr("transform").split(", ")[0].slice(10);
			let y = d3.select(this).attr("transform").split(", ")[1];
			y = +y.slice(0, y.length - 1);
			d3.select(".rader-tooltip")
				.style("top", d.year > 2000 ? `${y - 100}px` : `${y + 10}px`)
				.style("left", `${x + 10}px`)
				.style("visibility", "visible")
				.html(
					`Year: <b>${d.year}</b><br>Full-bloom: <b>${d.full_doy}</b> days after Jan 1`
				);
		})
		.on("mouseout", function (e, d) {
			d3.select(".rader-tooltip").style("visibility", "hidden");
		})
		.on("click", function (e, d) {
			containerG
				.selectChildren("g")
				.selectAll("circle")
				.attr("fill-opacity", 0.3)
				.attr("stroke-width", 0.5)
				.attr("stroke-opacity", 0.3);

			d3.select(this)
				.selectAll("circle")
				.attr("fill-opacity", 1)
				.attr("stroke-width", 5)
				.attr("stroke-opacity", 1);
			containerZoomedG.select(".petals").remove();
			containerZoomedG.select(".threads").remove();
			containerZoomedG.selectAll(".rader-zoomed__text").remove();
			let index = groupedMonthlyTempD.findIndex(
				(group) => group[0] === d.year
			);
			containerZoomedG
				.append("g")
				.classed("rader-zoomed__text", true)
				.append("text")
				.attr("x", -20)
				.attr("y", -60)
				.text(d.year);

			containerZoomedG
				.append("g")
				.classed("rader-zoomed__text", true)
				.append("text")
				.attr("transform", "scale(0.3)")
				.attr("x", -120)
				.attr("y", -150)
				.text(`Full-bloom: ${d.full_doy} days after Jan. 1`);
			drawPetals(groupedMonthlyTempD[index], containerZoomedG);
			drawRadarChart(groupedSeasonalTempD[index], containerZoomedG);

			containerZoomedG
				.select(".petals")
				.selectChildren("g")
				.on("mouseover", function (e, d) {
					containerZoomedG
						.select(".petals")
						.selectAll("g")
						.style("opacity", 0.3);
					containerZoomedG
						.select(".threads")
						.selectAll("g")
						.style("opacity", 0.1);
					d3.select(this).style("opacity", 1).style("z-index", 2);
					d3.select(".rader-zoomed-tooltip")
						.style("top", "70vh")
						.style("left", "200px")
						.style("visibility", "visible")
						.html(
							`<b>${d.month}</b><br>Avg. temp: <b>${
								Math.round(
									((9 * d.avg_tempC + 32 * 5) / 5) * 10
								) / 10
							}</b> (F)`
						);
				})
				.on("mouseout", function (e, d) {
					containerZoomedG.selectAll("g").style("opacity", 1);
					d3.select(".rader-zoomed-tooltip").style(
						"visibility",
						"hidden"
					);
				});
			containerZoomedG
				.select(".threads")
				.selectChildren("g")
				.on("mouseover", function (e, d) {
					containerZoomedG
						.select(".petals")
						.selectAll("g")
						.style("opacity", 0.3);
					containerZoomedG
						.select(".threads")
						.selectAll("g")
						.style("opacity", 0.1);
					d3.select(this).style("opacity", 1).style("z-index", 2);
					d3.select(".rader-zoomed-tooltip")
						.style("top", "70vh")
						.style("left", "200px")
						.style("visibility", "visible")
						.html(
							`<b>${d.month}</b><br>Avg. temp: <b>${
								Math.round(
									((9 * d.avg_tempC + 32 * 5) / 5) * 10
								) / 10
							}</b> (F)`
						);
				})
				.on("mouseout", function (e, d) {
					containerZoomedG.selectAll("g").style("opacity", 1);
					d3.select(".rader-zoomed-tooltip").style(
						"visibility",
						"hidden"
					);
				});
		});
});

function parseBloomingD(d) {
	d.year = +d.year;
	d.first_doy = d.first_doy !== "NA" ? +d.first_doy : d.first_doy;
	d.full_doy = d.full_doy !== "NA" ? +d.full_doy : d.full_doy;
	return d;
}

function parseTempD(d) {
	d.year = +d.year;
	d.avg_tempC = +d.avg_tempC;
	return d;
}

function scrolly() {
	enterView({
		selector: ".step",
		enter: (el) => {
			el.classList.add("step-active");
			let container = d3.select(".rader-sample__container");
			let index = +d3.select(el).attr("data-index");
			if (index === 0) {
				container
					.select(".threads")
					.transition()
					.duration(1000)
					.delay(1000)
					.style("opacity", 0);
			} else if (index === 1) {
				container
					.select(".petals")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 0.3);
				container
					.select(".petals")
					.select("g")
					.transition()
					.duration(1000)
					.style("opacity", 1);
			} else if (index === 2) {
				container
					.select(".petals")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 1)
					.transition()
					.delay(1000)
					.duration(1000)
					.style("opacity", 0.3);
				d3.select(".arrow")
					.transition()
					.delay(1000)
					.duration(1000)
					.style("opacity", 1);
				container
					.select(".petals")
					.select("g:last-of-type")
					.transition()
					.delay(2000)
					.style("opacity", 1);
			} else if (index === 3) {
				d3.select(".arrow")
					.transition()
					.duration(1000)
					.style("opacity", 0);
				container
					.select(".petals")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 1);
				container
					.select(".threads")
					.transition()
					.duration(1000)
					.delay(1000)
					.style("opacity", 1);
			} else if (index === 4) {
				container
					.select(".threads")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 0.2);
				container
					.select(".threads")
					.select("g")
					.transition()
					.duration(1000)
					.style("opacity", 1);
			} else if (index === 5) {
				container
					.select(".threads")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 1)
					.transition()
					.delay(1000)
					.duration(1000)
					.style("opacity", 0.2);
				d3.select(".arrow")
					.transition()
					.delay(1000)
					.duration(1000)
					.style("opacity", 1);
				container
					.select(".threads")
					.select("g:last-of-type")
					.transition()
					.delay(2000)
					.style("opacity", 1);
			} else if (index === 6) {
				d3.select(".arrow")
					.transition()
					.duration(1000)
					.style("opacity", 0);
				container
					.select(".threads")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 1);
			}
		},
		exit: (el) => {
			el.classList.remove("step-active");
			let container = d3.select(".rader-sample__container");
			let index = +d3.select(el).attr("data-index");
			if (index === 0) {
				container
					.select(".threads")
					.transition()
					.duration(1000)
					.style("opacity", 1);
			} else if (index === 1) {
				container
					.select(".petals")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 1);
			} else if (index === 2) {
				container
					.select(".petals")
					.select("g")
					.transition()
					.duration(1000)
					.style("opacity", 1);
				d3.select(".arrow").transition().style("opacity", 0);
				container
					.select(".petals")
					.select("g:last-of-type")
					.transition()
					.style("opacity", 0.3);
			} else if (index === 3) {
				d3.select(".arrow")
					.transition()
					.duration(1000)
					.style("opacity", 1);
				container
					.select(".petals")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 0.3);
				container
					.select(".petals")
					.select("g:last-of-type")
					.transition()
					.duration(1000)
					.style("opacity", 1);
				container
					.select(".threads")
					.transition()
					.duration(1000)
					.style("opacity", 0);
			} else if (index === 4) {
				container
					.select(".threads")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 1);
			} else if (index === 5) {
				container
					.select(".threads")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 0.2);
				d3.select(".arrow").transition().style("opacity", 0);
				container
					.select(".threads")
					.select("g")
					.transition()
					.duration(1000)
					.style("opacity", 1);
			} else if (index === 6) {
				d3.select(".arrow")
					.transition()
					.duration(1000)
					.style("opacity", 1);
				container
					.select(".threads")
					.selectAll("g")
					.transition()
					.duration(1000)
					.style("opacity", 0.2);
				container
					.select(".threads")
					.select("g:last-of-type")
					.transition()
					.duration(1000)
					.style("opacity", 1);
			}
		},
		offset: 0.7,
	});
}

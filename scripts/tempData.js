const marginTemp = { t: 50, r: 50, b: 75, l: 100 };
const size = {
	w: document.querySelector("#rader-chart").clientWidth,
	h: document.querySelector("#rader-chart").clientHeight,
};
const svg = d3
	.select("#rader-chart")
	.append("svg")
	.attr("width", size.w)
	.attr("height", size.h);

const containerG = svg.append("g").classed("rader__container", true);

Promise.all([
	d3.csv("data/kyoto_1881-2021.csv"),
	d3.csv("data/seasonal-temp.csv"),
	d3.csv("data/monthly-temp.csv"),
	d3.text("asset/petal.svg"),
]).then(function (datasets) {
	let bloomingD = datasets[0];
	bloomingD = bloomingD.map((d) => parseBloomingD(d));
	bloomingD = bloomingD.filter((d) => d.full_doy !== "NA");
	console.log(bloomingD);

	let seasonalTempD = datasets[1];
	seasonalTempD = seasonalTempD.map((d) => parseTempD(d));
	let groupedSeasonalTempD = d3.group(seasonalTempD, (d) => d.year);
	groupedSeasonalTempD = Array.from(groupedSeasonalTempD);

	let monthlyTempD = datasets[2];
	monthlyTempD = monthlyTempD.map((d) => parseTempD(d));
	let groupedMonthlyTempD = d3.group(monthlyTempD, (d) => d.year);
	groupedMonthlyTempD = Array.from(groupedMonthlyTempD);

	let svgEl = datasets[3];
	let defs = containerG.append("defs").html(svgEl);

	placeFlowers(bloomingD);
	groupedMonthlyTempD.forEach((d) => drawPetals(d));
	groupedSeasonalTempD.forEach((d) => drawRadarChart(d));
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

const margin = { t: 50, r: 25, b: 50, l: 50 };
const size = { w: 3000, h: 800 };
const svg = d3
	.select("#rader-chart")
	.append("svg")
	.attr("width", size.w)
	.attr("height", size.h);

const containerG = svg.append("g").classed("rader__container", true);

size.w = size.w - margin.l - margin.r;
size.h = size.h - margin.t - margin.b;

Promise.all([
	d3.csv("data/kyoto_1881-2021.csv"),
	d3.csv("data/seasonal-temp.csv"),
	d3.csv("data/monthly-temp.csv"),
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

// d3.csv("data/temp_merged.csv", function (d) {
// 	d.year = +d.year;
// 	d.first_doy = d.first_doy !== "NA" ? +d.first_doy : d.first_doy;
// 	d.full_doy = d.full_doy !== "NA" ? +d.full_doy : d.full_doy;
// 	d.avg_Nov = +d.avg_Nov;
// 	d.avg_Dec = +d.avg_Dec;
// 	d.avg_Jan = +d.avg_Jan;
// 	d.avg_Feb = +d.avg_Feb;
// 	d.avg_Mar = +d.avg_Mar;
// 	d.early_Nov = +d.early_Nov;
// 	d.mid_Nov = +d.mid_Nov;
// 	d.late_Nov = +d.late_Nov;
// 	d.early_Dec = +d.early_Dec;
// 	d.mid_Dec = +d.mid_Dec;
// 	d.late_Dec = +d.late_Dec;
// 	d.early_Jan = +d.early_Jan;
// 	d.mid_Jan = +d.mid_Jan;
// 	d.late_Jan = +d.late_Jan;
// 	d.early_Feb = +d.early_Feb;
// 	d.mid_Feb = +d.mid_Feb;
// 	d.late_Feb = +d.late_Feb;
// 	d.early_Mar = +d.early_Mar;
// 	d.mid_Mar = +d.mid_Mar;
// 	d.late_Mar = +d.late_Mar;
// 	return d;
// })

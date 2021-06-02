const annotation = [
	{
		year: 812,
		comment:
			"Oldest ever recorded. Professor Aono collected the data from a Japanese history text, <a href='https://en.wikipedia.org/wiki/Nihon_K%C5%8Dki' target='_blank'>Nihon Koki</a>.",
		category: "point",
	},
	{
		year: 961,
		comment:
			"This was the earliest full-blooming (March 28th) for 423 years, from 812 to 1235.",
		category: "point",
	},
	{
		year: 1084,
		comment:
			"Latest full-blooming (April 29th) for 510 years, from 812 to 1322.",
		category: "point",
	},
	{
		year: 1323,
		comment: "Latest full-blooming (May 4th) ever recorded.",
		category: "point",
	},
	{
		year: 1409,
		comment: "Earliest full-blooming (March 27th) until 2002.",
		category: "point",
	},
	{
		year: 1510,
		comment:
			"From 1500 to 1900, the majority (75%) of first-blooming happened between 102 to 110 days after Jan. 1 (from April 11 to 20).",
		category: "line",
	},
	{
		year: 1880,
		comment:
			"From 1880 to present, the temperature data are actually observed ones, obtained from Japan Meteorological Agency.",
		category: "line",
	},
	{
		year: 1953,
		comment:
			"From 1953 to present, the data about full-blooming date are obtained from Japan Meteorological Agency.",
		category: "line",
	},
	{
		year: 2021,
		comment: "Earliest full-blooming (March 26th) ever recorded",
		category: "point",
	},
];

const points = annotation
	.filter((el) => el.category === "point")
	.map((el) => el.year);

const lines = annotation
	.filter((el) => el.category === "line")
	.map((el) => el.year);
console.log(lines);

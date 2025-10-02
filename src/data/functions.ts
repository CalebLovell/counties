import stddev from "just-standard-deviation";
import { counties } from "~/data/counties";
import type { CountyData } from "~/data/types";

export const getCountyData = () => {
	return counties;
};

export const standardDeviation = () => {
	const population = counties.map((x) => x.population);
	const median_age = counties.map((x) => x.medianAge);
	const temperate = counties.map((x) => x.temperature.avgTempF);
	const homeValue = counties.map((x) => x.housing.medianHomeValue);
	const medianRent = counties.map((x) => x.rent.medianRent);

	const vals = {
		population_stdev: stddev(population) / 2,
		population_max: Math.max(...population),
		population_min: Math.min(...population),
		median_age_stdev: stddev(median_age) / 2,
		median_age_max: Math.max(...median_age),
		median_age_min: Math.min(...median_age),
		temperature_stdev: stddev(temperate) / 2,
		temperature_max: Math.max(...temperate),
		temperature_min: Math.min(...temperate),
		homeValue_stdev: stddev(homeValue) / 2,
		homeValue_max: Math.max(...homeValue),
		homeValue_min: Math.min(...homeValue),
		medianRent_stdev: stddev(medianRent) / 2,
		medianRent_max: Math.max(...medianRent),
		medianRent_min: Math.min(...medianRent),
	};
	return vals;
};

export const getActiveCounty = (county_id: number) => {
	const activeCounty = counties.find((x) => Number(x.id) === county_id);
	return activeCounty;
};

export const getColor = (
	county: CountyData,
	filterValues: {
		population: boolean;
		population_val: number;
		median_age: boolean;
		median_age_val: number;
		temperature: boolean;
		temperature_val: number;
		home_value: boolean;
		home_value_val: number;
		median_rent: boolean;
		median_rent_val: number;
	},
) => {
	const {
		population,
		population_val,
		median_age,
		median_age_val,
		temperature,
		temperature_val,
		home_value,
		home_value_val,
		median_rent,
		median_rent_val,
	} = filterValues;

	const vals = standardDeviation();
	const { population_stdev, median_age_stdev, temperature_stdev, homeValue_stdev, medianRent_stdev } = vals;

	let totalDeviations = 0;
	let activeFilters = 0;

	// Calculate standard deviations for each active filter
	if (population) {
		const deviation = Math.abs(county.population - population_val) / population_stdev;
		totalDeviations += deviation;
		activeFilters++;
	}

	if (median_age) {
		const deviation = Math.abs(county.medianAge - median_age_val) / median_age_stdev;
		totalDeviations += deviation;
		activeFilters++;
	}

	if (temperature) {
		const deviation = Math.abs(county.temperature.avgTempF - temperature_val) / temperature_stdev;
		totalDeviations += deviation;
		activeFilters++;
	}

	if (home_value) {
		const deviation = Math.abs(county.housing.medianHomeValue - home_value_val) / homeValue_stdev;
		totalDeviations += deviation;
		activeFilters++;
	}

	if (median_rent) {
		const deviation = Math.abs(county.rent.medianRent - median_rent_val) / medianRent_stdev;
		totalDeviations += deviation;
		activeFilters++;
	}

	// If no filters are active, return default color
	if (activeFilters === 0) {
		return "#e5e7eb"; // Light gray for unfiltered counties
	}

	// Calculate average deviation across all active filters
	const avgDeviation = totalDeviations / activeFilters;

	// Convert average deviation to weight (0-9 scale)
	let weight = 9;
	if (avgDeviation <= 0.5) weight = 1;
	else if (avgDeviation <= 1) weight = 2;
	else if (avgDeviation <= 1.5) weight = 3;
	else if (avgDeviation <= 2) weight = 4;
	else if (avgDeviation <= 2.5) weight = 5;
	else if (avgDeviation <= 3) weight = 6;
	else if (avgDeviation <= 3.5) weight = 7;
	else if (avgDeviation <= 4) weight = 8;
	// else weight = 9 (most different)

	const colors: Record<number, string> = {
		9: "#ffffff",
		8: "#FEFFE0",
		7: "rgb(254,255,207)",
		6: "rgb(202,233,181)",
		5: "rgb(133,204,187)",
		4: "rgb(73,183,194)",
		3: "rgb(50,128,181)",
		2: "#205274",
		1: "#173B53",
		0: "#fc2f70",
	};

	return colors[weight];
};

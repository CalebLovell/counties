import stddev from "just-standard-deviation";

import { type County, old_counties } from "./old_data";

export const getCountyData = () => {
	return old_counties;
};

export const standardDeviation = () => {
	const household_income = old_counties.map((x) => x.household_income);
	const property_value = old_counties.map((x) => x.property_value);
	const commute_time = old_counties.map((x) => x.commute_time);
	const median_age = old_counties.map((x) => x.median_age);

	const vals = {
		household_income_stdev: stddev(household_income) / 2,
		household_income_max: Math.max(...household_income),
		household_income_min: Math.min(...household_income),
		property_value_stdev: stddev(property_value) / 2,
		property_value_max: Math.max(...property_value),
		property_value_min: Math.min(...property_value),
		commute_time_stdev: stddev(commute_time) / 2,
		commute_time_max: Math.max(...commute_time),
		commute_time_min: Math.min(...commute_time),
		median_age_stdev: stddev(median_age) / 2,
		median_age_max: Math.max(...median_age),
		median_age_min: Math.min(...median_age),
	};
	return vals;
};

export const getActiveCounty = (county_id: number) => {
	const activeCounty = old_counties.find((x) => x.county_id === county_id);
	return activeCounty;
};

export const getColor = (
	county: County,
	filterValues: {
		hi: boolean;
		hi_val: number;
		pv: boolean;
		pv_val: number;
		c: boolean;
		c_val: number;
		age: boolean;
		age_val: number;
	},
) => {
	const { hi, hi_val, pv, pv_val, c, c_val, age, age_val } = filterValues;

	const vals = standardDeviation();
	const { household_income_stdev, property_value_stdev, median_age_stdev, commute_time_stdev } = vals;

	let totalDeviations = 0;
	let activeFilters = 0;

	// Calculate standard deviations for each active filter
	if (hi) {
		const deviation = Math.abs(county.household_income - hi_val) / household_income_stdev;
		totalDeviations += deviation;
		activeFilters++;
	}

	if (pv) {
		const deviation = Math.abs(county.property_value - pv_val) / property_value_stdev;
		totalDeviations += deviation;
		activeFilters++;
	}

	if (c) {
		const deviation = Math.abs(county.commute_time - c_val) / commute_time_stdev;
		totalDeviations += deviation;
		activeFilters++;
	}

	if (age) {
		const deviation = Math.abs(county.median_age - age_val) / median_age_stdev;
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

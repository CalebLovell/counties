import stddev from 'just-standard-deviation';

import { counties, County } from './counties';

export const getCountyData = () => {
	return counties;
};

export const standardDeviation = () => {
	const household_income = counties.map(x => x.household_income);
	const property_value = counties.map(x => x.property_value);
	const commute_time = counties.map(x => x.commute_time);
	const median_age = counties.map(x => x.median_age);
	const vals = {
		household_income_stdev: stddev(household_income) / 2,
		household_income_max: Math.max(...household_income),
		household_income_min: Math.min(...household_income),
		property_value_stdev: stddev(property_value) / 2,
		property_value_max: Math.max(...property_value),
		property_value_min: Math.max(...property_value),
		commute_time_stdev: stddev(commute_time) / 2,
		commute_time_max: Math.max(...commute_time),
		commute_time_min: Math.max(...commute_time),
		median_age_stdev: stddev(median_age) / 2,
		median_age_max: Math.max(...median_age),
		median_age_min: Math.max(...median_age),
	};
	return vals;
};

export const getActiveCounty = (county_id: number) => {
	const activeCounty = counties.find(x => x.county_id === county_id);
	return activeCounty;
};

export const getColor = (county: County) => {
	const state = {
		hi_val: 22000,
		pv_val: 19000,
		age_val: 22,
		c_val: 5,
	};
	const { hi_val, pv_val, age_val, c_val } = state;

	const vals = standardDeviation();
	const { household_income_stdev, property_value_stdev, median_age_stdev, commute_time_stdev } = vals;

	const dataset = [
		{
			datatype: 'household_income',
			input: hi_val,
			sd: household_income_stdev,
		},
		{
			datatype: 'property_value',
			input: pv_val,
			sd: property_value_stdev,
		},
		{
			datatype: 'commute_time',
			input: c_val,
			sd: commute_time_stdev,
		},
		{
			datatype: 'median_age',
			input: age_val,
			sd: median_age_stdev,
		},
	];

	const calcWeight = () => {
		let weight = 0;
		for (let i = 0; i < dataset.length; i++) {
			const { input, sd, datatype } = dataset[i];
			const datapoint = county[datatype];
			if (input - sd < datapoint && datapoint < input + sd) {
				weight = 1;
			} else if (input - 2 * sd < datapoint && datapoint < input + 2 * sd) {
				weight = 2;
			} else if (input - 3 * sd < datapoint && datapoint < input + 3 * sd) {
				weight = 3;
			} else if (input - 4 * sd < datapoint && datapoint < input + 4 * sd) {
				weight = 4;
			} else if (input - 5 * sd < datapoint && datapoint < input + 5 * sd) {
				weight = 5;
			} else if (input - 6 * sd < datapoint && datapoint < input + 6 * sd) {
				weight = 6;
			} else if (input - 7 * sd < datapoint && datapoint < input + 7 * sd) {
				weight = 7;
			} else if (input - 8 * sd < datapoint && datapoint < input + 8 * sd) {
				weight = 8;
			} else {
				weight = 9;
			}
		}
		return weight;
	};

	const weight = calcWeight();

	const colors = {
		9: '#ffffff',
		8: '#FEFFE0',
		7: 'rgb(254,255,207)',
		6: 'rgb(202,233,181)',
		5: 'rgb(133,204,187)',
		4: 'rgb(73,183,194)',
		3: 'rgb(50,128,181)',
		2: '#205274',
		1: '#173B53',
		0: '#fc2f70',
	};
	const color = colors[weight];
	return color;
};

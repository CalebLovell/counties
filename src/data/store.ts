import { create } from "zustand";
import { standardDeviation } from "~/data/functions";
import type { CountyData } from "~/data/types";

const {
	population_min,
	population_max,
	median_age_min,
	median_age_max,
	temperature_min,
	temperature_max,
	homeValue_min,
	homeValue_max,
	medianRent_min,
	medianRent_max,
} = standardDeviation();

type AppState = {
	sidebarIsOpen: boolean;
	setSidebarIsOpen: (by: boolean) => void;
	keyIsVisible: boolean;
	setKeyIsVisible: (by: boolean) => void;
	panelIsVisible: boolean;
	setPanelIsVisible: (by: boolean) => void;
	selectedCounty: CountyData | null;
	setSelectedCounty: (county: CountyData | null) => void;
	// Population Filter
	population: boolean;
	setPopulation: (value: boolean) => void;
	population_val: number;
	setPopulationVal: (value: number) => void;
	// Median Age Filter
	age: boolean;
	setAge: (value: boolean) => void;
	age_val: number;
	setAgeVal: (value: number) => void;
	// Temperature Filter
	temperature: boolean;
	setTemperature: (value: boolean) => void;
	temperature_val: number;
	setTemperatureVal: (value: number) => void;
	// Home Value Filter
	home_value: boolean;
	setHomeValue: (value: boolean) => void;
	home_value_val: number;
	setHomeValueVal: (value: number) => void;
	// Median Rent Filter
	median_rent: boolean;
	setMedianRent: (value: boolean) => void;
	median_rent_val: number;
	setMedianRentVal: (value: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
	sidebarIsOpen: false,
	setSidebarIsOpen: (by: boolean) => set({ sidebarIsOpen: by }),
	keyIsVisible: true,
	setKeyIsVisible: (by: boolean) => set({ keyIsVisible: by }),
	panelIsVisible: true,
	setPanelIsVisible: (by: boolean) => set({ panelIsVisible: by }),
	selectedCounty: null,
	setSelectedCounty: (county) => set({ selectedCounty: county }),
	// Population Filter
	population: true,
	setPopulation: (value: boolean) => set({ population: value }),
	population_val: Math.round((population_min + population_max) / 2),
	setPopulationVal: (value: number) => set({ population_val: value }),
	// Median Age Filter
	age: true,
	setAge: (value: boolean) => set({ age: value }),
	age_val: Math.round((median_age_min + median_age_max) / 2),
	setAgeVal: (value: number) => set({ age_val: value }),
	// Temperature Filter
	temperature: false,
	setTemperature: (value: boolean) => set({ temperature: value }),
	temperature_val: Math.round((temperature_min + temperature_max) / 2),
	setTemperatureVal: (value: number) => set({ temperature_val: value }),
	// Home Value Filter
	home_value: false,
	setHomeValue: (value: boolean) => set({ home_value: value }),
	home_value_val: Math.round((homeValue_min + homeValue_max) / 2),
	setHomeValueVal: (value: number) => set({ home_value_val: value }),
	// Median Rent Filter
	median_rent: false,
	setMedianRent: (value: boolean) => set({ median_rent: value }),
	median_rent_val: Math.round((medianRent_min + medianRent_max) / 2),
	setMedianRentVal: (value: number) => set({ median_rent_val: value }),
}));

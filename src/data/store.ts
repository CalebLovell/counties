import { create } from "zustand";
import { standardDeviation } from "./functions";

const {
	avg_temp_min,
	avg_temp_max,
	household_income_min,
	household_income_max,
	property_value_min,
	property_value_max,
	commute_time_min,
	commute_time_max,
	median_age_min,
	median_age_max,
} = standardDeviation();

type AppState = {
	sidebarIsOpen: boolean;
	setSidebarIsOpen: (by: boolean) => void;
	keyIsVisible: boolean;
	setKeyIsVisible: (by: boolean) => void;
	panelIsVisible: boolean;
	setPanelIsVisible: (by: boolean) => void;
	// Filter states
	temp: boolean;
	setTemp: (value: boolean) => void;
	temp_val: number;
	setTempVal: (value: number) => void;
	hi: boolean;
	setHi: (value: boolean) => void;
	hi_val: number;
	setHiVal: (value: number) => void;
	pv: boolean;
	setPv: (value: boolean) => void;
	pv_val: number;
	setPvVal: (value: number) => void;
	c: boolean;
	setC: (value: boolean) => void;
	c_val: number;
	setCVal: (value: number) => void;
	age: boolean;
	setAge: (value: boolean) => void;
	age_val: number;
	setAgeVal: (value: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
	sidebarIsOpen: false,
	setSidebarIsOpen: (by: boolean) => set({ sidebarIsOpen: by }),
	keyIsVisible: true,
	setKeyIsVisible: (by: boolean) => set({ keyIsVisible: by }),
	panelIsVisible: true,
	setPanelIsVisible: (by: boolean) => set({ panelIsVisible: by }),
	// Filter states
	temp: false,
	setTemp: (value: boolean) => set({ temp: value }),
	temp_val: Math.round((avg_temp_min + avg_temp_max) / 2),
	setTempVal: (value: number) => set({ temp_val: value }),
	hi: false,
	setHi: (value: boolean) => set({ hi: value }),
	hi_val: Math.round((household_income_min + household_income_max) / 2),
	setHiVal: (value: number) => set({ hi_val: value }),
	pv: false,
	setPv: (value: boolean) => set({ pv: value }),
	pv_val: Math.round((property_value_min + property_value_max) / 2),
	setPvVal: (value: number) => set({ pv_val: value }),
	c: false,
	setC: (value: boolean) => set({ c: value }),
	c_val: Math.round((commute_time_min + commute_time_max) / 2),
	setCVal: (value: number) => set({ c_val: value }),
	age: false,
	setAge: (value: boolean) => set({ age: value }),
	age_val: Math.round((median_age_min + median_age_max) / 2),
	setAgeVal: (value: number) => set({ age_val: value }),
}));

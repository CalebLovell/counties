import { create } from "zustand";
import type { County } from "~/data/old_data";
import { standardDeviation } from "./functions";

const {
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
	selectedCounty: County | null;
	setSelectedCounty: (county: County | null) => void;
	// Filter states
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
	selectedCounty: null,
	setSelectedCounty: (county) => set({ selectedCounty: county }),
	// Filter states
	hi: true,
	setHi: (value: boolean) => set({ hi: value }),
	hi_val: Math.round((household_income_min + household_income_max) / 2),
	setHiVal: (value: number) => set({ hi_val: value }),
	pv: true,
	setPv: (value: boolean) => set({ pv: value }),
	pv_val: Math.round((property_value_min + property_value_max) / 2),
	setPvVal: (value: number) => set({ pv_val: value }),
	c: true,
	setC: (value: boolean) => set({ c: value }),
	c_val: Math.round((commute_time_min + commute_time_max) / 2),
	setCVal: (value: number) => set({ c_val: value }),
	age: true,
	setAge: (value: boolean) => set({ age: value }),
	age_val: Math.round((median_age_min + median_age_max) / 2),
	setAgeVal: (value: number) => set({ age_val: value }),
}));

import { create } from 'zustand';

type AppState = {
	sidebarIsOpen: boolean;
	setSidebarIsOpen: (by: boolean) => void;
	keyIsVisible: boolean;
	setKeyIsVisible: (by: boolean) => void;
	panelIsVisible: boolean;
	setPanelIsVisible: (by: boolean) => void;
};

export const useAppStore = create<AppState>(set => ({
	sidebarIsOpen: false,
	setSidebarIsOpen: (by: boolean) => set({ sidebarIsOpen: by }),
	keyIsVisible: true,
	setKeyIsVisible: (by: boolean) => set({ keyIsVisible: by }),
	panelIsVisible: true,
	setPanelIsVisible: (by: boolean) => set({ panelIsVisible: by }),
}));

import { DataFilters } from "~/components/DataFilters";
import { DataPanel } from "~/components/DataPanel";
import { SocialsFooter } from "~/components/SocialsFooter";

export const Sidebar = () => {
	return (
		<div className="max-w-sm flex h-full w-full flex-col justify-between space-between overflow-auto p-2 text-right space-y-2 divide-y divide-gray-300">
			<DataFilters />
			<DataPanel />
			<SocialsFooter />
		</div>
	);
};

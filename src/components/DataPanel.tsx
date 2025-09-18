import { useAppStore } from "~/data/store";

export const DataPanel = () => {
	const { selectedCounty } = useAppStore();

	const details = [
		{
			title: "Household Income",
			value: selectedCounty?.household_income ? `$${selectedCounty.household_income.toLocaleString()}` : null,
		},
		{ title: "Commute Time", value: selectedCounty?.commute_time ? `${selectedCounty.commute_time} min` : null },
		{
			title: "Property Value",
			value: selectedCounty?.property_value ? `$${selectedCounty.property_value.toLocaleString()}` : null,
		},
		{ title: "Median Age", value: selectedCounty?.median_age ?? null },
	];

	if (!selectedCounty) return null;
	return (
		<section className="flex justify-end w-full">
			<dl className="flex flex-col items-end w-full">
				<div className="relative flex-auto p-1 md:p-2 text-right w-full">
					<dt className="truncate text-xs font-semibold leading-6 text-gray-900 md:whitespace-normal md:text-base">
						{selectedCounty.county_name}
					</dt>
					<dd className="text-xs text-gray-500 md:text-sm">{selectedCounty.county_state_name}</dd>
				</div>

				<div className="space-y-0 md:space-y-1 w-full">
					{details.map(({ title, value }) => (
						<Detail key={title} title={title} value={value} />
					))}
				</div>
			</dl>
		</section>
	);
};

const Detail = ({ title, value }: { title: string; value: string | number | null | undefined }) => {
	if (!value) return null;
	return (
		<div className="flex w-full flex-none items-center gap-x-1 justify-end text-right">
			<dt className="flex-none">{title}:</dt>
			<dd className="text-xs font-medium leading-6 text-gray-900 md:text-sm">{value}</dd>
		</div>
	);
};

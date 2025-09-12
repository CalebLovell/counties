import { useAppStore } from "~/data/store";

export const Key = () => {
	const { keyIsVisible } = useAppStore();

	const labels = [`Very Low`, `Low`, `Moderate`, `High`, `Very High`];
	const colors = [`#f7fbff`, `#deebf7`, `#9ecae1`, `#3182bd`, `#08519c`, `#08306b`];

	if (!keyIsVisible) return null;
	return (
		<div className="absolute bottom-4 left-0.5 rounded-lg p-2 md:bottom-16">
			{labels.map((label, index) => (
				<div key={label} className="mt-1 flex items-center">
					<div
						className="mr-2 h-6 w-1.5 transition duration-500 ease-in-out sm:h-10"
						style={{ backgroundColor: colors[index + 1] }}
					/>
					<p className="text-xs font-semibold text-black sm:text-sm">{label}</p>
				</div>
			))}
		</div>
	);
};

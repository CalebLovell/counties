import { useAppStore } from "~/data/store";

export const Key = () => {
	const { keyIsVisible } = useAppStore();

	const colors = [`#ffffff`, `#FEFFE0`, `rgb(133,204,187)`, `rgb(50,128,181)`, `#173B53`];

	if (!keyIsVisible) return null;
	return (
		<div className="absolute bottom-4 right-4 rounded-lg p-3 flex items-center space-x-3 bg-slate-300 bg-opacity-80 backdrop-blur-sm">
			<span className="text-xs font-semibold text-black sm:text-sm">Least Similar</span>
			<div className="flex">
				{colors.map((color, index) => (
					<div
						key={index}
						className="h-4 w-6 transition duration-500 ease-in-out sm:h-5 sm:w-8 first:rounded-l last:rounded-r"
						style={{ backgroundColor: color }}
					/>
				))}
			</div>
			<span className="text-xs font-semibold text-black sm:text-sm">Most Similar</span>
		</div>
	);
};

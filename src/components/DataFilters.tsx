import { standardDeviation } from "~/data/functions";
import { useAppStore } from "~/data/store";

export const DataFilters = () => {
	const {
		population,
		setPopulation,
		population_val,
		setPopulationVal,
		age,
		setAge,
		age_val,
		setAgeVal,
		temperature,
		setTemperature,
		temperature_val,
		setTemperatureVal,
		home_value,
		setHomeValue,
		home_value_val,
		setHomeValueVal,
		median_rent,
		setMedianRent,
		median_rent_val,
		setMedianRentVal,
	} = useAppStore();

	const { median_age_min, median_age_max } = standardDeviation();

	return (
		<section>
			<div className="text-xs font-semibold leading-6 text-gray-900">Map Information</div>
			<div className="flex flex-col space-y-2 text-sm text-gray-900">
				<p>Explore the map using the filters below.</p>
			</div>
			<div className="mt-2 space-y-2">
				{/* Population Filter */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => setPopulation(!population)}
							className={`text-sm font-semibold transition-colors ${
								population ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
							}`}
						>
							Population
						</button>
						<span className="text-sm text-gray-900 font-mono w-16 text-right">
							{population_val.toLocaleString()}
						</span>
					</div>
					<div className="space-y-2">
						<div className="flex items-center space-x-3">
							<span className="text-xs text-gray-500 w-12 text-right font-mono">{10}</span>
							<input
								type="range"
								step="1000"
								min={10}
								max={1000000}
								value={population_val}
								onChange={(e) => setPopulationVal(Math.round(Number(e.target.value)))}
								className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
							/>
							<span className="text-xs text-gray-500 w-12 text-left font-mono">{1000000}</span>
						</div>
					</div>
				</div>
				{/* Median Age Filter */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => setAge(!age)}
							className={`text-sm font-semibold transition-colors ${
								age ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
							}`}
						>
							Median Age
						</button>
						<span className="text-sm text-gray-900 font-mono w-16 text-right">{age_val}yrs</span>
					</div>
					<div className="space-y-2">
						<div className="flex items-center space-x-3">
							<span className="text-xs text-gray-500 w-12 text-right font-mono">
								{Math.round(median_age_min)}yrs
							</span>
							<input
								type="range"
								step="1"
								min={median_age_min}
								max={median_age_max}
								value={age_val}
								onChange={(e) => setAgeVal(Math.round(Number(e.target.value)))}
								className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
							/>
							<span className="text-xs text-gray-500 w-12 text-left font-mono">
								{Math.round(median_age_max)}yrs
							</span>
						</div>
					</div>
				</div>
				{/* Average Temperature Filter */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => setTemperature(!temperature)}
							className={`text-sm font-semibold transition-colors ${
								temperature ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
							}`}
						>
							Avg. Temperature
						</button>
						<span className="text-sm text-gray-900 font-mono w-16 text-right">{temperature_val}°F</span>
					</div>
					<div className="space-y-2">
						<div className="flex items-center space-x-3">
							<span className="text-xs text-gray-500 w-12 text-right font-mono">{30}°F</span>
							<input
								type="range"
								step="1"
								min={30}
								max={100}
								value={temperature_val}
								onChange={(e) => setTemperatureVal(Math.round(Number(e.target.value)))}
								className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
							/>
							<span className="text-xs text-gray-500 w-12 text-left font-mono">{100}°F</span>
						</div>
					</div>
				</div>
				{/* Home Value Filter */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => setHomeValue(!home_value)}
							className={`text-sm font-semibold transition-colors ${
								home_value ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
							}`}
						>
							Home Value
						</button>
						<span className="text-sm text-gray-900 font-mono w-16 text-right">
							{home_value_val.toLocaleString()}
						</span>
					</div>
					<div className="space-y-2">
						<div className="flex items-center space-x-3">
							<span className="text-xs text-gray-500 w-12 text-right font-mono">{10000}</span>
							<input
								type="range"
								step="1000"
								min={10000}
								max={1000000}
								value={home_value_val}
								onChange={(e) => setHomeValueVal(Math.round(Number(e.target.value)))}
								className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
							/>
							<span className="text-xs text-gray-500 w-12 text-left font-mono">{1000000}</span>
						</div>
					</div>
				</div>
				{/* Median Rent Filter */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => setMedianRent(!median_rent)}
							className={`text-sm font-semibold transition-colors ${
								median_rent ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
							}`}
						>
							Median Rent
						</button>
						<span className="text-sm text-gray-900 font-mono w-16 text-right">
							{median_rent_val.toLocaleString()}
						</span>
					</div>
					<div className="space-y-2">
						<div className="flex items-center space-x-3">
							<span className="text-xs text-gray-500 w-12 text-right font-mono">{200}</span>
							<input
								type="range"
								step="50"
								min={200}
								max={5000}
								value={median_rent_val}
								onChange={(e) => setMedianRentVal(Math.round(Number(e.target.value)))}
								className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
							/>
							<span className="text-xs text-gray-500 w-12 text-left font-mono">{5000}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

import { standardDeviation } from "~/data/functions";
import { useAppStore } from "~/data/store";

export const DataFilters = () => {
	const {
		population,
		setPopulation,
		population_val,
		setPopulationVal,
		population_importance,
		setPopulationImportance,
		age,
		setAge,
		age_val,
		setAgeVal,
		age_importance,
		setAgeImportance,
		temperature,
		setTemperature,
		temperature_val,
		setTemperatureVal,
		temperature_importance,
		setTemperatureImportance,
		home_value,
		setHomeValue,
		home_value_val,
		setHomeValueVal,
		home_value_importance,
		setHomeValueImportance,
		median_rent,
		setMedianRent,
		median_rent_val,
		setMedianRentVal,
		median_rent_importance,
		setMedianRentImportance,
	} = useAppStore();

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

	return (
		<section>
			<div className="text-xs font-semibold leading-6 text-gray-900">Map Information</div>
			<div className="flex flex-col space-y-2 text-sm text-gray-900">
				<p>Explore the map using the filters below.</p>
			</div>
			<div className="mt-4 space-y-3">
				{/* Population Filter */}
				<div className={`border rounded-lg p-3 transition-all ${population ? "border-indigo-400 bg-indigo-50/50" : "border-gray-300 bg-gray-50"}`}>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-semibold text-gray-900">Population</span>
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-700 font-mono">
								{population_val[0].toLocaleString()} - {population_val[1].toLocaleString()}
							</span>
							<button
								type="button"
								onClick={() => setPopulation(!population)}
								className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
									population ? "bg-indigo-600" : "bg-gray-300"
								}`}
							>
								<span
									className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
										population ? "translate-x-5" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
					</div>
					<div className="space-y-3 mt-3">
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Range</label>
							<div className="relative h-6 flex items-center">
								<input
									type="range"
									step={Math.round((population_max - population_min) / 100)}
									min={population_min}
									max={population_max}
									value={population_val[0]}
									onChange={(e) => {
										const newMin = Number(e.target.value);
										if (newMin <= population_val[1]) {
											setPopulationVal([newMin, population_val[1]]);
										}
									}}
									disabled={!population}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 2 }}
								/>
								<input
									type="range"
									step={Math.round((population_max - population_min) / 100)}
									min={population_min}
									max={population_max}
									value={population_val[1]}
									onChange={(e) => {
										const newMax = Number(e.target.value);
										if (newMax >= population_val[0]) {
											setPopulationVal([population_val[0], newMax]);
										}
									}}
									disabled={!population}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 1 }}
								/>
							</div>
						</div>
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Importance</label>
							<div className="flex items-center gap-2">
								<input
									type="range"
									min={1}
									max={5}
									value={population_importance}
									onChange={(e) => setPopulationImportance(Number(e.target.value))}
									disabled={!population}
									className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
								<span className="text-xs text-gray-700 font-semibold w-8">{population_importance}/5</span>
							</div>
						</div>
					</div>
				</div>

				{/* Median Age Filter */}
				<div className={`border rounded-lg p-3 transition-all ${age ? "border-indigo-400 bg-indigo-50/50" : "border-gray-300 bg-gray-50"}`}>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-semibold text-gray-900">Median Age</span>
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-700 font-mono">
								{Math.round(age_val[0])} - {Math.round(age_val[1])}yrs
							</span>
							<button
								type="button"
								onClick={() => setAge(!age)}
								className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
									age ? "bg-indigo-600" : "bg-gray-300"
								}`}
							>
								<span
									className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
										age ? "translate-x-5" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
					</div>
					<div className="space-y-3 mt-3">
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Range</label>
							<div className="relative h-6 flex items-center">
								<input
									type="range"
									step={1}
									min={median_age_min}
									max={median_age_max}
									value={age_val[0]}
									onChange={(e) => {
										const newMin = Number(e.target.value);
										if (newMin <= age_val[1]) {
											setAgeVal([newMin, age_val[1]]);
										}
									}}
									disabled={!age}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 2 }}
								/>
								<input
									type="range"
									step={1}
									min={median_age_min}
									max={median_age_max}
									value={age_val[1]}
									onChange={(e) => {
										const newMax = Number(e.target.value);
										if (newMax >= age_val[0]) {
											setAgeVal([age_val[0], newMax]);
										}
									}}
									disabled={!age}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 1 }}
								/>
							</div>
						</div>
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Importance</label>
							<div className="flex items-center gap-2">
								<input
									type="range"
									min={1}
									max={5}
									value={age_importance}
									onChange={(e) => setAgeImportance(Number(e.target.value))}
									disabled={!age}
									className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
								<span className="text-xs text-gray-700 font-semibold w-8">{age_importance}/5</span>
							</div>
						</div>
					</div>
				</div>

				{/* Temperature Filter */}
				<div className={`border rounded-lg p-3 transition-all ${temperature ? "border-indigo-400 bg-indigo-50/50" : "border-gray-300 bg-gray-50"}`}>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-semibold text-gray-900">Avg. Temperature</span>
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-700 font-mono">
								{Math.round(temperature_val[0])} - {Math.round(temperature_val[1])}°F
							</span>
							<button
								type="button"
								onClick={() => setTemperature(!temperature)}
								className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
									temperature ? "bg-indigo-600" : "bg-gray-300"
								}`}
							>
								<span
									className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
										temperature ? "translate-x-5" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
					</div>
					<div className="space-y-3 mt-3">
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Range</label>
							<div className="relative h-6 flex items-center">
								<input
									type="range"
									step={1}
									min={temperature_min}
									max={temperature_max}
									value={temperature_val[0]}
									onChange={(e) => {
										const newMin = Number(e.target.value);
										if (newMin <= temperature_val[1]) {
											setTemperatureVal([newMin, temperature_val[1]]);
										}
									}}
									disabled={!temperature}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 2 }}
								/>
								<input
									type="range"
									step={1}
									min={temperature_min}
									max={temperature_max}
									value={temperature_val[1]}
									onChange={(e) => {
										const newMax = Number(e.target.value);
										if (newMax >= temperature_val[0]) {
											setTemperatureVal([temperature_val[0], newMax]);
										}
									}}
									disabled={!temperature}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 1 }}
								/>
							</div>
						</div>
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Importance</label>
							<div className="flex items-center gap-2">
								<input
									type="range"
									min={1}
									max={5}
									value={temperature_importance}
									onChange={(e) => setTemperatureImportance(Number(e.target.value))}
									disabled={!temperature}
									className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
								<span className="text-xs text-gray-700 font-semibold w-8">{temperature_importance}/5</span>
							</div>
						</div>
					</div>
				</div>

				{/* Home Value Filter */}
				<div className={`border rounded-lg p-3 transition-all ${home_value ? "border-indigo-400 bg-indigo-50/50" : "border-gray-300 bg-gray-50"}`}>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-semibold text-gray-900">Home Value</span>
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-700 font-mono">
								${home_value_val[0].toLocaleString()} - ${home_value_val[1].toLocaleString()}
							</span>
							<button
								type="button"
								onClick={() => setHomeValue(!home_value)}
								className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
									home_value ? "bg-indigo-600" : "bg-gray-300"
								}`}
							>
								<span
									className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
										home_value ? "translate-x-5" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
					</div>
					<div className="space-y-3 mt-3">
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Range</label>
							<div className="relative h-6 flex items-center">
								<input
									type="range"
									step={Math.round((homeValue_max - homeValue_min) / 100)}
									min={homeValue_min}
									max={homeValue_max}
									value={home_value_val[0]}
									onChange={(e) => {
										const newMin = Number(e.target.value);
										if (newMin <= home_value_val[1]) {
											setHomeValueVal([newMin, home_value_val[1]]);
										}
									}}
									disabled={!home_value}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 2 }}
								/>
								<input
									type="range"
									step={Math.round((homeValue_max - homeValue_min) / 100)}
									min={homeValue_min}
									max={homeValue_max}
									value={home_value_val[1]}
									onChange={(e) => {
										const newMax = Number(e.target.value);
										if (newMax >= home_value_val[0]) {
											setHomeValueVal([home_value_val[0], newMax]);
										}
									}}
									disabled={!home_value}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 1 }}
								/>
							</div>
						</div>
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Importance</label>
							<div className="flex items-center gap-2">
								<input
									type="range"
									min={1}
									max={5}
									value={home_value_importance}
									onChange={(e) => setHomeValueImportance(Number(e.target.value))}
									disabled={!home_value}
									className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
								<span className="text-xs text-gray-700 font-semibold w-8">{home_value_importance}/5</span>
							</div>
						</div>
					</div>
				</div>

				{/* Median Rent Filter */}
				<div className={`border rounded-lg p-3 transition-all ${median_rent ? "border-indigo-400 bg-indigo-50/50" : "border-gray-300 bg-gray-50"}`}>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-semibold text-gray-900">Median Rent</span>
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-700 font-mono">
								${median_rent_val[0].toLocaleString()} - ${median_rent_val[1].toLocaleString()}
							</span>
							<button
								type="button"
								onClick={() => setMedianRent(!median_rent)}
								className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
									median_rent ? "bg-indigo-600" : "bg-gray-300"
								}`}
							>
								<span
									className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
										median_rent ? "translate-x-5" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
					</div>
					<div className="space-y-3 mt-3">
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Range</label>
							<div className="relative h-6 flex items-center">
								<input
									type="range"
									step={Math.round((medianRent_max - medianRent_min) / 100)}
									min={medianRent_min}
									max={medianRent_max}
									value={median_rent_val[0]}
									onChange={(e) => {
										const newMin = Number(e.target.value);
										if (newMin <= median_rent_val[1]) {
											setMedianRentVal([newMin, median_rent_val[1]]);
										}
									}}
									disabled={!median_rent}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 2 }}
								/>
								<input
									type="range"
									step={Math.round((medianRent_max - medianRent_min) / 100)}
									min={medianRent_min}
									max={medianRent_max}
									value={median_rent_val[1]}
									onChange={(e) => {
										const newMax = Number(e.target.value);
										if (newMax >= median_rent_val[0]) {
											setMedianRentVal([median_rent_val[0], newMax]);
										}
									}}
									disabled={!median_rent}
									className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:cursor-not-allowed"
									style={{ zIndex: 1 }}
								/>
							</div>
						</div>
						<div>
							<label className="text-xs text-gray-600 mb-2 block">Importance</label>
							<div className="flex items-center gap-2">
								<input
									type="range"
									min={1}
									max={5}
									value={median_rent_importance}
									onChange={(e) => setMedianRentImportance(Number(e.target.value))}
									disabled={!median_rent}
									className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
								<span className="text-xs text-gray-700 font-semibold w-8">{median_rent_importance}/5</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

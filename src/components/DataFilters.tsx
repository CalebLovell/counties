import { useAppStore } from "../data/store";
import { standardDeviation } from "../data/functions";

export const DataFilters = () => {
	const {
		temp,
		setTemp,
		temp_val,
		setTempVal,
		hi,
		setHi,
		hi_val,
		setHiVal,
		pv,
		setPv,
		pv_val,
		setPvVal,
		c,
		setC,
		c_val,
		setCVal,
		age,
		setAge,
		age_val,
		setAgeVal,
	} = useAppStore();

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

	return (
		<div className="space-y-4">
			{/* Temperature Filter */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<button
						onClick={() => setTemp(!temp)}
						className={`text-sm font-semibold transition-colors ${
							temp ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
						}`}
					>
						Average Annual Temperature
					</button>
					<span className="text-sm text-gray-900 font-mono w-16 text-right">{temp_val}°F</span>
				</div>
				<div className="space-y-2">
					<div className="flex items-center space-x-3">
						<span className="text-xs text-gray-500 w-12 text-right font-mono">{Math.round(avg_temp_min)}°F</span>
						<input
							type="range"
							step="1"
							min={avg_temp_min}
							max={avg_temp_max}
							value={temp_val}
							onChange={(e) => setTempVal(Math.round(Number(e.target.value)))}
							className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
						/>
						<span className="text-xs text-gray-500 w-12 text-left font-mono">{Math.floor(avg_temp_max)}°F</span>
					</div>
				</div>
			</div>

			{/* Household Income Filter */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<button
						onClick={() => setHi(!hi)}
						className={`text-sm font-semibold transition-colors ${
							hi ? "text-green-600" : "text-gray-500 hover:text-gray-700"
						}`}
					>
						Household Income
					</button>
					<span className="text-sm text-gray-900 font-mono w-16 text-right">${Math.round(hi_val / 1000)}k</span>
				</div>
				<div className="space-y-2">
					<div className="flex items-center space-x-3">
						<span className="text-xs text-gray-500 w-12 text-right font-mono">
							${Math.round(household_income_min / 1000)}k
						</span>
						<input
							type="range"
							step="1"
							min={household_income_min}
							max={household_income_max}
							value={hi_val}
							onChange={(e) => setHiVal(Number(e.target.value))}
							className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
						/>
						<span className="text-xs text-gray-500 w-12 text-left font-mono">
							${Math.round(household_income_max / 1000)}k
						</span>
					</div>
				</div>
			</div>

			{/* Property Value Filter */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<button
						onClick={() => setPv(!pv)}
						className={`text-sm font-semibold transition-colors ${
							pv ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
						}`}
					>
						Property Value
					</button>
					<span className="text-sm text-gray-900 font-mono w-16 text-right">${Math.round(pv_val / 1000)}k</span>
				</div>
				<div className="space-y-2">
					<div className="flex items-center space-x-3">
						<span className="text-xs text-gray-500 w-12 text-right font-mono">
							${Math.round(property_value_min / 1000)}k
						</span>
						<input
							type="range"
							step="1"
							min={property_value_min}
							max={property_value_max}
							value={pv_val}
							onChange={(e) => setPvVal(Number(e.target.value))}
							className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
						/>
						<span className="text-xs text-gray-500 w-12 text-left font-mono">
							${Math.round(property_value_max / 1000)}k
						</span>
					</div>
				</div>
			</div>

			{/* Commute Time Filter */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<button
						onClick={() => setC(!c)}
						className={`text-sm font-semibold transition-colors ${
							c ? "text-orange-600" : "text-gray-500 hover:text-gray-700"
						}`}
					>
						Commute Time
					</button>
					<span className="text-sm text-gray-900 font-mono w-16 text-right">{Math.round(c_val)}min</span>
				</div>
				<div className="space-y-2">
					<div className="flex items-center space-x-3">
						<span className="text-xs text-gray-500 w-12 text-right font-mono">
							{Math.round(commute_time_min)}min
						</span>
						<input
							type="range"
							step="1"
							min={commute_time_min}
							max={commute_time_max}
							value={c_val}
							onChange={(e) => setCVal(Math.round(Number(e.target.value)))}
							className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
						/>
						<span className="text-xs text-gray-500 w-12 text-left font-mono">
							{Math.floor(commute_time_max)}min
						</span>
					</div>
				</div>
			</div>

			{/* Median Age Filter */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<button
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
		</div>
	);
};

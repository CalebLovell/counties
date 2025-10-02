import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const EARTH_RADIUS_MILES = 3959;
const DEFAULT_FALLBACK_TEMP = 50;
const MAX_NEARBY_COUNTIES = 3;

// State average temperatures (°F) for fallback
const STATE_AVG_TEMPS = {
	AL: 64,
	AK: 26,
	AZ: 61,
	AR: 61,
	CA: 61,
	CO: 45,
	CT: 49,
	DE: 55,
	FL: 71,
	GA: 64,
	HI: 75,
	ID: 44,
	IL: 52,
	IN: 52,
	IA: 48,
	KS: 55,
	KY: 56,
	LA: 67,
	ME: 41,
	MD: 55,
	MA: 48,
	MI: 45,
	MN: 41,
	MS: 64,
	MO: 55,
	MT: 42,
	NE: 49,
	NV: 49,
	NH: 44,
	NJ: 53,
	NM: 54,
	NY: 45,
	NC: 59,
	ND: 40,
	OH: 51,
	OK: 60,
	OR: 48,
	PA: 49,
	RI: 50,
	SC: 63,
	SD: 45,
	TN: 58,
	TX: 65,
	UT: 49,
	VT: 43,
	VA: 56,
	WA: 48,
	WV: 52,
	WI: 43,
	WY: 42,
};

/**
 * Parses a single CSV line handling quoted values
 * @param {string} line - CSV line to parse
 * @returns {Array<string>} Array of parsed values
 */
function parseCSVLine(line) {
	const result = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === '"') {
			inQuotes = !inQuotes;
		} else if (char === "," && !inQuotes) {
			result.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}
	result.push(current.trim());
	return result;
}

/**
 * Loads existing temperature data from CSV file
 * @returns {Promise<Array<Object>>} Array of temperature data objects
 */
async function loadExistingTemperatures() {
	const tempsPath = path.join(__dirname, "output", "temperatures_2023.csv");
	const content = await fs.readFile(tempsPath, "utf8");

	const lines = content.trim().split("\n");
	const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());

	const temps = [];
	for (let i = 1; i < lines.length; i++) {
		const values = parseCSVLine(lines[i]);
		const row = {};
		headers.forEach((header, index) => {
			row[header] = values[index] || "";
		});
		temps.push(row);
	}

	return temps;
}

/**
 * Loads combined county data from JSON file
 * @returns {Promise<Array<Object>>} Array of combined county data
 */
async function loadCombinedData() {
	const combinedPath = path.join(__dirname, "output", "counties_combined.json");
	const content = await fs.readFile(combinedPath, "utf8");
	return JSON.parse(content);
}

/**
 * Converts full state name to two-letter abbreviation
 * @param {string} stateName - Full state name
 * @returns {string|null} Two-letter state code or null if not found
 */
function getStateAbbreviation(stateName) {
	const stateMap = {
		alabama: "AL",
		alaska: "AK",
		arizona: "AZ",
		arkansas: "AR",
		california: "CA",
		colorado: "CO",
		connecticut: "CT",
		delaware: "DE",
		florida: "FL",
		georgia: "GA",
		hawaii: "HI",
		idaho: "ID",
		illinois: "IL",
		indiana: "IN",
		iowa: "IA",
		kansas: "KS",
		kentucky: "KY",
		louisiana: "LA",
		maine: "ME",
		maryland: "MD",
		massachusetts: "MA",
		michigan: "MI",
		minnesota: "MN",
		mississippi: "MS",
		missouri: "MO",
		montana: "MT",
		nebraska: "NE",
		nevada: "NV",
		"new hampshire": "NH",
		"new jersey": "NJ",
		"new mexico": "NM",
		"new york": "NY",
		"north carolina": "NC",
		"north dakota": "ND",
		ohio: "OH",
		oklahoma: "OK",
		oregon: "OR",
		pennsylvania: "PA",
		"rhode island": "RI",
		"south carolina": "SC",
		"south dakota": "SD",
		tennessee: "TN",
		texas: "TX",
		utah: "UT",
		vermont: "VT",
		virginia: "VA",
		washington: "WA",
		"west virginia": "WV",
		wisconsin: "WI",
		wyoming: "WY",
	};
	return stateMap[stateName.toLowerCase()] || null;
}

/**
 * Calculates distance between two geographic points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in miles
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return EARTH_RADIUS_MILES * c;
}

// Approximate county centroids for Alaska (where most missing data is)
const ALASKA_CENTROIDS = {
	"02050": { lat: 60.7922, lon: -161.8358, name: "Bethel Census Area" },
	"02060": { lat: 58.7528, lon: -156.8639, name: "Bristol Bay Borough" },
	"02063": { lat: 61.1094, lon: -147.3958, name: "Chugach Census Area" },
	"02066": { lat: 61.4864, lon: -144.7861, name: "Copper River Census Area" },
	"02068": { lat: 63.85, lon: -148.9167, name: "Denali Borough" },
	"02070": { lat: 59.0397, lon: -158.5083, name: "Dillingham Census Area" },
	"02090": { lat: 64.8378, lon: -147.7164, name: "Fairbanks North Star Borough" },
	"02100": { lat: 59.2381, lon: -135.4453, name: "Haines Borough" },
	"02105": { lat: 58.1103, lon: -135.4453, name: "Hoonah-Angoon Census Area" },
	"02110": { lat: 58.3019, lon: -134.4197, name: "Juneau City and Borough" },
	"02122": { lat: 60.4903, lon: -150.9594, name: "Kenai Peninsula Borough" },
	"02130": { lat: 55.3422, lon: -131.6461, name: "Ketchikan Gateway Borough" },
	"02150": { lat: 57.79, lon: -152.4072, name: "Kodiak Island Borough" },
	"02158": { lat: 61.6, lon: -163.0, name: "Kusilvak Census Area" },
	"02164": { lat: 58.4681, lon: -156.6747, name: "Lake and Peninsula Borough" },
	"02170": { lat: 62.3203, lon: -149.545, name: "Matanuska-Susitna Borough" },
	"02180": { lat: 64.5011, lon: -165.4064, name: "Nome Census Area" },
	"02185": { lat: 69.3922, lon: -153.0064, name: "North Slope Borough" },
	"02188": { lat: 66.8886, lon: -160.8503, name: "Northwest Arctic Borough" },
	"02195": { lat: 56.8125, lon: -132.9558, name: "Petersburg Borough" },
	"02198": { lat: 55.5539, lon: -132.8197, name: "Prince of Wales-Hyder Census Area" },
	"02220": { lat: 57.0531, lon: -135.33, name: "Sitka City and Borough" },
	"02230": { lat: 59.4586, lon: -135.3131, name: "Skagway Municipality" },
	"02240": { lat: 64.0781, lon: -143.3658, name: "Southeast Fairbanks Census Area" },
	"02261": { lat: 61.1308, lon: -145.8661, name: "Valdez-Cordova Census Area" },
	"02275": { lat: 56.4708, lon: -132.3769, name: "Wrangell City and Borough" },
	"02282": { lat: 59.5469, lon: -139.7272, name: "Yakutat City and Borough" },
	"02290": { lat: 65.8331, lon: -152.6686, name: "Yukon-Koyukuk Census Area" },
};

// Other small counties missing temps (with approximate locations)
const OTHER_CENTROIDS = {
	15005: { lat: 21.19, lon: -156.975, name: "Kalawao County", state: "HI" },
	30067: { lat: 46.6797, lon: -105.8447, name: "Petroleum County", state: "MT" },
	31005: { lat: 41.4536, lon: -99.7928, name: "Arthur County", state: "NE" },
	31009: { lat: 42.8842, lon: -101.6606, name: "Blaine County", state: "NE" },
	31015: { lat: 41.8861, lon: -101.6219, name: "Boyd County", state: "NE" },
	48011: { lat: 31.8636, lon: -104.3658, name: "Armstrong County", state: "TX" },
	48033: { lat: 33.0606, lon: -101.8333, name: "Borden County", state: "TX" },
	48261: { lat: 26.9536, lon: -97.6364, name: "Kenedy County", state: "TX" },
	48269: { lat: 33.6131, lon: -100.2506, name: "King County", state: "TX" },
	48301: { lat: 31.8847, lon: -103.5661, name: "Loving County", state: "TX" },
	48311: { lat: 31.2503, lon: -102.8706, name: "McMullen County", state: "TX" },
};

/**
 * Estimates temperature for a county using nearby counties or state average
 * @param {string} fips - County FIPS code
 * @param {string} state - State name
 * @param {Array<Object>} existingTemps - Array of existing temperature data
 * @returns {Promise<number>} Estimated temperature in Fahrenheit
 */
async function estimateTemperature(fips, state, existingTemps) {
	const stateAbbr = getStateAbbreviation(state);

	// Check if we have centroid data for this county
	const centroid = ALASKA_CENTROIDS[fips] || OTHER_CENTROIDS[fips];

	if (centroid?.lat && centroid?.lon) {
		// Find nearest counties with temperature data
		const nearby = [];

		for (const temp of existingTemps) {
			const tempFips = temp.FIPS.padStart(5, "0");
			const tempCentroid = ALASKA_CENTROIDS[tempFips] || OTHER_CENTROIDS[tempFips];

			if (tempCentroid?.lat && tempCentroid?.lon) {
				const distance = calculateDistance(centroid.lat, centroid.lon, tempCentroid.lat, tempCentroid.lon);
				nearby.push({
					fips: tempFips,
					temp: parseFloat(temp["Avg Temperature (°F)"]),
					distance: distance,
				});
			}
		}

		// Sort by distance and take top counties
		nearby.sort((a, b) => a.distance - b.distance);
		const nearest = nearby.slice(0, MAX_NEARBY_COUNTIES);

		if (nearest.length > 0) {
			// Weighted average based on inverse distance
			let weightedSum = 0;
			let weightSum = 0;

			for (const n of nearest) {
				const weight = 1 / (n.distance + 1); // Add 1 to avoid division by zero
				weightedSum += n.temp * weight;
				weightSum += weight;
			}

			return Math.round((weightedSum / weightSum) * 100) / 100;
		}
	}

	// Fallback to state average
	return STATE_AVG_TEMPS[stateAbbr] || DEFAULT_FALLBACK_TEMP;
}

async function fillMissingTemperatures() {
	try {
		console.log("Loading existing data...");
		const existingTemps = await loadExistingTemperatures();
		const combined = await loadCombinedData();

		console.log(`Found ${existingTemps.length} existing temperature records`);
		console.log(`Found ${combined.length} total counties`);

		// Find counties missing temperature data
		const missingTemps = combined.filter((county) => !county["temp_Avg Temperature (°F)"]);
		console.log(`\nCounties missing temperature data: ${missingTemps.length}`);

		const filledTemps = [];

		for (const county of missingTemps) {
			const stateAbbr = getStateAbbreviation(county.State);
			const estimatedTemp = await estimateTemperature(county.FIPS, county.State, existingTemps);

			filledTemps.push({
				FIPS: county.FIPS,
				"County Name": `${stateAbbr}: ${county.County}`,
				State: stateAbbr,
				"Avg Temperature (°F)": estimatedTemp,
				"Data Points": 0,
				Note: "Estimated from nearby counties or state average",
			});

			console.log(`  ${county.FIPS}: ${county.County}, ${county.State} = ${estimatedTemp}°F`);
		}

		console.log(`\n✅ Filled ${filledTemps.length} counties with estimated temperature data`);

		// Write filled temperature data
		await writeOutputFiles(filledTemps, "temperatures_filled");

		// Create combined temperatures file
		const allTemps = [
			...existingTemps.map((t) => ({
				FIPS: t.FIPS,
				"County Name": t["County Name"],
				State: t.State,
				"Avg Temperature (°F)": t["Avg Temperature (°F)"],
				"Data Points": t["Data Points"],
			})),
			...filledTemps.map((t) => {
				// Remove the Note field from filled temps for the combined dataset
				const tempData = { ...t };
				delete tempData.Note;
				return tempData;
			}),
		];

		const allTempsPath = path.join(__dirname, "output", "temperatures_2023_complete.csv");
		const allTempsCsv = arrayToCsv(allTemps);
		await fs.writeFile(allTempsPath, allTempsCsv);
		console.log(`📄 Complete CSV: ${allTempsPath}`);
		console.log(`   Total records: ${allTemps.length}`);

		return filledTemps;
	} catch (error) {
		console.error("Error:", error.message);
		throw error;
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	fillMissingTemperatures().catch(console.error);
}

export { fillMissingTemperatures };

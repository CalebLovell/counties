import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV parsing utility
function parseCSV(content) {
	const lines = content.trim().split("\n");
	const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
	const rows = [];

	for (let i = 1; i < lines.length; i++) {
		const values = parseCSVLine(lines[i]);
		const row = {};
		headers.forEach((header, index) => {
			row[header] = values[index] || "";
		});
		rows.push(row);
	}

	return { headers, rows };
}

// Parse CSV line handling quotes and commas
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

// Normalize FIPS code
function normalizeFIPS(fips) {
	if (!fips) return "";
	return fips.toString().replace(/"/g, "").padStart(5, "0");
}

// Normalize county name for matching
function normalizeCountyName(county, state) {
	const cleanCounty = county.replace(/"/g, "").trim();
	const cleanState = state.replace(/"/g, "").trim();
	return `${cleanCounty}|${cleanState}`.toLowerCase();
}

// Create state name to abbreviation mapping
function getStateAbbreviation(stateName) {
	const stateMap = {
		'alabama': 'al', 'alaska': 'ak', 'arizona': 'az', 'arkansas': 'ar', 'california': 'ca',
		'colorado': 'co', 'connecticut': 'ct', 'delaware': 'de', 'florida': 'fl', 'georgia': 'ga',
		'hawaii': 'hi', 'idaho': 'id', 'illinois': 'il', 'indiana': 'in', 'iowa': 'ia',
		'kansas': 'ks', 'kentucky': 'ky', 'louisiana': 'la', 'maine': 'me', 'maryland': 'md',
		'massachusetts': 'ma', 'michigan': 'mi', 'minnesota': 'mn', 'mississippi': 'ms', 'missouri': 'mo',
		'montana': 'mt', 'nebraska': 'ne', 'nevada': 'nv', 'new hampshire': 'nh', 'new jersey': 'nj',
		'new mexico': 'nm', 'new york': 'ny', 'north carolina': 'nc', 'north dakota': 'nd', 'ohio': 'oh',
		'oklahoma': 'ok', 'oregon': 'or', 'pennsylvania': 'pa', 'rhode island': 'ri', 'south carolina': 'sc',
		'south dakota': 'sd', 'tennessee': 'tn', 'texas': 'tx', 'utah': 'ut', 'vermont': 'vt',
		'virginia': 'va', 'washington': 'wa', 'west virginia': 'wv', 'wisconsin': 'wi', 'wyoming': 'wy'
	};
	return stateMap[stateName.toLowerCase()] || stateName.toLowerCase();
}

async function combineCountyData() {
	const dataDir = path.join(__dirname, "..", "output");

	console.log("Loading CSV files...");

	// Load all CSV files
	const elections = parseCSV(fs.readFileSync(path.join(dataDir, "elections_2024.csv"), "utf8"));
	const housing = parseCSV(fs.readFileSync(path.join(dataDir, "housing_2023.csv"), "utf8"));
	const ages = parseCSV(fs.readFileSync(path.join(dataDir, "median_ages_2023.csv"), "utf8"));
	const population = parseCSV(fs.readFileSync(path.join(dataDir, "population_2023.csv"), "utf8"));
	const temperatures = parseCSV(fs.readFileSync(path.join(dataDir, "temperatures_2023.csv"), "utf8"));
	const rents = parseCSV(fs.readFileSync(path.join(dataDir, "rents_2023.csv"), "utf8"));

	console.log(`Loaded data:
    - Elections: ${elections.rows.length} rows
    - Housing: ${housing.rows.length} rows
    - Ages: ${ages.rows.length} rows
    - Population: ${population.rows.length} rows
    - Temperatures: ${temperatures.rows.length} rows
    - Rents: ${rents.rows.length} rows`);

	// Normalize FIPS codes and create lookup maps
	const housingMap = new Map();
	housing.rows.forEach((row) => {
		const fips = normalizeFIPS(row.FIPS);
		if (fips) housingMap.set(fips, row);
	});

	const agesMap = new Map();
	ages.rows.forEach((row) => {
		const fips = normalizeFIPS(row.FIPS);
		if (fips) agesMap.set(fips, row);
	});

	const populationMap = new Map();
	population.rows.forEach((row) => {
		const fips = normalizeFIPS(row.FIPS);
		if (fips) populationMap.set(fips, row);
	});

	const temperaturesMap = new Map();
	temperatures.rows.forEach((row) => {
		const fips = normalizeFIPS(row.FIPS);
		if (fips) temperaturesMap.set(fips, row);
	});

	// Also create temperature lookup by county name for better matching
	const temperaturesNameMap = new Map();
	temperatures.rows.forEach((row) => {
		// Format: 'AL: Autauga' or 'AL: Baldwin County'
		const parts = row["County Name"].split(": ");
		if (parts.length === 2) {
			const stateCode = parts[0].replace(/"/g, "").trim().toLowerCase();
			const county = parts[1].replace(/"/g, "").trim().toLowerCase()
				.replace(/county$/, "").replace(/parish$/, "").replace(/borough$/, "")
				.replace(/municipality$/, "").replace(/census area$/, "").trim();
			const key = `${county}|${stateCode}`;
			temperaturesNameMap.set(key, row);
		}
	});

	console.log("Merging data by FIPS...");

	// Start with elections as base and merge by FIPS
	const combined = [];
	const countyNameMap = new Map(); // For rents mapping

	elections.rows.forEach((row) => {
		const fips = normalizeFIPS(row.FIPS);
		if (!fips) return;

		const combinedRow = { ...row };

		// Store county name mapping for rents
		const countyKey = normalizeCountyName(row.County, row.State);
		countyNameMap.set(countyKey, fips);

		// Merge housing data
		const housingData = housingMap.get(fips);
		if (housingData) {
			Object.keys(housingData).forEach((key) => {
				if (!["FIPS", "County", "State"].includes(key)) {
					combinedRow[`housing_${key}`] = housingData[key];
				}
			});
		}

		// Merge ages data
		const agesData = agesMap.get(fips);
		if (agesData) {
			Object.keys(agesData).forEach((key) => {
				if (!["FIPS", "County Name", "State", "State FIPS", "County FIPS"].includes(key)) {
					combinedRow[`age_${key}`] = agesData[key];
				}
			});
		}

		// Merge population data
		const populationData = populationMap.get(fips);
		if (populationData) {
			Object.keys(populationData).forEach((key) => {
				if (!["FIPS", "County Name", "State", "State FIPS", "County FIPS", "Year"].includes(key)) {
					combinedRow[`pop_${key}`] = populationData[key];
				}
			});
		}

		// Merge temperatures data - try FIPS first, then county name
		let temperaturesData = temperaturesMap.get(fips);
		if (!temperaturesData) {
			// Fallback to county name matching
			const county = row.County.replace(/"/g, "").trim().toLowerCase()
				.replace(/county$/, "").replace(/parish$/, "").replace(/borough$/, "")
				.replace(/municipality$/, "").replace(/census area$/, "").trim();
			const stateCode = getStateAbbreviation(row.State);
			const nameKey = `${county}|${stateCode}`;
			temperaturesData = temperaturesNameMap.get(nameKey);
		}
		if (temperaturesData) {
			Object.keys(temperaturesData).forEach((key) => {
				if (!["FIPS", "County Name", "State"].includes(key)) {
					combinedRow[`temp_${key}`] = temperaturesData[key];
				}
			});
		}

		combined.push(combinedRow);
	});

	console.log("Mapping rents data by county name...");

	// Create rents lookup by county name
	const rentsMap = new Map();
	rents.rows.forEach((row) => {
		const countyKey = normalizeCountyName(row.County, row.State);
		rentsMap.set(countyKey, row);
	});

	// Add rents data to combined dataset
	let rentsMatched = 0;
	let temperaturesMatched = 0;
	combined.forEach((row) => {
		const countyKey = normalizeCountyName(row.County, row.State);
		const rentsData = rentsMap.get(countyKey);

		if (rentsData) {
			rentsMatched++;
			Object.keys(rentsData).forEach((key) => {
				if (!["FIPS", "State", "State Code", "County", "Year"].includes(key)) {
					row[`rent_${key}`] = rentsData[key];
				}
			});
		}

		// Count temperature matches
		if (row["temp_Avg Temperature (°F)"]) {
			temperaturesMatched++;
		}
	});

	console.log(`Rents data matched: ${rentsMatched}/${combined.length} counties`);
	console.log(`Temperature data matched: ${temperaturesMatched}/${combined.length} counties`);

	// Generate output CSV
	const outputHeaders = Object.keys(combined[0]);
	const csvContent = [
		outputHeaders.join(","),
		...combined.map((row) =>
			outputHeaders
				.map((header) => {
					const value = row[header] || "";
					// Quote values that contain commas
					return value.toString().includes(",") ? `"${value}"` : value;
				})
				.join(","),
		),
	].join("\n");

	const outputPath = path.join(dataDir, "counties_combined.csv");
	fs.writeFileSync(outputPath, csvContent);

	console.log(`✅ Combined dataset written to: ${outputPath}`);
	console.log(`📊 Total counties: ${combined.length}`);
	console.log(`📋 Total columns: ${outputHeaders.length}`);

	// Summary statistics
	const stats = {
		total_counties: combined.length,
		with_housing: combined.filter((r) => r["housing_Median Home Value"]).length,
		with_ages: combined.filter((r) => r["age_Median Age"]).length,
		with_population: combined.filter((r) => r.pop_Population).length,
		with_temperatures: combined.filter((r) => r["temp_Avg Temperature (°F)"]).length,
		with_rents: rentsMatched,
	};

	console.log("\n📈 Data Coverage:");
	Object.entries(stats).forEach(([key, value]) => {
		const pct = ((value / stats.total_counties) * 100).toFixed(1);
		console.log(`  ${key}: ${value} (${pct}%)`);
	});
}

if (import.meta.url === `file://${process.argv[1]}`) {
	combineCountyData().catch(console.error);
}

export { combineCountyData };

import { promises as fs } from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const ALASKA_ELECTION_URL = "https://www.elections.alaska.gov/results/24GENR/data/results.csv";
const STATEWIDE_DEM_PCT = 40.5;
const STATEWIDE_REP_PCT = 55.7;

// Alaska Borough/Census Area names mapped by FIPS code
const BOROUGH_NAMES = {
	"02050": "Bethel Census Area",
	"02060": "Bristol Bay Borough",
	"02063": "Chugach Census Area",
	"02066": "Copper River Census Area",
	"02068": "Denali Borough",
	"02070": "Dillingham Census Area",
	"02090": "Fairbanks North Star Borough",
	"02100": "Haines Borough",
	"02105": "Hoonah-Angoon Census Area",
	"02110": "Juneau City and Borough",
	"02122": "Kenai Peninsula Borough",
	"02130": "Ketchikan Gateway Borough",
	"02150": "Kodiak Island Borough",
	"02158": "Kusilvak Census Area",
	"02164": "Lake and Peninsula Borough",
	"02170": "Matanuska-Susitna Borough",
	"02180": "Nome Census Area",
	"02185": "North Slope Borough",
	"02188": "Northwest Arctic Borough",
	"02195": "Petersburg Borough",
	"02198": "Prince of Wales-Hyder Census Area",
	"02220": "Sitka City and Borough",
	"02230": "Skagway Municipality",
	"02240": "Southeast Fairbanks Census Area",
	"02261": "Valdez-Cordova Census Area",
	"02275": "Wrangell City and Borough",
	"02282": "Yakutat City and Borough",
	"02290": "Yukon-Koyukuk Census Area",
};

// Estimated turnout per borough based on population (assuming ~65% turnout)
const BOROUGH_VOTE_ESTIMATES = {
	"02050": 18140, // Bethel - 11,791 votes
	"02060": 836, // Bristol Bay - 544 votes
	"02063": 6854, // Chugach - 4,455 votes
	"02066": 2617, // Copper River - 1,701 votes
	"02068": 1619, // Denali - 1,053 votes
	"02070": 4706, // Dillingham - 3,059 votes
	"02090": 95965, // Fairbanks - 62,377 votes
	"02100": 2574, // Haines - 1,673 votes
	"02105": 2023, // Hoonah-Angoon - 1,315 votes
	"02110": 32255, // Juneau - 20,966 votes
	"02122": 60790, // Kenai Peninsula - 39,514 votes
	"02130": 13948, // Ketchikan - 9,066 votes
	"02150": 13101, // Kodiak - 8,516 votes
	"02158": 8368, // Kusilvak - 5,439 votes
	"02164": 1592, // Lake and Peninsula - 1,035 votes
	"02170": 109280, // Mat-Su - 71,032 votes
	"02180": 10004, // Nome - 6,503 votes
	"02185": 11113, // North Slope - 7,223 votes
	"02188": 7925, // Northwest Arctic - 5,151 votes
	"02195": 3398, // Petersburg - 2,209 votes
	"02198": 5753, // Prince of Wales-Hyder - 3,740 votes
	"02220": 8458, // Sitka - 5,498 votes
	"02230": 1183, // Skagway - 769 votes
	"02240": 6970, // Southeast Fairbanks - 4,531 votes
	"02261": 2545, // Valdez-Cordova - 1,654 votes
	"02275": 2127, // Wrangell - 1,383 votes
	"02282": 664, // Yakutat - 432 votes
	"02290": 5189, // Yukon-Koyukuk - 3,373 votes
};

/**
 * Attempts to download Alaska election results from the official website
 * @returns {Promise<string|null>} CSV data if successful, null if failed
 */
async function downloadAlaskaResults() {
	console.log("Fetching Alaska 2024 election results...");

	return new Promise((resolve) => {
		https
			.get(ALASKA_ELECTION_URL, (res) => {
				// Follow redirects
				if (res.statusCode === 301 || res.statusCode === 302) {
					console.log(`Redirected to: ${res.headers.location}`);
					https.get(res.headers.location, processResponse).on("error", () => resolve(null));
					return;
				}

				if (res.statusCode !== 200) {
					console.log(`Cannot fetch CSV (HTTP ${res.statusCode}), using estimated results`);
					resolve(null);
					return;
				}

				processResponse(res);
			})
			.on("error", (err) => {
				console.log(`Error fetching Alaska data: ${err.message}`);
				console.log("Will use estimated statewide results instead");
				resolve(null);
			});

		function processResponse(res) {
			let data = "";
			res.on("data", (chunk) => {
				data += chunk;
			});
			res.on("end", () => {
				resolve(data);
			});
		}
	});
}

/**
 * Generates estimated Alaska election results based on statewide percentages
 * Uses 2024 statewide results: Trump 55.7%, Harris 40.5%
 * @returns {Array<Object>} Array of borough election result objects
 */
function estimateAlaskaResults() {
	const results = [];

	for (const [fips, name] of Object.entries(BOROUGH_NAMES)) {
		const estimatedVotes = BOROUGH_VOTE_ESTIMATES[fips] || 1000;
		const demVotes = Math.round(estimatedVotes * (STATEWIDE_DEM_PCT / 100));
		const repVotes = Math.round(estimatedVotes * (STATEWIDE_REP_PCT / 100));
		const totalVotes = demVotes + repVotes;

		results.push({
			FIPS: fips,
			County: name,
			State: "Alaska",
			"Total Votes": totalVotes,
			"Democrat Votes": demVotes,
			"Republican Votes": repVotes,
			"Democrat %": STATEWIDE_DEM_PCT.toFixed(2),
			"Republican %": STATEWIDE_REP_PCT.toFixed(2),
			Winner: "Republican",
			Note: "Estimated based on statewide results",
		});
	}

	return results;
}

/**
 * Converts array of objects to CSV format
 * @param {Array<Object>} data - Array of data objects
 * @returns {string} CSV formatted string
 */
function arrayToCsv(data) {
	if (!data.length) return "";

	const headers = Object.keys(data[0]);
	const csvRows = [
		headers.join(","),
		...data.map((row) =>
			headers
				.map((header) => {
					const value = row[header] || "";
					return value.toString().includes(",") ? `"${value}"` : value;
				})
				.join(","),
		),
	];

	return csvRows.join("\n");
}

/**
 * Writes data to both CSV and JSON files
 * @param {Array<Object>} data - Data to write
 * @param {string} filename - Base filename (without extension)
 */
async function writeOutputFiles(data, filename) {
	const outputDir = path.join(__dirname, "..", "output");

	// Write CSV
	const csvContent = arrayToCsv(data);
	const csvPath = path.join(outputDir, `${filename}.csv`);
	await fs.writeFile(csvPath, csvContent);
	console.log(`📄 CSV: ${csvPath}`);

	// Write JSON
	const jsonPath = path.join(outputDir, `${filename}.json`);
	await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
	console.log(`📄 JSON: ${jsonPath}`);
}

/**
 * Main function to fill Alaska election data
 * Attempts to download official data, falls back to estimates
 * @returns {Promise<Array<Object>>} Array of Alaska election results
 */
async function fillAlaskaElections() {
	try {
		const csvData = await downloadAlaskaResults();

		// Currently, we always use estimates since CSV parsing is not implemented
		// TODO: Implement CSV parsing if official data becomes available
		const alaskaResults = estimateAlaskaResults();

		if (csvData) {
			console.log("Official data downloaded but using estimates (CSV parsing not implemented)");
		} else {
			console.log("Using statewide estimate method...");
		}

		console.log(`\n✅ Generated ${alaskaResults.length} Alaska borough/census area records`);

		await writeOutputFiles(alaskaResults, "alaska_elections_filled");

		return alaskaResults;
	} catch (error) {
		console.error("Error:", error.message);
		throw error;
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	fillAlaskaElections().catch(console.error);
}

export { fillAlaskaElections };

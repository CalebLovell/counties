import { fillAlaskaElections } from "./fill/alaska.js";
import { fillMissingRents } from "./fill/rents.js";
import { fillMissingTemperatures } from "./fill/temps.js";

async function fillAllMissingData() {
	console.log("=".repeat(60));
	console.log("FILLING ALL MISSING COUNTY DATA");
	console.log("=".repeat(60));

	try {
		// Step 1: Fill Alaska elections data
		console.log("\n📊 STEP 1/3: Filling Alaska Elections Data");
		console.log("-".repeat(60));
		await fillAlaskaElections();

		// Step 2: Fill missing rents data
		console.log("\n\n🏠 STEP 2/3: Filling Missing Rents Data");
		console.log("-".repeat(60));
		await fillMissingRents();

		// Step 3: Fill missing temperatures data
		console.log("\n\n🌡️  STEP 3/3: Filling Missing Temperature Data");
		console.log("-".repeat(60));
		await fillMissingTemperatures();

		console.log(`\n${"=".repeat(60)}`);
		console.log("✅ ALL MISSING DATA FILLED SUCCESSFULLY");
		console.log("=".repeat(60));
		console.log("\nGenerated files:");
		console.log("  - alaska_elections_filled.csv/json");
		console.log("  - rents_filled.csv/json");
		console.log("  - rents_2023_complete.csv");
		console.log("  - temperatures_filled.csv/json");
		console.log("  - temperatures_2023_complete.csv");
		console.log("\nNext step: Run the combine script to merge all data");
		console.log("  npm run combine");
	} catch (error) {
		console.error("\n❌ Error filling missing data:", error.message);
		process.exit(1);
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	fillAllMissingData().catch(console.error);
}

export { fillAllMissingData };

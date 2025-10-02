COUNTY DATA COLLECTION & PROCESSING
===================================

Directory Structure:
-------------------
data/
├── scripts/           # Data collection and processing scripts
│   ├── fill/         # Scripts to fill missing data
│   │   ├── alaska.js      # Fill missing Alaska election data
│   │   ├── rents.js       # Fill missing rent data with state estimates
│   │   └── temps.js       # Fill missing temperature data with estimates
│   ├── ages.js            # Collect median age data
│   ├── elections.js       # Collect 2024 election results
│   ├── housing.js         # Collect housing/home value data
│   ├── population.js      # Collect 2023 population data
│   ├── rents.js           # Collect HUD fair market rent data
│   ├── temperatures.js    # Collect average temperature data
│   ├── fill-all-missing.js # Master script to run all fill scripts
│   └── combine.js         # Combine all data sources into one dataset
└── output/           # Generated data files

Available Commands:
------------------
npm run collect:all    # Collect all raw data from sources
npm run fill:missing   # Fill missing data with estimates
npm run combine        # Combine all data into counties_combined.csv/json

Workflow:
---------
1. Collect raw data:
   npm run collect:all
   
2. Fill missing data (optional but recommended):
   npm run fill:missing
   
3. Combine into final dataset:
   npm run combine

Final Output:
------------
- counties_combined.csv  (3144 rows - all US counties)
- counties_combined.json (JSON format)

Data Coverage (after fill:missing):
-----------------------------------
- Elections: 100% (3143/3144)
- Housing: 99.8% (3138/3144)  
- Ages: 100% (3144/3144)
- Population: 100% (3144/3144)
- Temperatures: 100% (3144/3144)
- Rents: 100% (3143/3144)

Notes:
------
- Base: 3144 US counties (excludes Puerto Rico)
- Population data (2023) used as the basis
- FIPS codes normalized and used for primary matching
- County names normalized for fallback matching
- Missing data filled with state/regional estimates where possible

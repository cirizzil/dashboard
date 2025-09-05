Engineering Dashboard - From Engineering Drawings to Digital Insights

A React dashboard that shows data from engineering drawings (PNID and Isometric) using an ML API.

Features:

🎯 Dashboard Features

Navigation

*PNID Dashboard: Equipment, instruments, and line analysis
*Isometric Dashboard: Element and material breakdown
*Insights: Comprehensive data linking and summary statistics

Interactive Features

*Material Filter: Filter by material type across all data
*Equipment Type Filter: Filter PNID equipment by type
*Element Type Filter: Filter isometric elements by type
*Sorting: Multiple sort options for data tables
*Export: Download filtered data as CSV or JSON

Data Linking

*Line ID Mapping: Links PNID lines with isometric elements
*Coverage Analysis: Shows linking statistics and gaps
*Searchable Table: Detailed linking information with search

Theme Support

*Dark Mode: Default theme with professional dark styling
*Light Mode: Alternative light theme
*Theme Toggle: Easy switching between themes

Data Processing:

* Normalizes sizes (e.g., DN200 → 8 in)
* Normalizes materials (e.g., SS316 → SS)
* Maps raw API fields into a clean structure
just for refference
Raw Data	Normalized
"8""	"8 in"
"DN50"	"2 in"
"CARBON STEEL"	"CS"
"SS316"	"SS"
"ELBOW"	"elbow"
undefined	"Unknown"

Libraries Used:

* React, TypeScript, Vite
* Recharts (charts)
* Ant Design (UI components)
* React Router DOM (routing)
* Axios (API requests)

How to Run:

1. Install: `npm install`
2. Run dev: `npm run dev`
3. Open browser at `http://localhost:3000`







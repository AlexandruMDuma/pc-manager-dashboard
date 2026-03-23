# PC Manager Dashboard - SPFx Solution

An SPFx solution with two web parts for managing and viewing per-manager review data on SharePoint Online.

## Web Parts

### 1. Data Slicer (Admin)
- Admin clicks "Process New Files" to trigger processing
- Reads CSV files from `Data/Bulk data from PC` library folder
- Groups rows by the `Reader FMNO` column
- Creates a folder per FMNO under `Data/Data for each manager/{FMNO}`
- Breaks role inheritance, grants Read to the specific manager + Full Control to site owners
- Uploads the sliced CSV into each manager's folder
- Moves processed source CSVs to `Data/Processed`

### 2. Data Viewer (Manager)
- Resolves the current user's FMNO via Microsoft Graph (`employeeId`)
- Reads CSV data from their personal folder under `Data/Data for each manager/{FMNO}`
- Displays a review count card (pilot); full dashboard coming later

## Prerequisites

- **Node.js** 18.x (v18.17.1 or later)
- **npm** 8+ (comes with Node.js 18)
- **SharePoint Online** site with a document library called **Data**
- **Tenant admin** access to approve Microsoft Graph API permissions

## SharePoint Site Setup

Before deploying, create this folder structure in the **Data** document library:

```
Data (document library)
├── Bulk data from PC/          ← upload CSV files here
├── Data for each manager/      ← auto-created by the slicer
└── Processed/                  ← auto-created; holds processed source files
```

Only the `Bulk data from PC` folder needs to be created manually. The slicer will create the rest.

## Build & Run

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Trust the dev certificate (first time only)
gulp trust-dev-cert

# 3. Build the solution
gulp build

# 4. Serve locally — opens the hosted workbench on your SharePoint site
gulp serve
```

This launches a local dev server and opens the SharePoint hosted workbench at your site (`config/serve.json` has the URL). From the workbench you can add the **Data Slicer** and **Data Viewer** web parts to test them against real data on your site.

The hosted workbench URL is:
`https://mckinsey.sharepoint.com/sites/spcad-r8tyyze1uqpwf40pn9/_layouts/workbench.aspx`

## Test Data

Sample CSV files for testing are in the `test-data/` folder:
- `test-reviews.csv` — 8 rows across 3 FMNOs (12345, 67890, 11111)
- `test-reviews-batch2.csv` — 4 rows across 3 FMNOs (12345, 67890, 22222)

Upload these to `Data/Bulk data from PC` on your test site to verify the slicer.

## API Permissions

| API | Permission | Type | Purpose |
|-----|-----------|------|---------|
| Microsoft Graph | `User.Read.All` | Delegated | Look up users by `employeeId` (FMNO) |

This permission must be approved by a tenant admin after deploying the `.sppkg`.

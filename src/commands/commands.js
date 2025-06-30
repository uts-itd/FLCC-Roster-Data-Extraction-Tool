const FRDET = require('./frdet');
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Office */

Office.onReady(() => {
  // If needed, Office.js is ready to be called.
});

async function extractData(event) {
	await Excel.run(async (context) => {
		const names = context.workbook.names;
		const tables = context.workbook.tables;
		const sheets = context.workbook.worksheets;

		// load workbook context items
		context.workbook.load(
			'worksheets/items/name' +
			', tables/items/rows/items/values' +
			', tables/items/name' +
			', tables/items/columns/items' +
			', names/items/arrayValues/values' +
			', names/items/name'
		);

		await context.sync();

		// Get header row ranges
		const headerRowRanges = [];

		tables.items.forEach(table => {
			const headerRowRange = table.getHeaderRowRange().load('values');

			headerRowRanges.push( { tableName: table.name, headerRowRange: headerRowRange } );
		});

		await context.sync();

		// define table names
		const tableNames = [];
		
		tables.items.forEach(table => {
			const pattern = /(Monday|Tuesday|Wednesday|Thursday|Friday)\d{1}/g
			
			let matches = table.name.match(pattern);
			
			if(matches)
				tableNames.push(matches[0]);
		});

		// TODO: Check that it is a roster file	

		// create Roster Data Sheet if it does not exist
		createRosterDataSheet(sheets).activate();

		// create rosterData table if it does not exist
		const rosterDataTable = createRosterDataTable(tables);

		// define empty roster data
		let rosterData = [];

		tableNames.forEach(tableName => {
			try {
				let rosterTable = tables.items.find(item => item.name === tableName);
				let header = headerRowRanges.find(header => header.tableName === tableName);
				let extractedRosterData = FRDET.extractRosterData(rosterTable, header.headerRowRange);

				rosterData = rosterData.concat(extractedRosterData);
			} catch (error) {
				console.log(`${tableName} not found`);
			}
		});

		rosterDataTable.rows.add(null, rosterData);

		// Format table
		rosterDataTable.getRange().format.autofitColumns();
		rosterDataTable.columns.getItem('Date').getDataBodyRange().numberFormat = 'dd/mm/yyyy';

		event.completed();
	});
}

function createRosterDataSheet(sheets) {
	const wSheetName = 'Roster Data';

	// find sheet with wSheetName
	let rosterDataSheet = sheets.items.find(sheet => sheet.name === wSheetName);

	if (rosterDataSheet === undefined)
		rosterDataSheet = sheets.add(wSheetName);

	return rosterDataSheet;
}

function createRosterDataTable(tables) {
	const tableName = 'rosterData';

	// find table with tableName
	let dataTable = tables.items.find(item => item.name === tableName);

	if (dataTable === undefined) {
		dataTable = tables.add(`'Roster Data'!A1:G1`, true);

		dataTable.name = tableName;
		dataTable.getHeaderRowRange().values = 
			[["Name", "Allocation", "Date", "Start", "End", "Time", "Value"]];
	} else {
		dataTable.rows.deleteRows(dataTable.rows.items);
	}

	return dataTable;
}

// Register the function with Office.
Office.actions.associate("extractData", extractData);


const FRDET = require('./frdet');
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Office */

Office.onReady(() => {
  // If needed, Office.js is ready to be called.
});

/**
 * Shows a notification when the add-in command is executed.
 * @param event {Office.AddinCommands.Event}
 */
function action(event) {
  const message = {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: "Performed action.",
    icon: "Icon.80x80",
    persistent: true,
  };

  // Show a notification message.
  Office.context.mailbox.item.notificationMessages.replaceAsync(
    "ActionPerformanceNotification",
    message
  );

  // Be sure to indicate when the add-in command function is complete.
  event.completed();
}

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

		// Get dates cells from tables
		const dateCells = [];

		tables.items.forEach(table => {
			const dateCell = table.getHeaderRowRange().getCell(0, 0);
			dateCell.load('values');

			dateCells.push({ tableName: table.name, cell: dateCell });
		});

		await context.sync();

		// define table names
		const tableNames =
			['Monday1', 'Tuesday1', 'Wednesday1', 'Thursday1', 'Friday1', 
				'Monday2', 'Tuesday2', 'Wednesday2', 'Thursday2', 'Friday2',
				'Monday3', 'Tuesday3', 'Wednesday3', 'Thursday3', 'Friday3',
				'Monday4', 'Tuesday4', 'Wednesday4', 'Thursday4', 'Friday4',
				'Monday5', 'Tuesday5', 'Wednesday5', 'Thursday5', 'Friday5'
			];

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
				let extractedRosterData = FRDET.extractRosterData(rosterTable);

				// Get date from dateCells objects
				let date = dateCells.find(cell => cell.tableName === tableName).cell.values[0][0];

				// Add date to all rows
				extractedRosterData.forEach(row => row[2] = date);

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
		dataTable = tables.add(`'Roster Data'!A1:H1`, true);

		dataTable.name = tableName;
		dataTable.getHeaderRowRange().values = 
			[["Name", "Allocation", "Date", "Start", "End", "Time", "Value", "Address"]];
	} else {
		dataTable.rows.deleteRows(dataTable.rows.items);
	}

	return dataTable;
}

Office.actions.associate("extractData", extractData);

// Register the function with Office.
Office.actions.associate("action", action);

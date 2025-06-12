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

		context.workbook.load(
			'worksheets/items/name' +
			', tables/items/rows/items/values' +
			', tables/items/name' +
			', names/items/arrayValues/values' +
			', names/items/name'
		);

		await context.sync();

		// create Roster Data Sheet if it does not exist
		createRosterDataSheet(sheets).activate();

		// create rosterData table if it does not exist
		const rosterDataTable = createRosterDataTable(tables);

		event.completed();
	});
}

function createRosterDataSheet(sheets) {
	const wSheetName = 'Roster Data';

	let rosterDataSheet = sheets.items.find(sheet => sheet.name === wSheetName);

	if (rosterDataSheet === undefined)
		rosterDataSheet = sheets.add(wSheetName);

	return rosterDataSheet;
}

function createRosterDataTable(tables) {
	const tableName = 'rosterData';
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

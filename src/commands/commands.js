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

		createRosterDataSheet(sheets).activate();

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

Office.actions.associate("extractData", extractData);

// Register the function with Office.
Office.actions.associate("action", action);

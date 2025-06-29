/* 
 * Returns the name from a given cell value, removing any additional information found
 * inside the brackets. i.e. John Smith (9am-9.30am) => John Smith
 */
function extractName(cellValue) {
	const parenthesisIndex = cellValue.indexOf('(');

	if (parenthesisIndex > -1)
		return cellValue.substring(0, parenthesisIndex - 1).trim();

	return cellValue.trim();
}

/*
 * Returns the time override string from a given cell value.
 * e.g. John Smith (9.30am-10am) => 9.30am-10am
 */
function extractTimeOverride(cellValue) {
	const pattern = /((from|start|until|finish|lunch)\s*)?\d{1,2}.\d{1,2}(\s?-\s?)?((until|finish)?\s*\d{1,2}.\d{1,2})?/g;

	let matches = cellValue.match(pattern);
	let timeString;

	matches === null ? timeString = matches : timeString = matches[0];

	return timeString;
}

/*
 * Returns a string that can be used for calculating the number of hours. e.g. 9.30 => 9.5
 */
function convertTime(timeString) {
	let timeStringArr = timeString.split('.');

	let hour = timeStringArr[0] / 1;
	let minutes = timeStringArr[1] / 60;

	return hour + minutes;
}

/*
 * Returns a time range string corresponding to the cell column index
 */
function getTimeString(columnIndex) {
	const timeStrings = new Map([
		[1, "9.00-10.00"],
		[2, "10.00-11.00"],
		[3, "11.00-12.00"],
		[4, "12.00-1.00"],
		[5, "1.00-2.00"],
		[6, "2.00-3.00"],
		[7, "3.00-4.00"],
		[8, "4.00-5.00"],
		[9, "5.00-6.00"],
		[10, "6.00-7.00"]
	]);

	return timeStrings.get(columnIndex);
}

/*
 * Returns a date object converted from the Excel date serial number
 */
function excelDateToJSDate(serial) {
	const utc_days = Math.floor(serial - 25569);
	const utc_value = utc_days * 86400;
	const date_info = new Date(utc_value * 1000);

	return date_info;
}

/*
 * 
 */
function cleanTimeStringOverride(timeStringOverride) {
	let cleanedString = timeStringOverride.replace('until', 'til');
	cleanedString = cleanedString.replace('till', 'til');
	cleanedString = cleanedString.replace(':', '.');

	return cleanedString;
}

/*
 * Returns the lunch time from the string otherwise, it return null.
 */
function extractLunchTime(cellValue) {
	const pattern = /\blunch\s+(\d{1,2}[.:]\d{2})\b/i;

	let matches = cellValue.match(pattern);

	return matches ? matches[0] : null;
}

/*
 * Gets the corresponding time range from the header
 */ 
function getTimeRange(columnIndex, headerRowRange) {
	let timeRangeString = headerRowRange.values[0][columnIndex];
	const pattern = /\d{1,2}-\d{1,2}/;

	const matches = timeRangeString.match(pattern);

	return matches[0];
}

/*
 * Returns extracter roster table
 */
function extractRosterData(table, headerRowRange) {
	const rows = table.rows.items;
	const rosterData = [];

	let date = headerRowRange.values[0][0];

	rows.forEach(row => {
		let servicePoint = row.values[0][0];

		// loop through cells by column
		for (let colIndex = 1; colIndex <= table.columns.count - 1; colIndex++) {
			let cellValue = row.values[0][colIndex];

			if (cellValue !== '') {
				let name = extractName(cellValue);

				let timeRange = getTimeRange(colIndex, headerRowRange); // e.g. [11-12]
				let timeRangeOverride = extractTimeOverride(cellValue); // e.g. from 11.30 or until 4.30
				let lunchTimeString = extractLunchTime(cellValue); // e.g. lunch 12.30
				
				let timePattern = /\d{1,2}.\d{1,2}/g;

				// If there's a lunch time
				if (lunchTimeString) {
					// Get lunch start and end times
					let lunchStart = convertTime(lunchTimeString.match(timePattern)[0]);
					let lunchEnd = lunchStart + .5 > 12 ?
						lunchStart + .5 - 12 :
						lunchStart + .5;

					// Calculate how long lunch time is
					let lunchTime = lunchEnd > lunchStart ?
						lunchEnd - lunchStart :
						lunchEnd + 12 - lunchStart;

					// Get service point start and end times
					let startTime = timeRange[0] < lunchStart ?
						Number(timeRange[0]) :
						lunchEnd;
					let endTime = timeRange[1] == lunchEnd ?
						lunchStart :
						Number(timeRange[1]);

					// Caculate how long service point time is
					let time = endTime > startTime ?
						endTime - startTime:
						entTime + 12 - startTime;

					// If lunch time starts BEFORE the service point start
					if (lunchStart < startTime) {
						rosterData.push([
							name, 'Lunch', date, lunchStart, lunchEnd, lunchTime, cellValue
						]);

						rosterData.push([
							name, servicePoint, date, startTime, endTime, time, cellValue
						]);
					} else { // Otherwise, lunch time comes after the service point time
						rosterData.push([
							name, servicePoint, date, startTime, endTime, time, cellValue
						]);

						rosterData.push([
							name, 'Lunch', date, lunchStart, lunchEnd, lunchTime, cellValue
						]);
					}
				} else {
					let startTime = Number(timeRange[0]);
					let endTime = Number(timeRange[1]);
					
					if (timeRangeOverride) {
						if (timeRangeOverride.startsWith('start') || timeRangeOverride.startsWith('from'))
							startTime = convertTime(timeRangeOverride.match(timePattern)[0]);

						if (timeRangeOverride.startsWith('finish') || timeRangeOverride.startsWith('until'))
							endTime = convertTime(timeRangeOverride.match(timePattern)[0]);
					}

					// Calculate the time (hours)
					let time = endTime > startTime ?
						endTime - startTime :
						endTime + 12 - startTime;

					rosterData.push([
						name, servicePoint, date, startTime, endTime, time, cellValue
					]);
				}
			}
		}
	});

	return rosterData;
}

module.exports = {
	extractName,
	extractTimeOverride,
	convertTime,
	getTimeString,
	excelDateToJSDate,
	cleanTimeStringOverride,
	extractLunchTime,
	getTimeRange,
	extractRosterData
};


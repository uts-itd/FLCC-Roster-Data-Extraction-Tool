const FRDET = require('./frdet');

describe('extractName() takes a string value from the roster cell and returns the name', () => {
	describe('Function will return the name from the string when there are no parenthesis', () => {
		let nameString = "Jane Doe";
		let expectedResult = 'Jane Doe';

		let result = FRDET.extractName(nameString);

		test('Name extracted from "Jane Doe" should be "Jane Doe"', () => {
			expect(result).toBe(expectedResult);
		});
	});
	
	describe('Function will return the name from the string when there is nothing within the proceeding parenthesis', () => {
	let nameString = "John Doe ()";
		let expectedResult = 'John Doe';

		let result = FRDET.extractName(nameString);
		
		test('Name extracted from "John Doe ()" should be "John Doe"', () => {
			expect(result).toBe(expectedResult);
		});
	});

	describe('Function will return the name from the string when there is something within the proceeding parenthesis', () => {
		let nameString = "Jeremy Doe (do something)";
		let expectedResult = 'Jeremy Doe';

		let result = FRDET.extractName(nameString);

		test('Name extracted from "Jeremy (do something)" should be "Jeremy Doe"', () => {
			expect(result).toBe(expectedResult);
		});

		nameString = "Richard Hammond (from 9.30)";
		expectedResult = 'Richard Hammond';

		result = FRDET.extractName(nameString);

		test('Name extracted from "Richard Hammond (from 9.30)" should be "Richard Hammond"', () => {
			expect(result).toBe(expectedResult);
		});
	});

	describe('Function will return an empty string when parenthesis preceeds the name', () => {
		let nameString = "() James Doe";
		let expectedResult = '';

		let result = FRDET.extractName(nameString);

		test('Name extracted from "() James Doe" should be an empty string', () => {
			expect(result).toBe(expectedResult);
		});

		nameString = "(from 9.30) James Doe";
		expectedResult = '';

		result = FRDET.extractName(nameString);

		test('Name extracted from "(from 9.30) James Doe" should be an empty string', () => {
			expect(result).toBe(expectedResult);
		});
	});
});

describe('extractTimeOverride() takes a string value from a roster cell and returns the time string found in parenthesis', () => {
	describe('Function will extract the time string from within the parenthesis', () => {
		let nameString = 'Jeremy Clarkson (until 9.30)';
		let expectedResult = 'until 9.30';

		let result = FRDET.extractTimeOverride(nameString);

		test('Time string extracted from "Jeremy Clarkson (until 9.30)" should be "until 9.30"', () => {
			expect(result).toBe(expectedResult);
		});

		nameString = 'James May (from 9.15 - until 9.45)';
		expectedResult = 'from 9.15 - until 9.45';

		result = FRDET.extractTimeOverride(nameString);

		test('Time string extracted from "James May (from 9.15 - until 9.45)" should be "from 9.15 - until 9.45"', () => {
			expect(result).toBe(expectedResult);
		});

		nameString = 'Richard Hammond (9.15 - 9.45)';
		expectedResult = '9.15 - 9.45';

		result = FRDET.extractTimeOverride(nameString);

		test('Time string extracted from "Richard Hammond (9.15 - 9.45)" should be "9.15 - 9.45"', () => {
			expect(result).toBe(expectedResult);
		});

		nameString = 'Tom Hanks (Do something from 12.30)';
		expectedResult = 'from 12.30';

		result = FRDET.extractTimeOverride(nameString);

		test('Time string extracted from "Tom Hanks (from 12.30)" should be "from 12.30"', () => {
			expect(result).toBe(expectedResult);
		});
	});

	describe('Function will return null if there is no time string within the parenthesis', () => {
		const nameString = 'James May ()';

		const result = FRDET.extractTimeOverride(nameString);

		test('Time string extracted from "James May ()" should be null', () => {
			expect(result).toBeNull;
		});
	});

	describe('Function will return null if there is no parenthesis', () => {
		const nameString = 'James May';

		const result = FRDET.extractTimeOverride(nameString);

		test('Time string extracted from "James May" should be null', () => {
			expect(result).toBeNull;
		});
	});
});

describe('convertTime() converts a time string to double', () => {
	const timeString = '9.30';

	const timeDbl = FRDET.convertTime(timeString);

	test('Converts "9.30" to 9.5', () => {
		expect(timeDbl).toBe(9.5);
	});
});

describe('getTime() will get the time array based off the input', () => {
	test('result should be array with 11 in [0] and 12 in [1]', () => {
		const cellValue = 'John Doe';
		const timeString = '11.00-12.00';

		const result = FRDET.getTime(timeString, cellValue);

		expect(result[0]).toBe(11);
		expect(result[1]).toBe(12);
	});
});

describe('getTime() should get the time based off the cell value', () => {
	const cellValue = 'John Doe (from 11:30)';
	const timeString = '11.00-12.00';
	const expectedResult = [11.5, 12];

	const result = FRDET.getTime(timeString, cellValue);
	
	test('result should equal [11.5, 12] ', () => {
		expect(result).toEqual(expectedResult);
	});
});

describe('excelDateToJSDate() convert excel date serial to JS Date format', () => {
	const dateSerial = 45108;
	const expectedDate = new Date('2023-07-01T00:00:00.000Z');

	const convertedDate = FRDET.excelDateToJSDate(dateSerial);

	test('45108 is converted to "2023-07-01T00:00:00.000Z"', () => {
		expect(convertedDate).toEqual(expectedDate);
	});
});

describe('extractLunchTime() gets the lunch time from the given string', () => {
	let cellValue = 'John Doe (lunch 12.30)';
	let expectedValue = 'lunch 12.30';

	let result = FRDET.extractLunchTime(cellValue);

	test('result should be "lunch 12.30"', () => {
		expect(result).toBe(expectedValue);
	});

	cellValue = 'John Doe (Do something lunch 12.00)';
	expectedValue = 'lunch 12.00';

	result = FRDET.extractLunchTime(cellValue);

	test('result should be "lunch 12.00"', () => {
		expect(result).toBe(expectedValue);
	});
});

describe('getTimeRange() will get the time range associated with the column of the cell.', () => {
	const HEADER = {
		"values" : [
			['Mon 5th May', '9-10am', '10-11am', '11-12pm', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm', '6-7pm']
		],
	};

	const columnIndex = 3;
	const expectedResult = '11-12';

	const result = FRDET.getTimeRange(columnIndex, HEADER);

	test('timeRange returned should be "11-12"', () => {
		expect(result).toBe(expectedResult);
	});
});

describe('extractRosterData() extracts the roster data into an array.', () => {
	const ROSTERTABLE = {
		"name" : "Monday1",
		"columns" : {
			"count" : 11,
		},
		"rows" : {
			"items" : [ //row
				{
					"values" : [
						['Inbound/SF', 'Shreya', 'Angeline', 'Angeline', 'Angeline (lunch 12.30)', 'Grace', '', 'Joyce', 'Joyce (finish 4.30)', 'Aditya', 'Alex']
					],
				},
				{
					"values" : [
						['Inbound/SF', 'Akansha', 'Akansha', 'Akansha', 'Shreya', '', 'Joyce', 'Grace', 'Aditya', '', '']
					],
				},
				{
					"values" : [
						['Inbound/SF', '', '', 'Shreya', 'Grace (start 12.30)', '', '', '', 'Alex', '', '']
					],
				},
				{
					"values" : [
						['Inbound/SF', '', '', '', '', '', '', '', '', '', '']
					],
				},
				{
					"values" : [
						['Salesforce only', 'Angeline', 'Shreya', '', 'Akansha', 'Joyce', 'Grace', '', 'Grace (finish 4.30)', 'Alex', 'Aditya']
					],
				},
				{
					"values" : [
						['Salesforce only', '', '', '', 'Joyce (start 12.30)', '', '', '', '', '', '']
					],
				},
				{
					"values" : [
						['Salesforce only', '', '', '', '', '', '', '', '', '', '']
					],
				},
				{
					"values" : [
						['Outbound / Inbound', '', '', '', 'Yoon (start 12.30)', 'Yoon', 'Yoon', 'Yoon', 'Yoon (finish 4.30)', 'Sienna', 'Sienna']
					],
				},
				{
					"values" : [
						['Outbound / Inbound', '', '', '', '', '', '', '', 'Sienna', '', '']
					],
				},
				{
					"values" : [
						['Outbound / Inbound', '', '', '', '', '', '', '', '', '', '']
					],
				},
				{
					"values" : [
						['Other', '', '', '', '', '', '', '', '', '', '']
					],
				},
			],
		},
	};

	const HEADER = {
		"values" : [
			['Mon 5th May', '9-10am', '10-11am', '11-12pm', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm', '6-7pm']
		],
	};

	const expectedResult = [
		['Shreya', 'Inbound/SF', 'Mon 5th May', 9, 10, 1, 'Shreya'],
		['Angeline', 'Inbound/SF', 'Mon 5th May', 10, 11, 1, 'Angeline'],
		['Angeline', 'Inbound/SF', 'Mon 5th May', 11, 12, 1, 'Angeline'],
		['Angeline', 'Inbound/SF', 'Mon 5th May', 12, 12.5, 0.5, 'Angeline (lunch 12.30)'],
		['Angeline', 'Lunch', 'Mon 5th May', 12.5, 1, 0.5, 'Angeline (lunch 12.30)'],
		['Grace', 'Inbound/SF', 'Mon 5th May', 1, 2, 1, 'Grace'],
		['Joyce', 'Inbound/SF', 'Mon 5th May', 3, 4, 1, 'Joyce'],
		['Joyce', 'Inbound/SF', 'Mon 5th May', 4, 4.5, 0.5, 'Joyce (finish 4.30)'],
		['Aditya', 'Inbound/SF', 'Mon 5th May', 5, 6, 1, 'Aditya'],
		['Alex', 'Inbound/SF', 'Mon 5th May', 6, 7, 1, 'Alex'],
		['Akansha', 'Inbound/SF', 'Mon 5th May', 9, 10, 1, 'Akansha'],
		['Akansha', 'Inbound/SF', 'Mon 5th May', 10, 11, 1, 'Akansha'],
		['Akansha', 'Inbound/SF', 'Mon 5th May', 11, 12, 1, 'Akansha'],
		['Shreya', 'Inbound/SF', 'Mon 5th May', 12, 1, 1, 'Shreya'],
		['Joyce', 'Inbound/SF', 'Mon 5th May', 2, 3, 1, 'Joyce'],
		['Grace', 'Inbound/SF', 'Mon 5th May', 3, 4, 1, 'Grace'],
		['Aditya', 'Inbound/SF', 'Mon 5th May', 4, 5, 1, 'Aditya'],
		['Shreya', 'Inbound/SF', 'Mon 5th May', 11, 12, 1, 'Shreya'],
		['Grace', 'Inbound/SF', 'Mon 5th May', 12.5, 1, 0.5, 'Grace (start 12.30)'],
		['Alex', 'Inbound/SF', 'Mon 5th May', 4, 5, 1, 'Alex'],
		['Angeline', 'Salesforce only', 'Mon 5th May', 9, 10, 1, 'Angeline'],
		['Shreya', 'Salesforce only', 'Mon 5th May', 10, 11, 1, 'Shreya'],
		['Akansha', 'Salesforce only', 'Mon 5th May', 12, 1, 1, 'Akansha'],
		['Joyce', 'Salesforce only', 'Mon 5th May', 1, 2, 1, 'Joyce'],
		['Grace', 'Salesforce only', 'Mon 5th May', 2, 3, 1, 'Grace'],
		['Grace', 'Salesforce only', 'Mon 5th May', 4, 4.5, 0.5, 'Grace (finish 4.30)'],
		['Alex', 'Salesforce only', 'Mon 5th May', 5, 6, 1, 'Alex'],
		['Aditya', 'Salesforce only', 'Mon 5th May', 6, 7, 1, 'Aditya'],
		['Joyce', 'Salesforce only', 'Mon 5th May', 12.5, 1, 0.5, 'Joyce (start 12.30)'],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 12.5, 1, 0.5, 'Yoon (start 12.30)'],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 1, 2, 1, 'Yoon'],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 2, 3, 1, 'Yoon'],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 3, 4, 1, 'Yoon'],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 4, 4.5, 0.5, 'Yoon (finish 4.30)'],
		['Sienna', 'Outbound / Inbound', 'Mon 5th May', 5, 6, 1, 'Sienna'],
		['Sienna', 'Outbound / Inbound', 'Mon 5th May', 6, 7, 1, 'Sienna'],
		['Sienna', 'Outbound / Inbound', 'Mon 5th May', 4, 5, 1, 'Sienna']
	];

	const result = FRDET.extractRosterData(ROSTERTABLE, HEADER);

	test('Roster data should be extracted to the roster table', () => {
		expect(result).toEqual(expectedResult);
	});
});

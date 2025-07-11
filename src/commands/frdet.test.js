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

describe('convertTime() converts a time in string format to an equivalent number', () => {
	describe('Function converts time in string format to a number', () => {
		let timeString = '9.30';
		let expectedResult = 9.5;

		let result = FRDET.convertTime(timeString);

		test('time string "9.30" should convert to 9.5', () => {
			expect(result).toBe(expectedResult);
		});
	});

	describe('Returns null if string is not a time in string format', () => {
		let timeString = 'Dimingo Chaves (from 9.30)';

		let result = FRDET.convertTime(timeString);

		test('String "Dimingo Chaves (from 9.30)" should return null', () => {
			expect(result).toBeNull;
		});

		timeString = 'from 9.30';

		result = FRDET.convertTime(timeString);

		test('from 9.30" should return null', () => {
			expect(result).toBeNull;
		});
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
	describe('extract lunch time when it is explicitly declared in parenthesis', () => {
		let cellValue = 'John Doe (lunch 12.30)';
		let expectedValue = 'lunch 12.30';

		let result = FRDET.extractLunchTime(cellValue);

		test('John Doe (lunch 12.30) should be "lunch 12.30"', () => {
			expect(result).toBe(expectedValue);
		});
	});

	describe('extracts lunch time when it is declared in parenthesis with other text', () => {
		let cellValue = 'John Doe (Do something lunch 12.00)';
		let expectedValue = 'lunch 12.00';

		let result = FRDET.extractLunchTime(cellValue);

		test('John Doe (Do something lunch 12.00) should be "lunch 12.00"', () => {
			expect(result).toBe(expectedValue);
		});
	});
});

describe('getTimeRange() will return an array with the start and end time of the range associated with the column of the cell.', () => {
	const HEADER = {
		"values" : [
			['Mon 5th May', '9-10am', '10-11am', '11-12pm', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm', '6-7pm']
		],
	};

	describe('Function will return an array of size 2, with the start time and the end times', () => {
		const columnIndex = 3;
		const expectedResult = [11,12];

		const result = FRDET.getTimeRange(columnIndex, HEADER);

		test('timeRange returned should be [11,12]', () => {
			expect(result).toEqual(expectedResult);
		});
	});

	describe('Function will return null if 0 is passed as the column parameter', () => {
		const columnIndex = 0;
		const expectedResult = null;

		const result = FRDET.getTimeRange(columnIndex, HEADER);

		test('timeRange returned should be null', () => {
			expect(result).toBeNull();
		});
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
						['Inbound/SF', 'Akansha', 'Akansha', 'Akansha', 'Shreya (lunch 12.00)', '', 'Joyce', 'Grace', 'Aditya', '', '']
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
			['Mon 5 May 2025', '9-10am', '10-11am', '11-12pm', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm', '6-7pm']
		],
	};

	const expectedResult = [
		['Shreya', 'Inbound/SF', '05/05/2025', 9, 10, 1, 'Shreya'],
		['Angeline', 'Inbound/SF', '05/05/2025', 10, 11, 1, 'Angeline'],
		['Angeline', 'Inbound/SF', '05/05/2025', 11, 12, 1, 'Angeline'],
		['Angeline', 'Inbound/SF', '05/05/2025', 12, 12.5, 0.5, 'Angeline (lunch 12.30)'],
		['Angeline', 'Lunch', '05/05/2025', 12.5, 1, 0.5, 'Angeline (lunch 12.30)'],
		['Grace', 'Inbound/SF', '05/05/2025', 1, 2, 1, 'Grace'],
		['Joyce', 'Inbound/SF', '05/05/2025', 3, 4, 1, 'Joyce'],
		['Joyce', 'Inbound/SF', '05/05/2025', 4, 4.5, 0.5, 'Joyce (finish 4.30)'],
		['Aditya', 'Inbound/SF', '05/05/2025', 5, 6, 1, 'Aditya'],
		['Alex', 'Inbound/SF', '05/05/2025', 6, 7, 1, 'Alex'],
		['Akansha', 'Inbound/SF', '05/05/2025', 9, 10, 1, 'Akansha'],
		['Akansha', 'Inbound/SF', '05/05/2025', 10, 11, 1, 'Akansha'],
		['Akansha', 'Inbound/SF', '05/05/2025', 11, 12, 1, 'Akansha'],
		['Shreya', 'Lunch', '05/05/2025', 12, 12.5, 0.5, 'Shreya (lunch 12.00)'],
		['Shreya', 'Inbound/SF', '05/05/2025', 12.5, 1, 0.5, 'Shreya (lunch 12.00)'],
		['Joyce', 'Inbound/SF', '05/05/2025', 2, 3, 1, 'Joyce'],
		['Grace', 'Inbound/SF', '05/05/2025', 3, 4, 1, 'Grace'],
		['Aditya', 'Inbound/SF', '05/05/2025', 4, 5, 1, 'Aditya'],
		['Shreya', 'Inbound/SF', '05/05/2025', 11, 12, 1, 'Shreya'],
		['Grace', 'Inbound/SF', '05/05/2025', 12.5, 1, 0.5, 'Grace (start 12.30)'],
		['Alex', 'Inbound/SF', '05/05/2025', 4, 5, 1, 'Alex'],
		['Angeline', 'Salesforce only', '05/05/2025', 9, 10, 1, 'Angeline'],
		['Shreya', 'Salesforce only', '05/05/2025', 10, 11, 1, 'Shreya'],
		['Akansha', 'Salesforce only', '05/05/2025', 12, 1, 1, 'Akansha'],
		['Joyce', 'Salesforce only', '05/05/2025', 1, 2, 1, 'Joyce'],
		['Grace', 'Salesforce only', '05/05/2025', 2, 3, 1, 'Grace'],
		['Grace', 'Salesforce only', '05/05/2025', 4, 4.5, 0.5, 'Grace (finish 4.30)'],
		['Alex', 'Salesforce only', '05/05/2025', 5, 6, 1, 'Alex'],
		['Aditya', 'Salesforce only', '05/05/2025', 6, 7, 1, 'Aditya'],
		['Joyce', 'Salesforce only', '05/05/2025', 12.5, 1, 0.5, 'Joyce (start 12.30)'],
		['Yoon', 'Outbound / Inbound', '05/05/2025', 12.5, 1, 0.5, 'Yoon (start 12.30)'],
		['Yoon', 'Outbound / Inbound', '05/05/2025', 1, 2, 1, 'Yoon'],
		['Yoon', 'Outbound / Inbound', '05/05/2025', 2, 3, 1, 'Yoon'],
		['Yoon', 'Outbound / Inbound', '05/05/2025', 3, 4, 1, 'Yoon'],
		['Yoon', 'Outbound / Inbound', '05/05/2025', 4, 4.5, 0.5, 'Yoon (finish 4.30)'],
		['Sienna', 'Outbound / Inbound', '05/05/2025', 5, 6, 1, 'Sienna'],
		['Sienna', 'Outbound / Inbound', '05/05/2025', 6, 7, 1, 'Sienna'],
		['Sienna', 'Outbound / Inbound', '05/05/2025', 4, 5, 1, 'Sienna']
	];

	const result = FRDET.extractRosterData(ROSTERTABLE, HEADER);

	test('Roster data should be extracted to the roster table', () => {
		expect(result).toStrictEqual(expectedResult);
	});
});

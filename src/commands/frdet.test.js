const FRDET = require('./frdet');

describe('extractName() takes a string value from the roster cell and returns the name', () => {
	const nameString = "John Doe ()";

	const extractedName = FRDET.extractName(nameString);
	
	test('Name extracted should be "John Doe"', () => {
		expect(extractedName).toBe('John Doe');
	});
});

describe('extractTime() takes a string value from a roster cell and returns the time string found in parenthesis', () => {
	const nameStrings = [
		'John Doe (until 9.30)',
		'John Doe (from 9.15 - until 9.45)',
		'John Doe (9.15-9.45)',
		'John Doe',
		'Selen K (from 11:30)',
		'John Doe (until 11.20)'
	];

	const extractedTimes = nameStrings.map(str => FRDET.extractTime(str));

	test('Time extracted from "John Doe (until 9.30)" is "until 9.30"', () => {
		expect(extractedTimes[0]).toBe('until 9.30');
	});

	test('Time extracted from "John Doe (from 9.15 - until 9.45)" is "from 9.15 - until 9.45"', () => {
		expect(extractedTimes[1]).toBe('from 9.15 - until 9.45');
	});

	test('Time extracted from "John Doe (9.15-9.45)" is "9.15-9.45"', () => {
		expect(extractedTimes[2]).toBe('9.15-9.45');
	});

	test('Time extracted from "John Doe" is Null', () => {
		expect(extractedTimes[3]).toBeNull();
	});

	test('Time extracted from "John Doe (from 11:30)" should be "from 11:30"', () => {
		expect(extractedTimes[4]).toBe('from 11:30');
	});

	test('Time extracted from "John Doe (until 11.20)" should be "until 11.20"', () => {
		expect(extractedTimes[5]).toBe('until 11.20');
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
	const cellValue = 'John Doe (lunch 12.30)';
	const expectedValue = '12.30';

	const result = FRDET.extractLunchTime(cellValue);

	test('result should be "12.30"', () => {
		expect(result).toBe(expectedValue);
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
						['Inbound/SF', 'Shreya', 'Angeline', 'Angeline', 'Angeline', 'Grace', '', 'Joyce', 'Joyce (finish 4.30)', 'Aditya', 'Alex']
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
		['Shreya', 'Inbound/SF', 'Mon 5th May', 9, 10, 1, 'Shreya', ''],
		['Angeline', 'Inbound/SF', 'Mon 5th May', 10, 11, 1, 'Angeline', ''],
		['Angeline', 'Inbound/SF', 'Mon 5th May', 11, 12, 1, 'Angeline', ''],
		['Angeline', 'Inbound/SF', 'Mon 5th May', 12, 1, 1, 'Angeline', ''],
		['Grace', 'Inbound/SF', 'Mon 5th May', 1, 2, 1, 'Grace', ''],
		['Joyce', 'Inbound/SF', 'Mon 5th May', 3, 4, 1, 'Joyce', ''],
		['Joyce', 'Inbound/SF', 'Mon 5th May', 4, 5, 1, 'Joyce (finish 4.30)', ''],
		['Aditya', 'Inbound/SF', 'Mon 5th May', 5, 6, 1, 'Aditya', ''],
		['Alex', 'Inbound/SF', 'Mon 5th May', 6, 7, 1, 'Alex', ''],
		['Akansha', 'Inbound/SF', 'Mon 5th May', 9, 10, 1, 'Akansha', ''],
		['Akansha', 'Inbound/SF', 'Mon 5th May', 10, 11, 1, 'Akansha', ''],
		['Akansha', 'Inbound/SF', 'Mon 5th May', 11, 12, 1, 'Akansha', ''],
		['Shreya', 'Inbound/SF', 'Mon 5th May', 12, 1, 1, 'Shreya', ''],
		['Joyce', 'Inbound/SF', 'Mon 5th May', 2, 3, 1, 'Joyce', ''],
		['Grace', 'Inbound/SF', 'Mon 5th May', 3, 4, 1, 'Grace', ''],
		['Aditya', 'Inbound/SF', 'Mon 5th May', 4, 5, 1, 'Aditya', ''],
		['Shreya', 'Inbound/SF', 'Mon 5th May', 11, 12, 1, 'Shreya', ''],
		['Grace', 'Inbound/SF', 'Mon 5th May', 12, 1, 1, 'Grace (start 12.30)', ''],
		['Alex', 'Inbound/SF', 'Mon 5th May', 4, 5, 1, 'Alex', ''],
		['Angeline', 'Salesforce only', 'Mon 5th May', 9, 10, 1, 'Angeline', ''],
		['Shreya', 'Salesforce only', 'Mon 5th May', 10, 11, 1, 'Shreya', ''],
		['Akansha', 'Salesforce only', 'Mon 5th May', 12, 1, 1, 'Akansha', ''],
		['Joyce', 'Salesforce only', 'Mon 5th May', 1, 2, 1, 'Joyce', ''],
		['Grace', 'Salesforce only', 'Mon 5th May', 2, 3, 1, 'Grace', ''],
		['Grace', 'Salesforce only', 'Mon 5th May', 4, 5, 1, 'Grace (finish 4.30)', ''],
		['Alex', 'Salesforce only', 'Mon 5th May', 5, 6, 1, 'Alex', ''],
		['Aditya', 'Salesforce only', 'Mon 5th May', 6, 7, 1, 'Aditya', ''],
		['Joyce', 'Salesforce only', 'Mon 5th May', 12, 1, 1, 'Joyce (start 12.30)', ''],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 12, 1, 1, 'Yoon (start 12.30)', ''],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 1, 2, 1, 'Yoon', ''],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 2, 3, 1, 'Yoon', ''],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 3, 4, 1, 'Yoon', ''],
		['Yoon', 'Outbound / Inbound', 'Mon 5th May', 4, 5, 1, 'Yoon (finish 4.30)', ''],
		['Sienna', 'Outbound / Inbound', 'Mon 5th May', 5, 6, 1, 'Sienna', ''],
		['Sienna', 'Outbound / Inbound', 'Mon 5th May', 6, 7, 1, 'Sienna', ''],
		['Sienna', 'Outbound / Inbound', 'Mon 5th May', 4, 5, 1, 'Sienna', '']
	];

	const result = FRDET.extractRosterData(ROSTERTABLE, HEADER);

	test('Roster data should be extracted to the roster table', () => {
		expect(result).toEqual(expectedResult);
	});
});

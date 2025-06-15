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

describe('isTimeRange() checks if the time string is a range', () => {
	const timeStrings = [
		'9.30',
		'9.30-10.30'
	];

	const isTimeRanges = timeStrings.map(str => FRDET.isTimeRange(str));

	test('String "9.30" is falsy', () => {
		expect(isTimeRanges[0]).toBeFalsy();
	});

	test('String "9.30-10.30" is truthy', () => {
		expect(isTimeRanges[1]).toBeTruthy();
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

	const result = FRDET.getTime(timeString, cellValue);
	
	test('getTime()2', () => {
		expect(result[0]).toBe(11.5);
		expect(result[1]).toBe(12);
	});
});

describe('extractTimeRanges() converts the timeRow to a Map of timeStrings', () => {
	const row = [
		'Service Points',
		'Details',
		'8-9',
		'9-10',
		'10-11',
		'11-12',
		'12-1',
		'1-2',
		'2-3',
		'3-4',
		'4-5',
		'5-6',
		'6-7'
	];

	const expectedMap = new Map([
		[2, '8.00-9.00'],
		[3, '9.00-10.00'],
		[4, '10.00-11.00'],
		[5, '11.00-12.00'],
		[6, '12.00-1.00'],
		[7, '1.00-2.00'],
		[8, '2.00-3.00'],
		[9, '3.00-4.00'],
		[10, '4.00-5.00'],
		[11, '5.00-6.00'],
		[12, '6.00-7.00']
	]);

	const timeRangeMap = FRDET.extractTimeRanges(row);

	test('timeRangeMap is length of 11', () => {
		expect(timeRangeMap.size).toBe(11);
	});

	test.skip('timeRangeMap keys are all integers', () => {
		expect(timeRangeMap.keys().every(key => typeof(key) === 'number')).toBeTruthy();
	});

	test('timeRangeMap is same as expectedMap', () => {
		expect(timeRangeMap).toEqual(expectedMap);
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

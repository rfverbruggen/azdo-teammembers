import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
import { join } from "path";


function setupCoverage()
{
	const NYC = require('nyc');
	const nyc = new NYC({
		cwd: join(__dirname, '..', '..', '..'),
		exclude: ['**/test/**', '.vscode-test/**'],
		reporter: ['text', 'lcov'],
		all: true,
		instrument: true,
		hookRequire: true,
		hookRunInContext: true,
		hookRunInThisContext: true,
	});

	nyc.reset();
	nyc.wrap();

	return nyc;
}

export async function run(): Promise<void>
{
	const nyc = setupCoverage();

	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname);

	const options = { cwd: __dirname };
	const files: string[] = glob.sync('**/*.test.js', options);

	// Add files to the test suite
	files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));


	try
	{
		await new Promise((resolve, reject) =>
		{
			// Run the mocha test
			mocha.run(failures =>
			{
				failures ? reject(new Error(`${failures} tests failed.`)) : resolve(undefined);
			});
		});
	} finally
	{
		nyc.writeCoverageFile();
		await nyc.report();
	}
}

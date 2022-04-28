import * as Mocha from 'mocha';
import * as glob from 'glob';
import { join } from 'path';

function setupCoverage()
{
	const NYC = require('nyc');
	const nyc = new NYC({
		cwd: join(__dirname, '..', '..', '..'),
		exclude: ['**/test/**', '.vscode-test/**'],
		reporter: ['text', 'html'],
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
	const nyc = process.env.COVERAGE ? setupCoverage() : null;

	const mochaOpts: Mocha.MochaOptions = {
		timeout: 10 * 1000,
		color: true,
		...JSON.parse(process.env.PWA_TEST_OPTIONS || '{}'),
	};

	const grep = mochaOpts.grep || (mochaOpts as Record<string, unknown>).g;
	if (grep)
	{
		mochaOpts.grep = new RegExp(String(grep), 'i');
	}

	// Paths are relative to Mocha
	const logTestReporter = '../../../out/src/test/reporters/logTestReporter';
	// const goldenTextReporter =
	//   '../../../out/src/test/reporters/goldenTextReporter';

	mochaOpts.reporter = 'mocha-multi-reporters';
	mochaOpts.reporterOptions = {
		// reporterEnabled: `${logTestReporter}, ${goldenTextReporter}`,
		// reporterEnabled: goldenTextReporter
		reporterEnabled: logTestReporter,
	};
	if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY)
	{
		mochaOpts.reporterOptions = {
			reporterEnabled: `${logTestReporter}, mocha-junit-reporter`,
			mochaJunitReporterReporterOptions: {
				testsuitesTitle: `tests ${process.platform}`,
				mochaFile: join(
					process.env.BUILD_ARTIFACTSTAGINGDIRECTORY,
					`test-results/TEST-${process.platform}-test-results.xml`,
				),
			},
		};
	}

	const runner = new Mocha(mochaOpts);

	const options = { cwd: __dirname };
	const files: string[] = glob.sync('**/*.test.js', options);

	for (const file of files)
	{
		runner.addFile(join(__dirname, file));
	}

	try
	{
		await new Promise((resolve, reject) =>
			runner.run((failures: any) =>
				failures ? reject(new Error(`${failures} tests failed`)) : resolve(undefined),
			),
		);
	} finally
	{
		if (nyc)
		{
			nyc.writeCoverageFile();
			await nyc.report();
		}
	}
}

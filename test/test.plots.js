//test all graph types for when a data type is not correct is given. e.g. string, int

describe('Indels per cycle graph tests', function () {
	it('should create a new graph', function () {
		expect(icChart(formatData(readFile('/demo/7843_2-1.bc')))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(icChart(formatData(readFile('/demo/78ss43_2-1.bc')))).to.be.null;
	});
});
describe('Insert sizes graph tests', function () {
	it('should create a new graph', function () {
		expect(isChart(formatData(readFile('/demo/7843_2-1.bc')))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(isChart(formatData(readFile('/demo/78ss43_2-1.bc')))).to.be.null;
	});
});
describe('GC Content graph tests', function () {
	it('should create a new graph', function () {
		expect(gcChart(formatData(readFile('/demo/7843_2-1.bc')))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(gcChart(formatData(readFile('/demo/78ss43_2-1.bc')))).to.be.null;
	});
});
describe('ACGT content per cycle graph tests', function () {
	it('should create a new graph', function () {
		expect(gccChart(formatData(readFile('/demo/7843_2-1.bc')))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(gccChart(formatData(readFile('')))).to.be.null;
	});
});
describe('Indel distribution per cycle graph tests', function () {
	it('should create a new graph', function () {
		expect(indelDist(formatData(readFile('/demo/7843_2-1.bc')))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(indelDist(formatData(readFile('     fgafg   ')))).to.be.null;
	});
});
describe('GC-Depth graph tests', function () {
	it('should create a new graph', function () {
		expect(gcDepth(formatData(readFile('/demo/7843_2-1.bc')))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(gcDepth(formatData(readFile('     fgafg   ')))).to.be.null;
	});
});
describe('Coverage distribution graph tests', function () {
	it('should create a new graph', function () {
		expect(coverage(formatData(readFile('/demo/7843_2-1.bc')))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(coverage(formatData(readFile('     fgafg   ')))).to.be.null;
	});
});
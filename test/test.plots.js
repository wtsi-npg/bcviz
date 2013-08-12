var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
describe('Indels per cycle graph tests', function () {
	it('should create a new graph', function () {
		expect(icChart(formatData(readFile("demo/sample_1.bc")))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(icChart(formatData(readFile('1.bc')))).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(icChart(12 + 394 / 45)).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(icChart('12 + 394 / 45')).to.be.null;
	});
});
describe('Insert sizes graph tests', function () {
	it('should create a new graph', function () {
		expect(isChart(formatData(readFile("demo/sample_1.bc")))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(isChart(formatData(readFile('1.bc')))).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(isChart(12 + 394 / 45)).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(isChart('12 + 394 / 45')).to.be.null;
	});
});
describe('GC Content graph tests', function () {
	it('should create a new graph', function () {
		expect(gcChart(formatData(readFile("demo/sample_1.bc")))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(gcChart(formatData(readFile('1.bc')))).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(gcChart(12 + 394 / 45)).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(gcChart('12 + 394 / 45')).to.be.null;
	});
});
describe('ACGT content per cycle graph tests', function () {
	it('should create a new graph', function () {
		expect(gccChart(formatData(readFile("demo/sample_1.bc")))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(gccChart(formatData(readFile('')))).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(gccChart(12 + 394 / 45)).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(gccChart('12 + 394 / 45')).to.be.null;
	});
});
describe('Indel distribution per cycle graph tests', function () {
	it('should create a new graph', function () {
		expect(indelDist(formatData(readFile("demo/sample_1.bc")))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(indelDist(formatData(readFile('     fgafg   ')))).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(indelDist(12 + 394 / 45)).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(indelDist('12 + 394 / 45')).to.be.null;
	});
});
describe('GC-Depth graph tests', function () {
	it('should create a new graph', function () {
		expect(gcDepth(formatData(readFile("demo/sample_1.bc")))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(gcDepth(formatData(readFile('     fgafg   ')))).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(gcDepth(12 + 394 / 45)).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(gcDepth('12 + 394 / 45')).to.be.null;
	});
});
describe('Coverage distribution graph tests', function () {
	it('should create a new graph', function () {
		expect(coverage(formatData(readFile("demo/sample_1.bc")))).to.be.an('object');
	});
	it('should not create a new graph and return null', function () {
		expect(coverage(formatData(readFile('     fgafg   ')))).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(coverage(12 + 394 / 45)).to.be.null;
	});
	it('should not create a new graph and return null', function () {
		expect(coverage('12 + 394 / 45')).to.be.null;
	});
});
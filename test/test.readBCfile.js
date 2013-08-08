var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
describe('readFile() returns correct data types',function () {
	it('data should exist',function () {
		expect(readFile("/demo/sample_1.bc")).to.exist;
	});
	it('data should not exist',function () {
		expect(readFile("fgaddfagafhdhjtjt")).to.not.exist;
	});
});
describe('formatData() returns correct data types',function () {
	it('should return an array',function () {
		formatData(readFile("/demo/sample_1.bc")).length.should.equal(10);
	});
	it('should return null',function () {
		expect(formatData(90)).to.not.exist;
	});
	it('should return null',function () {
		expect(formatData(readFile("   "))).to.not.exist;
	});
});
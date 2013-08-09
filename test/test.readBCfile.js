var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
describe('readFile() returns correct data types',function () {
	//This test runs in browser but fails when run in terminal.
	it('data should exist',function (done) {
		expect(readFile("demo/sample_1.bc")).to.exist;
		done();
	});
	it('data should not exist',function () {
		expect(readFile("fgaddfagafhdhjtjt")).to.not.exist;
	});
});
describe('formatData() returns correct data types',function () {
	it('should return an array',function (done) {
		formatData(readFile("demo/sample_1.bc")).length.should.equal(10);
		done();
	});
	it('should return null',function () {
		expect(formatData(90)).to.not.exist;
	});
	it('should return null',function () {
		expect(formatData(readFile("   "))).to.not.exist;
	});
});
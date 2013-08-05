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
		formatData(readFile("/demo/sample_1.bc")).length.should.equal(9);
	});
	it('should return null',function () {
		expect(formatData(readFile("   "))).to.not.exist;
	});
});
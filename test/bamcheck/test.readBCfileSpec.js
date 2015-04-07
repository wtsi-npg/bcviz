define(['chai', '../js/src/readBCfile.js'], function ( chai, read) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;
	describe('readBCfile returns correct data types',function () {
		it('should return an array',function () {
			read("demo/sample_1.bc").length.should.equal(10);
		});
		it('should return null',function () {
			expect(read(90)).to.not.exist;
		});
		it('should return null',function () {
			expect(read("   ")).to.not.exist;
		});
	});
});
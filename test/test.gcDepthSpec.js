define(['chai', '../js/src/GCDepth.js', '../js/src/readBCfile.js'], function (chai, gcd, read) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;
	describe('GC-Depth graph tests', function () {
		it('should create a new graph', function () {
			expect(gcd(read("demo/sample_1.bc"))).to.be.an('object');
		});
		it('should not create a new graph and return null', function () {
			expect(gcd(read('     fgafg   '))).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(gcd(12 + 394 / 45)).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(gcd('12 + 394 / 45')).to.be.null;
		});
	});
});
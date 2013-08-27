define(['chai', '../js/src/qualityChart.js', '../js/src/readBCfile.js'], function (chai, q, read) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;
	describe('quality chart distribution graph tests', function () {
		it('should create a new graph', function () {
			expect(q(read("demo/sample_1.bc"))).to.be.an('object');
		});
		it('should not create a new graph and return null', function () {
			expect(q(read('     fgafg   '))).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(q(12 + 394 / 45)).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(q('12 + 394 / 45')).to.be.null;
		});
	});
});
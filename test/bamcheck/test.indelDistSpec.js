define(['chai', '../js/src/indelDist.js', '../js/src/readBCfile.js'], function (chai, id, read) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;
	describe('Indel distribution per cycle graph tests', function () {
		it('should create a new graph', function () {
			expect(id(read("demo/sample_1.bc"))).to.be.an('object');
		});
		it('should not create a new graph and return null', function () {
			expect(id(read('     fgafg   '))).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(id(12 + 394 / 45)).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(id('12 + 394 / 45')).to.be.null;
		});
	});
});
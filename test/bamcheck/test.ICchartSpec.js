define(['chai', '../js/src/ICcharts.js', '../js/src/readBCfile.js'], function (chai, ic, read) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;
	describe('Indels per cycle graph tests', function () {
		it('should create a new graph', function () {
			expect(ic(read("demo/sample_1.bc"))).to.be.an('object');
		});
		it('should not create a new graph and return null', function () {
			expect(ic(read('1.bc'))).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(ic(12 + 394 / 45)).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(ic('12 + 394 / 45')).to.be.null;
		});
	});
});
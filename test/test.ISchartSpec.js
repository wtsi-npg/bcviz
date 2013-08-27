define(['chai', '../js/src/ISchart.js', '../js/src/readBCfile.js'], function (chai, is, read) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;
	describe('Insert size graph tests', function () {
		it('should create a new graph', function () {
			expect(is(read("demo/sample_1.bc"))).to.be.an('object');
		});
		it('should not create a new graph and return null', function () {
			expect(is(read('1.bc'))).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(is(12 + 394 / 45)).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(is('12 + 394 / 45')).to.be.null;
		});
	});
});
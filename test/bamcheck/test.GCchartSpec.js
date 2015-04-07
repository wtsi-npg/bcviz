define(['chai', '../js/src/gcChart.js', '../js/src/readBCfile.js'], function (chai, gc, read) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;
	describe('GC Content graph tests', function () {
		it('should create a new graph', function () {
			expect(gc(read("demo/sample_1.bc"))).to.be.an('object');
		});
		it('should not create a new graph and return null', function () {
			expect(gc(read('1.bc'))).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(gc(12 + 394 / 45)).to.be.null;
		});
		it('should not create a new graph and return null', function () {
			expect(gc('12 + 394 / 45')).to.be.null;
		});
	});
});
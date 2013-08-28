define(['chai', '../js/src/qualityChart.js', '../js/src/readBCfile.js'], function (chai, q, read) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;
	describe('quality chart distribution graph tests', function () {
		var bcFile = read("demo/sample_1.bc")
		var aGraph = q(bcFile);
		it('should create a new graph from bamcheck file', function () {
			expect(aGraph).to.be.an('object');
		});
		it('should return the resize function', function () {
			expect(aGraph.resize).to.be.a('function');
		});
		it('height should be the size given after resize', function () {
			aGraph.resize(300, 400);
			aGraph.height.should.equal(300);
		});
		it('width should be the size given after resize', function () {
			aGraph.resize(300, 400);
			aGraph.width.should.equal(400);
		});
		it('should not create a new graph and return null because file doesn\'t exist', function () {
			expect(q(read('     fgafg   '))).to.be.null;
		});
		it('should not create a new graph and return null because it is given an int', function () {
			expect(q(12 + 394 / 45)).to.be.null;
		});
		it('should not create a new graph and return null because it is given a string', function () {
			expect(q('12 + 394 / 45')).to.be.null;
		});
	});
});
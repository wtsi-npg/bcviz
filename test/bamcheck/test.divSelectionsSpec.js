define(['chai', '../js/src/divSelections.js', 'd3'], function ( chai, checkDivSelection, d3) {
	var assert = chai.assert;
	var should = chai.should();
	var expect = chai.expect;

	d3.select('body').append('div').attr('id', 'aDiv').attr('class', 'aClass');

	describe('checkDivSelection returns correct data types', function () {
		it('should return ID that was entered', function () {
			expect(checkDivSelection('#aDiv')).to.equal('#aDiv');
		});
		it('should return class that was entered', function () {
			expect(checkDivSelection('.aClass')).to.equal('.aClass');
		});
		it("should return 'body' for an id that doesn't exist", function () {
			expect(checkDivSelection('#nothing')).to.equal('body');
		});
		it("should return 'body' for a class that doesn't exist", function () {
			expect(checkDivSelection('.nothing')).to.equal('body');
		});
		it("should return 'body' for string that doesn't exist", function () {
			expect(checkDivSelection('adib')).to.equal('body');
		});
		it('should return "body" for empty number', function () {
			expect(checkDivSelection('351')).to.equal('body');
		});
		it('should return "body" for empty string', function () {
			expect(checkDivSelection('')).to.equal('body');
		});
		it('should return "body" for white space', function () {
			expect(checkDivSelection('  ')).to.equal('body');
		});
		it('should return "body" for white space followed by a string', function () {
			expect(checkDivSelection(' asdf')).to.equal('body');
		});
	});
});
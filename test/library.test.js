/* jshint node: true, mocha: true */
var expect = require('chai').expect;
var Library = require('..');
var levelup = require('levelup');
var concat = require('concat-stream');
var memdown = require('memdown');

var obj = {encoding:'object'};

describe('Library', function() {
  beforeEach(function() {
    this.lib = new Library(levelup({db: memdown}));
  });

  it('exports a function', function() {
    expect(Library).to.be.a('function');
  });

  it('stores and reproduces forms', function(done) {
    var lib = this.lib;
    var form = {content: ['A test form']};
    lib.createFormsWriteStream().end(form, function() {
      lib._forms.createReadStream().pipe(concat(obj, function(data) {
        expect(data).to.eql([form]);
        done();
      }));
      // lib.createFormsReadStream().pipe(concat(obj, function(data) {
      //   expect(data).to.be.an('array');
      //   expect(data.length).to.equal(1);
      //   expect(data[0].form).to.eql(form);
      //   done();
      // }));
    });
  });

  it('stores and reproduces used terms', function(done) {
    var lib = this.lib;
    var term = 'Indemnification';
    var form = {content:[{use: term}]};
    lib.createFormsWriteStream().end(form, function() {
      lib.createTermsReadStream().pipe(concat(obj, function(data) {
        expect(data).to.eql([term]);
        done();
      }));
    });
  });

  it('stores and reproduces defined terms', function(done) {
    var lib = this.lib;
    var term = 'Indemnification';
    var form = {content:[{definition: term}]};
    lib.createFormsWriteStream().end(form, function() {
      lib.createTermsReadStream().pipe(concat(obj, function(data) {
        expect(data).to.eql([term]);
        done();
      }));
    });
  });

  it('stores and reproduces referenced headings', function(done) {
    var lib = this.lib;
    var heading = 'Intellectual Property';
    var form = {content:[{reference: heading}]};
    lib.createFormsWriteStream().end(form, function() {
      lib.createHeadingsReadStream().pipe(concat(obj, function(data) {
        expect(data).to.eql([heading]);
        done();
      }));
    });
  });

  it('stores and reproduces inserted blanks', function(done) {
    var lib = this.lib;
    var blank = 'Company Name';
    var form = {content:[{blank: blank}]};
    lib.createFormsWriteStream().end(form, function() {
      lib.createBlanksReadStream().pipe(concat(obj, function(data) {
        expect(data).to.eql([blank]);
        done();
      }));
    });
  });
});
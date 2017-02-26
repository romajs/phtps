const assert = require('assert');
const request = require('request');
const sinon = require('sinon');
const stream = require('stream');
 
const phtps = require('../lib/phtps.js');
const proxy = require('../lib/proxy.js');
 
describe('phtps', function() {

	var config = {
		"hostname" : "127.0.0.1",
        "port" : 8666,
        "logLevel" : "debug",
        "globalOptions" : {
            "numberOfWorkers": 1,
            "strategy": "phantom-server",
        },
        "localOptions" : {
            "waitForJS" : false,
        }
	}

	var url = 'http://127.0.0.1:8666?url=http://www.foo-bar.com';

	beforeEach(function() {
		console.info('proxy.phantom_html_to_pdf.kill:', proxy.phantom_html_to_pdf.kill)
		this.phantom_html_to_pdf = sinon.stub(proxy, 'phantom_html_to_pdf');
	});
 
	afterEach(function() {
		proxy.phantom_html_to_pdf.restore();
	});
 
	it('start, request, stop -> ok', function(done) {

		var pdf = {
			stream : new stream.PassThrough(),
		};

		pdf.stream.statusCode = 200;
		pdf.stream.write('test pdf stream pass throught');
		pdf.stream.end();

		this.phantom_html_to_pdf.returns(function(url, callback) {
			callback && callback(undefined, pdf);
		});

		var instance = new phtps(config);

		assert.notEqual(null, instance);
		
		instance.start(function() {

			request(url, function(error, response, body) {

				assert.equal(200, response.statusCode);
				assert.equal('test pdf stream pass throught', body);

				instance.stop();
				done();
			});

		});

	});
 
	it('start, request, stop -> fail', function(done) {

		var conversion = function(url, callback) {
			callback && callback('strange error happened', undefined);
		};

		conversion.kill = function() {
		};

		this.phantom_html_to_pdf.returns(conversion);

		var instance = new phtps(config);

		assert.notEqual(null, instance);
		
		instance.start(function() {

			request(url, function(error, response, body) {

				assert.equal(500, response.statusCode);
				assert.equal('', body);

				instance.stop();
				done();
			});

		});

	});

})

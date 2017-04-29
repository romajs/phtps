const extend = require('extend');
const http = require('http');
const url = require("url");
const winston = require("winston");

const proxy = require("./proxy.js");

module.exports = Phtps;

function Phtps(config) {

    const DEFAULT_CONFIG = {
        "hostname" : "127.0.0.1",
        "port" : 8686,
        "logLevel" : "info",
        "globalOptions" : {
            "numberOfWorkers": 1,
            "strategy": "phantom-server",
        },
        "localOptions" : {
            "waitForJS" : false,
        }
    };

    config = extend(DEFAULT_CONFIG, config);

    var server = undefined;
    var logger = undefined;

    this.start = function(callback) {

        logger = new (winston.Logger)({
            level: config.logLevel,
            transports: [
              new (winston.transports.Console)({'timestamp':true})
            ]
        });

        logger.info('Config:', config);

        server = http.createServer(handleRequest);

        server.listen(config.port, config.hostname, function() {
            logger.info("Server listening on: http://%s:%s", config.hostname, config.port);
            callback && callback();
        });
    }

    this.stop = function() {
        server.close();
        delete server;
        delete logger;
    }

    var handleRequest = function(request, response) {

        logger.debug('Raw url:', request.url);

        var parsedUrl = url.parse(request.url, true);
        var params = parsedUrl.query;
        
        logger.debug('Params:', params);

        var filename = 'phtps_' + new Date().getTime() + '.pdf';
        
        response.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        response.setHeader('Content-type', 'application/pdf');

        logger.info('Converting to \"%s\" ...', filename);

        var conversion = proxy.phantom_html_to_pdf(config.globalOptions);

        conversion(extend({ url : params.url }, config.localOptions), function(err, pdf) {

            if(err) {
                return handleError(conversion, response, 500, err);
            }

            logger.silly('Conversion logs of \"%s\":', filename, pdf.logs);

            pdf.stream.pipe(response);

            logger.info('Conversion of \"%s\" is completed.', filename);
        });

    }

    var handleError = function(conversion, response, statusCode, message) {
        logger.error('Error: ', statusCode, message);
        conversion.kill();
        response.writeHead(statusCode, message);
        response.end();
    }

}

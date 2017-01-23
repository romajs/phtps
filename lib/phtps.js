const extend = require('extend');
const http = require('http');
const phantom_html_to_pdf = require("phantom-html-to-pdf");
const url = require("url");
const winston = require("winston");

module.exports = Phtps;

function Phtps() {

    const DEFAULT_CONFIG = {
        "hostname" : "127.0.0.1",
        "port" : 8686,
        "timeout": 60000, // ms
        "logLevel" : "info"
    };

    var server = undefined;
    var logger = undefined;

    this.start = function(config) {

        config = extend(true, DEFAULT_CONFIG, config);

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

        var conversion = phantom_html_to_pdf({
            numberOfWorkers: 2,
            strategy: "dedicated-process",
            timeout: config.timeout,
        });

        var conversionConfig = {
            url : params.url,
            waitForJS : true, // PHANTOM_HTML_TO_PDF_READY
        };

        conversion(conversionConfig, function(err, pdf) {

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

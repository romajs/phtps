# phtps

[![npm](https://img.shields.io/npm/v/phtps.svg)]()

Sample node http server for pdf generation with **phantom-html-to-pdf**

For more infomation please see: [https://www.npmjs.com/package/phantom-html-to-pdf]()

### Install

`npm install phtps`

### Usage

`phtps [path/to/config/file]`

### Configuration:

Config file as JSON

Default:

```js
{
    "hostname" : "127.0.0.1",
    "port" : 8686,
    "logLevel" : "info",
    "globalOptions" : {
        "numberOfWorkers": 1,
        "strategy": "phantom-server"
    },
    "localOptions" : {
        "waitForJS" : false
    }
}
```

Example (./example/example.config):

```js
{
    "hostname" : "0.0.0.0",
    "port" : 8686,
    "logLevel" : "debug",
    "globalOptions" : {
        "numberOfWorkers": 2,
        "strategy": "dedicated-process",
        "timeout": 60000
    },
    "localOptions" : {
        "waitForJS" : true // var PHANTOM_HTML_TO_PDF_READY must be set
    }
}
```

* `hostname`, `port` and `logLevel` are for **http server**
* `globalOptions` and `localOptions` are for **phantom-html-to-pdf**

Global Options: https://www.npmjs.com/package/phantom-html-to-pdf#global-options

Local Options: https://www.npmjs.com/package/phantom-html-to-pdf#local-options
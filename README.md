# phtps

[![npm](https://img.shields.io/npm/v/phtps.svg)](https://www.npmjs.com/package/phtps)
[![CircleCI](https://img.shields.io/circleci/project/github/romajs/phtps.svg)](https://circleci.com/gh/romajs/phtps)
[![Codecov](https://img.shields.io/codecov/c/github/romajs/phtps.svg)](https://codecov.io/gh/romajs/phtps)
[![dependencies](https://david-dm.org/romajs/phtps.svg)](https://david-dm.org/romajs/phtps)
[![devDependencies](https://david-dm.org/romajs/phtps/dev-status.svg)](https://david-dm.org/romajs/phtps?type=dev)

[![NPM](https://nodei.co/npm/phtps.png?downloads=true)](https://nodei.co/npm/phtps/)


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

### Development

Install: `npm install`  
Test: `npm test`  
Code coverage: `npm run coverage`  
Codecov: `npm run codecov`    
Start: `npm start -- example/example.config`  
Link: `npm link`  

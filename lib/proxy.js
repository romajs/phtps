const phantom_html_to_pdf = require("phantom-html-to-pdf");

console.info('phantom_html_to_pdf.kill:', phantom_html_to_pdf().kill);

module.exports.phantom_html_to_pdf = phantom_html_to_pdf;
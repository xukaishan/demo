
var webp = require('webp-converter');
const path = require('path');

const filePath = path.join(__dirname, '/', '/public/javascripts/');
webp.dwebp(`${filePath}1.webp`, "output.png", "-o", function (status, error) {
    console.log(status, error);
});
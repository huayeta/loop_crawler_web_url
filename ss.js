const fs = require('fs');
const path = require('path');

const ss = fs.readFileSync(path.resolve(__dirname,'./c.txt'),{
    flag:'r'
});
console.log(ss.toString().trim().length)
console.log(Array.from(ss.toString().trim()).length)

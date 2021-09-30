//remember to add package you use to package json
var path = require('path');

const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const filedir = "data"
const  filename =  "Spa_Team_s_Questions-Oggy.csv"
const filepath = path.join(filedir, filename);



fs.createReadStream(filepath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
     //console.log(results[0]git["Question"]);
     //console.log(results[0]["Answer"]);
     
     console.log((results))
    

    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });
/*
date.toDateString() // "sun nov 29 2020 "
date.toUTCString()  // "sun nov 29 2020 20:14:56 GMT-0600 (CST)"
date.getMonth()     // 11
date.getDate()      // 29
date.getFullYear()  // 2020
*/


module.exports = 
    async function GetDate(timestamp){
        const date = timestamp;
        const result = date.toDateString().split(" ");

        const day = result[0];
        const month = result[1];
        const numericDate = result[2];
        const year = result[3];

        const customDate = month+" "+numericDate+" , "+ year; 


        return customDate;
   
   
};
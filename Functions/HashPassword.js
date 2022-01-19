const bcrypt = require('bcryptjs');
const saltRounds = Number(process.env.SALT_ROUNDS);

module.exports = 
    async function HashPassword(password){
    
        //Asynchronous salt generation
        const salt = await bcrypt.genSalt(saltRounds);

        //Synchronous hashing
        const hash = bcrypt.hashSync(password, salt);
        return hash;
   
   
  };

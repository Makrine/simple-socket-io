// #region database connection
const { Client } = require('pg')

function dbConnection() {
    const client = new Client({
        user: process.env.USER,
        host: process.env.HOSTNAME,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: 5432,
      })
 
      client.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
          connected = true;
      
      });

      return client;
}



function getValues(client) {
  client.query('SELECT * FROM public."Users"', (err, result) => {
    if (err) throw err;

    // Process the result
    console.log(result.rows);

    // Close the connection
    client.end();
  });
}

function addUser(client, username) {
    client.query(`INSERT INTO public.users(username) VALUES('${username}')`, (err, result) => {
        if (err) throw err;
    
        // Process the result
        console.log(result.rows);
    
        // Close the connection
        client.end();
      });
}

module.exports = {
    dbConnection,
    getValues,
    addUser
}


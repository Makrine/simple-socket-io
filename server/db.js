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


function createRoom(client, callback) {
  // generate random room id with nums and letters. size should be 5
  let roomId = Math.random().toString(36).substring(2, 7);

    client.query(`INSERT INTO public.rooms(room_id, user_num) VALUES('${roomId}', 1)`, (err, result) => {
        if (err) throw err;
    
        // Process the result
        console.log(result.rows);
        callback(roomId);
        // Close the connection
        //client.end();
      });
}

function updateRoom(client, roomId, connected, callback) {

  // check if num_users is already 2
  client.query(`SELECT user_num FROM public.rooms WHERE room_id = '${roomId}'`, (err, result) => {
    if (err) throw err;

    // Process the result
    console.log(result.rows);

    // if doesnt exist, then return false
    if (result.rows.length == 0) {
      console.log("room doesnt exist");
      callback(false);
      // Close the connection
      //client.end();
    }

    // find out if user_num is already 2
    else if (result.rows[0].user_num == 2) {
      console.log("room is full");
      callback(false);
      // Close the connection
      //client.end();
    }

    else {
      client.query(`UPDATE public.rooms SET user_num = user_num + 1 WHERE room_id = '${roomId}'`, (err, result) => {
        if (err) 
        {
          console.log("err: " + err);
          throw err;
        }
    
        // Process the result
        console.log(`Room: ${roomId} user connected` + result.rows);
        callback(true);
        // Close the connection
        //client.end();
      });
    }
    
  });
}


module.exports = {
    dbConnection,
    createRoom,
    updateRoom
}


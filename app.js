const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
// const https = require('https');
// const fs = require('fs');
const cors = require('cors');
const compression = require('compression');

require('dotenv').config();

const app = express();

// app.use(compression());

const obj = {
    result: "ceva"
}

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    // port: 3105,
    driver: "msnodesqlv8",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        //encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
        trustedConnection: true
    }
}

// app.use(cors());

app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

app.get('/', function (req, res) {
    var request = new sql.Request();  
    request
      .query('select * from facultati', function(
        err,
        recordset,
      ) {
      if (err) {
        return console.error(err);
      }
      res.send(recordset);
    });
});

sql.connect(sqlConfig, (err, pool) => {
    if (err) {
      return console.error(err);
    }
    console.log('DB connection established - starting web server');
    const server = app.listen(process.env.SERVER_PORT, function() {
      console.log('Web server is running.....');
    });
    server.on('close', sql.close.bind(sql));
  });
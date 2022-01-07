const { Pool, Client } = require('pg');

const pool = new Pool({
    max: 50,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
});


pool.query("select now();",async (err, res) => {
    
    if(err){
        console.log(err);
    }
    if(res){
        console.log("PostgresSQL connected sucesfully");
    }
    
});

const shouldAbort = (err,done) => {
    if (err) {
        console.error('Error in transaction', err.stack)
        client.query('ROLLBACK', err => {
            if (err) {
              console.error('Error rolling back client', err.stack)
            }
            done()
        })
    }
    return !!err
}

module.exports = {pool,shouldAbort};
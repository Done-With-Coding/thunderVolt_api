const { pool, shouldAbort } = require("../conn");

class Station{
    constructor(lat, long){
        this.lat = lat;
        this.long = long;
    }

    addStation(name, address, types){
        return new Promise((resolve, reject) => {

            const searchQuery = 'INSERT INTO public.charging_station (name, address, latitude, longitude, geog, type0, type1, type2, type3, type4) VALUES ($1, $2, CAST($3 AS numeric), CAST($4 AS numeric), ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6, $7, $8, $9)';

             pool
                .connect()
                .then(conn => {
                  conn
                    .query(searchQuery, [name, address, this.lat, this.long, types[0], types[1], types[2], types[3], types[4]])
                    .then(result => {
                      conn.release()
                      resolve(result)
                    })
                    .catch(error => {
                      conn.release()
                      reject(error)
                    })
                })
                .catch(error => {
                  conn.release()
                  reject(error)
                })
        });
    }

    findNearestStation(radius){
      return new Promise((resolve, reject) => {

          const searchQuery = 'SELECT * FROM public.charging_station WHERE ST_DWithin(geog, ST_MakePoint($1,$2)::geography, $3)';

           pool
              .connect()
              .then(conn => {
                conn
                  .query(searchQuery, [this.long, this.lat, radius])
                  .then(result => {
                    conn.release()
                    resolve(result)
                  })
                  .catch(error => {
                    conn.release()
                    reject(error)
                  })
              })
              .catch(error => {
                conn.release()
                reject(error)
              })
      });

  }


  getStationName(station_id){
    return new Promise((resolve, reject) => {

      const searchQuery = 'SELECT name FROM public.charging_station WHERE id=$1';

       pool
          .connect()
          .then(conn => {
            conn
              .query(searchQuery, [station_id])
              .then(result => {
                conn.release()
                resolve(result)
              })
              .catch(error => {
                conn.release()
                reject(error)
              })
          })
          .catch(error => {
            conn.release()
            reject(error)
          })
    });
  }

    
    
}

module.exports = Station;



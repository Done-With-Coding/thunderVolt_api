const { pool, shouldAbort } = require("../conn");

class Booking{
    constructor(station_id, mobile_no){
        this.station_id = station_id;
        this.mobile_no = mobile_no;
    }

    addBooking(slot, b_date, charger_type){
        return new Promise((resolve, reject) => {

            const searchQuery = 'INSERT INTO public.bookings(station_id, slot, b_date, charger_type, mobile_no)'+
                                    'VALUES ($1, $2, $3, $4, $5) returning *;';

             pool
                .connect()
                .then(conn => {
                  conn
                    .query(searchQuery, [this.station_id, slot, b_date, charger_type, this.mobile_no])
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

    getBookedSlots(station_id, b_date){
        return new Promise((resolve, reject) => {

            const searchQuery = 'SELECT * FROM public.bookings WHERE station_id = $1 AND b_date = $2 order by slot asc;';

             pool
                .connect()
                .then(conn => {
                  conn
                    .query(searchQuery, [station_id, b_date])
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

    getBookingHistory(mobile_no){

        console.log(mobile_no);
        return new Promise((resolve, reject) => {

            const searchQuery = 'SELECT * FROM public.bookings WHERE mobile_no = CAST($1 AS numeric) order by b_date desc, slot desc;';

             pool
                .connect()
                .then(conn => {
                  conn
                    .query(searchQuery, [mobile_no])
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

module.exports = Booking;



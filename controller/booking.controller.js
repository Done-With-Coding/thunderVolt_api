const Booking = require("./../db/models/booking.model");
const Station = require("./../db/models/station.model");

async function addBooking(req,res){
    let {station_id, slot, b_date, charger_type, mobile_no} = req.body;

    try{
        const booking = new Booking(station_id, mobile_no);
        booking.addBooking(slot, b_date, charger_type)
            .then(result => {
                res.status(200).json(result);
            });
        
    }  
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

async function getBookedSlots(req,res){
    let {station_id, b_date} = req.body;

    try{
        const booking = new Booking(station_id, b_date);
        booking.getBookedSlots(station_id, b_date)
            .then(result => {
                res.status(200).json(result);
            });
        
    }  
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

async function getBookingHistory(req,res){
    let {mobile_no} = req.body;

    try{
        const booking = new Booking();
        booking.getBookingHistory(mobile_no)
            .then(async result => {
                let obj = result;
                let station = new Station();

                for(let i=0; i<obj.rows.length; i++){
                    await station.getStationName(obj.rows[i].station_id)
                        .then(result1 => {
                            obj.rows[i]['station_name'] = result1.rows[0].name;
                            obj.rows[i]['address'] = result1.rows[0].address
                            obj.rows[i]['latitude'] = result1.rows[0].latitude;
                            obj.rows[i]['longitude'] = result1.rows[0].longitude;
                            // console.log(result1);
                        });
                }


                let cur_date = new Date();
                let pastBooking = obj.rows.filter(i=> new Date(i.b_date).getDate() < cur_date.getDate());
                let booking =  obj.rows.filter(i=> new Date(i.b_date).getDate() >= cur_date.getDate());
                res.status(200).json({pastBooking, booking});
            });
        
    }  
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

module.exports = {addBooking, getBookedSlots, getBookingHistory};
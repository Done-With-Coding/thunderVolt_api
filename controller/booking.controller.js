const Booking = require("./../db/models/booking.model");

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
            .then(result => {
                let cur_date = new Date();
                let pastBooking = result.rows.filter(i=> new Date(i.b_date).getDate() < cur_date.getDate());
                let booking =  result.rows.filter(i=> new Date(i.b_date).getDate() >= cur_date.getDate());
                res.status(200).json({pastBooking, booking});
            });
        
    }  
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

module.exports = {addBooking, getBookedSlots, getBookingHistory};
const router = require('express').Router();

const {addBooking, getBookedSlots, getBookingHistory} = require('../controller/booking.controller');

router.post('/addBooking', addBooking);
router.post('/getBookedSlots', getBookedSlots);
router.post('/getBookingHistory', getBookingHistory);

module.exports = router;

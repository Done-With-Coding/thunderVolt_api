const router = require('express').Router();

const {addStation, findNearbyStation} = require('../controller/station.controller');


router.post('/findNearbyStation', findNearbyStation);
router.post('/addStation', addStation);

module.exports = router;
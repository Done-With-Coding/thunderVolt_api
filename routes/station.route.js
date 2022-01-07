const router = require('express').Router();

const {addStation} = require('../controller/station.controller');

router.post('/addStation', addStation);

module.exports = router;
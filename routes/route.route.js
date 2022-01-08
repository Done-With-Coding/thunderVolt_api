const router = require('express').Router();
const {getRoute, planAdjacencyList, } = require('../controller/route.controller');


router.post('/getRoute', getRoute);
router.post('/planAdjacencyList', planAdjacencyList);


module.exports = router;
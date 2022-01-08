const router = require('express').Router();
const {getRoute, planRoute, planAdjacencyList, getShortestPath} = require('../controller/route.controller');


router.post('/getRoute', getRoute);
router.post('/planRoute', planRoute);
router.post('/planAdjacencyList', planAdjacencyList);
router.post('/getShortestPath', getShortestPath);


module.exports = router;
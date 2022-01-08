const getRouteAzure = require('../api/getRoute.azure');
const getAdjacencyList = require('../service/getAdjacencyList.service');
const getRouteMatrix = require('./../api/getRouteMatrix.azure.js');
const postRouteMatrix = require('./../api/postRouteMatrix.azure.js');
const dijsktra = require("./../service/shortestPath.service");
const Station = require('../db/models/station.model');  


async function getRoute(req, res){
    try{
        let {origin, destination, departAt, wayPoints} = req.body;
    

        if(typeof(wayPoints) === 'undefined'){
            wayPoints = [];
        }
        else{
            wayPoints = JSON.parse(wayPoints);
            
        }

        for(let i = 0; i<wayPoints.length; i++){
            wayPoints[i] = wayPoints[i].reverse();
        }

    
        getRouteAzure(origin, destination, wayPoints, departAt )
            .then(result => {
                res.status(200).json(result);
            });
    }
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

async function planAdjacencyList(req,res){
    try{
        let {point, range} = req.body;

        point = JSON.parse(point);
        
        getAdjacencyList(point, range)
            .then(async(result) => {
                let res1 = {
                    matrixParts: result
                }
                
                let geoJSON = {
                    "type":"MultiPoint",
                    "coordinates": point
                };

                // res.status(200).json(res1);
                

                // get matrix directly from azure to check matrix is correct
                await postRouteMatrix(geoJSON, geoJSON)
                    .then(async(result) => {
                        await getRouteMatrix(result.headers.location)
                            .then(async(result) =>{
                                let matrix = result.matrix;

                                var promise1 = new Promise(async(resolve1, reject1) => {
                                
                                    for(let i=0; i<matrix.length; i++){
                                        matrix[i] = await  matrix[i].map((obj) =>  obj.response.routeSummary.lengthInMeters);
                                        matrix[i] = await  matrix[i].reduce((a, v, idx) => ({ ...a, [idx]: v}), {}) ;
                                    
                                        if(i == matrix.length -1){
                                            resolve1();
                                        }
                                    }
                                

                                });

                                promise1.then(async() => {
                                    matrix = await matrix.reduce((a, v, idx) => ({ ...a, [idx]: v}), {})
                                    res1[matrix] = matrix;
                                    res.status(200).json(res1);
                                });
                            
                            })

                    })
            })
        
    }
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

async function getShortestPath(req,res){
    try{
        let {point, range, adj} = req.body;

                
                let path = await dijsktra(adj, range);

                if(path.length == 0){
                    res.status(404).json({'error': 'Path not found'});
                    return;
                }

                console.log(point.length);

                let resultArray = path.map(i=>point[i]);

                res.status(200).json(resultArray);
                
            
        
    }
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

async function planRoute(req, res){

    try{
        let {origin, destination, departAt, range, beltRadius, pointRadius} = req.body;

        beltRadius = 5000;
        pointRadius = 15000;

        departAt = new Date(departAt);

        if(typeof(wayPoints) === 'undefined'){
            wayPoints = [];
        }
    
            getRouteAzure(origin, destination, wayPoints, departAt )
            .then(async (result) => {

                const azureRoute = result;

                const travel_dist = azureRoute.routes[0].summary.lengthInMeters;

                let points = await azureRoute.routes[0].legs[0].points.map(({longitude, latitude}) => ([longitude, latitude]));
            
                    let geoJsonLineString = {
                        "type": "LineString",
                        "coordinates": points
                    }
                    
                    let stations = new Station();
            
                    stations.findStationsBelt(geoJsonLineString, beltRadius)
                        .then(result => {
                            let chargingPoints = result.rows;


                            const safeRange = 0.85*range;

                            const divRatio = safeRange/travel_dist;

                            stations.findStationInterpolant(geoJsonLineString, divRatio, pointRadius)
                                .then(result => {
                                    let interpolantPoints = result.rows;


                                    var ids = new Set(chargingPoints.map(d => d.id));

                                    chargingPoints = [...chargingPoints, ...interpolantPoints.filter(d => !ids.has(d.id))];



                                    let chargingArray = chargingPoints.map(({longitude, latitude}) => ([longitude, latitude].map(Number)));


                                    let source = origin.split(',').map(Number).reverse();
                                    let dest = destination.split(',').map(Number).reverse();

                                    let pointsArray = [source, ...chargingArray, dest];


                                    getAdjacencyList(pointsArray, range)
                                        .then(async(result) => {


                                            let path = await dijsktra(result, range);

                                            if(path.length == 0){
                                                res.status(404).json({'error': 'Path not found', result, pointsArray});
                                                return;
                                            }
                                        
                                        
                                            let resultArray = path.map(i=>pointsArray[i]);

                                            let stationArray = [];

                                            let station1 = new Station(); 

                                            
                                            resultArray = resultArray.map(([i, j])=>([j,i]));

                                            for(let i = 1; i<resultArray.length-1; i++){
                                                station1.getStationNameGeom(resultArray[i][0], resultArray[i][1])
                                                    .then(result => {
                                                        // console.log(result);
                                                        stationArray.push(result.rows[0]);
                                                    } ) 
                                            }



                                            getRouteAzure(origin, destination, resultArray.slice(1,-1), departAt )
                                                .then(result => {
                                                    res.status(200).json({stationArray, result});
                                                });
                                        

                                        })


                                });
                            
                        })                   
            });
    }
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

module.exports = {getRoute, planRoute, planAdjacencyList, getShortestPath};
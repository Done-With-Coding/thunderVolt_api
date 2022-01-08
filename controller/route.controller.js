const getRouteAzure = require('../api/getRoute.azure');
const getAdjacencyList = require('../service/getAdjacencyList.service');
const getRouteMatrix = require('./../api/getRouteMatrix.azure.js');
const postRouteMatrix = require('./../api/postRouteMatrix.azure.js');


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

module.exports = {getRoute, planAdjacencyList};
const Station = require('../db/models/station.model');
const postRouteMatrix = require('./../api/postRouteMatrix.azure.js');

const getRouteMatrix = require('./../api/getRouteMatrix.azure.js');

async function addStation(req, res) {
    try{
        let {name, address, lat, long, types} = req.body;
        
        types = JSON.parse(types);
        
        const station = new Station(lat, long);
        
        station.addStation(name, address, types)
            .then(result => {
                res.status(200).json(result);
            })
    }
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

async function findNearbyStation(req, res) {
    try{
        const {lat,long} = req.body;
        
        const radius = 6000;

        const station = new Station(lat,long);

        station.findNearestStation(radius)
            .then(stations => {

                pointArray = stations.rows.map(({latitude, longitude}) => [longitude, latitude]);

                let geoJSON = {
                    "type":"MultiPoint",
                    "coordinates": pointArray
                };


                let geoJSON1= {
                    "type":"MultiPoint",
                    "coordinates": [[long, lat]]
                };

                postRouteMatrix(geoJSON1, geoJSON)
                    .then(async result => {
                        // console.log(result.headers);
                        // res.status(200).json({"done": true});
                        
                        await getRouteMatrix(result.headers.location)
                            .then(response => {

                                // console.log(response.matrix);
                                let distArray = response.matrix[0].map((obj) =>  obj.response.routeSummary.lengthInMeters);
                                

                                stations.rows = stations.rows.map((obj, idx)=>({...obj, distance: distArray[idx]}));
                                
                                res.status(200).json(stations);
                            })

                    })
                    
                

                
            })
    }
    catch(err){
        console.log(err);
        res.status(500).json("error: Internal Server Error");
    }
}

module.exports =  {addStation, findNearbyStation};
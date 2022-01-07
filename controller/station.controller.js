const Station = require('../db/models/station.model');

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

module.exports =  {addStation};
const axios = require('axios');

async function getRouteWaypoints(origin, destination,wayPoints, departAt) {

    let query = origin +':';

    wayPoints.forEach(wayPoint => {
        query += wayPoint + ':';
    })

    query += destination;

    const config = {
        method: 'get',
        url: 'https://atlas.microsoft.com/route/directions/json',
        params: {
            'subscription-key': process.env.AZURE_PKEY,
            'api-version': '1.0',
            'query': query,
            'instructionsType': 'tagged',
            'language': 'en-US',
            'computeBestOrder': 'true',
            'routeRepresentation': 'polyline',
            'computeTravelTimeFor' : 'all',
            'sectionType': 'travelMode',
            'travelMode': 'car',
            'traffic': 'true',
            'routeType': 'eco',
            'departAt': new Date(departAt)
        }
    }

    return new Promise((resolve, reject) => {

        axios(config)
        .then(function (response) {
            resolve(response.data);
        })
        .catch(function (error) {
            
            reject(error);
        });

    });

    
}

module.exports = getRouteWaypoints;
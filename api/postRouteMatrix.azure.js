const axios = require('axios');

async function postRouteMatrix(geoJsonx, geoJsony){
    const config = {
        method: 'post',
        url: 'https://atlas.microsoft.com/route/matrix/json',
        'headers': {
            'Content-Type': 'application/json'
        },
        params: {
            'subscription-key': process.env.AZURE_PKEY,
            'api-version': '1.0',
            'computeTravelTimeFor' : 'all',
            'sectionType': 'travelMode',
            'travelMode': 'car',
            'traffic': 'true',
            'routeType': 'eco'
        },
        
        data:{
            'origins': geoJsonx,
            'destinations': geoJsony
        }
    }


    return new Promise((resolve, reject) => {

        axios(config)
        .then(function (response) {
            resolve(response);
        })
        .catch(function (error) {
            
            reject(error);
        });

    });
}

module.exports = postRouteMatrix;

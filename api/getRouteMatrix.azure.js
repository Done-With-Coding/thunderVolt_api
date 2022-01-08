const axios = require('axios');

async function getRouteMatrix(url){
    const config = {
        method: 'get',
        url: url
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

module.exports = getRouteMatrix;

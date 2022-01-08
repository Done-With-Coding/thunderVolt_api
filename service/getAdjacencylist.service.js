const postRouteMatrix = require('./../api/postRouteMatrix.azure.js');
const getRouteMatrix = require('./../api/getRouteMatrix.azure.js');


function mergeDeep(target, source) {
    const isObject = (obj) => obj && typeof obj === 'object';
  
    if (!isObject(target) || !isObject(source)) {
      return source;
    }
  
    Object.keys(source).forEach(key => {
      const targetValue = target[key];
      const sourceValue = source[key];
  
      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });
  
    return target;
}

async function getAdjacent(chunkx, chunky, safeRange, offsetHorizontal, offsetVertical){

    console.log(offsetHorizontal, offsetVertical);

    return new Promise(async(resolve, reject) => {

        let geoJSONx = {
            "type":"MultiPoint",
            "coordinates": JSON.parse(JSON.stringify(chunkx))
        };
    
        let geoJSONy = {
            "type":"MultiPoint",
            "coordinates": JSON.parse(JSON.stringify(chunky))
        };
        
        // console.log(geoJSONx);
        // console.log(geoJSONy);
    
        await postRouteMatrix(geoJSONx, geoJSONy)
            .then(async(result) => {
                // console.log(result.headers);
                await getRouteMatrix(result.headers.location)
                    .then(async(result) =>{
                        let matrix = result.matrix;
                        
                        var promise1 = new Promise(async(resolve1, reject1) => {

                            for(let i=0; i<matrix.length; i++){
                                matrix[i] = await  matrix[i].map((obj) =>  obj.response.routeSummary.lengthInMeters);
                                matrix[i] = await  matrix[i].reduce((a, v, idx) => ({ ...a, [idx+offsetHorizontal]: v}), {}) ;

                                if(i == matrix.length -1){
                                    resolve1();
                                }
                            }

                            
                        });
                        
                        promise1.then(async() => {
                            matrix = await matrix.reduce((a, v, idx) => ({ ...a, [idx+offsetVertical]: v}), {})
    
                            resolve(matrix);
                        });

                    })
                    .catch(err => {
                        reject(err);
                    })
            })
            .catch(err => {
                reject(err);
            })

    });
}


async function getAdjacencyList(pointsArray, range){

    return new Promise(async(resolve, reject) => {

        let safeRange = 0.9*range;

        const chunkSize = 25;

        const  n = pointsArray.length;
        const noChunks = pointsArray.length/chunkSize;

        console.log("no Chunks ", noChunks);

        let adjacencyList = Array(n).fill({});

        adjacencyList = adjacencyList.reduce(
            (obj, item, idx) => Object.assign(obj, { [idx]: {} }), {});

        

        let i=0;
        let j=0;    
        for(i=0; i<noChunks; i++){
            for(j=0; j<noChunks; j++){

                console.log("i: ", i, "j: ", j);

                let chunkx = pointsArray.slice(i*chunkSize, Math.min((i+1)*chunkSize, n));
                let chunky = pointsArray.slice(j*chunkSize, Math.min((j+1)*chunkSize, n));

                await getAdjacent(chunkx,chunky, safeRange, j*chunkSize, i*chunkSize)
                    .then(chunkAdj=>{
                        // console.log(chunkAdj);
                        adjacencyList = mergeDeep(adjacencyList, chunkAdj);
                    })
                
            }
            // if(i==noChunks-1 && j==noChunks-1){
            //     resolve(adjacencyList);
            // }
        }

        resolve(adjacencyList);

    }); 

}

module.exports = getAdjacencyList;
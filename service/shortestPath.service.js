
//function to inplement dijsktras algorithm in javascript given adjacency list and source node and destination node
function dijsktra(adjacencyList, range){

    return new Promise((resolve, reject) => {
        let safeRange = 0.9*range;
        let n = Object.keys(adjacencyList).length;
        let parent = Array(n).fill(null);
        let weight = Array(n).fill(Infinity);
        let visited = Array(n).fill(false);

        weight[0] = 0;
        
        for(let i=0; i<n; i++){
            let min = Infinity;
            let minIndex = -1;
            for(let j=0; j<n; j++){
                if(!visited[j] && weight[j] < min){
                    min = weight[j];
                    minIndex = j;
                }
            }

            visited[minIndex] = true;
            for(let j=0; j<n; j++){

                if(typeof(adjacencyList[minIndex]) === 'undefined'){
                    resolve([]);
                }

                if(adjacencyList[minIndex.toString()][j.toString()] > 0 && adjacencyList[minIndex.toString()][j.toString()] <=safeRange){

                    if(!visited[j] && adjacencyList[minIndex.toString()][j.toString()] && weight[j] > weight[minIndex] + adjacencyList[minIndex.toString()][j.toString()]){
                        weight[j] = weight[minIndex] + adjacencyList[minIndex][j];
                        parent[j] = minIndex;
                    }
                }
            }
        }


        if(weight[n-1] == Infinity){
            resolve([]);
        }


        let path = [n-1];

        let parentIndex = parent[n-1];
        while(parentIndex != null){
            path.push(parentIndex);
            parentIndex = parent[parentIndex];
        }



        path = path.reverse();

        let pathArray = [0];

        let curr_dist = 0;

        for(let i=1; i<path.length; i++){
            curr_dist += adjacencyList[path[i-1]][path[i]];

            if(curr_dist > safeRange){
                pathArray.push(path[i-1]);
                curr_dist = adjacencyList[path[i-1]][path[i]];
            }
        }


        if(pathArray[pathArray.length-1] != n-1){
            pathArray.push(n-1);
        }

        resolve(pathArray);
    })

    

}

module.exports = dijsktra;
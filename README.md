# thunderVolt_api

ThunderVolt is a app for the the solution for the charging of Electric vehicles and increase the user experience for finding the nearby charging station and pre-booking to avoid the long wait at the charging station. This is a backend part of the ThunderVolt built on Node.Js which uses the PostgressSQL database.

## Dependencies
- node
- npm
- express
- postgresql
- postGIS
- Azure Maps API key

## Database setup

- Install PostgresSQL
- Install PostGIS using stack builder (https://gis.stackexchange.com/questions/41060/installing-postgis-on-windows)
- Create a database called "thunderVolt"
- Import the test database from `/data/thunderVolt.backup`



## environment file(.env)
Add the required variables for the app in the **.env** file.

`PGUSER`= (postgresql username)

`PGHOST`= (localhost / address of hosted database) 

`PGPASSWORD`= (postgresql password)

`PGDATABASE`= (database name)

`PGPORT`= (port number of postgresql)) 

`AZURE_PKEY`= (Azure Maps API key)         

## Installation Recipe
### Clone this repository 
`git clone https://github.com/Done-With-Coding/thunderVolt_api` 

### Install dependecies
`
npm i
`
### Usage
`
node app.js
`

This will run a server on the port 3000. Make sure you have the correct port number in Frontend part of the ThunderVolt.
    

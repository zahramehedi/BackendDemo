//Require the Express web application framework and create a new app instance
const express = require('express')
const app = express()
//Require the MongoDB Node.js driver and specify the URL of the MongoDB server to connect to
const mongoClient = require('mongodb').MongoClient
//Hold path of Mongodb server
const url = "mongodb://localhost:27017"

//Tell the app to parse incoming JSON data and convert it to an object
app.use(express.json())

//Define an async function that connects to the MongoDB server
async function connectDb(){

//Connect to the MongoDB server using the MongoClient
const db= await mongoClient.connect(url)

//If the connection was successful, log a message to the console and set up the app routes
if(db){
   // console.log(db)
    console.log("DB CONNECTED")

    //if a database with name 'myDb' does not exist 'myDb' will be created
        const myDb = db.db('myDb')
        const collection = myDb.collection('myTable')

        app.get("/", (req,res)=> {
             res.send("Hello world!")
        })

        //Handle post requests
//When user presses sign up button in android application then a post request will be sent to this server
        app.post('/signup', (req, res) => {

            //User inputs data
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
//Create a query to check if a user with the same email already exists
            const query = {email: newUser.email }

            console.log({newUser})

            //Check if a user with the same email already exists in the 'myTable' collection
            collection.findOne(query)
            .then(response=> {
                //If there is no user with the same email, insert the new user into the 'myTable' collection
                if(!response){
                   collection.insertOne(newUser)
                   .then(response=> {
                    res.status(200).send();
                   })
                   .catch(err=> console.log(err))
                }
                else{
                    //If there is already a user with the same email, send a 400 Bad Request response
                    res.send(400).send();
                }
            })
            .catch(err=> console.log(err))

          /*  collection.findOne(query, (err, result) => {
                       console.log("find", result)
                if (result == null) {
                    collection.insertOne(newUser, (err, result) => {
                        console.log("insert", result)
                        if(result){
                        res.status(200).send() //if result is not null email is already taken
                        }
                        else{
                            res.status(500).send() //server error
                        }
                    })
                } else {
                    res.status(400).send() //bad request
                }
                
            })*/

        })
//Define a route for handling POST requests to the '/login' URL
        app.post('/login', (req, res) => {
//Extract the user's email and password
            const query = {
                email: req.body.email,
                password: req.body.password
            }

            //Check if a user with the specified email and password exists in the 'myTable' collection
            collection.findOne(query)
            .then(result => {
                if(result){
                    const objToSend = {
                        name: result.name,
                        email: req.body.email,
                        
                    }

                    res.status(200).send(JSON.stringify(objToSend)) //200 = everything good

                }
                else{
                    //If there is no matching user, send a 404 Not Found response
                    res.status(404).send()
                }
            })
            .catch(err=> console.log(err));

           /* collection.findOne(query, (err, result) => {

                if(result != null) {

                    const objToSend = {
                        name: result.name,
                        email: req.body.email,
                        
                    }

                    res.status(200).send(JSON.stringify(objToSend)) //200 = everything good

                } else {
                    res.status(404).send()
                }

            })
            */

        })

}
}
//Call the connectDb function to start the server and connect to the database
connectDb();


/*
mongoClient.connect(url, (err,db) => {

    if (err) {
        console.log("Error while connecting mongo client")
    } else {
        console.log("DB CONNECTED")
//if a database with name 'myDb' does not exist 'myDb' will be created
        const myDb = db.db('myDb')
        const collection = myDb.collection('myTable')

        //Handle post requests
//When user presses sign up button in android application then a post request will be sent to this server
        app.post('/signup', (req, res) => {

            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            const query = {email: newUser.email }

            collection.findOne(query, (err, result) => {

                if (result == null) {
                    collection.insertOne(newUser, (err, result) => {
                        res.status(200).send() //if result is not null email is already taken
                    })
                } else {
                    res.status(400).send() //bad request
                }
                
            })

        })

        app.post('/login', (req, res) => {

            const query = {
                email: req.body.email,
                password: req.body.password
            }

            collection.findOne(query, (err, result) => {

                if(result != null) {

                    const objToSend = {
                        name: result.name,
                        email: req.body.email,
                        
                    }

                    res.status(200).send(JSON.stringify(objToSend)) //200 = everything good

                } else {
                    res.status(404).send()
                }

            })

        })

    }

})
*/

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})
const express = require('express')
// const fetch = require("node-fetch");
require('dotenv').config();
const { google } = require('googleapis')
 
// console.log(process.env.YOUTUBE_TOKEN)

const app = express()


app.use(express.urlencoded({extended: false}))
app.set('view engine','ejs')
app.set('views','views')


app.get('/',(req, res, next) => {
    res.render('homepage',{videoids:[]});
})





app.post('/getQuery', (req, res, next) => {

    const numberofresults = parseInt(req.body.numberofresults);

    google.youtube('v3').search.list({
        key: process.env.YOUTUBE_TOKEN,
        part:'snippet',
        q:req.body.searchquery,
        maxResults:numberofresults
    })
    .then(response => {
        const { data } = response;
        // data.items.forEach(item => {
        //     console.log(item.snippet.title)
        // })

        let videoids = []

        data.items.forEach(item => {
            if (item.id.kind === 'youtube#video')
            {
                videoids.push(item.id.videoId)
            }  
        })

        console.log(videoids);

        res.render('homepage',{videoids:videoids})

    })
    .catch(err => {
        console.log(err);
    })


})

app.listen(3002);
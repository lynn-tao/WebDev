const express = require('express')
const schedulerouter = express.Router()

schedulerouter.get('/showschedule', function(req,res){
    let https = require('https')
    let url = "https://ion.tjhsst.edu/api/schedule"
    
    https.get(url, function(response){
      let aggregated_response_string = ""
     
      response.on('data', function(chunk){
        aggregated_response_string+= chunk;
      })
    
      response.on('end', function(){
        const response_object = JSON.parse(aggregated_response_string)
        
        
        var schedule = {}
        schedule["date"] = response_object.results[0].date
        
        blocks = response_object.results[0].day_type.blocks
        
        for (let i = 0; i < blocks.length; i++) {
            console.log(blocks[i]);
            schedule["block"+i] = blocks[i]
        }
        res.render('schedule_display', schedule)
      })
      
    })
})

module.exports = schedulerouter
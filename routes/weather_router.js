const express = require('express')
const weatherrouter = express.Router()

weatherrouter.get('/getweather', function(req,res){
    res.render('weatherform')
})

function c_downloadResponse(req,res,next) {
   lat = req.query.latitude
   long = req.query.longitude
   res.locals.latitude = lat
   res.locals.longitude = long

    var https = require('https');
    var url = 'https://api.weather.gov/points/'+lat+','+long
    var options = { 
    	headers : {
    		'User-Agent': 'lynn_request'
    	}
    }
    https.get(url, options, function(response) {
    	var rawData = '';
    	response.on('data', function(chunk) {
    		rawData += chunk;
    	});
    	response.on('end', function() {
                var obj = JSON.parse(rawData);
                console.log("Parsed JSON Data")
                console.log(obj)
                if (obj.title == 'Adjusting Precision Of Point Coordinate'){
                    console.log("PRECISION")
                    res.locals.precision = "Too Much Precision"
                    next()
                }
                if (obj.title == 'Data Unavailable For Requested Point'){
                    res.locals.nodata = "Data Unavailable"
                    next()
                }
                if ('parameterErrors' in obj){
                    res.locals.paramerror = "Wrong Parameter Entered"
                    next()
                }
                if (obj.properties.forecast === null){
                    res.locals.noforecast = "No Forecast"
                    next()
                }
                res.locals.weather_url = obj.properties.forecast
                res.locals.weather_location = obj.properties.relativeLocation.properties
                next()
        });
    }).on('error', function(e) {
    	console.error(e);
    });
}

function c_downloadForecast(req,res,next) {
   console.log(res.locals.weather_location)
   
   if (typeof res.locals.nodata !== 'undefined') {
       res.locals.notavailable = "Data Unavailable For Requested Point"
       next()
    } 
    if (typeof res.locals.paramerror !== 'undefined') {
       res.locals.wrongparameter = "You either did not enter a correct parameter for (latitude, longitude), or you missed a parameter. Please enter two correct parameters. "
       next()
    } 
    if (typeof res.locals.noforecast !== 'undefined') {
       res.locals.nullforecast = "Sorry, there is no forecast available at the location you've entered."
       next()
    } 
    if (typeof res.locals.precision !== 'undefined') {
       res.locals.noprecision = "The coordinates you've entered are too precise. Please limit latitude and longitude to 4 decimal places."
       next()
    } 
    var https = require('https');
    var url = res.locals.weather_url
    var options = { 
    	headers : {
    		'User-Agent': 'lynn_request'
    	}
    }
    https.get(url, options, function(response) {
    	var rawData = '';
    	response.on('data', function(chunk) {
    		rawData += chunk;
    	});
    	response.on('end', function() {
                var obj = JSON.parse(rawData);
                res.locals.forecast_today = obj.properties.periods[0]
                res.locals.forecast_tonight = obj.properties.periods[1]
                res.locals.forecast_tomorrow = obj.properties.periods[2]
                next()
        });
    }).on('error', function(e) {
    	console.error(e);
    });
}

weatherrouter.get('/results', c_downloadResponse, c_downloadForecast, function(req,res){
    if (typeof res.locals.notavailable !== 'undefined') {
       res.send(res.locals.notavailable)
    } 
    if (typeof res.locals.wrongparameter !== 'undefined') {
       res.send(res.locals.wrongparameter)
    } 
    if (typeof res.locals.nullforecast !== 'undefined') {
       res.send(res.locals.nullforecast)
    }
    if (typeof res.locals.noprecision !== 'undefined') {
       res.send(res.locals.noprecision)
    }
    
    var render_dictionary = {
     'lat' : res.locals.latitude,
     'long': res.locals.longitude,
     'today_forecast' : res.locals.forecast_today,
     'tonight_forecast' : res.locals.forecast_tonight,
     'tomorrow_forecast' : res.locals.forecast_tomorrow,
     'city' : res.locals.weather_location.city,
     'state' : res.locals.weather_location.state
    }
    
    res.render('weather_results', render_dictionary)
})

module.exports = weatherrouter
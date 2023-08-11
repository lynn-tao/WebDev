const express = require('express')
const convrouter = express.Router()

convrouter.get('/mathform', function(req,res){
    res.render('mathform')
})

convrouter.get('/numberFormRedirect', function(req,res){
    num = req.query.number
    res.redirect('converter/'+req.query.number)
})

convrouter.get('/converter/:number', function(req,res){
    number = req.params.number
    convert = {
        "number" : number,
        "tocelsius": (number-32) * (5/9),
        "milestokm": number * 1.60934,
        "tolynn": number * 50,
        "dogstocats": number + 45,
    }
    other_params = req.query
    if ('format' in other_params) {
        res.json(convert)
    }
    res.render('converter', convert)
})

module.exports = convrouter
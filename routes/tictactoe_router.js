const express = require('express')
const tttrouter = express.Router()

// TICTACTOE
tttrouter.get('/playtictactoe', function(req,res){
  res.render('tictactoe')
})

module.exports = tttrouter
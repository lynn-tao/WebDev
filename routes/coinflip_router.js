const express = require('express')
const cfrouter = express.Router()

// COINFLIP
let coin_wins = 0;
cfrouter.get('/coinflip', (req,res) => { 
    let x = Math.random() 
    if (x < 0.5){
        coin_wins++
    }
    const result = {
      'flip_result' : x < 0.5,
      'wins': coin_wins
    }
    res.render('coin_flip', result);
})

module.exports = cfrouter
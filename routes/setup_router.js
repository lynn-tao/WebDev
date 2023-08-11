const express = require('express')
const setuprouter = express.Router()

// HOMEPAGE
let page_counter = 0;
setuprouter.get('/', function(req,res){
  page_counter++;
  const render_dictionary = {
    'count' : page_counter
  }
  res.render('homepage', render_dictionary)
})

// LABS
setuprouter.get('/labs', function(req,res){
  res.render('labs')
})

module.exports = setuprouter
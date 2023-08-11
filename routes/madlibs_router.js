const express = require('express')
const mlrouter = express.Router()

// MADLIBS
mlrouter.get('/playmadlibs', (req, res) => {
  res.render('madlib')
})

mlrouter.post('/madlibsresult', (req,res) => {
  let result = false
    if (req.body.food !== "") {
        if (req.body.check == "yes")
      result = true;
    }
  const out = {
    'has_result' : result,
    'picture' : req.body.picture,
    'food' : req.body.food,
    'name' : req.body.name,
    'adjective' : req.body.adjective,
    'noun1' : req.body.noun1,
    'verb1' : req.body.verb1,
    'verb2' : req.body.verb2,
    'verb3' : req.body.verb3,
    'number': req.body.mins,
    'noun2' : req.body.noun2,
    'food2' : req.body.food2,
    // 'check' : req.query.check,
  }
  res.render('madlib_output', out)
});

module.exports = mlrouter
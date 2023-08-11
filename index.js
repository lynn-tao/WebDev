#!/usr/bin/nodejs
const express = require("express");
const app = express();
var mysql = require('mysql');

const cookieSessionModule = require('cookie-session');
const cookieInitializationParams = {
  name: 'lynn_session_cookie',
  keys: ['encryptionkey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}

const cookieSessionMiddleware = cookieSessionModule(cookieInitializationParams)
app.use(cookieSessionMiddleware)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

const static_files_router = express.static('static')
app.use( static_files_router )

const setuprouter = require('./routes/setup_router')
app.use(setuprouter)

const tictactoerouter = require('./routes/tictactoe_router')
app.use(tictactoerouter)

const coinfliprouter = require('./routes/coinflip_router')
app.use(coinfliprouter)

const madlibsrouter = require('./routes/madlibs_router')
app.use(madlibsrouter)

const converterrouter = require('./routes/converter_router')
app.use(converterrouter)

const weatherrouter = require('./routes/weather_router')
app.use(weatherrouter)

const schedulerouter = require('./routes/schedule_router')
app.use(schedulerouter)

var sql_params = {
  connectionLimit : 10,
  user            : process.env.DIRECTOR_DATABASE_USERNAME,
  password        : process.env.DIRECTOR_DATABASE_PASSWORD,
  host            : process.env.DIRECTOR_DATABASE_HOST,
  port            : process.env.DIRECTOR_DATABASE_PORT,
  database        : process.env.DIRECTOR_DATABASE_NAME
}

app.locals.pool = mysql.createPool(sql_params);

app.get('/votefruit', (req,res) => {
  threshold = 5
  let {visits} = req.session;
  visits ||= 0;
  req.session.visits = visits;
  req.session.visits += 1;
  const render_dictionary = {
    'visits' : req.session.visits
  }
  if (req.session.visits < threshold){
    res.render("fruitform", render_dictionary)
  }
  else{
    res.render("cookie_blocked")
  }
})

app.get('/fruitvoteresults', (req,res) => {
    
    console.log(req.query)

    fruit_sum = {
        'Watermelon': 0,
        'Mango' : 0,
        'Kiwi' : 0,
        'Apple' : 0,
        'Orange': 0,
        'Grape' : 0,
        'Pomegranate' : 0,
        'Strawberry' : 0,
        'Blueberry' : 0
    }
    
    fruit_list = Object.keys(fruit_sum)

    for (let i = 0; i < fruit_list.length; i++) {
      if (req.query.upvote.includes(fruit_list[i])){
          fruit_sum[fruit_list[i]] = 1
      }
      else if (req.query.downvote.includes(fruit_list[i])){
          fruit_sum[fruit_list[i]] = -1
      }
    }
    console.log(fruit_sum)
    
    function displayFruits() { 
        new Promise(function (resolve,reject) {
            const sql_all = "SELECT * FROM fruits INNER JOIN stores ON fruits.store = stores.store_name;"
            res.app.locals.pool.query(sql_all, function(error, results){
                if (error) throw error;
                console.log("FIRST")
                console.log(results)
                for (let i = 0; i < fruit_list.length; i++) {
                    results[i].votes = results[i].votes + fruit_sum[fruit_list[i]]
                    if (fruit_sum[fruit_list[i]] == 1){
                        results[i].customers = results[i].customers + 1
                    }
                    const sql = "UPDATE fruits INNER JOIN stores SET votes = '?', customers = '?' WHERE fruit_name = ? AND store_name = ?"
                    let params = [results[i].votes, results[i].customers, fruit_list[i], results[i].store_name]
                    res.app.locals.pool.query(sql, params, function(error, results){
                        if (error) throw error;
                    })
                }
                const output_dictionary = {
                  'results' : results 
                }
                console.log("LAST")
                console.log(results)
                resolve(res.render('fruitresults', output_dictionary))
            })
        })
    }
    
    async function main() {
        let output = await displayFruits()
    }
    main()

})

app.get('/blessings', (req,res) => {
    count_blessings  = {
	  "blessings": 1,
	}
    return res.json(count_blessings)
})

app.get('/cookiepage', (req,res) => {
  threshold = 5
  let {visits} = req.session;
  visits ||= 0;
  req.session.visits = visits;
  req.session.visits += 1;
  const render_dictionary = {
    'visits' : req.session.visits
  }
  if (req.session.visits < threshold){
    res.render("cookie_view", render_dictionary)
  }
  else{
    res.render("cookie_blocked")
  }
})

const listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});

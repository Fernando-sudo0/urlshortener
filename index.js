require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const urlparser = require("url")
const database = require("./database.js");
const { nextTick } = require('process');
const { url } = require('inspector');
const app = express();
const port = process.env.PORT || 3000;
const TIMEOUT = 10000;

const config = {
  autoIndex : false, 
  useNewUrlParser : true,
  useUnifiedTopology : true
}
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
     
 app.post('/api/shorturl', function(req, res, next) {

 const bodyurl = req.body.url;
 const hostname =  urlparser.parse(bodyurl).hostname

  let t = setTimeout(()=> { next({message : 'timeout'}); }, TIMEOUT);

  if(!hostname)
    return res.json({ error : "Invalid URL"})

  database.findOneByOriginalURL(bodyurl, function(err, data){
    if (err) {
      return next(err);
    }
   if (!data){
    database.CreateAndSaveUrlShortener(bodyurl, function(err,data){
      clearTimeout(t);
      if(err){
        return next(err);
      }
      if(!data){
        return next({message : 'Missing callback argument' });
      }
      return res.json({original_url : data.original_url, short_url : data.short_url});
    });
   }
   else{
    return res.json({original_url : data.original_url, short_url : data.short_url});
      }
  })

 });

app.get('/api/shorturl/:id', function(req, res, done) {
  database.findOneByShortURL(req.params.id, function(err, data){
    if(err){return next(err);}
    if(!data)
    return res.json({error: "No short URL found for the given input"});
    
    res.redirect(data.original_url);

  })
  
})
// app.get('/api/shorturl', function(req, res) {
//   const options = {
//     family: 0,
//     hints: dns.ADDRCONFIG | dns.V4MAPPED,
// };
// dns.lookup("google.com", options,(err, address, family) => {
// res.json({'address' : address , 'family' : family})
// })
// })


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

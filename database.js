const mongoose = require('mongoose');
require('dotenv').config()

const config = {
    autoIndex : false, 
    useNewUrlParser : true,
    useUnifiedTopology : true
  }

mongoose.connect("mongodb+srv://sa:Contra123@shortenerdb.og1db0o.mongodb.net/urlshorteners", config);

let urlSchema = new mongoose.Schema({
    original_url : String,
    short_url : Number
});

const UrlShortener = mongoose.model('urlshorteners', urlSchema);

const CreateAndSaveUrlShortener = (originalurl, done) => {
 try{

    UrlShortener.countDocuments({}, function(err, docCount) {
    if (err) { return handleError(err) } 
  
    const urlshort = new UrlShortener({original_url : originalurl,  short_url : docCount + 1})
    
     urlshort.save(function(err, data){
             if(err) return console.log(err);
                done(null, data);
            });
        
    });
     }catch(error){
        console.log(error)
     }
}

const findOneByShortURL = (shorturl , done) => {
    UrlShortener.findOne({short_url : shorturl}, function(err,data){
        if(err) return console.log(err);
        done(null, data)
    })
}

const findOneByOriginalURL = (originalurl, done) => {
    UrlShortener.findOne({original_url : originalurl}, function(err,data){
        if(err) return console.log(err);
        done(null, data)
    })
  };






exports.CreateAndSaveUrlShortener = CreateAndSaveUrlShortener;
exports.findOneByOriginalURL = findOneByOriginalURL;
exports.findOneByShortURL = findOneByShortURL;
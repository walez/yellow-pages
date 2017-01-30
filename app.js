var express = require('express')
    , app = express()
    , path = require('path')
    , fileUpload = require('express-fileupload')
    , body = require('body-parser')
    , port = (process.env.PORT || 3000)

app.use(express.static(__dirname + '/public'))
app.use(body.json());
app.use(body.urlencoded({extended:true}));
app.use(fileUpload());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes ===============
app.use(require('./routes')); // configure our routes


app.listen(port, function(){
   console.log("Yellow running on port:" + port);
});

exports = module.exports.app;

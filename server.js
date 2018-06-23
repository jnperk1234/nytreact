var express = require ('express');
var bodyParser =require ('body-parser');
var mongoose = require ('mongoose');
var Article = require ('./articleModel')
//var logger = require ('morgan');
//var History = require('.models/History.js');

var app = express();
var PORT = process.env.PORT || 3000;

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.use(express.static('client/build'));

mongoose.connect('mongodb://newuser1234:newuser1234@ds263520.mlab.com:63520/nyreact2');
var db = mongoose.connection;

var fruit =["apple", "pear"]

db.on('error', function(err){
    console.log('Mongoose Error:' , err);
});

db.once('open', function(){
    console.log('Mongo connection successful.');
});

app.get('/data', function(req, res){
    res.send(fruit);
});

app.get('api/saved', function(req, res){
    History.find({}).sort([['date', descending]]).limit(5)
    .exec(function(err, doc){
        if(err) {
            console.log(err)
        } else {
            res.send(doc);
        }
    })
});

//creates new article. Post object as body to work
app.post('/new-article', function ( req, res){
	const article = new Article(req.body)
	article.save().then(function(result){
		res.json(result)
	})
});


app.post('/api/saved', function(req, res) {
	var newArticle = new Article({
		title: req.body.title,
		date: req.body.date,
		url: req.body.url
	});

	Article.create({'location': req.body.location, 'date': Date.now()}, function(err) {
		if(err) {
			console.log(err);
		} else {
			res.send('Saved Search');
		}
	})
});

app.delete('/api/saved/:id', function(req, res) {
	History.find({'_id': req.params.id}).remove()
	.exec(function(err, doc) {
		res.send(doc);
	});
});

app.listen(PORT, function() {
	console.log('App listening on PORT: ' + PORT);
});
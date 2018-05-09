//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var moviesController = require('./controladores/moviesController.js');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas', moviesController.searchAllMovies);
app.get('/generos', moviesController.searchAllGenres);
app.get('/peliculas/recomendacion', moviesController.searchRecommendation);
app.get('/peliculas/:id', moviesController.searchMovieById);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

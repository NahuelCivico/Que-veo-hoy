var conn = require('../lib/conexionbd.js');

function searchAllMovies(req, res){
  var anio = req.query.anio;
  var titulo = req.query.titulo;
  var genero = req.query.genero;
  var orden = req.query.columna_orden;
  var pagina = req.query.pagina;
  var cantidad = req.query.cantidad;

  var sql = createQuery(titulo, anio, genero, orden, pagina, cantidad);
  var sqlCount = createQueryCount(titulo, anio, genero);

  conn.query(sql, function(error, resultado, fields){
    conn.query(sqlCount, function(error, resultado1, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'peliculas': resultado,
        'total' : resultado1[0].total
      };
      res.send(JSON.stringify(response));
    });
  });
}

function searchAllGenres(req, res){
  var sql = "SELECT * FROM genero";
  conn.query(sql, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'generos': resultado
      };
      res.send(JSON.stringify(response));
  });
}

function searchMovieById(req, res){
  var id = req.params.id;
  var sql = "SELECT p.titulo, p.duracion, p.trama, p.director, p.anio, p.fecha_lanzamiento, p.puntuacion, p.poster, a.nombre as actores, g.nombre FROM pelicula p JOIN genero g ON p.genero_id = g.id JOIN actor_pelicula ac ON p.id = ac.pelicula_id JOIN actor a ON ac.actor_id = a.id WHERE p.id = '" + id + "'";
  conn.query(sql, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'pelicula': resultado[0],
        'actores' : resultado,
        'genero' : resultado[0]
      };
      res.send(JSON.stringify(response));
  });
}

function searchRecommendation(req, res){
  var genero = req.query.genero;
  var anioInicio = req.query.anio_inicio;
  var anioFin = req.query.anio_fin;
  var puntuacion = req.query.puntuacion;

  var sql = createQuertRecommendation(genero, anioInicio, anioFin, puntuacion);

  conn.query(sql, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'peliculas': resultado
      };
      res.send(JSON.stringify(response));
  });
}

function createQuery(titulo, anio, genero, orden, pagina, cantidad){
  var query = "SELECT * FROM pelicula ORDER BY " + orden + " LIMIT " + (pagina - 1) * cantidad + "," + cantidad + "";
  if (titulo != undefined || anio != undefined || genero != undefined) {
    query = "SELECT p.titulo, p.duracion, p.trama, p.director, p.anio, p.fecha_lanzamiento, p.puntuacion, p.poster, g.nombre FROM pelicula p JOIN genero AS g ON p.genero_id = g.id WHERE titulo LIKE '" + titulo + "%' OR p.anio = '" + anio + "' OR g.id = '" + genero + "' ORDER BY " + orden + " LIMIT " + (pagina - 1) * cantidad + "," + cantidad + "";
  }
  return query;
}

function createQueryCount(titulo, anio, genero){
  var query = "SELECT COUNT(*) as total FROM pelicula";
  if (titulo != undefined || anio != undefined || genero != undefined) {
    query = "select COUNT(*) as total FROM pelicula p JOIN genero AS g ON p.genero_id = g.id WHERE titulo LIKE '" + titulo + "%' OR p.anio = '" + anio + "' OR g.id = '" + genero + "'";
  }
  return query;
}

function createQuertRecommendation(genero, anioInicio, anioFin, puntuacion){
  var query = '';
  if (genero != undefined && anioInicio != undefined && anioFin != undefined) {
    var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "' AND ( fecha_lanzamiento >= '" + anioInicio + "' AND fecha_lanzamiento <= '" + anioFin + "' )";
  }else if(anioInicio != undefined && anioFin != undefined) {
    var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE ( fecha_lanzamiento >= '" + anioInicio + "' AND fecha_lanzamiento <= '" + anioFin + "' )";
  }else if(genero != undefined && puntuacion != undefined){
    var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "' AND p.puntuacion >= '" + puntuacion + "'";
  }else if(puntuacion != undefined){
    var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE  p.puntuacion >= '" + puntuacion + "'";
  }else {
    var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "'";
  }
  return query;
}

module.exports = {
  searchAllMovies : searchAllMovies,
  searchAllGenres : searchAllGenres,
  searchRecommendation : searchRecommendation,
  searchMovieById : searchMovieById
}

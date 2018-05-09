CREATE DATABASE peliculas;
 USE peliculas;

CREATE TABLE pelicula(
  id INT NOT NULL auto_increment,
  titulo VARCHAR(100),
  duracion INT(5),
  director VARCHAR(400),
  anio INT(5),
  fecha_lanzamiento DATE,
  puntuacion INT(2),
  poster VARCHAR(300),
  trama VARCHAR(700),
  PRIMARY KEY (id)
);

CREATE TABLE genero(
  id INT NOT NULL auto_increment,
  nombre VARCHAR(30),
  PRIMARY KEY (id)
);

ALTER TABLE pelicula
ADD COLUMN genero_id INT;

--SHOW CREATE TABLE pelicula;
ALTER TABLE pelicula  ADD FOREIGN KEY (genero_id) REFERENCES genero (id);

CREATE TABLE actor (
  id INT NOT NULL auto_increment,
  nombre VARCHAR(70),
  PRIMARY KEY (id)
);

--SHOW CREATE TABLE actor_pelicula;
CREATE TABLE actor_pelicula(
  id INT NOT NULL auto_increment,
  actor_id INT NOT NULL,
  pelicula_id INT NOT NULL,
  PRIMARY KEY (id)
);

--SHOW CREATE TABLE actor_pelicula;
ALTER TABLE actor_pelicula  ADD FOREIGN KEY (actor_id) REFERENCES actor (id);

--SHOW CREATE TABLE actor_pelicula;
ALTER TABLE actor_pelicula  ADD FOREIGN KEY (pelicula_id) REFERENCES pelicula (id);

const http = require('http');
const fs = require('fs');
let movies = require('./node_modules/movies');
let faqs = require('./node_modules/faqs');
let theaters = require('./node_modules/theaters');
let titulo=""
let totalDePeliculas="";


let secciones = {
	"/" : "Home",
	"/en-cartelera" : "Cartelera",
	"/mas-votadas" : "Mas votadas",
	"/sucursales": "Sucursales",
	"/contacto": "Contacto",
	"/preguntas-frecuentes": "FAQ"
}
function piePagina(actual){
	let hipervinculos = `<br/><hr/>Recordá que podes visitar las siguientes secciones: `
	for(let pagina in secciones){
		if(pagina != actual){
			hipervinculos += `<a href=${pagina}>${secciones[pagina]}</a>, `
		}
	}
	hipervinculos += `<br/>` 
	return hipervinculos;
}

let movies_ordenadas = movies.sort(function (a,b){
	if (a.title < b.title) {
		return -1;
	}
	if (a.title > b.title){
		return 1;
	}
	return 0;
});

let listado = ""

// Servidor
http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); //'text/plain; charset=utf-8'
	
	// Route System
	switch (req.url) {
		//Home
		case '/':

			titulo = `Bienvenidos a DH Movies el mejor sitio para encontrar las mejores películas, 
				incluso mucho mejor que Netflix, Cuevana y PopCorn.<br/>
				
				<hr/>`;
			listado = "<br/>Listado: <br/><br/>";
			for (const i in movies_ordenadas) {
					listado += `<li/>${movies_ordenadas[i].title}</li>`
			}
			totalDePeliculas=`Total de peliculas en cartelera: ${movies.length} <br/>`
		
            res.end(titulo + totalDePeliculas + listado + piePagina('/'));
			break;
		// En cartelera
		case '/en-cartelera':
			titulo = `En cartelera <br/><hr/>`
			listado = "<br/>Listado: <br/><br/>";
			for (const i in movies_ordenadas) {
				listado += `<li/>${movies_ordenadas[i].title}:</li> <br/> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${movies_ordenadas[i].overview}<br/><br/>`
			}
			totalDePeliculas=`Total de peliculas en cartelera: ${movies.length} <br/>`
			res.end(titulo + totalDePeliculas + listado + piePagina("/en-cartelera"));
			break;
		case '/mas-votadas':
			titulo = `Más votadas <br/><hr/>`
			listado = "<br/>Listado: <br/><br/>";
			let totalMasVotadas = 0;
			let ratingAverage = 0;
			for (const i in movies_ordenadas) {
				if(movies_ordenadas[i].vote_average>=7){	
					listado += `<li/>${movies_ordenadas[i].title} (Rating IMDb = ${movies_ordenadas[i].vote_average}):</li> <br/> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${movies_ordenadas[i].overview}<br/><br/>`
					totalMasVotadas++;
					ratingAverage+=movies_ordenadas[i].vote_average;
				}
			}
			ratingAverage/=totalMasVotadas;
			totalDePeliculas = `Total de peliculas en cartelera: ${totalMasVotadas} <br/>`
			
			res.end(titulo + totalDePeliculas + listado + piePagina("/mas-votadas"));
			break;
		case '/sucursales':
			titulo = "Nuestras Salas <br/><hr/>"
			let totalDeSucursales = `Total de sucursales: ${theaters.length} <br/>`
			listado = `<br/>Surcursales: <br/><br/>`
			for(const i in theaters){
				listado += `<li/>Sucursal: ${theaters[i].name} (Dirección: ${theaters[i].address}).</li><br/>&nbsp&nbsp&nbsp&nbsp&nbsp Descripción: ${theaters[i].description} <br/><br/>`
			}
			res.end(titulo + totalDeSucursales + listado + piePagina("/sucursales"));
			break;
		case '/contacto':
			titulo = `Contáctanos <br/> <hr/>`
			let contenido = `​¿Tenés algo para contarnos? Nos encanta escuchar a nuestros
			clientes.<br/>Si deseas contactarnos podés escribirnos al siguiente email:
			dhmovies@digitalhouse.com o en las redes sociales.<br/> Envianos tu consulta,
			sugerencia o reclamo y será respondido a la brevedad posible.<br/> Recordá que
			también podes consultar la sección de Preguntas Frecuentes para obtener
			respuestas inmediatas a los problemas más comunes`
			res.end(titulo + contenido + piePagina("/contacto"));
			break;
		case '/preguntas-frecuentes':
			titulo = `Preguntas Frecuentes <br/> <hr/>`
			let totalDePreguntas = `Total de preguntas realizadas: ${faqs.length}<br/>`
			listado = `<br/> Listado de preguntas frecuentes: <br/><br/>`
			for(const i in faqs){
				listado += `<li/> ${faqs[i].faq_title} <br/><br/>&nbsp&nbsp&nbsp&nbsp ${faqs[i].faq_answer}<br/><br/> </li>`
			}
			res.end(titulo + totalDePreguntas + listado + piePagina("/preguntas-frecuentes"));
			break;
		default:
			res.end('404 not found')
	}
}).listen(3030, 'localhost', () => console.log('Server running in 3030 port'));
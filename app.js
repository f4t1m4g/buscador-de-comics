// SELECTORES // 
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

//API MARVEL // 
const ts = Date.now()
const publicKey = `defc8f737697e98074c210a6764f4fc2`
const privateKey = `9647b5ecb68666ba881f50a71ea7de759314d48c`

const hash = md5(`${ts}${privateKey}${publicKey}`)

const API_KEY = "defc8f737697e98074c210a6764f4fc2";
const BASE_URL = "https://gateway.marvel.com/v1/public";

// VARIABLES // 

let paginaActual = 0;
let offset = 0;
let ultimaBusqueda = "";
let comicEncontrado = {};

const formulario = $(".formulario");
const seccionPrincipal = $(".seccion-principal");
const resultadosTitulo = $(".resultados-titulo-contenedor");
const cantidadDeResultados = $(".cantidad-resultados");
const contenedorDeCards = $(".resultados-cards-contenedor");
const loader = $(".loader-contenedor");
const selectMasNuevos = $(".nuevos");
const selectMasViejos = $(".viejos");
const selectTipo = $("#tipo");
const selectOrden = $("#orden");
const paginaActualHTML = $(".pagina-actual")
const paginasTotalesHTML = $(".paginas-totales")
const paginaActualContenedor = $(".pagina-actual-contenedor")
const botonVolver = $(".boton-volver");

/**   BOTONES DE PAGINACION  */

const pagAnterior = $(".pagina-anterior");
const pagSiguiente = $(".pagina-siguiente");
const pagPrimera = $(".pagina-primera");
const pagUltima = $(".pagina-ultima");
const botonesPaginacion = $$(".paginacion-btn");

/**  RUTAS */

const getComics = `${BASE_URL}/comics?ts=${ts}&apikey=${API_KEY}&hash=${hash}`;
const getPersonajes = `${BASE_URL}/characters?ts=${ts}&apikey=${API_KEY}&hash=${hash}`;

/**  FUNCIONES GENERALES  */

const construirURL = (endpoint, queryParams) => {
  return `${endpoint}${queryParams}`;
};

const actualizarQueryParams = (query) => {
  let queryParams = `&offset=${offset}`;
  queryParams += query;
  return queryParams;
};

const actualizarOffset = () => {
  offset = paginaActual * 20;
};

const actualizarNroDePagina = (masOmenos) => {
  paginaActual = paginaActual + masOmenos;
  actualizarOffset();
};

const borrarContenidoHTML = (elemento) => {
  elemento.innerHTML = ``;
};

const ocultar = (elemento) => {
  elemento.classList.add("is-hidden");
};

const mostrar = (elemento) => {
  elemento.classList.remove("is-hidden");
};

const resetearValoresDeBusqueda = () => {
  const busqueda = $("#input-search");
  busqueda.value = ``;
  const tipo = $("#tipo");
  tipo.value = "comics";
  const orden = $("#orden");
  orden.value = "a-z";
};

const buscarComicPorId = (id) => {

  fetch(`${BASE_URL}/comics/${id}?ts=${ts}&apikey=${API_KEY}&hash=${hash}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      comicEncontrado = data.data.results[0];

      crearTarjetaDetalleDeComic(comicEncontrado);
    })
    .catch((err) => {
      seccionPrincipal.textContent = "No pudimos encontrar tu busqueda";
    });
};

const formatearFecha = (fecha) => {
  let fechaSeparadaDeHora = fecha.split("T");
  fecha = fechaSeparadaDeHora[0];
  fecha = fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
  return fecha;
};

const ocultarPaginacion = () => {
  ocultar(pagAnterior)
  ocultar(pagSiguiente)
  ocultar(pagPrimera)
  ocultar(pagUltima) 
  ocultar(paginaActualContenedor)
};

const mostarPaginacion = () => {
  mostrar(pagAnterior)
  mostrar(pagSiguiente)
  mostrar(pagPrimera)
  mostrar(pagUltima) 
  mostrar(paginaActualContenedor)  
};


/**  FUNCIONES PRINCIPALES  */

const crearTarjetasDeComics = (data, container) => {

  ocultar(loader);
  let comics = data.data.results;

  comics.map((comic) => {
    resultadosTitulo.classList.toggle("is-hidden");
    cantidadDeResultados.textContent = ` ${data.data.total}`;
    let imgComic = comic.thumbnail.path;

    if (
      imgComic ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
    ) {
      imgComic = "./images/img-not-found";
    }

    container.innerHTML += `
    <article class="card-comic-simple-contenedor">        
      <div class="comic-img-contenedor ">              
        <img src="${imgComic}.${comic.thumbnail.extension}" />        
      </div>     
      <div class="comic-titulo-contenedor">
         <h3 class="comic-titulo">${comic.title}</h3>
      </div>
   </article>
             
        `;
  });

  // ABRIR CARD DETALLE DE COMIC CON ONCLICK

  const todasLasCardsDeComics = $$(".card-comic-simple-contenedor");

  todasLasCardsDeComics.forEach((comicCard, cardIndice) => {
    comicCard.onclick = () => {
      let comicCardElegidaId = comics[cardIndice].id;

      borrarContenidoHTML(contenedorDeCards);
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);

      buscarComicPorId(comicCardElegidaId);
    }; 
  }); 
};

const crearTarjetaDetalleDeComic = (comicCardElegida) => {
  ocultarPaginacion();

  let imgComic = comicCardElegida.thumbnail.path;
  let descripcion = comicCardElegida.description;

  if (descripcion === null || descripcion === "") {
    descripcion = "Lo sentimos, no hay información disponible";
  }

  if (
    imgComic ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
  ) {
    imgComic = "/images/img-not-found";
  }

  contenedorDeCards.innerHTML = `
 
             <div class= "card-detalle-contenedor">
               <div class= "card-comic-detalle-contenedor">
                   <div class= "comic-img-contenedor">
                       <img class= "comic-img" src="${imgComic}.${
    comicCardElegida.thumbnail.extension
  }">
                   </div>
                   <div class= "comic-contenido-contenedor">
                       <h1 class= "comic-contenido-titulo">${
                         comicCardElegida.title
                       }</h2>
                       <h3>Publicado:</h3>
                       <p>${formatearFecha(comicCardElegida.dates[1].date)}</p>
                       <h3>Guionistas:</h3> 
                       <p class= "guionistas-nombres"></p>
               
                       <h3>Descripción: </h3>
                       <p>${descripcion}</p>
                   </div>
               </div>
 
               <div class= "personajes-contenedor">
                   <h3>Personajes</h3>
                   <h4><span class="cantidad-personajes">${
                     comicCardElegida.characters.available
                   }</span> ENCONTRADOS</h4>
                   <div class= "personajes-cards-contenedor"></div>                                            
               </div>
           </div>      
           `;

  // rellenar creadores
  const creadores = comicCardElegida.creators.items;
  const creadoresQty = comicCardElegida.creators.available;
  const guionistasNombres = $(".guionistas-nombres");

  if (creadoresQty === 0) {
    guionistasNombres.innerHTML = "Lo sentimos, no hay información disponible";
  } else {
    creadores.forEach((creador) => {
      guionistasNombres.innerHTML += `
              ${creador.name} •  
              `;
    });
  }

  // rellenar tarjetas de personajes dentro de la card comic detalle
  const urlPersonajesDelComic = comicCardElegida.characters.collectionURI;

  fetch(`${urlPersonajesDelComic}?ts=${ts}&apikey=${API_KEY}&hash=${hash}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const personajesContenedor = $(".personajes-cards-contenedor");
      crearTarjetasDePersonajes(data, personajesContenedor);
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);
    })
    .catch((err) => {
      seccionPrincipal.textContent = "No pudimos encontrar tu busqueda";
    });
};

const crearTarjetasDePersonajes = (data, container) => {

  ocultar(loader);
  let personajes = data.data.results;

  personajes.map((personaje) => {
    resultadosTitulo.classList.toggle("is-hidden");
    cantidadDeResultados.textContent = ` ${data.data.total}`;

    let imgPersonaje = personaje.thumbnail.path;

    if (
      imgPersonaje ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
    ) {
      imgPersonaje = "/images/img-not-found";
    }

    container.innerHTML += `
    
    <article class= "card-personaje-simple-contenedor">
        <div class="personaje-img-contenedor">              
            <img src="${imgPersonaje}.${personaje.thumbnail.extension}"/>        
        </div>   
        <div class="personaje-nombre-contenedor">
            <h3 class="personaje-nombre">${personaje.name}</h3>
        </div>
    </article>
             
        `;
  });

  // ABRIR CARD DETALLE DE PERSONAJE CON ONCLICK

  const todasLasCardsDePersonajes = $$(".card-personaje-simple-contenedor");

  todasLasCardsDePersonajes.forEach((personajeCard, personajeIndice) => {
    personajeCard.onclick = () => {
      const personajeCardElegida = personajes[personajeIndice];

      borrarContenidoHTML(contenedorDeCards);
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);

      crearTarjetaDetalleDePersonaje(personajeCardElegida);
    }; 
  });
};

const crearTarjetaDetalleDePersonaje = (personajeCardElegida) => {
  ocultarPaginacion();

  let imgPersonaje = personajeCardElegida.thumbnail.path;
  let descripcion = personajeCardElegida.description;

  if (descripcion === null || descripcion === "") {
    descripcion = "Lo sentimos, no hay descripción disponible";
  }

  if (
    imgPersonaje ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
  ) {
    imgPersonaje = "/images/img-not-found";
  }

  contenedorDeCards.innerHTML = `
      <div class="card-detalle-contenedor">
        <div class="card-personaje-detalle-contenedor">
            <div class="personaje-img-contenedor">
                <img class="personaje-img" src="${imgPersonaje}.${personajeCardElegida.thumbnail.extension}">
            </div>
            <div class="personaje-contenido-contenedor">
              <h1 class="personaje-contenido-nombre">${personajeCardElegida.name}</h2>
              <h3>Descripción:</h3>
              <p>${descripcion}</p>
            </div>
        </div>
        <div class="comics-contenedor">
            <h3>Comics</h3>
            <h4><span class="cantidad-comics">${personajeCardElegida.series.available}</span> ENCONTRADOS</h4>
            <div class="comics-cards-contenedor"></div>
        </div>
      </div>
  `;

  // rellenar tarjetas de comics en los que aparece este personaje
  const urlComicsDelPersonaje = personajeCardElegida.series.collectionURI;

  fetch(`${urlComicsDelPersonaje}?ts=${ts}&apikey=${API_KEY}&hash=${hash}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const comicsContenedor = $(".comics-cards-contenedor");
      crearTarjetasDeComics(data, comicsContenedor);
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);
    });
};

const listarCards = (url) => {
  borrarContenidoHTML(contenedorDeCards);
  mostrar(resultadosTitulo);
  mostrar(cantidadDeResultados);
  mostarPaginacion()
  const tipo = $("#tipo").value;
  ultimaBusqueda = url;

  fetch(`${url}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {

      if (tipo === "comics") {
        crearTarjetasDeComics(data, contenedorDeCards);
      } else {
        crearTarjetasDePersonajes(data, contenedorDeCards);
      }

      /***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
       *                PAGINACION
       **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

      const totalDeResultados = data.data.total;
      const resto = totalDeResultados % 20;
      let ultimaPaginaDisponible = 0;

      if (resto === 0) {
        ultimaPaginaDisponible = totalDeResultados / 20 - 1;
      } else {
        ultimaPaginaDisponible = (totalDeResultados - resto) / 20;
      }

      paginaActualHTML.innerHTML = `${paginaActual + 1}`;
      paginasTotalesHTML.innerHTML = `${ultimaPaginaDisponible+ 1}`;

      // habilitar o deshabilitar botones

      if (paginaActual === 0) {
        pagAnterior.disabled = true;
        pagPrimera.disabled = true;
      } else {
        pagAnterior.disabled = false;
        pagPrimera.disabled = false;
      }

      if (paginaActual === ultimaPaginaDisponible) {
        pagSiguiente.disabled = true;
        pagUltima.disabled = true;
      } else {
        pagSiguiente.disabled = false;
        pagUltima.disabled = false;
      }

      botonesPaginacion.forEach((btnPaginacion) => {
        btnPaginacion.onclick = () => {
          if (btnPaginacion.classList.contains("pagina-primera")) {
            paginaActual = 0;
            actualizarOffset();
            actualizarBusqueda();
          } else if (btnPaginacion.classList.contains("pagina-anterior")) {
            actualizarNroDePagina(-1);
            actualizarBusqueda();
          } else if (btnPaginacion.classList.contains("pagina-siguiente")) {
            actualizarNroDePagina(1);
            actualizarBusqueda();
          } else if (btnPaginacion.classList.contains("pagina-ultima")) {
            paginaActual = ultimaPaginaDisponible;
            actualizarOffset();
            actualizarBusqueda();
          } else {
            mostrarTarjetasDeComics(getComics);
          }
        };
      });
    }) 
    .catch((err) => {
      seccionPrincipal.textContent = "No pudimos encontrar tu busqueda";
    });
};

const actualizarBusqueda = () => {

  const busqueda = $("#input-search").value;
  const tipo = $("#tipo").value;
  const orden = $("#orden").value;
  let busquedaValue = ``;
  let queryParams = ``;

  if (tipo === "comics") {

    if (busqueda.length) {
      busquedaValue = `&titleStartsWith=${busqueda}`;
    }
    if (orden === "a-z") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=title`);
    }
    if (orden === "z-a") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-title`);
    }
    if (orden === "mas-nuevos") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=modified`);
    }
    if (orden === "mas-viejos") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-modified`);
    }

    listarCards(construirURL(getComics, queryParams));
  } else {

    if (busqueda.length) {
      busquedaValue = `&nameStartsWith=${busqueda}`;
    }
    if (orden === "a-z") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=name`);
    }
    if (orden === "z-a") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-name`);
    }
    listarCards(construirURL(getPersonajes, queryParams));
  }
};

// BUSQUEDA POR PARAMETROS//

formulario.onsubmit = (e) => {
  e.preventDefault();
  mostrar(loader);
  paginaActual = 0;
  actualizarOffset();
  actualizarBusqueda();
};

const ocultarOpcionesMasNuevosOViejos = () => {

  if (selectTipo.value === "personajes") {
    ocultar(selectMasNuevos);
    ocultar(selectMasViejos);
  } else {
    mostrar(selectMasNuevos);
    mostrar(selectMasViejos);
  }
};

selectTipo.addEventListener("change", ocultarOpcionesMasNuevosOViejos);

// BOTON BACK //

botonVolver.onclick = () => {
  mostrar(loader);
  if (ultimaBusqueda.length) {
    listarCards(ultimaBusqueda);
  } else inicializar();
};

/***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
 *                INICIALIZAR
 **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

const inicializar = () => {
  mostrar(loader);
  actualizarBusqueda();
};

inicializar();
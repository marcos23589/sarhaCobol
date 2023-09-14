const { Router } = require("express");
const router = Router();
const path = require("path");
const destino = path.join(__dirname, "../files/upload");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const liquidacion = require("../models/Liquidacion");

// FUNCIONES IMPORTADAS DEL PAGES.CONTROLLER
const {
  home,
  getLiquidacion,
  getPreconceptos,
  postPreconceptos,
  getEsidif,
} = require("../controllers/pages.controller");

let count = 0;

//SE CREA EL DIRECTORIO DONDE SE GUARDAN
//LAS PLANILLAS DE MANERA TEMPORAL
fs.mkdir(destino, { recursive: true }, (err) => {
  if (err) throw err;
});

let nombre = "";
let tiempo = Date.now();
const jDatos = [];

// SE SUBE EL ARCHIVO EXCEL
// Y SE LE DA UN NOMBRE ALEATORIO
const guardado = multer.diskStorage({
  filename: (req, file, cb) => {
    nombre = tiempo + "-" + file.originalname;
    cb(null, nombre);
  },
  destination: destino,
});

//LUGAR DONDE SE GUARDA EL ARCHIVO EXCEL TEMPORAL
router.use(
  multer({
    storage: guardado,
    dest: destino,
  }).array("archivo")
);

// RUTAS
router.get("/", home);
router.get("/preconceptos", getPreconceptos);
router.post("/preconceptos", postPreconceptos);
router.get("/liquidacion", getLiquidacion);
router.get("/esidif", getEsidif);

/********* CUANDO SE CARGA LA LIQUIDACION *************/
router.post("/liquidacion", async (req, res) => {
  //SE LIMPIA LA BBDD
  await liquidacion.deleteMany();

  //FILTRO CON LOS CUIT DE LOS ANEXOS QUE ESTÁN CARGADOS EN SARHA

  const cuits = [
    30715322745, //FISCALIA
    30673674433, //TRIB DE CUENTAS
    30652487080, //UNEPOSC
    //30717532879, //CITEC
    //30717665704, //IGUALDAD
    // 30710660839, //MIN PRODUCCION
    // 30716837250, //JEF GABINETE
    // 30711853738, //DESARROLLO
    // 30716110326, //MIN TRABAJO
    // 33716718439, //MIN SEGURIDAD
    // 30715443577, //GOBERNACION
    // 30673656699, //MIN GOBIERN
    // 30673639603, //MEFI
    // 30656949836, //CAP
    // 30673657687, //MSGG
    // 30707677879, //CASA DE STA CRUZ
    // 30673656524, //HTDI
  ];

  let datos = excel();

  for (let i = 0; i < datos.length; i++) {
    //SE FILTRA EL JSON DE ACUERDO AL CUIT DE LOS ANEXOS
    if (cuits.includes(datos[i].CUIT)) {
      const { CUIT, CUIL, CODIGO, IMPORTE } = datos[i];
      count++;
      jDatos.push({
        CUIT,
        CUIL,
        CODIGO,
        IMPORTE,
      });
    }
  }

  //SE GUARDA LA LIQUIDACION EN LA BBDD
  jDatos.forEach((element) => {
    try {
      liquidacion.insertMany(element);
    } catch (error) {
      console.log(error);
    }
  });

  console.log("DOCUMENTOS INGRESADOS ->", count);

  //SE BORRA EL ARCHIVO EXCEL SUBIDO
  try {
    fs.unlinkSync(`${destino}/${nombre}`);
    console.log("Archivo excel guardado en BBDD!");
  } catch (error) {
    console.error("Algo pasó borrando el archivo! ->", error);
  }
  return res.redirect("preconceptos");
});

/********* CUANDO SE CARGA LA OTRO EXCEL *************/

router.post("/esidif", async (req, res) => {
  let datos = excel();

  //SE OBTIENE UN OBJETO
  console.log(datos);
  return res.redirect("esidif");
});

/********* FUNCION MANEJADORA DE LOS EXCEL *************/
function excel() {
  //SE LEVANTA EL EXCEL
  let excelToJson = xlsx.readFile(`${destino}/${nombre}`);

  //SE CREA UNA VARIABLE QUE GUARDA UN JSON CON LOS NOMBRES DE LAS PESTAÑAS
  let nombreHoja = excelToJson.SheetNames;

  //SE CREA UNA VARIABLE PARA GUARDAR UN JSON CON LOS DATOS DE LA PESTAÑA 1
  return xlsx.utils.sheet_to_json(excelToJson.Sheets[nombreHoja[0]]);
}

module.exports = router;

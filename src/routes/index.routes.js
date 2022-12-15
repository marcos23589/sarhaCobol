const { Router } = require("express");
const router = Router()
const path = require('path')
const destino = path.join(__dirname, "../files/upload");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require('fs')
const liquidacion = require("../models/Liquidacion")

const {
    home,
    acerca,
    getLiquidacion,
    getPreconceptos,
    postPreconceptos
} = require("../controllers/pages.controller");

//SE CREA EL DIRECTORIO DONDE SE GUARDAN 
//LAS PLANILLAS DE MANERA TEMPORAL
fs.mkdir(destino, { recursive: true }, (err) => {
  if (err) throw err;
});

let nombre = "";
let tiempo = Date.now();
const jDatos = [];

// SE SUBE EL ARCHIVO EXCEL
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

router.get('/', home)
router.get('/about', acerca)
router.get('/preconceptos', getPreconceptos)
router.post('/preconceptos', postPreconceptos)
router.get('/liquidacion', getLiquidacion)

router.post('/liquidacion', async (req, res) => {
  
  //FILTRO CON LOS CUIT DE LOS ANEXOS QUE ESTÁN CARGADOS EN SARHA
  const cuits = [
    30710660839, 30716837250, 30711853738, 30716110326, 33716718439,
    30715443577, 30673656699, 30673639603, 30656949836, 30673657687,
    30707677879, 30673656524,
  ];

  //LEVANTA EL EXCEL PARA QUE LEVANTE LOS DATOS
  let excelToJson = xlsx.readFile(`${destino}/${nombre}`);

  //SE CREA UNA VARIABLE QUE GUARDA UN JSON CON LOS NOMBRES DE LAS PESTAÑAS
  let nombreHoja = excelToJson.SheetNames;

  //SE CREA UNA VARIABLE PARA GUARDAR UN JSON CON LOS DATOS DE LA PESTAÑA 1
  let datos = xlsx.utils.sheet_to_json(excelToJson.Sheets[nombreHoja[0]]);
  
  for (let i = 0; i < datos.length; i++) {

    //SE FILTRA EL JSON DE ACUERDO A LOS ANEXOS
    if (cuits.includes(datos[i].CUIT)) {
        const {CUIT, CUIL, CODIGO, IMPORTE } = datos[i]
      jDatos.push({
        CUIT, CUIL, CODIGO, IMPORTE        
      });
    }    
  }

  //SE LIMPIA LA BBDD
  await liquidacion.deleteMany()

  //SE GUARDA LA LIQUIDACION EN LA BBDD
  await jDatos.forEach(element => {
    try {
     liquidacion.insertMany(element)
   } catch (error) {
     console.log(error)
   }
  });

  //SE BORRA EL ARCHIVO SUBIDO
  try {
    fs.unlinkSync(`${destino}/${nombre}`)
    console.log('Archivo eliminado!')
  } catch (error) {
    console.error('Algo pasó borrando el archivo! ->', error)
  }
  
  return res.redirect("liquidacion")
})

    
module.exports = router
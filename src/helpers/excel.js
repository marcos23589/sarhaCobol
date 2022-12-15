const path = require('path')
const destino = path.join(__dirname, "../public/upload");
const xlsx = require("xlsx");
const multer = require("multer");
const { Router } = require("express");
const router = Router()
let nombre = "";
let tiempo = Date.now();

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

  //FILTRO CON LOS CUIT DE LOS ANEXOS QUE ESTÁN CARGADOS EN SARHA
  const cuits = [
    30710660839, 30716837250, 30711853738, 30716110326, 33716718439,
    30715443577, 30673656699, 30673639603, 30656949836, 30673657687,
    30707677879, 30673656524,
  ];

 //CREA UN EXCEL TEMPORAL PARA QUE LEVANTE LOS DATOS
 let excelToJson = xlsx.readFile(`${destino}/${nombre}`);

 //SE CREA UNA VARIABLE QUE GUARDA UN JSON CON LOS NOMBRES DE LAS PESTAÑAS
 let nombreHoja = excelToJson.SheetNames;

 //SE CREA UNA VARIABLE PARA GUARDAR UN JSON CON LOS DATOS DE LA PESTAÑA 1
 let datos = xlsx.utils.sheet_to_json(excelToJson.Sheets[nombreHoja[0]]);

    for (let i = 0; i < datos.length; i++) {
        //SE FILTRA EL JSON DE ACUERDO A LOS ANEXOS
        if (cuits.includes(datos[i].CUIT)) {
          jDatos.push({
            ...datos[i],            
          });
        }
      } 
    
module.exports = excel
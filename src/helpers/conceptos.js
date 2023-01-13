const path = require("path");
const fs = require('fs')
const { fechaDesde, fechaHasta, periodoDesde } = require("../helpers/fecha");
const salidasTxt = path.join(__dirname, "../files/salidas-txt");

let desde = fechaDesde
let hasta = fechaHasta

//SE CREA EL DIRECTORIO DONDE SE GUARDAN LAS SALIDAS
fs.mkdir(salidasTxt, { recursive: true }, (err) => {
  if (err) throw err;
});

const filtro = (CODIGO, importe, cuil, cantidad, concepto) => {

  //VALORES FIJOS
  let subconcepto = "1";
  let reintegro = "1";

  //Si cantidad == -1, NO ES ASIGNACION
  if (cantidad == -1) {
    cantidad = 1;
  } else {
    //EN CASO DE ASIGNACION, NO VA IMPORTE    
    importe = 0;

    //COMENTAR O DESCOMENTAR LAS FECHAS 
    //EN CASO DE SER NECESARIO
    desde = 31012023
    hasta = 31012023
  }

  
  //SE CREA UN STRING QUE LUEGO SE ESCRIBE EN EL ARCHIVO
  let stringSalida = "";
    stringSalida +=
    cuil +

    //RELLENA LOS CAMPOS AL PRINCIPIO
    CODIGO.toString().padStart(4, "0") +
    subconcepto.padStart(4, "0") +
    desde +
    periodoDesde +
    reintegro +
    hasta +
    cantidad.toString().padStart(8, "0").padEnd(14, "0") +
    importe.toString().padStart(12, "0");

  //SE AGREGA UN RETORNO DE CARRO AL FINAL DEL STRING, 
  //PARA QUE LA PRÓXIMA LÍNEA SE ESCRIBA DEBAJO DE ÉSTA
  stringSalida += "\n";

  //CREA EL ARCHIVO Y LO VA ACTUALIZANDO
  //SI EXISTE, LO SOBREESCRIBE!
  fs.appendFile(
    `${salidasTxt}/${CODIGO}-${concepto}.txt`,
    stringSalida,
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
};

module.exports = filtro
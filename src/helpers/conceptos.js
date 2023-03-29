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

const filtro = (CODIGO, importe, cuil, cantidad, denominacion, subsarha) => {
  
  let reintegro = "";

  //SE DEFINEN LOS REINTEGROS PARA LOS VALORES DE IMPORTE
  switch (CODIGO) {
    case 851: if(subsarha == 1 || subsarha == 2){reintegro = "8"}
      break;
    case 852: if(subsarha == 1 || subsarha == 2 || subsarha == 3) 
                  {reintegro = "8"} 
                  else if(subsarha == 4){reintegro = "9"}
      break;
    case 855: if(subsarha == 1){reintegro = "9"}
      break;
    case 320: if(subsarha == 2 || subsarha == 3){reintegro = "8"}
      break;
    default:
        reintegro = "1";
      break;
  }  

  //Si cantidad == -1, NO ES ASIGNACION
  if (cantidad == -1) {
    cantidad = 1;
  } else {
    //EN CASO DE ASIGNACION, NO VA IMPORTE    
    importe = 0;

    //COMENTAR O DESCOMENTAR LAS FECHAS 
    //EN CASO DE SER NECESARIO
    desde = 31032023
    hasta = 31032023
  }
  
  //SE CREA UN STRING QUE LUEGO SE ESCRIBE EN EL ARCHIVO
  let stringSalida = "";
    stringSalida +=
    cuil +

    //RELLENA LOS CAMPOS AL PRINCIPIO
    CODIGO.toString().padStart(4, "0") +
    subsarha.toString().padStart(4, "0") +
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
    `${salidasTxt}/${CODIGO}-${denominacion}.txt`,
    stringSalida,
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
};

module.exports = filtro
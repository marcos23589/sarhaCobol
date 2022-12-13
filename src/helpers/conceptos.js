const path = require("path");
const fs = require('fs')
const { fechaDesde, fechaHasta, periodoDesde } = require("../helpers/fecha");
const salidasTxt = path.join(__dirname, "../public/salidas-txt");


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
  }

  //SE CREA UN STRING QUE LUEGO SE ESCRIBE EN EL ARCHIVO
  let stringSalida = "";
  stringSalida +=
    cuil +
    //RELLENA LOS CAMPOS AL PRINCIPIO
    CODIGO.toString().padStart(4, "0") +
    subconcepto.padStart(4, "0") +
    fechaDesde +
    periodoDesde +
    reintegro +
    fechaHasta +
    cantidad.toFixed().toString().padStart(10, "0").padEnd(14, "0") +
    importe.toString().padStart(12, "0");

  //SE AGREGA AL FINAL DEL STRING UN RETORNO DE CARRO, PARA QUE EL PRÓXIMO
  //SE ESCRIBA DEBAJO DE ÉSTE
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



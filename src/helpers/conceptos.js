const path = require("path");
const fs = require("fs");
const { fechaDesde, fechaHasta, periodoDesde } = require("../helpers/fecha");
const salidasTxt = path.join(__dirname, "../files/salidas-txt");
const {
  codAfiliaciones,
  codDescuentos,
  reintegros,
} = require("../helpers/filtros");

let desde = fechaDesde;
let hasta = fechaHasta;

//SE CREA EL DIRECTORIO DONDE SE GUARDAN LAS SALIDAS
fs.mkdir(salidasTxt, { recursive: true }, (err) => {
  if (err) throw err;
});

const filtro = (CODIGO, importe, cuil, cantidad, denominacion, subsarha) => {
  let afiliaciones = codAfiliaciones(CODIGO, importe / 100);

  let { cod_institucion, cod_descuento } = codDescuentos(CODIGO);

  //SE DEFINEN LOS REINTEGROS PARA LOS VALORES DE IMPORTE
  let reintegro = reintegros(CODIGO);

  //Si cantidad == -1, NO ES ASIGNACION
  if (cantidad == -1) {
    cantidad = 1;
  } else {
    //EN CASO DE ASIGNACION, NO VA IMPORTE
    importe = 0;

    //COMENTAR O DESCOMENTAR LAS FECHAS
    //EN CASO DE SER NECESARIO
    /* desde = 31032023
    hasta = 31032023 */
  }

  //SE CREA UN STRING QUE LUEGO SE ESCRIBE EN EL ARCHIVO
  let stringSalida = "";

  /* cuil + */
  if (afiliaciones != -1) {
    stringSalida +=
      "1" +
      cuil.toString() +
      fechaDesde +
      afiliaciones.toString().padStart(8, "0") +
      "0000000000";
  } else if (cod_institucion) {
    stringSalida +=
      cuil.toString() +
      cod_institucion.padStart(6, "0") +
      cod_descuento.padStart(4, "0") +
      (importe / 100).toString().padStart(11, "0") +
      periodoDesde.toString() +
      periodoDesde.toString();
  } else {
    //RELLENA LOS CAMPOS AL PRINCIPIO
    stringSalida +=
      cuil.toString() +
      CODIGO.toString().padStart(4, "0") +
      subsarha.toString().padStart(4, "0") +
      desde +
      periodoDesde +
      reintegro +
      hasta +
      cantidad.toString().padStart(8, "0").padEnd(14, "0") +
      importe.toString().padStart(12, "0");
  }

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

module.exports = filtro;

const path = require("path");
const fs = require("fs");
const { fechaDesde, fechaHasta, periodoDesde } = require("../helpers/fecha");
const salidasTxt = path.join(__dirname, "../files/salidas-txt");
const {
  codAfiliaciones,
  codDescuentos,
  reintegros,
} = require("../helpers/filtros");
const generarStringSalida = require("./salidas");

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
  let reintegro = reintegros(CODIGO, subsarha);

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
  let stringSalida = generarStringSalida(
    cuil,
    CODIGO,
    subsarha,
    desde,
    periodoDesde,
    reintegro,
    hasta,
    cantidad,
    importe,
    afiliaciones,
    cod_institucion,
    cod_descuento,
    fechaDesde
  );

  //SE AGREGA UN RETORNO DE CARRO AL FINAL DEL STRING,
  //PARA QUE LA PRÓXIMA LÍNEA SE ESCRIBA DEBAJO DE ÉSTA
  stringSalida += "\n";

  //CREA EL ARCHIVO Y LO VA ACTUALIZANDO
  //SI EXISTE, LO SOBREESCRIBE!

  const filename = `${CODIGO}-${denominacion}.txt`;
  const filepath = path.join(salidasTxt, filename);

  fs.appendFile(filepath, stringSalida, (err) => {
    if (err) {
      console.error(`Error al escribir en el archivo ${filename}: ${err}`);
    } else {
      console.log(`Datos escritos correctamente en ${filename}`);
    }
  });
};

module.exports = filtro;

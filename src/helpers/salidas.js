function generarStringSalidaParaAfiliacion(cuil, fechaDesde, afiliaciones) {
  return `1${cuil}${fechaDesde}${afiliaciones.toString().padStart(8, "0")}0000000000`;
}

function generarStringSalidaParaDescuento(cuil, cod_institucion, cod_descuento, importe, periodoDesde) {
  return `${cuil}${cod_institucion.padStart(6, "0")}${cod_descuento.padStart(4, "0")}${(importe / 100).toString().padStart(11, "0")}${periodoDesde}${periodoDesde}`;
}

function generarStringSalida(cuil, CODIGO, subsarha, desde, periodoDesde, reintegro, hasta, cantidad, importe, afiliaciones, cod_institucion, cod_descuento, fechaDesde) {
  if (afiliaciones !== -1) {
    return generarStringSalidaParaAfiliacion(cuil, fechaDesde, afiliaciones);
  } else if (cod_institucion) {
    return generarStringSalidaParaDescuento(cuil, cod_institucion, cod_descuento, importe, periodoDesde);
  } else {
    //RELLENA LOS CAMPOS AL PRINCIPIO
    return `${cuil}${CODIGO.toString().padStart(4, "0")}${subsarha.toString().padStart(4, "0")}${desde}${periodoDesde}${reintegro}${hasta}${cantidad.toString().padStart(8, "0").padEnd(14, "0")}${importe.toString().padStart(12, "0")}`;
  }
}

module.exports = generarStringSalida;

//SE FILTRAN LOS DOCUMENTOS DE LA BBDD POR CODIGO COBOL
const sumaCodigos = (archivo) => {
  let arreglo851 = archivo.filter(
    (element) => element.CODIGO == "250" || element.CODIGO == "280"
  );
  sumaCuil(arreglo851);

  let arreglo852 = archivo.filter(
    (element) => element.CODIGO == "930" || element.CODIGO == "933"
  );
  sumaCuil(arreglo852);
};

//SE SUMAN LOS IMPORTES CUYOS CUILES SON IGUALES
function sumaCuil(arreglo) {
  let aux = 0;
  for (let i = 0; i < arreglo.length; i++) {
    if (aux.CUIL == arreglo[i].CUIL) {
      aux.IMPORTE += arreglo[i].IMPORTE;

      //SE ELIMINAN LOS DOCUMENTOS YA SUMADOS
      archivo.splice(archivo.indexOf(arreglo[i]), 1);
    } else {
      aux = arreglo[i];
    }
  }
}

function codAfiliaciones(cod, importe) {
  const afiliacion = [
    488, 485, 356, 354, 352, 353, 355, 494, 497, 468, 471, 477, 464, 459, 443,
  ];
  const interfaz = [
    299, 300, 380, 381, 383, 384, 385, 411, 413, 414, 415, 417, 419, 420, 424,
  ];
  if (cod == 474) {
    return mpcss(importe);
  } else if (afiliacion.includes(cod)) {
    let i = afiliacion.indexOf(cod);
    return interfaz[i];
  } else return -1;
}

function codDescuentos(cod) {
  let descuento = {};
  const descuentos = [441, 440, 442, 444, 448, 449, 452, 447, 445];

  if (descuentos.includes(cod)) {
    switch (cod) {
      case 441:
        descuento.cod_institucion = "421";
        descuento.cod_descuento = "14";
        break;
      case 444:
        descuento.cod_institucion = "411";
        descuento.cod_descuento = "14";
        break;
      case 445:
        descuento.cod_institucion = "416";
        descuento.cod_descuento = "189";
        break;
      case 448:
        descuento.cod_institucion = "343";
        descuento.cod_descuento = "14";
        break;
      case 440:
        descuento.cod_institucion = "417";
        descuento.cod_descuento = "189";
        break;
      case 442:
        descuento.cod_institucion = "423";
        descuento.cod_descuento = "162";
        break;
      case 447:
        descuento.cod_institucion = "425";
        descuento.cod_descuento = "189";
        break;
      case 449:
        descuento.cod_institucion = "426";
        descuento.cod_descuento = "14";
        break;
      case 451:
        descuento.cod_institucion = "427";
        descuento.cod_descuento = "217";
        break;
      case 452:
        descuento.cod_institucion = "428";
        descuento.cod_descuento = "211";
        break;
      default:
        break;
    }
  }
  return descuento;
}

function mpcss(importe) {
  let cod;
  switch (importe) {
    case 4000:
      cod = 416;
      break;
    case 6000:
      cod = 429;
      break;
    case 500:
      cod = 430;
      break;
    default:
      cod = -1;
      break;
  }
  return cod;
}

function reintegros(cod){
  let reintegro
  switch (cod) {
    case 851:
      if (subsarha == 1 || subsarha == 2) {
        reintegro = "8";
      }
      break;
    case 852:
      if (subsarha == 1 || subsarha == 2 || subsarha == 3) {
        reintegro = "8";
      } else if (subsarha == 4) {
        reintegro = "9";
      }
      break;
    case 855:
      if (subsarha == 1) {
        reintegro = "9";
      }
      break;
    case 320:
      if (subsarha == 2 || subsarha == 3) {
        reintegro = "8";
      }
      break;
    default:
      reintegro = "1";
      break;
  }return reintegro
}

module.exports = { sumaCodigos, codAfiliaciones, codDescuentos, reintegros };

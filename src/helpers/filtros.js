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
  const afiliacion = {
    488: 299,
    485: 300,
    355: 385,
    494: 411,
    497: 413,
    468: 414,
    471: 415,
    477: 417,
    464: 419,
    459: 420,
    443: 424,
  };

  if (cod === 474) {
    return mpcss(importe);
  } else {
    return afiliacion[cod] || -1;
  }
}


function codDescuentos(cod) {
  const descuentos = {
    441: {cod_institucion: "421", cod_descuento: "14"},
    440: {cod_institucion: "417", cod_descuento: "189"},
    442: {cod_institucion: "423", cod_descuento: "162"},
    444: {cod_institucion: "411", cod_descuento: "14"},
    445: {cod_institucion: "416", cod_descuento: "189"},
    447: {cod_institucion: "425", cod_descuento: "189"},
    448: {cod_institucion: "343", cod_descuento: "14"},
    449: {cod_institucion: "426", cod_descuento: "14"},
    451: {cod_institucion: "427", cod_descuento: "217"},
    452: {cod_institucion: "428", cod_descuento: "211"}
  };
  
  return descuentos[cod] || {};
}

function mpcss(importe) {
  const codigos = {
    4000: 416,
    6000: 429,
    500: 430
  };
  return codigos[importe] || -1;
}

function reintegros(cod, subsarha){
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

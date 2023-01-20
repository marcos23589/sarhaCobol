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
}

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
        
module.exports = sumaCodigos
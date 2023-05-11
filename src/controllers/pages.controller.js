const Concepto = require('../models/conceptos')
const liquidacion = require('../models/Liquidacion')
const filtro = require('../helpers/conceptos')
const Asignaciones = require('../models/Asignaciones')
const {sumaCodigos} = require('../helpers/filtros')

exports.home = (req, res) => {
    return res.render("home", {titulo: "Sarha-Cobol"})
}

exports.getLiquidacion =   (req, res) => {    
    return res.render("liquidacion", {titulo: "Liquidacion"})
}

exports.getEsidif = (req, res) => {
 return res.render('esidif', {titulo: "e-SIDIF"})                                                                                                                                         
}

exports.getPreconceptos = async (req, res) => {
    try {
      const cantidad = await liquidacion.countDocuments();
      const resultado = await Concepto.find();
      const tamano = resultado.length;
      const res1 = resultado.slice(0, tamano * (1 / 3));
      const res2 = resultado.slice(tamano * (1 / 3), tamano * (2 / 3));
      const res3 = resultado.slice(tamano * (2 / 3));
      
      return res.render("preconceptos", {
        res1,
        res2,
        res3,
        titulo: "Preconceptos",
        cantidad,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Ha ocurrido un error");
    }
  };
  

exports.postPreconceptos = async (req, res) => {
    
    const preconceptos = req.body.cobol

    //SE OBTIENEN LOS CONCEPTOS A GENERAR TXTS
    let archivo = await liquidacion.find({ "CODIGO" : preconceptos})
    
    //SUMA CODIGOS 250-280 y 930-933(COBOL)    
    sumaCodigos(archivo)

    for (let i = 0; i < archivo.length; i++) {
        let importe = Math.ceil(archivo[i].IMPORTE * 100);        
        let auxSarha = await Concepto.find({"cobol": archivo[i].CODIGO})
        let cantidad = -1;
        let aux =  await Asignaciones.findOne({"SARHA": auxSarha[0].sarha})        
        
        if(aux){            
          //redondea al entero más cercano
          cantidad = Math.round(importe / (aux.MONTO*100));
                                   
        }
        
        //FILTRO PARA CREAR LOS ARCHIVOS
        filtro(
            auxSarha[0].sarha,
            importe, 
            archivo[i].CUIL, 
            cantidad, 
            auxSarha[0].denominacion,
            auxSarha[0].subsarha)
    }  
    
    return res.redirect("preconceptos")
}




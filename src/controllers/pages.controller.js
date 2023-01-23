const Concepto = require('../models/conceptos')
const liquidacion = require('../models/Liquidacion')
const filtro = require('../helpers/conceptos')
const Asignaciones = require('../models/Asignaciones')
const sumaCodigos = require('../helpers/filtros')

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

    //se obtiene la cantidad de registros (liq. vertical)
    let cantidad = await liquidacion.countDocuments()

    //se obtienen los conceptos a seleccionar
    let resultado = await Concepto.find()
    let res1 = []
    let res2 = []
    let res3 = []
    const tamano = resultado.length
    
    //se separan los conceptos en 3 arrays para visualizar en 3 columnas
    for (let index = 0; index < resultado.length; index++) {
        if (index < (tamano*1/3)) {
            res1.push(resultado[index])
        }else if (index < (tamano*2/3)){
            res2.push(resultado[index])
        }else
        res3.push(resultado[index])        
    }
    return res.render("preconceptos", {res1, res2, res3, titulo: "Preconceptos", cantidad})
}

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




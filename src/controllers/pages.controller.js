const Concepto = require('../models/conceptos')
const liquidacion = require('../models/Liquidacion')
const filtro = require('../helpers/conceptos')
const Asignaciones = require('../models/Asignaciones')

exports.home = (req, res) => {
    return res.render("home")
}

exports.acerca = (req, res) => {
    return res.render("about")
}

exports.getLiquidacion =   (req, res) => {    
    return res.render("liquidacion")
}

exports.getPreconceptos = async (req, res) => {
    let resultado = await Concepto.find()
    let res1 = []
    let res2 = []
    let res3 = []
    const tamano = resultado.length
    
    for (let index = 0; index < resultado.length; index++) {
        if (index < (tamano*1/3)) {
            res1.push(resultado[index])
        }else if (index < (tamano*2/3)){
            res2.push(resultado[index])
        }else
        res3.push(resultado[index])        
    }
    return res.render("preconceptos", {res1, res2, res3})
}


exports.postPreconceptos = async (req, res) => {
    
    const preconceptos = req.body.cobol
    let archivo = await liquidacion.find({ "CODIGO" : preconceptos})

    for (let i = 0; i < archivo.length; i++) {
        let importe = Math.ceil(archivo[i].IMPORTE * 100);
        let cuil = archivo[i].CUIL;
        let auxSarha = await Concepto.find({"cobol": archivo[i].CODIGO})
        let sarha = auxSarha[0].sarha
        let denominacion = auxSarha[0].denominacion
        let cantidad = -1;
        let aux =  await Asignaciones.findOne({"SARHA": sarha})
        
        if(aux){
          cantidad = Math.ceil(importe / (aux.MONTO*100));                   
        }
                
        filtro(sarha, importe, cuil, cantidad, denominacion)           
    }  
 
    return res.redirect("preconceptos")
}


const Concepto = require('../models/conceptos')
const liquidacion = require('../models/Liquidacion')
const filtro = require('../helpers/conceptos')
const Asignaciones = require('../models/Asignaciones')

exports.home = (req, res) => {
    return res.render("home", {titulo: "Sarha-Cobol"})
}

exports.getLiquidacion =   (req, res) => {    
    return res.render("liquidacion", {titulo: "Liquidacion"})
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
    let archivo = await liquidacion.find({ "CODIGO" : preconceptos})

    /* let resultado851 = []

        for (let index = 0; index < archivo.length; index++) {
            if(archivo[index].CODIGO == '280' || archivo[index].CODIGO == '250'){
                resultado851.push({cuil: archivo[index].CUIL,
                                  acumulado: archivo[index].IMPORTE}) 
            }            
        }   
    
        let resultado = new Map();

        resultado851.forEach( (resultado851) => {

            let temp = 0;

            if (resultado.has((resultado851.cuil).toString())) {
                temp = resultado.get((resultado851.cuil).toString()) + resultado851.acumulado;
            } else {
                temp = resultado851.acumulado;
            }

            resultado.set((resultado851.cuil), temp);
            console.log(temp);
            }
        ); */

    const busqueda = archivo.reduce((acc, persona) => {
      acc[persona.CUIL] = ++acc[persona.CUIL] || 0;
      return acc;
    }, {});

    const duplicados = archivo.filter((persona) => {
      return busqueda[persona.CUIL];
    });
    console.log(duplicados)

    
    

    for (let i = 0; i < archivo.length; i++) {
        let importe = Math.ceil(archivo[i].IMPORTE * 100);
        let cuil = archivo[i].CUIL;
        let auxSarha = await Concepto.find({"cobol": archivo[i].CODIGO})
        let sarha = auxSarha[0].sarha
        let denominacion = auxSarha[0].denominacion
        let cantidad = -1;
        let subsarha = auxSarha[0].subsarha
        let aux =  await Asignaciones.findOne({"SARHA": sarha})
        
        if(aux){
            
          //redondea al entero más cercano
          cantidad = Math.round(importe / (aux.MONTO*100));                           
        }
        
        filtro(sarha, importe, cuil, cantidad, denominacion, subsarha)
    }  
    
    return res.redirect("preconceptos")
}




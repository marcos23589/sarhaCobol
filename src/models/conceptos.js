const { Schema, model } = require("mongoose")

const conceptoSchema = new Schema({
    cobol: Number,
    sarha: Number,
    subsarha: Number,
    denominacion: String 
})

// EN model SE USA EL NOMBRE DE LA COLECCION EN LA BBDD!
const modeloConcepto = model("Concepto", conceptoSchema)


module.exports = modeloConcepto
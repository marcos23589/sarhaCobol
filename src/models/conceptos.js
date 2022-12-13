const { Schema, model } = require("mongoose")

const conceptoSchema = new Schema({
    sarha: Number,
    cobol: Number,
    denominacion: String 
})

const modeloConcepto = model("Concepto", conceptoSchema)


module.exports = modeloConcepto
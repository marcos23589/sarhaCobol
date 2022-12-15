const { Schema, model } = require("mongoose");

const liquidacionSchema = new Schema({
    CUIT: {
        type: Number,
        required: true
    },
    CUIL: {
        type: Number,
        required: true
    },
    CODIGO: {
        type: String,
        required: true
    },
    IMPORTE: {
        type: Number,
        required: true
    }
})
// EN model SE USA EL NOMBRE DE LA COLECCION EN LA BBDD!
const modeloLiquidacion = model("liquidacions", liquidacionSchema);


module.exports = modeloLiquidacion
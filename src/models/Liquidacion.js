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

const modeloLiquidacion = model("liquidacions", liquidacionSchema);


module.exports = modeloLiquidacion
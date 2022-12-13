const mongoose = require("mongoose");

const asignacionSchema = mongoose.Schema({
    COBOL: {
        type: Number,
        require: true
    },
    SARHA: {
        type: Number,
        require: true
    },
    CONCEPTO: {
        type: String,
        require: true
    },
    MONTO: {
        type: Number,
        require: true
    }
})

const modeloAsignacion = mongoose.model("asignaciones", asignacionSchema)


module.exports = modeloAsignacion
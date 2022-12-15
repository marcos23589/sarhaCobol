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

// EN model SE USA EL NOMBRE DE LA COLECCION EN LA BBDD!
const modeloAsignacion = mongoose.model("asignaciones", asignacionSchema)


module.exports = modeloAsignacion
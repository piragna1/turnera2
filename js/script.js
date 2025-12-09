turnos = [];

function agregarTurno(nombre,apellido,telefono,fecha){
    turnos.push({
        nombre,
        apellido,
        telefono,
        fecha
    });

    console.log(turnos[0]);
}

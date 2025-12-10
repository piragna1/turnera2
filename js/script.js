turnos = [];

function agregarTurno(event){
    event.preventDefault();
    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let telefono = document.getElementById('telefono').value;
    let fecha = document.getElementById('fecha').value;
    turnos.push({
        nombre,
        apellido,
        telefono,
        fecha
    });

    console.log(turnos[0]);
}

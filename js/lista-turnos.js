let turnos = [];
function listarTurnos(){
    console.log('Listando turnos...');
    turnos = localStorage.getItem('turnos');
    if (turnos){
        const parsedTurnos = JSON.parse(turnos);
        console.log(parsedTurnos);
    }
    else {
        console.log('Aun no hay turnos cargados...')
    }
}
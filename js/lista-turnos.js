let turnos = [];
function listarTurnos(){
    console.log('Listando turnos...');
    turnos = localStorage.getItem('turnos');
    if (turnos){
        const parsedTurnos = JSON.parse(turnos);
        console.log(parsedTurnos);
        //selecciono la lista por id
        const lista = document.getElementById('lista-turnos');

        parsedTurnos.forEach(element => {
            //creo un elemento li
            const nuevoElemento = document.createElement('li');
            //creo el nodo con el texto
            const nodo = document.createTextNode(
                element.nombre + ' - ' +
                element.apellido + ' - ' +
                element.telefono + ' - ' + 
                element.fecha + ' - ' + 
                element.hora
                // 'hola'
            );
            //agrego el texto al li
            nuevoElemento.appendChild(nodo);
            //agrego el li a la lista
            lista.appendChild(nuevoElemento);
        });

    }
    else {
        console.log('Aun no hay turnos cargados...')
    }
}
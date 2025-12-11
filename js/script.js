let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
console.log('turnos:',turnos);

/**
 * Este metodo invoca a validaciones y en caso de valido, agrega el turno al localStorage.
 * @param {*} event El evento que surge de apretar el boton 'Sacar turno'
 */
function agregarTurno(event) {
  event.preventDefault();

  //validacion
  let formularioValido = validarTurno();
  if (!formularioValido) return;

  //obtencion de valores
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let telefono = document.getElementById("telefono").value;
  let fecha = document.getElementById("fecha").value;
  let hora = document.getElementById("hora").value;

  //objeto turno
  let turno = {
    nombre,apellido,telefono,fecha,hora
  }

  //reset del formulario
  form.reset();
  
  //despersistencia de los turnos que estan en localstorage
  turnos = localStorage.getItem('turnos');

  //ya existen turnos
  if (turnos){
    const parsedTurnos = JSON.parse(turnos);
    turnos = parsedTurnos;
  }
  else{turnos=[]}

  //agrego el nuevo turno
  turnos.push(turno);
  
  //Guardo la lista de turnos nueva en localstorage
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

/**
 * Este metodo valida un turno desde los campos ingresados hasta el horario del mismo y en comparacion con el de otros turnos ya existentes
 * @returns true si un turno cargado es valido y false en caso  contrario
 */
function validarTurno() {
  let form = document.getElementById("form");
  const inputs = form.querySelectorAll("input");
  let formularioValido = true;

  //verificar si hay campos vacios
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      formularioValido = false;
      input.nextElementSibling.classList.add("error");
      input.nextElementSibling.innerText = "Debe completar este campo.";
    } else {
      input.nextElementSibling.classList.remove("error");
      input.nextElementSibling.innerText = "";
    }
  });

  if (!formularioValido) return false;


  //validacion de la fecha
  let fecha = document.getElementById('fecha').value;
  let fechaValida = false;
  fechaValida = validarFecha(fecha);
  if (!fechaValida ) return false;

  let hora = document.getElementById('hora').value;
  let horarioValido = false;

  //validar rango horario
  horarioValido = validarHorario(hora);

  if (!horarioValido ) {
    console.log('El horario debe sacarse entre las 07hs y las 19hs');
    return false;
  }

  //Verificacion de colision entre turnos
  turnos.forEach(turno => {
    horarioValido = verificarColisionHorarios(turno.hora,hora);
    if (!horarioValido) return false;
  })

  console.log('horario valido')
  return true;
}

/**
 * Este metodo compara dos horarios y verifica si se encuentran a mas de 45 minutos uno de otro
 * @param {String} horario1 El primer horario a comparar
 * @param {String} horario2 El segundo horario a comparar
 * @returns true si ambos horarios no se encuentran dentro de los 45 minutos y false en caso contrario
 */
function verificarColisionHorarios(horario1, horario2){
  let horas1,horas2, minutos1,minutos2, mensajeError;
  mensajeError = document.getElementById('mensajeError');
  horas1 = Number(horario1.split(':')[0])
  minutos1 = Number(horario1.split(':')[1])
  horas2 = Number(horario2.split(':')[0])
  minutos2 = Number(horario2.split(':')[1])

  
  if ((horas1 - horas2) === 0){
    if ((minutos1- minutos2) < 45){
      mensajeError.textContent='Existe conflicto de horarios con otro turno.';
      console.log('conflicto de horarios');
      console.log('hora1:', horas1, 'min1:', minutos1);
      console.log('hora2:', horas2, 'min2:', minutos2);
      return false
    }
  }

  return true;
}

/**
 * Funcion que valida si un horario se encuentra entre las 07 y las 19 horas
 * @param {String} horario El horario en formato de string. Ejemplo: '21:20'
 * @returns Si el horario es valido (se encuentra entre las 07 y las 19 horas)
 */
function validarHorario(horario){

  //Hacer: validar tambien que si es el mismo dia, no se pueda reservar a menos de 2 horas de anticipacion

  console.log('hora', horario)
  let mensajeError = document.getElementById('mensajeError');
  let horas = Number(horario.split(':')[0]);
  if (horas < 7 || horas > 19) {
    mensajeError.textContent = 'Debe escoger un horario entre las 07 y las 19 horas';
    return false;}
    return true;
}

function validarFecha(fecha){
  let inputAnio = fecha.split('-')[0];
  let inputMes = fecha.split('-')[1];
  let inputDia = fecha.split('-')[2];
  let input = new Date(inputAnio, inputMes-1,inputDia);
  let ahora = new Date();

  console.log('ahora', ahora);
  console.log('input', input);

  //hacer: validar que el anio sea el mismo
  if (input.getFullYear() !== ahora.getFullYear()) {
    console.log('tiene que ser en el mismo anio que el corriente')
    return false;}
  //hacer: validar que el mes sea el mismo
  if (input.getMonth() !== ahora.getMonth()) {
    console.log('El turno debe sacarse este mes')
    return false;}
  //hacer: validar que la fecha sea posterior a ayer
  if (input.getDate() - ahora.getDate() < 0) {
    console.log('No puede reservarse turnos para dias ya pasados')
    return false;}

  return true;
}
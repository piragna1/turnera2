let turnos = [];

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

  //agrego el nuevo turno
  turnos.push(turno);
  
  //Guardo la lista de turnos nueva en localstorage
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

function validarTurno() {
  let form = document.getElementById("form");
  const inputs = form.querySelectorAll("input");
  let formularioValido = true;
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

  if (formularioValido) return true;
  return false;
}

turnos = [];

function agregarTurno(event) {
  event.preventDefault();
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let telefono = document.getElementById("telefono").value;
  let fecha = document.getElementById("fecha").value;
  let hora = document.getElementById("hora").value;
  let formularioValido = validarTurno();
  if (formularioValido) {
    turnos.push({
      nombre,
      apellido,
      telefono,
      fecha,
      hora,
    });
    console.log(turnos[turnos.length - 1]);
    form.reset();

    // Store object
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }
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

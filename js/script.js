let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
console.log("turnos:", turnos);

/**
 * Este metodo invoca a validaciones y en caso de valido, agrega el turno al localStorage.
 * @param {*} event El evento que surge de apretar el boton 'Sacar turno'
 */
function agregarTurno(event) {
  event.preventDefault();

  //obtencion de valores
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let telefono = document.getElementById("telefono").value;
  let fecha = document.getElementById("fecha").value;
  let hora = document.getElementById("hora").value;

  //objeto turno
  let turno = {
    nombre,
    apellido,
    telefono,
    fecha,
    hora,
  };

  //validacion
  let formularioValido = validarTurno(turno);
  console.log("formularioValido", formularioValido);

  if (!formularioValido) return;

  //reset del formulario
  form.reset();

  //despersistencia de los turnos que estan en localstorage
  turnos = localStorage.getItem("turnos");

  //ya existen turnos
  if (turnos) {
    const parsedTurnos = JSON.parse(turnos);
    turnos = parsedTurnos;
  } else {
    turnos = [];
  }

  //agrego el nuevo turno
  turnos.push(turno);

  //Guardo la lista de turnos nueva en localstorage
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

/**
 * Este metodo valida un turno desde los campos ingresados hasta el horario del mismo y en comparacion con el de otros turnos ya existentes
 * @returns true si un turno cargado es valido y false en caso  contrario
 */
function validarTurno(turno) {
  console.log('VALIDAR TURNO')
  let form = document.getElementById("form");

  let formularioValido = true;

  formularioValido = verificarCamposVacios();
  if (!formularioValido) return false;

  //validacion del nombre
  formularioValido = validarNombre(turno.nombre);
  if (!formularioValido) return false;

  //validacion del apellido
  formularioValido = validarApellido(turno.apellido);
  if (!formularioValido) return false;

  //validacion del telefono
  formularioValido = validarTelefono(turno.telefono);
  if (!formularioValido) return false;

  //validacion de la fecha
  let fecha = turno.fecha;
  let fechaValida = validarFecha(fecha);
  if (!fechaValida) return false;

  //validar rango horario
  let dia = Number(fecha.split("-")[2]);
  let hora = turno.hora;
  let horarioValido = validarHorario(dia, hora);
  console.log("horarioValido:", horarioValido);
  if (!horarioValido) {
    return false;
  }

  //Verificacion de colision entre turnos
  horarioValido = verificarColisionHorarios(dia, hora);
  if (!horarioValido) return false;

  console.log("turno valido");
  return true;
}

function verificarCamposVacios() {
  let formularioValido = true;
  const inputs = form.querySelectorAll("input");
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
  return formularioValido;
}

/** hacer:redocumentar
 * Este metodo compara dos horarios y verifica si se encuentran a mas de 45 minutos uno de otro
 * @param {String} horario1 El primer horario a comparar
 * @param {String} horario El segundo horario a comparar
 * @returns true si ambos horarios no se encuentran dentro de los 45 minutos y false en caso contrario
 */
function verificarColisionHorarios(dia, horario) {
  //hacer : el metodo no distingue dias, por lo que pueden conflictuar turnos de diferentes dias.
  //ahora verificar primero si se trata del mismo dia, luego verificar horarios
  console.log("dia", dia);
  console.log("horario", horario);

  for (let i = 0; i < turnos.length; i++) {
    let turno = turnos[i];
    let turnoFecha = turno.fecha;
    console.log("turnoFecha", turnoFecha);
    let turnoHorario = turno.hora;
    console.log("turnoHorario", turnoHorario);
    let turnoDia = Number(turnoFecha.split("-")[2]);

    let horas1, horas2, minutos1, minutos2, mensajeError;
    mensajeError = document.getElementById("mensajeError");
    horas1 = Number(turnoHorario.split(":")[0]);
    minutos1 = Number(turnoHorario.split(":")[1]);
    horas2 = Number(horario.split(":")[0]);
    minutos2 = Number(horario.split(":")[1]);

    //Atencion: suponer un caso como el de un turno a las 13:59 y otro a las 14:00.
    //Resultaria en true cuando no deberia ser asi
    //Considerar tratar todo en terminos de segundos y luego hacer la operacion
    //Si un turno tiene de otro un espaciado de 45*60 (45 mins expresados en segundos) entonces se puede validar

    let segundos1 = horas1 * 3600 + minutos1 * 60;
    let segundos2 = horas2 * 3600 + minutos2 * 60;

    console.log("segundos1", segundos1);
    console.log("segundos2", segundos2);
    console.log(
      "Math.abs(segundos1-segundos2)",
      Math.abs(segundos1 - segundos2)
    );

    console.log(
      "Math.abs(segundos1-segundos2) < 45*60",
      Math.abs(segundos1 - segundos2) < 45 * 60
    );
    if (Math.abs(segundos1 - segundos2) < 45 * 60) {
      console.log("turnoDia===dia", turnoDia === dia);
      //verificar que sean del mismo dia
      if (turnoDia === dia) {
        mensajeError.textContent =
          "Existe conflicto de horarios con otro turno.";
        console.log("conflicto de horarios");
        console.log("hora1:", horas1, "min1:", minutos1);
        console.log("hora2:", horas2, "min2:", minutos2);
        console.log("hora1-hora2", horas1 - horas2);
        console.log("min1-min2", minutos1 - minutos2);
        return false;
      }
    }

    mensajeError.textContent = "";
  }

  return true;
}

/** Hacer:Redocumentar
 * Funcion que valida si un horario se encuentra entre las 07 y las 19 horas y...
 * @param {String} horario El horario en formato de string. Ejemplo: '21:20'
 * @returns Si el horario es valido (se encuentra entre las 07 y las 19 horas)
 */
function validarHorario(dia, horario) {
  //Hacer: validar tambien que si es el mismo dia, no se pueda reservar a menos de 2 horas de anticipacion

  //hacer: si un turno es a las 13:59, el turno de las 14:00 se puede sacar, lo cual no deberia ser posible ya que no hay distancia de 45 minutos.
  let ahora = new Date();
  let diaAhora = ahora.getDate();

  console.log("dia ahora:", diaAhora, "dia turno:", dia);

  console.log("hora", horario);
  let mensajeError = document.getElementById("mensajeError");
  let horas = Number(horario.split(":")[0]);
  let minutos = Number(horario.split(":")[1]);
  console.log("horas", horas);
  console.log("horas < 7", horas < 7);
  console.log("horas >= 19", horas >= 19);
  console.log("minutos", minutos);
  if (horas < 7 || horas >= 19) {
    console.log("horas < 7 || horas > 19");
    mensajeError.textContent =
      "Debe escoger un horario entre las 07 y las 19 horas";
    console.log("El horario debe sacarse entre las 07hs y las 19hs");
    return false;
  }

  console.log("horario:", horario);
  console.log("ahora horas:", ahora.getHours());
  console.log("ahora minutos:", ahora.getMinutes());

  //tener en cuenta que puede dar negativo pero el dia puede ser posterior a hoy, por lo que el calculo seria enganioso
  //verificar el espaciado de dos horas solamente si el turno es para el dia de hoy

  console.log("diaAhora", diaAhora, "dia", dia);

  if (diaAhora === dia) {
    //comparar espaciado
    console.log("turno horas - ahora horas:", horas - ahora.getHours());
    console.log("turno mins - ahora minutos:", minutos - ahora.getMinutes());
    if (horas - ahora.getHours() < 2 && horas - ahora.getHours() >= 0) {
      mensajeError.textContent =
        "El turno no puede sacarse con menos de 2 horas de anticipacion";
      console.log(
        "El turno no puede sacarse con menos de 2 horas de anticipacion"
      );
      return false;
    } else if (horas - ahora.getHours() < 0) {
      mensajeError.textContent = "Ya ha pasado esa hora";
      console.log("Esa hora ya ha pasado");
      return false;
    }
  }

  mensajeError.textContent = "";

  return true;
}

/**
 * Este metodo verifica que el turno se saque el mismo anio y el mismo mes y que el dia sea posterior a ayer.
 * @param {String} fecha La fecha del turno
 * @returns true si es valida la fecha y false en caso contrario
 */
function validarFecha(fecha) {
  let inputAnio = fecha.split("-")[0];
  let inputMes = fecha.split("-")[1];
  let inputDia = fecha.split("-")[2];
  let input = new Date(inputAnio, inputMes - 1, inputDia);
  let ahora = new Date();

  console.log("ahora", ahora);
  console.log("input", input);

  //hacer: validar que el anio sea el mismo
  if (input.getFullYear() !== ahora.getFullYear()) {
    console.log("tiene que ser en el mismo anio que el corriente");
    return false;
  }
  //hacer: validar que el mes sea el mismo
  if (input.getMonth() !== ahora.getMonth()) {
    console.log("El turno debe sacarse este mes");
    return false;
  }
  //hacer: validar que la fecha sea posterior a ayer
  if (input.getDate() - ahora.getDate() < 0) {
    console.log("No puede reservarse turnos para dias ya pasados");
    return false;
  }

  return true;
}

function validarNombre(nombre) {

  console.log('VALIDAR NOMBRE')
  // Expresión regular:
  // ^ y $ -> inicio y fin de la cadena
  // [A-Za-zÁÉÍÓÚáéíóúÑñ] -> letras con acentos y ñ
  // (?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)* -> permite espacios seguidos de más letras
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;

  let input = document.getElementById("nombre");

  // El nombre debe tener al menos 2 caracteres y máximo 50
  if (nombre.length < 2 || nombre.length > 50) {
    console.log(
      "El nombre debe tener al menos 2 caracteres y maximo 50 caracteres"
    );

    input.nextElementSibling.classList.add("error");
    input.nextElementSibling.innerText =
      "El campo debe tener al menos 2 caracteres y maximo 50 caracteres";
    return false;
  }

  //match con la expresion regular
  if (!regex.test(nombre.trim())) {
    console.log("Ingrese un nombre valido. Solo letras y espacios");

    input.nextElementSibling.classList.add("error");
    input.nextElementSibling.innerText =
      "Ingrese un dato valido. Solo letras y espacios";
    return false;
  }

  return true;
}

function validarApellido(apellido) {

  console.log('VALIDAR apellido')
  // Expresión regular:
  // ^ y $ -> inicio y fin de la cadena
  // [A-Za-zÁÉÍÓÚáéíóúÑñ] -> letras con acentos y ñ
  // (?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)* -> permite espacios seguidos de más letras
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;

  let input = document.getElementById("apellido");

  // El apellido debe tener al menos 2 caracteres y máximo 50
  if (apellido.length < 2 || apellido.length > 50) {
    console.log(
      "El apellido debe tener al menos 2 caracteres y maximo 50 caracteres"
    );

    input.nextElementSibling.classList.add("error");
    input.nextElementSibling.innerText =
      "El campo debe tener al menos 2 caracteres y maximo 50 caracteres";
    return false;
  }

  //match con la expresion regular
  if (!regex.test(apellido.trim())) {
    console.log("Ingrese un apellido valido. Solo letras y espacios");

    input.nextElementSibling.classList.add("error");
    input.nextElementSibling.innerText =
      "Ingrese un dato valido. Solo letras y espacios";
    return false;
  }

  return true;
}




//implementar
function validarTelefono(telefono) {
  const phoneRegex = /^(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}$/;
if (!phoneRegex.test(telefono)){
  let input = document.getElementById('telefono');
  input.nextElementSibling.classList.add('error');
  input.nextElementSibling.innerText = "Ingresar un numero de telefono valido";
  return false;
}
  
  return true;}

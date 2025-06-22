export default function simularSistema(parametros) {
  const simulacion = [];

  const {
    timeX,
    minutoInicio,
    iterations,
    limiteInferior,
    limiteSuperior,
    complejidad1,
    complejidad2,
  } = parametros;

  // Inicialización de variables acumulativas
  let horaActual = 0;
  let numeroIteracion = 0;
  let proximoEvento = "Inicio";
  let contadorComplejidad30 = 0;
  let contadorComplejidad50 = 0;
  let acumuladorTiempoComplejidad30 = 0;
  let acumuladorTiempoComplejidad50 = 0;

  let finReparacion = "-";
  let proximaLlegada = "-";
  let colaClientes = [];

  while (horaActual < timeX && numeroIteracion < 10000) {
    const evento = generarIteracion(
      proximoEvento,
      numeroIteracion,
      horaActual,
      limiteInferior,
      limiteSuperior,
      contadorComplejidad30,
      contadorComplejidad50,
      acumuladorTiempoComplejidad30,
      acumuladorTiempoComplejidad50,
      complejidad1,
      complejidad2,
      colaClientes,
      finReparacion,
      proximaLlegada
    );

    console.log(evento);

    numeroIteracion++;
    finReparacion = evento.FinReparacion;
    proximaLlegada = evento.ProximaLlegada;
    colaClientes = evento.ColaRelojes;

    if (
      evento.ProximaLlegada < evento.FinReparacion ||
      evento.FinReparacion === "-"
    ) {
      // Si la próxima llegada es antes del fin de reparación o no hay reparación
      horaActual = evento.ProximaLlegada;
      proximoEvento = "Llegada de cliente";
    }

    simulacion.push(evento);
  }

  return simulacion;
}

/*
NumeroFila
Reloj
Evento
Proximo evento
-
RND
Tiempo llegada
Proxima llegada
-
RND
Complejidad
Tiempo reparacion
Proximo fin reparacion
-
Contador comp 30
Contador comp 50
-
Acumulador tiempo comp 30
Acumulador tiempo comp 50
-
Estado relojero
Cola relojes
-
Objs temp
*/

function generarIteracion(
  eventoActual,
  numeroFila,
  horaActual,
  limiteInferior,
  limiteSuperior,
  contadorComplejidad30,
  contadorComplejidad50,
  acumuladorTiempoComplejidad30,
  acumuladorTiempoComplejidad50,
  complejidad1,
  complejidad2,
  colaClientes,
  finReparacion,
  proximaLlegada
) {
  let evento = {};
  if (eventoActual === "Inicio") {
    // Generar un número aleatorio para la llegada del primer cliente
    let rndLlegadaCliente = Math.round(Math.random() * 100) / 100;

    // Calcular el tiempo de llegada del primer cliente
    let tiempoLlegada =
      limiteInferior + rndLlegadaCliente * (limiteSuperior - limiteInferior);

    evento = {
      NumeroFila: numeroFila,
      Reloj: horaActual,
      Evento: eventoActual,
      RND: rndLlegadaCliente,
      TiempoLlegada: tiempoLlegada,
      ProximaLlegada: horaActual + tiempoLlegada,
      RndComplejidad: "-", // Inicialmente no hay complejidad
      Complejidad: "-", // Inicialmente no hay complejidad
      TiempoReparacion: "-", // Inicialmente no hay reparación
      FinReparacion: "-", // Inicialmente no hay fin de reparación
      ContadorComp30: contadorComplejidad30, // Contador para complejidad 30
      ContadorComp50: contadorComplejidad50, // Contador para complejidad 50
      AcumuladorTiempoComp30: acumuladorTiempoComplejidad30, // Acumulador para complejidad 30
      AcumuladorTiempoComp50: acumuladorTiempoComplejidad50, // Acumulador para complejidad 50
      EstadoRelojero: "Libre", // Estado del relojero
      largoColaRelojes: colaClientes.length, // Largo de la cola de relojes
      ColaRelojes: colaClientes, // Cola de relojes
    };
  } else if (eventoActual === "Llegada de cliente") {
    // Generar un número aleatorio para la llegada del primer cliente
    let rndLlegadaCliente = Math.round(Math.random() * 100) / 100;

    // Calcular el tiempo de llegada del primer cliente
    let tiempoLlegada =
      limiteInferior + rndLlegadaCliente * (limiteSuperior - limiteInferior);

    let complejidad, tiempoReparacion, rndComplejidad;
    let nuevaCola = [...colaClientes]; // Copia superficial

    if (finReparacion === "-") {
      rndComplejidad = Math.round(Math.random() * 100) / 100;
      complejidad = rndComplejidad < 0.5 ? complejidad1 : complejidad2;
      tiempoReparacion = 5000;
      finReparacion = horaActual + tiempoReparacion;
    } else {
      // Si hay un fin de reparación pendiente, no se genera una nueva complejidad
      rndComplejidad = "-";
      complejidad = "-";
      tiempoReparacion = "-";

      nuevaCola.push([]);
    }

    evento = {
      NumeroFila: numeroFila,
      Reloj: horaActual,
      Evento: eventoActual,
      RND: rndLlegadaCliente,
      TiempoLlegada: tiempoLlegada,
      ProximaLlegada: horaActual + tiempoLlegada,
      RndComplejidad: rndComplejidad, // Inicialmente no hay complejidad
      Complejidad: complejidad, // Inicialmente no hay complejidad
      TiempoReparacion: tiempoReparacion, // Inicialmente no hay reparación
      FinReparacion: finReparacion, // Inicialmente no hay fin de reparación
      ContadorComp30: contadorComplejidad30, // Contador para complejidad 30
      ContadorComp50: contadorComplejidad50, // Contador para complejidad 50
      AcumuladorTiempoComp30: acumuladorTiempoComplejidad30, // Acumulador para complejidad 30
      AcumuladorTiempoComp50: acumuladorTiempoComplejidad50, // Acumulador para complejidad 50
      EstadoRelojero: "Ocupado", // Estado del relojero
      largoColaRelojes: colaClientes.length, // Largo de la cola de relojes

      ColaRelojes: nuevaCola, // Cola de relojes
    };

    return evento;
  } else if (eventoActual === "Fin de reparación") {
    let nuevaCola = [...colaClientes]; // Copia superficial
    let estadoRelojero = "Libre";
    let rndLlegadaCliente = "-";
    let tiempoLlegada = "-";
    let rndComplejidad = "-";
    let complejidad = "-";
    let tiempoReparacion = "-";

    if (colaClientes.length > 0) {
      // Si hay clientes en la cola, se repara el siguiente cliente
      nuevaCola.shift(); // Eliminar el primer cliente de la cola

      // Generar un número aleatorio para la complejidad del cliente
      let rndComplejidad = Math.round(Math.random() * 100) / 100;
      complejidad = rndComplejidad < 0.5 ? complejidad1 : complejidad2;

      // Calcular el tiempo de reparación basado en la complejidad
      tiempoReparacion = 5000;
      // Calcular el fin de reparación
      finReparacion = horaActual + tiempoReparacion;

      // Actualizar el estado del relojero
      estadoRelojero = "Ocupado";
    } else {
      // Si no hay clientes en la cola, el relojero queda libre
      finReparacion = "-";
      tiempoReparacion = "-";
    }

    evento = {
      NumeroFila: numeroFila,
      Reloj: horaActual,
      Evento: eventoActual,
      RND: rndLlegadaCliente,
      TiempoLlegada: tiempoLlegada,
      ProximaLlegada: proximaLlegada,
      RndComplejidad: rndComplejidad, // Inicialmente no hay complejidad
      Complejidad: complejidad, // Inicialmente no hay complejidad
      TiempoReparacion: tiempoReparacion, // Inicialmente no hay reparación
      FinReparacion: finReparacion, // Inicialmente no hay fin de reparación
      ContadorComp30: contadorComplejidad30, // Contador para complejidad 30
      ContadorComp50: contadorComplejidad50, // Contador para complejidad 50
      AcumuladorTiempoComp30: acumuladorTiempoComplejidad30, // Acumulador para complejidad 30
      AcumuladorTiempoComp50: acumuladorTiempoComplejidad50, // Acumulador para complejidad 50
      EstadoRelojero: estadoRelojero, // Estado del relojero
      largoColaRelojes: colaClientes.length, // Largo de la cola de relojes

      ColaRelojes: nuevaCola, // Cola de relojes
    };
  }
  return evento;
}

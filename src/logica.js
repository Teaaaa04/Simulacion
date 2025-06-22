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
  let colaRelojes = 0;

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
      colaRelojes,
      finReparacion,
      proximaLlegada
    );

    console.log(`Iteración ${numeroIteracion + 1}:`, evento);

    numeroIteracion++;
    finReparacion = evento.FinReparacion;
    proximaLlegada = evento.ProximaLlegada;
    colaRelojes = evento.largoColaRelojes;

    if (
      evento.ProximaLlegada < evento.FinReparacion ||
      evento.FinReparacion === "-"
    ) {
      // Si la próxima llegada es antes del fin de reparación o no hay reparación
      horaActual = evento.ProximaLlegada;
      proximoEvento = "Llegada de cliente";
    } else {
      // Si el fin de reparación es antes de la próxima llegada
      horaActual = evento.FinReparacion;
      proximoEvento = "Fin de reparación";
    }

    simulacion.push(evento);
  }

  console.log("Simulación generada con éxito");

  let finSimulacion = {
    NumeroFila: numeroIteracion,
    Reloj: timeX,
    Evento: "Fin simulación",
    RND: "-", // No hay RND en el fin de simulación
    TiempoLlegada: "-", // No hay tiempo de llegada en el fin de simulación
    ProximaLlegada: proximaLlegada,
    RndComplejidad: "-", // Inicialmente no hay complejidad
    Complejidad: "-", // Inicialmente no hay complejidad
    TiempoReparacion: "-", // Inicialmente no hay reparación
    FinReparacion: finReparacion, // Inicialmente no hay fin de reparación
    ContadorComp30: contadorComplejidad30, // Contador para complejidad 30
    ContadorComp50: contadorComplejidad50, // Contador para complejidad 50
    AcumuladorTiempoComp30: acumuladorTiempoComplejidad30, // Acumulador para complejidad 30
    AcumuladorTiempoComp50: acumuladorTiempoComplejidad50, // Acumulador para complejidad 50
    EstadoRelojero: finReparacion == "-" ? "Libre" : "Ocupado", // Estado del relojero
    largoColaRelojes: colaRelojes, // Largo de la cola de relojes
  };

  simulacion.push(finSimulacion);

  let simulacion2 = recortarVector(minutoInicio, iterations, simulacion);

  return simulacion2;
}

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
  colaRelojes,
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
      largoColaRelojes: colaRelojes, // Largo de la cola de relojes
    };
  } else if (eventoActual === "Llegada de cliente") {
    // Generar un número aleatorio para la llegada del primer cliente
    let rndLlegadaCliente = Math.round(Math.random() * 100) / 100;

    // Calcular el tiempo de llegada del primer cliente
    let tiempoLlegada =
      limiteInferior + rndLlegadaCliente * (limiteSuperior - limiteInferior);

    let complejidad, tiempoReparacion, rndComplejidad;

    if (finReparacion === "-") {
      rndComplejidad = Math.round(Math.random() * 100) / 100;
      complejidad = rndComplejidad < 0.5 ? complejidad1 : complejidad2;
      tiempoReparacion = 15;

      finReparacion = horaActual + tiempoReparacion;
    } else {
      // Si hay un fin de reparación pendiente, no se genera una nueva complejidad
      rndComplejidad = "-";
      complejidad = "-";
      tiempoReparacion = "-";
      colaRelojes++;
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
      largoColaRelojes: colaRelojes, // Largo de la cola de relojes
    };

    return evento;
  } else if (eventoActual === "Fin de reparación") {
    let estadoRelojero = "Libre";
    let rndLlegadaCliente = "-";
    let tiempoLlegada = "-";
    let rndComplejidad = "-";
    let complejidad = "-";
    let tiempoReparacion = "-";

    if (colaRelojes > 0) {
      // Si hay clientes en la cola, se repara el siguiente cliente
      colaRelojes--;
      // Generar un número aleatorio para la complejidad del cliente
      rndComplejidad = Math.round(Math.random() * 100) / 100;
      complejidad = rndComplejidad < 0.5 ? complejidad1 : complejidad2;

      // Calcular el tiempo de reparación basado en la complejidad
      tiempoReparacion = calcularTiempoReparacionRK4(
        0.5,
        complejidad,
        colaRelojes
      );
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
      largoColaRelojes: colaRelojes, // Largo de la cola de relojes
    };
  }
  return evento;
}

function recortarVector(minutoInicio, iteraciones, simulacion) {
  // Filtramos los eventos cuyo reloj es igual o mayor al minuto de inicio
  const simulacionFiltrada = simulacion.filter(
    (elemento) => elemento.Reloj >= minutoInicio
  );

  // Tomamos solo la cantidad de iteraciones solicitadas
  const resultado = simulacionFiltrada.slice(0, iteraciones);

  return resultado;
}

function calcularTiempoReparacionRK4(a, C, R) {
  const h = 0.1; // paso de integración (minutos)
  let t = 0;
  let D = 0;

  console.log(a, C, R);

  // f(t, D) = 0.8*C + t + a*R (independiente de D)
  function f(t, D) {
    return 0.8 * C + t + a * R;
  }

  while (D < C) {
    const k1 = f(t, D);
    const k2 = f(t + h / 2, D + (h / 2) * k1);
    const k3 = f(t + h / 2, D + (h / 2) * k2);
    const k4 = f(t + h, D + h * k3);

    D = D + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    t = t + h;
  }

  return parseFloat(t.toFixed(2)); // redondeamos para mostrar bonito
}

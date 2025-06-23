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
  let objetosTemporales = [];

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
      proximaLlegada,
      objetosTemporales
    );

    numeroIteracion++;
    finReparacion = evento.FinReparacion;
    proximaLlegada = evento.ProximaLlegada;
    colaRelojes = evento.largoColaRelojes;
    contadorComplejidad30 = evento.ContadorComp30;
    contadorComplejidad50 = evento.ContadorComp50;
    acumuladorTiempoComplejidad30 = evento.AcumuladorTiempoComp30;
    acumuladorTiempoComplejidad50 = evento.AcumuladorTiempoComp50;

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

    // CORRECCIÓN: Usar copia profunda para evitar referencias compartidas
    objetosTemporales = copiarObjetosProfundo(evento.ObjetosTemporales);

    simulacion.push(evento);
  }

  console.log("Simulación generada con éxito");

  let finSimulacion = {
    NumeroFila: numeroIteracion,
    Reloj: timeX,
    Evento: "Fin simulación",
    RND: "-",
    TiempoLlegada: "-",
    ProximaLlegada: proximaLlegada,
    RndComplejidad: "-",
    Complejidad: "-",
    TiempoReparacion: "-",
    FinReparacion: finReparacion,
    ContadorComp30: contadorComplejidad30,
    ContadorComp50: contadorComplejidad50,
    AcumuladorTiempoComp30: acumuladorTiempoComplejidad30,
    AcumuladorTiempoComp50: acumuladorTiempoComplejidad50,
    EstadoRelojero: finReparacion == "-" ? "Libre" : "Ocupado",
    largoColaRelojes: colaRelojes,
    ObjetosTemporales: copiarObjetosProfundo(objetosTemporales),
  };

  simulacion.push(finSimulacion);

  let simulacion2 = recortarVector(minutoInicio, iterations, simulacion);

  return simulacion2;
}

// NUEVA FUNCIÓN: Crear copia profunda de objetos
function copiarObjetosProfundo(objetos) {
  return objetos.map((objeto) => ({
    estado: objeto.estado,
    tiempoLlegada: objeto.tiempoLlegada,
    complejidad: objeto.complejidad,
    horaInicioReparacion: objeto.horaInicioReparacion,
  }));
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
  proximaLlegada,
  objetosTemporales
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
      RndComplejidad: "-",
      Complejidad: "-",
      TiempoReparacion: "-",
      FinReparacion: "-",
      ContadorComp30: contadorComplejidad30,
      ContadorComp50: contadorComplejidad50,
      AcumuladorTiempoComp30: acumuladorTiempoComplejidad30,
      AcumuladorTiempoComp50: acumuladorTiempoComplejidad50,
      EstadoRelojero: "Libre",
      largoColaRelojes: colaRelojes,
      ObjetosTemporales: [],
    };
  } else if (eventoActual === "Llegada de cliente") {
    // CORRECCIÓN: Crear copia profunda de objetos temporales existentes
    let nuevaColaObjetos2 = copiarObjetosProfundo(objetosTemporales);
    console.log("Objetos temporales antes de la llegada:", nuevaColaObjetos2);

    // Crear nuevo cliente
    let cliente = {
      estado: "Sin determinar",
      tiempoLlegada: horaActual,
      complejidad: "-",
      horaInicioReparacion: "-",
    };

    let rndLlegadaCliente = Math.round(Math.random() * 100) / 100;

    // Calcular el tiempo de llegada del primer cliente
    let tiempoLlegada =
      limiteInferior + rndLlegadaCliente * (limiteSuperior - limiteInferior);

    let complejidad, tiempoReparacion, rndComplejidad;

    if (finReparacion === "-") {
      rndComplejidad = Math.round(Math.random() * 100) / 100;
      complejidad = rndComplejidad < 0.5 ? complejidad1 : complejidad2;
      tiempoReparacion = calcularTiempoReparacionRK4(
        0.5,
        complejidad,
        colaRelojes
      );
      finReparacion = horaActual + tiempoReparacion;

      cliente.estado = "En reparación";
      cliente.tiempoLlegada = "-"; // No es necesario el tiempo de llegada una vez en reparación
      cliente.horaInicioReparacion = horaActual;
      cliente.complejidad = complejidad;
    } else {
      // Si hay un fin de reparación pendiente, no se genera una nueva complejidad
      rndComplejidad = "-";
      tiempoReparacion = "-";
      colaRelojes++;
      cliente.estado = "En cola";
      cliente.complejidad = "-";
    }

    nuevaColaObjetos2.push(cliente);

    evento = {
      NumeroFila: numeroFila,
      Reloj: horaActual,
      Evento: eventoActual,
      RND: rndLlegadaCliente,
      TiempoLlegada: tiempoLlegada,
      ProximaLlegada: horaActual + tiempoLlegada,
      RndComplejidad: rndComplejidad,
      Complejidad: complejidad,
      TiempoReparacion: tiempoReparacion,
      FinReparacion: finReparacion,
      ContadorComp30: contadorComplejidad30,
      ContadorComp50: contadorComplejidad50,
      AcumuladorTiempoComp30: acumuladorTiempoComplejidad30,
      AcumuladorTiempoComp50: acumuladorTiempoComplejidad50,
      EstadoRelojero: "Ocupado",
      largoColaRelojes: colaRelojes,
      ObjetosTemporales: nuevaColaObjetos2,
    };

    return evento;
  } else if (eventoActual === "Fin de reparación") {
    let estadoRelojero = "Libre";
    let rndLlegadaCliente = "-";
    let tiempoLlegada = "-";
    let rndComplejidad = "-";
    let complejidad = "-";
    let tiempoReparacion = "-";

    // CORRECCIÓN: Crear copia profunda antes de modificar
    let nuevaColaObjetos = copiarObjetosProfundo(objetosTemporales);

    const clienteEnReparacion = nuevaColaObjetos.find(
      (cliente) => cliente.estado === "En reparación"
    );

    if (clienteEnReparacion) {
      // 🔄 2. Actualizar contadores y acumuladores según complejidad
      const complejidadCliente = clienteEnReparacion.complejidad;
      const inicioReparacion = clienteEnReparacion.horaInicioReparacion;

      const tiempoAcumulado = horaActual - inicioReparacion;

      if (complejidadCliente === 30) {
        contadorComplejidad30++;
        acumuladorTiempoComplejidad30 += tiempoAcumulado;
      } else if (complejidadCliente === 50) {
        contadorComplejidad50++;
        acumuladorTiempoComplejidad50 += tiempoAcumulado;
      }
    }

    // Sacar al cliente que estaba en reparacion
    nuevaColaObjetos = nuevaColaObjetos.filter(
      (cliente) => cliente.estado !== "En reparación"
    );

    if (colaRelojes > 0) {
      colaRelojes--;

      // Buscar el cliente en espera con menor llegada y modificarlo
      let indiceMin = -1;
      let minLlegada = Infinity;

      for (let i = 0; i < nuevaColaObjetos.length; i++) {
        if (
          nuevaColaObjetos[i].estado === "En cola" &&
          nuevaColaObjetos[i].tiempoLlegada < minLlegada
        ) {
          minLlegada = nuevaColaObjetos[i].tiempoLlegada;
          indiceMin = i;
        }
      }

      if (indiceMin !== -1) {
        nuevaColaObjetos[indiceMin].estado = "En reparación";
        nuevaColaObjetos[indiceMin].horaInicioReparacion = horaActual;
        nuevaColaObjetos[indiceMin].tiempoLlegada = "-";
        rndComplejidad = Math.round(Math.random() * 100) / 100;
        complejidad = rndComplejidad < 0.5 ? complejidad1 : complejidad2;
        nuevaColaObjetos[indiceMin].complejidad = complejidad;

        tiempoReparacion = calcularTiempoReparacionRK4(
          0.5,
          complejidad,
          colaRelojes
        );

        finReparacion = horaActual + tiempoReparacion;
        estadoRelojero = "Ocupado";
      }
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
      RndComplejidad: rndComplejidad,
      Complejidad: complejidad,
      TiempoReparacion: tiempoReparacion,
      FinReparacion: finReparacion,
      ContadorComp30: contadorComplejidad30,
      ContadorComp50: contadorComplejidad50,
      AcumuladorTiempoComp30: acumuladorTiempoComplejidad30,
      AcumuladorTiempoComp50: acumuladorTiempoComplejidad50,
      EstadoRelojero: estadoRelojero,
      largoColaRelojes: colaRelojes,
      ObjetosTemporales: nuevaColaObjetos,
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

  // f(t, D) = 0.8*C + t + a*R (independiente de D)
  function f(t, D) {
    return 0.8 * D + t + a * R;
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

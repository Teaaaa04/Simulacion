import { agregarHojaExcel } from "./excelManager";
import { descargarExcel } from "./excelManager";

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
    a,
    h,
  } = parametros;

  // Inicialización de variables acumulativas
  let horaActual = 0;
  let numeroIteracion = 0;
  let proximoEvento = "Inicio";
  let contadorComplejidad30 = 0;
  let contadorComplejidad50 = 0;
  let acumuladorTiempoComplejidad30 = 0;
  let acumuladorTiempoComplejidad50 = 0;

  let idsClientes = 1;

  let finReparacion = "-";
  let proximaLlegada = "-";
  let colaRelojes = 0;
  let objetosTemporales = [];

  while (horaActual < timeX) {
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
      objetosTemporales,
      idsClientes,
      a,
      h
    );

    numeroIteracion++;
    idsClientes = evento.IdsClientes;
    finReparacion = evento.FinReparacion;
    proximaLlegada = evento.ProxLlegada;
    colaRelojes = evento.ColaRelojes;
    contadorComplejidad30 = evento.ContComp30;
    contadorComplejidad50 = evento.ContComp50;
    acumuladorTiempoComplejidad30 = evento.AC_TiempoComp30;
    acumuladorTiempoComplejidad50 = evento.AC_TiempoComp50;

    if (
      evento.ProxLlegada < evento.FinReparacion ||
      evento.FinReparacion === "-"
    ) {
      // Si la próxima llegada es antes del Fin reparación o no hay reparación
      horaActual = evento.ProxLlegada;
      proximoEvento = "Llegada cliente";
    } else {
      // Si el Fin reparación es antes de la próxima llegada
      horaActual = evento.FinReparacion;
      proximoEvento = "Fin reparación";
    }

    // CORRECCIÓN: Usar copia profunda para evitar referencias compartidas
    objetosTemporales = copiarObjetosProfundo(evento.ObjetosTemporales);

    simulacion.push(evento);
  }

  descargarExcel("resultado_euler.xlsx");
  console.log("Simulación generada con éxito");

  let finSimulacion = {
    N: numeroIteracion,
    Reloj: timeX,
    Evento: "Fin simulación",
    RND: "-",
    TiempoLlegada: "-",
    ProxLlegada: proximaLlegada,
    RND_C: "-",
    C: "-",
    TiempoReparacion: "-",
    FinReparacion: finReparacion,
    ContComp30: contadorComplejidad30,
    ContComp50: contadorComplejidad50,
    AC_TiempoComp30: acumuladorTiempoComplejidad30,
    AC_TiempoComp50: acumuladorTiempoComplejidad50,
    EstadoRelojero: finReparacion == "-" ? "Libre" : "Ocupado",
    ColaRelojes: colaRelojes,
    ObjetosTemporales: copiarObjetosProfundo(objetosTemporales),
    IdsClientes: idsClientes, // ID del último cliente procesado
  };

  simulacion.push(finSimulacion);

  let simulacion2 = recortarVector(minutoInicio, iterations, simulacion);

  return simulacion2;
}

// NUEVA FUNCIÓN: Crear copia profunda de objetos
function copiarObjetosProfundo(objetos) {
  return objetos.map((objeto) => ({
    id: objeto.id,
    estado: objeto.estado,
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
  objetosTemporales,
  IdsClientes,
  a,
  h
) {
  let evento = {};
  if (eventoActual === "Inicio") {
    // Generar un número aleatorio para la llegada del primer cliente
    let rndLlegadaCliente = Math.round(Math.random() * 100) / 100;

    // Calcular el tiempo de llegada del primer cliente
    let tiempoLlegada =
      limiteInferior + rndLlegadaCliente * (limiteSuperior - limiteInferior);

    evento = {
      N: numeroFila,
      Reloj: horaActual,
      Evento: eventoActual,
      RND: rndLlegadaCliente,
      TiempoLlegada: Number(tiempoLlegada.toFixed(2)),
      ProxLlegada: Number((horaActual + tiempoLlegada).toFixed(2)),
      RND_C: "-",
      C: "-",
      TiempoReparacion: "-",
      FinReparacion: "-",
      ContComp30: contadorComplejidad30,
      ContComp50: contadorComplejidad50,
      AC_TiempoComp30: Number(acumuladorTiempoComplejidad30.toFixed(2)),
      AC_TiempoComp50: Number(acumuladorTiempoComplejidad50.toFixed(2)),
      EstadoRelojero: "Libre",
      ColaRelojes: colaRelojes,
      ObjetosTemporales: [],
      IdsClientes: IdsClientes, // ID del primer cliente
    };
  } else if (eventoActual === "Llegada cliente") {
    // CORRECCIÓN: Crear copia profunda de objetos temporales existentes
    let nuevaColaObjetos2 = copiarObjetosProfundo(objetosTemporales);

    // Crear nuevo cliente
    let cliente = {
      id: IdsClientes,
      estado: "Sin determinar",
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
      tiempoReparacion = calcularTiempoReparacionEuler(
        a,
        h,
        complejidad,
        colaRelojes
      );
      finReparacion = horaActual + tiempoReparacion;

      cliente.estado = "En reparación";
      cliente.horaInicioReparacion = horaActual;
      cliente.complejidad = complejidad;
    } else {
      // Si hay un Fin reparación pendiente, no se genera una nueva complejidad
      rndComplejidad = "-";
      tiempoReparacion = "-";
      colaRelojes++;
      cliente.estado = "En cola";
      cliente.complejidad = "-";
    }

    nuevaColaObjetos2.push(cliente);

    evento = {
      N: numeroFila,
      Reloj: horaActual,
      Evento: eventoActual,
      RND: rndLlegadaCliente,
      TiempoLlegada: Number(tiempoLlegada.toFixed(2)),
      ProxLlegada: Number((horaActual + tiempoLlegada).toFixed(2)),
      RND_C: rndComplejidad,
      C: complejidad,
      TiempoReparacion:
        tiempoReparacion == "-" ? "-" : Number(tiempoReparacion.toFixed(2)),
      FinReparacion: Number(finReparacion.toFixed(2)),
      ContComp30: contadorComplejidad30,
      ContComp50: contadorComplejidad50,
      AC_TiempoComp30: Number(acumuladorTiempoComplejidad30.toFixed(2)),
      AC_TiempoComp50: Number(acumuladorTiempoComplejidad50.toFixed(2)),
      EstadoRelojero: "Ocupado",
      ColaRelojes: colaRelojes,
      ObjetosTemporales: nuevaColaObjetos2,
      IdsClientes: IdsClientes + 1, // Incrementar el ID del próximo cliente
    };

    return evento;
  } else if (eventoActual === "Fin reparación") {
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

    // Marcar al cliente que estaba en reparación como atendido
    nuevaColaObjetos = nuevaColaObjetos.map((cliente) => {
      if (cliente.estado === "En reparación") {
        return {
          ...cliente,
          estado: "-",
          horaInicioReparacion: "-",
          complejidad: "-",
        };
      }
      return cliente;
    });

    if (colaRelojes > 0) {
      colaRelojes--;

      // Buscar el cliente en espera con menor llegada y modificarlo
      let indiceMin = -1;
      let minId = Infinity;

      for (let i = 0; i < nuevaColaObjetos.length; i++) {
        if (
          nuevaColaObjetos[i].estado === "En cola" &&
          nuevaColaObjetos[i].id < minId
        ) {
          minId = nuevaColaObjetos[i].id;
          indiceMin = i;
        }
      }

      if (indiceMin !== -1) {
        nuevaColaObjetos[indiceMin].estado = "En reparación";
        nuevaColaObjetos[indiceMin].horaInicioReparacion = horaActual;
        rndComplejidad = Math.round(Math.random() * 100) / 100;
        complejidad = rndComplejidad < 0.5 ? complejidad1 : complejidad2;
        nuevaColaObjetos[indiceMin].complejidad = complejidad;

        tiempoReparacion = calcularTiempoReparacionEuler(
          a,
          h,
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
      N: numeroFila,
      Reloj: horaActual,
      Evento: eventoActual,
      RND: rndLlegadaCliente,
      TiempoLlegada: tiempoLlegada,
      ProxLlegada: proximaLlegada,
      RND_C: rndComplejidad,
      C: complejidad,
      TiempoReparacion:
        tiempoReparacion == "-"
          ? tiempoReparacion
          : Number(tiempoReparacion.toFixed(2)),
      FinReparacion:
        finReparacion == "-" ? "-" : Number(finReparacion.toFixed(2)),
      ContComp30: contadorComplejidad30,
      ContComp50: contadorComplejidad50,
      AC_TiempoComp30: Number(acumuladorTiempoComplejidad30.toFixed(2)),
      AC_TiempoComp50: Number(acumuladorTiempoComplejidad50.toFixed(2)),
      EstadoRelojero: estadoRelojero,
      ColaRelojes: colaRelojes,
      ObjetosTemporales: nuevaColaObjetos,
      IdsClientes: IdsClientes, // No incrementamos aquí porque no es una llegada
    };
  }
  return evento;
}

// function recortarVector(minutoInicio, iteraciones, simulacion) {
//   // Filtramos los eventos cuyo reloj es igual o mayor al minuto de inicio
//   const simulacionFiltrada = simulacion.filter(
//     (elemento) => elemento.Reloj >= minutoInicio
//   );

//   // Tomamos solo la cantidad de iteraciones solicitadas
//   const resultado = simulacionFiltrada.slice(0, iteraciones);

//   return resultado;
// }

function recortarVector(minutoInicio, iteraciones, simulacion) {
  const simulacionFiltrada = simulacion.filter(
    (elemento) => elemento.Reloj >= minutoInicio
  );

  const resultado = simulacionFiltrada.slice(0, iteraciones);

  // 1. Determinar qué IDs de clientes estuvieron activos alguna vez
  const idsActivos = new Set();
  resultado.forEach((evento) => {
    evento.ObjetosTemporales.forEach((obj) => {
      if (obj.estado !== "-") {
        idsActivos.add(obj.id);
      }
    });
  });

  // 2. Filtrar los clientes en cada evento según los IDs activos
  const resultadoLimpio = resultado.map((evento) => ({
    ...evento,
    ObjetosTemporales: evento.ObjetosTemporales.filter((obj) =>
      idsActivos.has(obj.id)
    ),
  }));

  return resultadoLimpio;
}

function calcularTiempoReparacionEuler(a, h, C, R) {
  let t = 0;
  let D = 0;
  let pasos = [];

  // f(t, D) = 0.5 * C + t + a * R
  function f(t, D) {
    return 0.5 * C + t + a * R;
  }

  while (D < C) {
    const dD = f(t, D); // derivada
    pasos.push({ t, D, dD });
    D = D + h * dD; // actualización de D
    t = t + h; // actualización de t
  }

  t *= 10;

  let nombreHoja = `C${C}_R${R}`;

  agregarHojaExcel(nombreHoja, pasos, h);

  // exportToExcel(pasos, "resultado_euler");

  return parseFloat(t.toFixed(2));
}

import React, { useState } from "react";
import { Play, Clock, Eye, Trash } from "lucide-react";
import simularSistema from "./logica";

export default function App() {
  const [parameters, setParameters] = useState({
    timeX: 0,
    minutoInicio: 0,
    iterations: 0,
    limiteInferior: 13,
    limiteSuperior: 17,
    complejidad1: 30,
    complejidad2: 50,
  });

  const [simulaciones, setSimulaciones] = useState([]);

  const handleParameterChange = (key, value) => {
    setParameters((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const simulateSystem = async () => {
    // Simular el proceso de simulación
    const simulacion = simularSistema(parameters);
    setSimulaciones(simulacion);
  };

  const deleteSimulation = () => {
    setSimulaciones([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            Simulador de Sistema - Relojes antiguos
          </h1>

          {/* Parámetros de entrada */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:col-span-3">
              <h3 className="text-lg font-semibold text-blue-800 mb-6">
                Parámetros de Simulación
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tiempo a simular en minutos
                  </label>
                  <input
                    type="number"
                    placeholder="Ingresar valor"
                    onChange={(e) =>
                      handleParameterChange("timeX", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="1000"
                  />
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mostrar a partir del minuto (j)
                  </label>
                  <input
                    type="number"
                    placeholder="Ingresar valor"
                    onChange={(e) =>
                      handleParameterChange("minutoInicio", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Cantidad de iteraciones a mostrar (i)
                  </label>
                  <input
                    type="number"
                    placeholder="Ingresar valor"
                    onChange={(e) =>
                      handleParameterChange("iterations", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 lg:col-span-3">
              <h3 className="text-lg font-semibold text-red-800 mb-6">
                Parámetros del Sistema
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Distribución de Llegada de Relojes */}
                <div className="bg-white rounded-lg p-4 border border-red-300">
                  <h4 className="text-md font-semibold text-red-700 mb-4 text-center">
                    Distribución de Llegada de Relojes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">
                        Límite Inferior
                      </label>
                      <input
                        type="number"
                        value={parameters.limiteInferior}
                        onChange={(e) =>
                          handleParameterChange(
                            "limiteInferior",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">
                        Límite Superior
                      </label>
                      <input
                        type="number"
                        value={parameters.limiteSuperior}
                        onChange={(e) =>
                          handleParameterChange(
                            "limiteSuperior",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Complejidad de Reparación */}
                <div className="bg-white rounded-lg p-4 border border-red-300">
                  <h4 className="text-md font-semibold text-red-700 mb-4 text-center">
                    Complejidad de Reparación de Relojes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">
                        Complejidad 1
                      </label>
                      <input
                        type="number"
                        value={parameters.complejidad1}
                        onChange={(e) =>
                          handleParameterChange("complejidad1", e.target.value)
                        }
                        className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">
                        Complejidad 2
                      </label>
                      <input
                        type="number"
                        value={parameters.complejidad2}
                        onChange={(e) =>
                          handleParameterChange("complejidad2", e.target.value)
                        }
                        className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parámetros rojos (parametrizables) */}

          {/* Botón de simulación */}
          <div className="text-center space-x-4">
            <button
              onClick={simulateSystem}
              className="inline-flex items-center gap-3 px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700 active:transform active:scale-95 text-white shadow-lg"
            >
              <Play className="w-6 h-6" />
              Iniciar Simulación
            </button>
            <button
              onClick={deleteSimulation}
              className="inline-flex items-center gap-3 px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-200 bg-red-600 hover:bg-red-700 active:transform active:scale-95 text-white shadow-lg"
            >
              <Trash className="w-6 h-6" />
              Borrar simulación
            </button>
          </div>
        </div>
      </div>
      {simulaciones.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Resultados de la Simulación
          </h2>
          <table className="min-w-full text-sm text-gray-700 border border-gray-300">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {/* Encabezados base */}
                {Object.keys(simulaciones[0])
                  .filter(
                    (key) =>
                      key !== "ObjetosTemporales" && key !== "IdsClientes"
                  )
                  .map((key) => (
                    <th
                      key={key}
                      className="px-3 py-2 border border-gray-300 text-left"
                    >
                      {key}
                    </th>
                  ))}

                {/* Detectar cuántos relojes como máximo hay */}
                {(() => {
                  const maxObjetos = Math.max(
                    ...simulaciones.map(
                      (fila) => fila.ObjetosTemporales?.length || 0
                    )
                  );
                  const headers = [];
                  for (let i = 0; i < maxObjetos; i++) {
                    headers.push(
                      <th
                        key={`Estado-${i}`}
                        className="px-3 py-2 border border-gray-300"
                      >
                        Estado Reloj {i + 1}
                      </th>,

                      <th
                        key={`Complejidad-${i}`}
                        className="px-3 py-2 border border-gray-300"
                      >
                        Complejidad Reloj {i + 1}
                      </th>,
                      <th
                        key={`Inicio-${i}`}
                        className="px-3 py-2 border border-gray-300"
                      >
                        Inicio Reparación {i + 1}
                      </th>
                    );
                  }
                  return headers;
                })()}
              </tr>
            </thead>

            <tbody>
              {simulaciones.map((fila, i) => (
                <tr
                  key={i}
                  className={
                    i === simulaciones.length - 1
                      ? "bg-red-700 text-white"
                      : "odd:bg-white even:bg-gray-50"
                  }
                >
                  {/* Valores base excepto ObjetosTemporales */}
                  {Object.entries(fila)
                    .filter(
                      ([key]) =>
                        key !== "ObjetosTemporales" && key !== "IdsClientes"
                    )
                    .map(([key, valor], j) => (
                      <td key={j} className="px-3 py-2 border border-gray-200">
                        {typeof valor === "object"
                          ? JSON.stringify(valor)
                          : valor}
                      </td>
                    ))}

                  {/* Expandir objetos temporales */}
                  {(() => {
                    const columnas = [];
                    const objetos = fila.ObjetosTemporales || [];
                    const maxObjetos = Math.max(
                      ...simulaciones.map(
                        (f) => f.ObjetosTemporales?.length || 0
                      )
                    );

                    for (let k = 0; k < maxObjetos; k++) {
                      const obj = objetos[k];
                      columnas.push(
                        <td
                          key={`estado-${i}-${k}`}
                          className="px-3 py-2 border border-gray-200"
                        >
                          {obj ? obj.estado : "-"}
                        </td>,
                        <td
                          key={`llegada-${i}-${k}`}
                          className="px-3 py-2 border border-gray-200"
                        >
                          {obj ? obj.tiempoLlegada : "-"}
                        </td>,
                        <td
                          key={`comp-${i}-${k}`}
                          className="px-3 py-2 border border-gray-200"
                        >
                          {obj ? obj.complejidad : "-"}
                        </td>,
                        <td
                          key={`inicio-${i}-${k}`}
                          className="px-3 py-2 border border-gray-200"
                        >
                          {obj ? obj.horaInicioReparacion : "-"}
                        </td>
                      );
                    }

                    return columnas;
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

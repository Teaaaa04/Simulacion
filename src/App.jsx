import React, { useState } from "react";
import { Play, Clock, Eye, Trash } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import simularSistema from "./logica";

export default function App() {
  const [parameters, setParameters] = useState({
    timeX: 10,
    minutoInicio: 0,
    iterations: 10,
    limiteInferior: 13,
    limiteSuperior: 17,
    complejidad1: 30,
    complejidad2: 50,
    a: -1,
    h: 0.1,
  });

  const [simulaciones, setSimulaciones] = useState([]);
  const [promedios, setPromedios] = useState(null);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const grupo1 = ["RND", "TiempoLlegada", "ProxLlegada"];
  const grupo2 = ["RND_C", "C", "TiempoReparacion", "FinReparacion"];
  const grupo3 = ["contComp1", "contComp2", "AC_TiempoComp1", "AC_TiempoComp2"];

  const handleParameterChange = (key, value) => {
    setParameters((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const simulateSystem = async () => {
    // Validar parámetros
    if (
      parameters.timeX < 0 ||
      parameters.minutoInicio < 0 ||
      parameters.limiteInferior < 0 ||
      parameters.limiteSuperior < 0 ||
      parameters.complejidad1 < 0 ||
      parameters.complejidad2 < 0 ||
      parameters.a < 0 ||
      parameters.h < 0
    ) {
      alert("Por favor, ingrese valores positivos para los parámetros.");
      return;
    }

    if (parameters.h <= 0) {
      alert("El parámetro h debe ser mayor que 0 para la simulación.");
      return;
    }

    if (parameters.complejidad1 <= 0 || parameters.complejidad2 <= 0) {
      alert(
        "Los valores de complejidad deben ser mayores que 0 para la simulación."
      );
      return;
    }

    if (parameters.a)
      if (parameters.timeX <= parameters.minutoInicio) {
        alert(
          "El tiempo a simular debe ser mayor que el minuto de inicio para mostrar resultados."
        );
        return;
      }

    if (parameters.iterations < 1) {
      alert("La cantidad de iteraciones debe ser al menos 1.");
      return;
    }

    // Validar que el límite inferior sea menor que el superior
    if (parameters.limiteInferior > parameters.limiteSuperior) {
      alert(
        "El límite superior debe ser mayor que el límite inferior para la distribución"
      );
      return;
    }

    // Simular el proceso de simulación
    const { simulacion2, promedios } = simularSistema(parameters);
    setPromedios(promedios);

    setSimulaciones(simulacion2);
  };

  const deleteSimulation = () => {
    setSimulaciones([]);
    setPromedios(null);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 200; // Puedes ajustar esto si querés más/menos filas por página

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentSimulaciones = simulaciones.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(simulaciones.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            Simulador de Sistema - Relojes antiguos
          </h1>

          {/* Parámetros de entrada */}
          <div className="flex gap-8 mb-8 w-full ">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 justify-between w-2/5">
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
                    <Eye className="w-4 h-4" />
                  </label>
                  <input
                    type="number"
                    placeholder="Ingresar valor"
                    value={parameters.minutoInicio}
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
                    value={parameters.iterations}
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
            {/* Parámetros del sistema */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 lg:col-span-3 w-3/5">
              <h3 className="text-lg font-semibold text-red-800 mb-6">
                Parámetros del Sistema
              </h3>

              <div className="flex gap-6">
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
                        defaultValue={parameters.limiteInferior}
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
                        defaultValue={parameters.limiteSuperior}
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
                        defaultValue={parameters.complejidad1}
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
                        defaultValue={parameters.complejidad2}
                        onChange={(e) =>
                          handleParameterChange("complejidad2", e.target.value)
                        }
                        className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Parámetro a */}
                <div className="bg-white rounded-lg p-4 border border-red-300">
                  <h4 className="text-md font-semibold text-red-700 mb-4 text-center">
                    Parámetro a
                  </h4>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-red-700">
                      Valor de a
                    </label>
                    <input
                      type="number"
                      onChange={(e) =>
                        handleParameterChange("a", e.target.value)
                      }
                      className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-300">
                  <h4 className="text-md font-semibold text-red-700 mb-4 text-center">
                    Parámetro h
                  </h4>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm  font-medium text-red-700">
                      Valor de h
                    </label>
                    <input
                      min={0}
                      type="number"
                      defaultValue={parameters.h}
                      onChange={(e) =>
                        handleParameterChange("h", e.target.value)
                      }
                      className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
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
        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
          <div className="overflow-auto max-h-[75vh]">
            {" "}
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
                    .map((key) => {
                      const bgColor = grupo1.includes(key)
                        ? "bg-blue-200"
                        : grupo2.includes(key)
                        ? "bg-green-200"
                        : grupo3.includes(key)
                        ? "bg-pink-200"
                        : "bg-gray-100";
                      return (
                        <th
                          key={key}
                          className={`px-3 py-2 border border-gray-300 text-left break-words ${bgColor}`}
                        >
                          {key}
                        </th>
                      );
                    })}

                  {/* Detectar cuántos relojes como máximo hay */}
                  {(() => {
                    const maxObjetos = Math.max(
                      ...simulaciones.map(
                        (fila) => fila.ObjetosTemporales?.length || 0
                      )
                    );
                    const headers = [];
                    for (let i = 0; i < maxObjetos; i++) {
                      // si i es par, cabcera roja, sino azul
                      const bgColor =
                        i % 2 === 0 ? "bg-red-100" : "bg-blue-100";

                      headers.push(
                        <th
                          key={`Estado-${i}`}
                          className={`px-2 py-2 border border-gray-300 ${bgColor}`}
                        >
                          Estado Reloj {i + 1}
                        </th>,

                        <th
                          key={`Complejidad-${i}`}
                          className={`px-2 py-2 border border-gray-300 ${bgColor}`}
                        >
                          C
                        </th>,
                        <th
                          key={`Inicio-${i}`}
                          className={`px-2 py-2 border border-gray-300 ${bgColor}`}
                        >
                          Inicio Reparación
                        </th>
                      );
                    }
                    return headers;
                  })()}
                </tr>
              </thead>

              <tbody>
                {currentSimulaciones.map((fila, i) => (
                  <tr
                    key={i + indexOfFirstRow}
                    onClick={() => setSelectedRowIndex(i + indexOfFirstRow)}
                    className={`cursor-pointer transition-all ${
                      i + indexOfFirstRow === selectedRowIndex
                        ? "bg-yellow-200 font-semibold"
                        : i + indexOfFirstRow === simulaciones.length - 1
                        ? "bg-red-700 text-white"
                        : i % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    {/* Valores base excepto ObjetosTemporales */}
                    {Object.entries(fila)
                      .filter(
                        ([key]) =>
                          key !== "ObjetosTemporales" && key !== "IdsClientes"
                      )
                      .map(([key, valor], j) => (
                        <td
                          key={j}
                          className="px-3 py-2 border border-gray-200"
                        >
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
                            {obj && obj.estado !== "-"
                              ? `${obj.estado} (${obj.id})`
                              : "-"}
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
        </div>
      )}
      {simulaciones.length > 0 && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
      {promedios && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Promedios de Tiempo de Reparación
          </h3>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-medium text-blue-700">
                Complejidad {parameters.complejidad1}
              </p>
              <p className="text-xl">
                {promedios.promedioTiempoReparacion30} min
              </p>
            </div>
            <div>
              <p className="font-medium text-red-700">
                Complejidad {parameters.complejidad2}
              </p>
              <p className="text-xl">
                {promedios.promedioTiempoReparacion50} min
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

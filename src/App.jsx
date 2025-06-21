import React, { useState } from "react";
import { Play, Clock, Eye } from "lucide-react";

export default function App() {
  const [parameters, setParameters] = useState({
    timeX: 0,
    iterations: 0,
    startHour: 0,
    displayCount: 10,
    limiteInferior: 13,
    limiteSuperior: 17,
    complejidad1: 30,
    complejidad2: 50,
  });

  const handleParameterChange = (key, value) => {
    setParameters((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const simulateSystem = async () => {
    // Simular el proceso de simulación
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            Simulador de Sistema - Relojes antiguos
          </h1>

          {/* Parámetros de entrada */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tiempo a simular en minutos
              </label>
              <input
                type="number"
                value={parameters.timeX}
                onChange={(e) => handleParameterChange("timeX", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="1000"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mostrar a partir del minuto (j)
              </label>
              <input
                type="number"
                value={parameters.startHour}
                onChange={(e) =>
                  handleParameterChange("startHour", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Cantidad de iteraciones a mostrar (i)
              </label>
              <input
                type="number"
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

          {/* Parámetros rojos (parametrizables) */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-6">
              Parámetros del Sistema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        handleParameterChange("limiteInferior", e.target.value)
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
                        handleParameterChange("limiteSuperior", e.target.value)
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

          {/* Botón de simulación */}
          <div className="text-center mb-8">
            <button
              onClick={simulateSystem}
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700 active:transform active:scale-95 text-white shadow-lg"
            >
              <Play className="w-6 h-6" />
              Iniciar Simulación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import * as XLSX from "xlsx";

let contadorHojas;
let workbook;

function inicializarWorkbook() {
  contadorHojas = 1;
  workbook = XLSX.utils.book_new(); // Crear un nuevo workbook
}

export function agregarHojaExcel(nombreBase, pasos, h) {
  if (!workbook) {
    inicializarWorkbook(); // Asegurarse de que el workbook esté inicializado
  }

  let nombreHoja = `${contadorHojas.toString().padStart(3, "0")}_${nombreBase}`;
  contadorHojas++;

  const worksheetData = [
    ["Iteración", "t(i)", "D(i)", "f(t(i), D(i))", "t(i+1)", "D(i+1)"],
  ];

  for (let i = 0; i < pasos.length; i++) {
    const p = pasos[i];
    const t_i = parseFloat(p.t);
    const D_i = parseFloat(p.D);
    const f_i = parseFloat(p.dD);
    const t_next = parseFloat(pasos[i + 1]?.t || t_i + h);
    const D_next = parseFloat(pasos[i + 1]?.D || D_i + h * f_i);

    worksheetData.push([i, t_i, D_i, f_i, t_next, D_next]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
}

export function descargarExcel(nombreArchivo = "integraciones_euler.xlsx") {
  if (!workbook) {
    inicializarWorkbook(); // Asegurarse de que el workbook esté inicializado
  }
  XLSX.writeFile(workbook, nombreArchivo);
  inicializarWorkbook(); // Reiniciar workbook después de guardar
}

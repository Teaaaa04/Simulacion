import * as XLSX from "xlsx";
let contadorHojas = 1;

const workbook = XLSX.utils.book_new(); // se mantiene en memoria

export function agregarHojaExcel(nombreBase, pasos, h) {
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

    // const t_next = (t_i + h).toFixed(2);
    // const D_next = (D_i + h * f_i).toFixed(4);

    worksheetData.push([i, t_i, D_i, f_i, t_next, D_next]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
}

export function descargarExcel(nombreArchivo = "integraciones_euler.xlsx") {
  XLSX.writeFile(workbook, nombreArchivo);
}

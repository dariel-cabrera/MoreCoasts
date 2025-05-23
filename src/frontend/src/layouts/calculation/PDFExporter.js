import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';

class PDFExporter {
  static exportCalculations(data, filters) {
    const doc = new jsPDF();
    
    // Título del reporte
    doc.setFontSize(18);
    doc.text("Reporte de Cálculos de Sedimentos", 105, 15, { align: 'center' });
    
    // Información de filtros
    doc.setFontSize(10);
    let filtrosTexto = "Filtros aplicados: ";
    if (filters.fechaInicio) filtrosTexto += `Desde ${dayjs(filters.fechaInicio).format('DD/MM/YYYY')} `;
    if (filters.fechaFin) filtrosTexto += `Hasta ${dayjs(filters.fechaFin).format('DD/MM/YYYY')} `;
    if (filters.ubicacion) filtrosTexto += `Ubicación: ${filters.ubicacion}`;
    
    doc.text(filtrosTexto, 14, 25);
    doc.text(`Total registros: ${data.length}`, 14, 30);
    
    // Cabeceras de la tabla
    const headers = [
      "Ubicación",
      "Fecha",
      "Densidad Sed.",
      "Densidad Mar",
      "Coef. Porosidad",
      "Índice",
      "Altura (m)",
      "Ángulo (°)",
      "Aceleración",
      "Medición (m³)"
    ];
    
    // Datos de la tabla
    const tableData = data.map(item => [
      item.ubicacion,
      dayjs(item.createdAt).format('DD/MM/YYYY'),
      item.densidad_a,
      item.densidad_m,
      item.coeficiente,
      item.indice,
      item.altura,
      item.angulo,
      item.aceleracion,
      item.P
    ]);
    
    // Generar tabla
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Guardar PDF
    doc.save(`reporte_sedimentos_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
  }
}

export default PDFExporter;
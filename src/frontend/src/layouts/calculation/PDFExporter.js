import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';

class PDFExporter {
  static exportCalculations(data = [], filters = {}) {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        alert("No hay datos válidos para exportar.");
        return;
      }

      const doc = new jsPDF();

      // Título
      doc.setFontSize(18);
      doc.text("Reporte de Cálculos de Sedimentos", 105, 15, { align: 'center' });

      // Filtros aplicados
      doc.setFontSize(10);
      let filtrosTexto = "Filtros aplicados: ";
      if (filters.fechaInicio) filtrosTexto += `Desde ${dayjs(filters.fechaInicio).format('DD/MM/YYYY')} `;
      if (filters.fechaFin) filtrosTexto += `Hasta ${dayjs(filters.fechaFin).format('DD/MM/YYYY')} `;
      if (filters.ubicacion) filtrosTexto += `Ubicación: ${filters.ubicacion}`;

      doc.text(filtrosTexto.trim(), 14, 25);
      doc.text(`Total registros: ${data.length}`, 14, 30);

      // Cabeceras
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

      // Cuerpo de tabla con validación
      const tableData = data.map(item => [
        item.ubicacion || '',
        item.createdAt ? dayjs(item.createdAt).format('DD/MM/YYYY') : '',
        item.densidad_a ?? '',
        item.densidad_m ?? '',
        item.coeficiente ?? '',
        item.indice ?? '',
        item.altura ?? '',
        item.angulo ?? '',
        item.aceleracion ?? '',
        item.P ?? ''
      ]);

      // Generación de tabla
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 35,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        }
      });

      // Guardar
      doc.save(`reporte_sedimentos_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);

    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Ocurrió un error al generar el PDF. Revisa la consola para más detalles.");
    }
  }
}

export default PDFExporter;

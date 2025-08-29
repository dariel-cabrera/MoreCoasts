import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import { format } from 'date-fns';

class PDFExporter {
  static exportCalculations(data, filters, action = 'save') {
    const doc = new jsPDF();
    
    // Configuración inicial del documento
    doc.setProperties({
      title: `Reporte Sedimentos - ${dayjs().format('YYYY-MM-DD HHmmss')}`,
      subject: 'Reporte de cálculos de sedimentos marinos',
      author: 'MoreCoast',
      keywords: 'sedimentos, cálculo, informe técnico',
      creator: 'Aplicación de Ingeniería Costera'
    });

    // Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("Reporte de Cálculos de Sedimentos", 105, 15, { align: 'center' });
    
    // Sección de metadatos y filtros
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const metadata = [
      `Fecha generación: ${dayjs().format('DD/MM/YYYY HH:mm:ss')}`,
      `Filtros aplicados: ${this.formatFilters(filters)}`,
      `Total registros: ${data.length}`
    ];
    
    metadata.forEach((text, index) => {
      doc.text(text, 14, 25 + (index * 5));
    });

    // Configuración de la tabla
    const headers = [
      "Ubicación",
      "Fecha",
      "Hora",
      "Densidad Sedimento. (kg/m³)",
      "Densidad Mar. (kg/m³)",
      "Índice R. (k)",
      "Coef. P. (n)", 
      "Altura (m)",
      "Ángulo (°)",  
      "g (m/s²)",
      "Q (m³)", 
      "P (m³)", 
      "K"
    ];

    const tableData = data.map(item => [
      item.ubicacion,
      format(new Date(item.fecha), 'dd-MM-yy'),
      format(new Date(item.fecha), 'HH:mm:ss'),
      item.densidad_a,
      item.densidad_m,
      item.coeficiente,
      item.indice,
      item.altura,
      item.angulo,
      item.aceleracion,
      item.Q,
      item.P,
      item.K
    ]);

    // Generación de la tabla
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 45,
      theme: 'grid',
      tableWidth: 'auto', // hace que el ancho total se ajuste automáticamente
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: 'center',
        valign: 'middle'
      },
      headerStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
       // Aplica mismo ancho y alineación a todas las columnas
    0: { cellWidth: 'auto', halign: 'center' },
    1: { cellWidth: 'auto', halign: 'center' },
    2: { cellWidth: 'auto', halign: 'center' },
    3: { cellWidth: 'auto', halign: 'center' },
    4: { cellWidth: 'auto', halign: 'center' },
    5: { cellWidth: 'auto', halign: 'center' },
    6: { cellWidth: 'auto', halign: 'center' },
    7: { cellWidth: 'auto', halign: 'center' },
    8: { cellWidth: 'auto', halign: 'center' },
    9: { cellWidth: 'auto', halign: 'center' },
    10: { cellWidth: 'auto', halign: 'center' },
    11: { cellWidth: 'auto', halign: 'center' },
    12: { cellWidth: 'auto', halign: 'center' }
      }
    });

    // Acción final: guardar o imprimir
    if (action === 'print') {
      this.printPDF(doc);
    } else {
      doc.save(`reporte_sedimentos_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
    }
  }

  static formatFilters(filters) {
    let text = '';
    if (filters.fechaInicio) text += `Desde: ${dayjs(filters.fechaInicio).format('DD/MM/YYYY')} `;
    if (filters.fechaFin) text += `Hasta: ${dayjs(filters.fechaFin).format('DD/MM/YYYY')} `;
    if (filters.ubicacion) text += `Ubicación: ${filters.ubicacion}`;
    return text || 'Ningún filtro aplicado';
  }

  static formatNumber(value) {
    return typeof value === 'number' ? value.toFixed(2) : '-';
  }

  static printPDF(doc) {
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const printWindow = window.open(pdfUrl);
    printWindow?.addEventListener('load', () => {
      printWindow.print();
      URL.revokeObjectURL(pdfUrl);
    });
  }
}

export default PDFExporter;
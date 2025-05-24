import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

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
      "Fecha Muestreo",
      "Densidad Sed. (kg/m³)",
      "Densidad Mar (kg/m³)",
      "Índice Romp (k)",
      "Coef. Porosidad (n)", 
      "Altura (m)",
      "Ángulo (°)",  
      "Aceleración (m/s²)",
      "Q (m³)", 
      "Medición Práctica (m³)", 
      "K"
    ];

    const tableData = data.map(item => [
      item.ubicacion,
      dayjs(item.createdAt).format('DD/MM/YYYY HH:mm'),
      this.formatNumber(item.densidad_a),
      this.formatNumber(item.densidad_m),
      this.formatNumber(item.coeficiente),
      this.formatNumber(item.indice),
      this.formatNumber(item.altura),
      this.formatNumber(item.angulo),
      this.formatNumber(item.aceleracion),
      this.formatNumber(item.Q),
      this.formatNumber(item.P),
      this.formatNumber(item.K)
    ]);

    // Generación de la tabla
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 45,
      theme: 'grid',
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
        0: { halign: 'left', cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
        8: { halign: 'right' },
        9: { halign: 'right' },
        10: { halign: 'right' },
        11: { halign: 'right' }
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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import { format } from 'date-fns';

class PDFExporter {
  static exportTrazas(data, filters, action = 'save') {
    const doc = new jsPDF();
    
    // Configuración inicial del documento
    doc.setProperties({
      title: `Reporte Trazas - ${dayjs().format('YYYY-MM-DD HHmmss')}`,
      subject: 'Reporte de Trazas de MoreCoast',
      author: 'MoreCoast',
      keywords: 'seguridad, cálculo, informe técnico',
      creator: 'MoreCoast'
    });

    // Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("Reporte de Trazas del Sistema", 105, 15, { align: 'center' });
    
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
      "Usuario",
      "Fecha ",
      "Hora",
      "Nombre",
      "Apellido",
      "CI",
      "Accion", 
    ];

    const tableData = data.map(item => [
      item.idUser.user_name,
      item.fecha ? format(new Date(item.fecha), 'dd-MM-yy') : "Sin fecha",
      item.fecha ? format(new Date(item.fecha), 'HH:mm:ss') : "Sin Hora",
      item.idUser.name,
      item.idUser.lastname,
      item.idUser.ci,
      item.accion
      
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
      }
    });

    // Acción final: guardar o imprimir
    if (action === 'print') {
      this.printPDF(doc);
    } else {
      doc.save(`reporte_trazas_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
    }
  }

  static formatFilters(filters) {
    let text = '';
    if (filters.fechaInicio) text += `Desde: ${dayjs(filters.fechaInicio).format('DD/MM/YYYY')} `;
    if (filters.fechaFin) text += `Hasta: ${dayjs(filters.fechaFin).format('DD/MM/YYYY')} `;
    if (filters.users) text += `Usuario: ${filters.users}`;
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
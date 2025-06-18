import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";

class ReportesEstadisticos {
  static async exportReports( reportRef, data, filters, action = 'save') {
    if (!reportRef) {
      console.error("Elemento objetivo no definido para exportar reporte");
      return;
    }

    const canvas = await html2canvas( reportRef, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    
    const doc = new jsPDF("landscape", "mm", "a4");
    
    // Metadatos del documento
    doc.setProperties({
      title: `Reporte Estadístico - ${dayjs().format("YYYY-MM-DD HHmmss")}`,
      subject: "Reporte estadístico de sedimentos marinos",
      author: "MoreCoast",
      keywords: "sedimentos, estadísticas, gráficos",
      creator: "Aplicación de Ingeniería Costera",
    });

    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte Estadístico", 148, 15, { align: "center" });

    // Información del reporte
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const metadata = [
      `Fecha de generación: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}`,
      `Filtros aplicados: ${this.formatFilters(filters)}`,
      `Total de registros: ${data.length}`,
    ];

    metadata.forEach((line, i) => {
      doc.text(line, 15, 25 + i * 6);
    });

    // Insertar gráficos
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgProps = doc.getImageProperties(imgData);
    const imgWidth = pageWidth - 30;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    doc.addImage(imgData, "PNG", 15, 45, imgWidth, imgHeight);

    // Acción final (guardar/imprimir)
    if (action === "print") {
      this.printPDF(doc);
    } else {
      doc.save(`reporte-estadistico-${dayjs().format("YYYYMMDD_HHmmss")}.pdf`);
    }
  }

  static printPDF(doc) {
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);
    
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
        URL.revokeObjectURL(pdfUrl);
      });
    }
  }

  static formatFilters(filters) {
    let text = "";
    if (filters.fechaInicio)
      text += `Desde: ${dayjs(filters.fechaInicio).format("DD/MM/YYYY")} `;
    if (filters.fechaFin)
      text += `Hasta: ${dayjs(filters.fechaFin).format("DD/MM/YYYY")} `;
    if (filters.ubicacion && filters.ubicacion !== "Todas")
      text += `Ubicación: ${filters.ubicacion}`;
      
    return text || "Ningún filtro aplicado";
  }
}

export default ReportesEstadisticos;
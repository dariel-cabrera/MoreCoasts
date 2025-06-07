// components/ReportesEstadisticos.jsx
import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import MDButton from "components/MDButton";

const ReportesEstadisticos = ({ targetRef }) => {
  const handleExportPDF = async () => {
    if (!targetRef.current) return;

    const canvas = await html2canvas(targetRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);

    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("reporte-estadistico.pdf");
  };

  const handleImprimir = () => {
    if (!targetRef.current) return;
    const ventanaImpresion = window.open("", "_blank");
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Imprimir Reporte</title>
        </head>
        <body>
          ${targetRef.current.innerHTML}
        </body>
      </html>
    `);
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
    ventanaImpresion.close();
  };

  return (
    <>
      <MDButton
        variant="gradient"
        color="success"
        onClick={handleImprimir}
      >
        Imprimir
      </MDButton>
      <MDButton
        variant="gradient"
        color="error"
        onClick={handleExportPDF}
      >
        Exportar PDF
      </MDButton>
    </>
  );
};

export default ReportesEstadisticos;

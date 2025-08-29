import React from 'react';
import axios from 'axios';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  responseType: 'blob',
});

export const ExportToExcel = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Conectando a:', api.defaults.baseURL);
      
      const response = await api.get('/export-excel');
      
      if (response.status !== 200) {
        throw new Error(`Error ${response.status}`);
      }

      // Crear el blob
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Verificar si el navegador soporta la API de File System Access
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: 'calculos_sedimentos.xlsx',
            types: [{
              description: 'Archivos Excel',
              accept: {
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              },
            }],
          });
          
          // Crear un stream de escritura
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        } catch (err) {
          // Si el usuario cancela el diálogo, no es un error real
          if (err.name !== 'AbortError') {
            throw err;
          }
        }
      } else {
        // Fallback para navegadores que no soportan la API
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'calculos_sedimentos.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }

    } catch (error) {
      console.error('Error en exportación:', error);
      setError(error.message || 'Error al exportar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleExport}
        disabled={isLoading}
        style={{
          padding: '0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
         
      >
        <img 
        src="/images/export.png" // Ajusta la ruta
        alt="Exportar a Excel"
        style={{ 
          width: '25x', 
          height: '25px',
          opacity: isLoading ? 0.5 : 1 // Opacidad al cargar
        }}
      />
       
      </button>

      {error && (
        <div style={{
          color: '#d32f2f',
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#fde8e8',
          borderRadius: '4px',
        }}>
          {error}
          <button 
            onClick={() => setError(null)} 
            style={{
              background: 'none',
              border: 'none',
              color: '#d32f2f',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
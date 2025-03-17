import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { TablaCalculo } from './components/TablaCalculo';
import { calcularDatos, actualizarDatos, eliminarDatos } from './components/AccionesCalculo';
import Menu from './components/Menu';
import NuevoCalculo from './NuevoCalculo';
import { ButonCabecera } from './components/ButonCabecera';

function App() {
  const [calculo, setCalculo] = useState({
    densidad_a: 0,
    densidad_m: 0,
    coeficiente: 0,
    indice: 0,
    altura: 0,
    angulo: 0,
    aceleracion: 0,
    P: 0,
    id: 0,
  });

  const [calculos, setCalculos] = useState([]);
  const [editar, setEditar] = useState(false);
  const [mostrarNuevoCalculo, setMostrarNuevoCalculo] = useState(false);

  const getDatos = async () => {
    try {
      const respuesta = fetch("http://localhost:3001/calculo");
      const datos = await respuesta.json();
      setCalculos(datos);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    getDatos();
  }, []);

  const limpiarDatos = () => {
    setCalculo({
      densidad_a: 0,
      densidad_m: 0,
      coeficiente: 0,
      indice: 0,
      altura: 0,
      angulo: 0,
      aceleracion: 0,
      P: 0,
      id: 0,
    });
    setEditar(false);
    setMostrarNuevoCalculo(false);
  };

  const editarCalculos = (val) => {
    console.log('Editando Datos');
    setEditar(true);
    setMostrarNuevoCalculo(true);
    
    setCalculo({
      densidad_a: val.densidad_a,
      densidad_m: val.densidad_m,
      coeficiente: val.coeficiente,
      indice: val.indice,
      altura: val.altura,
      angulo: val.angulo,
      aceleracion: val.aceleracion,
      P: val.P,
      id: val._id,
    });
  };

  const handleNuevoCalculo = () => {
    setMostrarNuevoCalculo(true);
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          <h1>Gestión de Cálculos</h1>
        </div>
        <Menu />
        <ButonCabecera handleNuevoCalculo={handleNuevoCalculo} />
        <div className="card-body">
          {mostrarNuevoCalculo ? (
            <NuevoCalculo
              calculo={calculo}
              setCalculo={setCalculo}
              limpiarDatos={limpiarDatos}
              getDatos={getDatos}
              editar={editar}
              calcularDatos={calcularDatos}
              actualizarDatos={actualizarDatos}
            />
          ) : (
            <TablaCalculo
              datos={calculos}
              onEliminar={(id) => eliminarDatos({ idValue: id, getDatos, limpiarDatos })}
              onEditar={(val) => {
                editarCalculos(val);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
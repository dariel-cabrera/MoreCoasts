import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Checkbox, Typography, AppBar, Toolbar, Snackbar, Alert } from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Adaptador de fecha
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Proveedor de localización
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

import { format, parse } from 'date-fns'; // Importar format y parse de date-fns

import UbicacionService from 'services/ubicacion-service';
import { crear,eliminar } from './mapHttp';

const Mapa = () => {
    const [areas, setAreas] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentArea, setCurrentArea] = useState({ nombre: '', ciudad: '', poligono: [] });
    
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'
    const featureGroupRef = useRef();

    

    useEffect(() => {
        fetchArea();
    }, []);

    // Obtener los circuitos desde el backend
    const fetchArea = async () => {
        try {
          const response = await UbicacionService.getUbicaciones();
          console.log("Datos recibidos:", response.data); // Verificar estructura de datos
          
          const formattedAreas = response.data.map(area => {
            // Asegurarse que poligono es un array de arrays de [lat, lng]
            const polygonCoords = Array.isArray(area.poligono) ? 
              area.poligono.map(coord => 
                Array.isArray(coord) ? coord : [coord.lat, coord.lng]
              ) : [];
            
            return {
              ...area,
              poligono: polygonCoords,
              visible: true
            };
          });
          
          setAreas(formattedAreas);
        } catch (error) {
          console.error("Error fetching areas:", error);
        }
      };

    // Guardar un circuito (crear o actualizar)
    const handleSave = async () => {
        const areaParaGuardar = {
            ...currentArea,  
        };

        try {
            if (currentArea._id) {
                await axios.put(`http://localhost:5000/api/circuits/${currentArea._id}`, areaParaGuardar);
                setSnackbarMessage('Area actualizada correctamente');
            } else {
                console.log(currentArea.poligono);
                await crear(areaParaGuardar);
                setSnackbarMessage('Area creada correctamente');
            }
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setOpen(false);
            fetchArea(); // Actualizar la lista de circuitos
        } catch (error) {
            setSnackbarMessage('Error al guardar el area');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // Eliminar un circuito
    const handleDelete = async (id) => {
        try {
            await eliminar(id)
            setAreas((prevArea) => prevArea.filter(area => area._id !== id)); // Actualizar el estado local
            setSnackbarMessage('Area eliminada correctamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Eliminar el polígono del mapa
            const layer = featureGroupRef.current.getLayers().find(layer => layer._leaflet_id === id);
            if (layer) {
                featureGroupRef.current.removeLayer(layer);
            }
        } catch (error) {
            setSnackbarMessage('Error al eliminar el area');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // Manejar la creación de un polígono
    const handleCreate = useCallback((e) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const coordinates = layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng ]);
            setCurrentArea({ ...currentArea, poligono: coordinates });
            setOpen(true);
        }
    }, [currentArea]);

    // Alternar la visibilidad de un circuito
    const toggleVisibility = useCallback((id) => {
        setAreas((prevAreas) =>
            prevAreas.map(area =>
                area._id === id ? { ...area, visible: !area.visible } : area
            )
        );
    }, []);

      // Memoizar los polígonos para evitar re-renderizados innecesarios
      const visibleAreas = useMemo(() => {
        return areas.filter(area => area.visible).map((area, idx) => {
            
            return (
                <Polygon
                    key={area._id}
                    positions={area.poligono}
                    pathOptions={{ color:  'green' } }// Colorear según el horario
                >
                    <Popup>
                        <div>
                            <h3>{area.nombre}</h3>
                            <p>{area.ciudad}</p>
                            <Button onClick={() => { setCurrentArea(area); setOpen(true); }}>Editar</Button>
                            <Button onClick={() => handleDelete(area._id)}>Eliminar</Button>
                        </div>
                    </Popup>
                </Polygon>
            );
        });
    }, [areas]);


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div style={{ height: '100vh', width: '100%' }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Areas Calculadas
                        </Typography>
                       
                    </Toolbar>
                </AppBar>
                <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                    <div style={{ width: '300px', padding: '16px', borderRight: '1px solid #ccc', overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
                        <Typography variant="h6" gutterBottom>
                            Lista de Areas
                        </Typography>
                        <List>
                            {areas.map((area) => (
                                <ListItem key={area._id}>
                                    <Checkbox
                                        checked={area.visible}
                                        onChange={() => toggleVisibility(area._id)}
                                    />
                                    <ListItemText primary={area.nombre} secondary={`${area.ciudad} `} />
                                    <Button onClick={() => { setCurrentArea(area); setOpen(true); }}>Editar</Button>
                                    <Button onClick={() => handleDelete(area._id)}>Eliminar</Button>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div style={{ flex: 1 }}>
                        <MapContainer center={[20.0217, -75.8294]} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <FeatureGroup ref={featureGroupRef}>
                                <EditControl
                                    position="topright"
                                    onCreated={handleCreate}
                                    draw={{
                                        rectangle: false,
                                        circle: false,
                                        circlemarker: false,
                                        marker: false,
                                        polyline: false,
                                        polygon: true,
                                    }}
                                />
                            </FeatureGroup>
                            {visibleAreas}
                        </MapContainer>
                    </div>
                </div>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{currentArea._id ? 'Editar Area' : 'Nuevo Area'}</DialogTitle>
                    <DialogContent>
                        <TextField label="Nombre" value={currentArea.nombre} onChange={(e) => setCurrentArea({ ...currentArea, nombre: e.target.value })} fullWidth margin="dense" />
                        <TextField label="Ciudad" value={currentArea.ciudad} onChange={(e) => setCurrentArea({ ...currentArea, ciudad: e.target.value })} fullWidth margin="dense" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </LocalizationProvider>
    );
};

export default Mapa;
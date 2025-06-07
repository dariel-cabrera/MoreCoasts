import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Checkbox, Typography, AppBar, Toolbar, Snackbar, Alert } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import * as yup from 'yup';
import UbicacionService from 'services/ubicacion-service';
import { crear, eliminar,actualizar } from './mapHttp';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Esquema de validación para el área
const areaSchema = yup.object().shape({
  nombre: yup.string()
    .required('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  ciudad: yup.string()
    .required('La ciudad es requerida')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  poligono: yup.array()
    .of(
      yup.array()
        .of(yup.number())
        .length(2, 'Cada coordenada debe tener exactamente 2 valores [lat, lng]')
        .required('Las coordenadas son requeridas')
    )
    .min(3, 'Un polígono debe tener al menos 3 puntos')
    .required('El polígono es requerido')
});

const Mapa = () => {
    const [areas, setAreas] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentArea, setCurrentArea] = useState({ nombre: '', ciudad: '', poligono: [] });
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(false);
    const featureGroupRef = useRef();

    useEffect(() => {
        fetchAreas();
    }, []);

    // Validar el área actual
    const validateArea = async () => {
        try {
            await areaSchema.validate(currentArea, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationError) {
            const newErrors = {};
            validationError.inner.forEach(err => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    // Obtener las áreas desde el backend con validación
    const fetchAreas = async () => {
        setLoading(true);
        try {
            const response = await UbicacionService.getUbicaciones();
            
            if (!Array.isArray(response)) {
                throw new Error('La respuesta no es un array válido');
            }

            const formattedAreas = response.map(area => {
                if (!area || typeof area !== 'object') {
                    console.warn('Área inválida encontrada:', area);
                    return null;
                }

                // Validar y formatear coordenadas
                let polygonCoords = [];
                if (Array.isArray(area.poligono)) {
                    polygonCoords = area.poligono.map(coord => {
                        if (Array.isArray(coord)) {
                            return coord.slice(0, 2); // Tomar solo lat y lng
                        } else if (coord && typeof coord === 'object' && 'lat' in coord && 'lng' in coord) {
                            return [coord.lat, coord.lng];
                        }
                        console.warn('Coordenada inválida:', coord);
                        return [0, 0]; // Valor por defecto
                    }).filter(coord => coord.length === 2);
                }

                return {
                    _id: area._id || Math.random().toString(36).substr(2, 9),
                    nombre: area.nombre || 'Sin nombre',
                    ciudad: area.ciudad || 'Sin ciudad',
                    poligono: polygonCoords,
                    visible: true
                };
            }).filter(area => area !== null && area.poligono.length >= 3); // Filtrar áreas inválidas
            
            setAreas(formattedAreas);
        } catch (error) {
            console.error("Error fetching areas:", error);
            showSnackbar('Error al cargar las áreas', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Mostrar snackbar con manejo de errores
  const showSnackbar = (message, severity = 'success') => {
    // Limpiar mensajes de error técnicos
    const cleanMessage = message
      .replace('Error: ', '')
      .replace('AxiosError: ', '')
      .replace('HttpException: ', '');
    
    setSnackbarMessage(cleanMessage);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

    // Guardar un área (crear o actualizar) con validación
    const handleSave = async () => {
        if (!await validateArea()) {
            showSnackbar('Por favor corrige los errores en el formulario', 'error');
            return;
        }

        try {
            setLoading(true);
            console.log(currentArea)
            if (currentArea._id) {
                await actualizar(currentArea._id, currentArea);
                showSnackbar('Área actualizada correctamente');
            } else {
                await crear(currentArea);
                showSnackbar('Área creada correctamente');
            }
            setOpen(false);
            fetchAreas();
        } catch (error) {
            console.error('Error saving area:', error);
            showSnackbar(error.message, 'error');
             // Manejar errores específicos del backend
            if (error.message.includes('ya está registrado') || 
                error.message.includes('ya está en uso')) {
                setErrors(prev => ({ ...prev, nombre: error.message }));
            }
        } finally {
            setLoading(false);
        }
    };

    // Eliminar un área con confirmación
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta área?')) {
            return;
        }

        try {
            setLoading(true);
            await eliminar(id);
            setAreas(prevAreas => prevAreas.filter(area => area._id !== id));
            showSnackbar('Área eliminada correctamente');

            const layer = featureGroupRef.current?.getLayers()?.find(layer => layer._leaflet_id === id);
            if (layer) {
                featureGroupRef.current.removeLayer(layer);
            }
        } catch (error) {
            console.error('Error deleting area:', error);
            showSnackbar(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Manejar la creación de un polígono con validación básica
    const handleCreate = useCallback((e) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const coordinates = layer.getLatLngs()[0].map(latLng => {
                // Validar que lat y lng sean números válidos
                const lat = typeof latLng.lat === 'number' ? latLng.lat : 0;
                const lng = typeof latLng.lng === 'number' ? latLng.lng : 0;
                return [lat, lng];
            });
            
            // Validar que el polígono tenga al menos 3 puntos
            if (coordinates.length >= 3) {
                setCurrentArea(prev => ({ ...prev, poligono: coordinates }));
                setOpen(true);
            } else {
                showSnackbar('Un polígono debe tener al menos 3 puntos', 'error');
            }
        }
    }, []);

    // Alternar la visibilidad de un área
    const toggleVisibility = useCallback((id) => {
        setAreas(prevAreas =>
            prevAreas.map(area =>
                area._id === id ? { ...area, visible: !area.visible } : area
            )
        );
    }, []);

    // Renderizar áreas visibles con memoización
    const visibleAreas = useMemo(() => {
        return areas.filter(area => area.visible && area.poligono?.length >= 3).map((area) => (
            <Polygon
                key={area._id}
                positions={area.poligono}
                pathOptions={{ color: area.color || 'green' }}
                eventHandlers={{
                    click: () => console.log('Polygon clicked', area)
                }}
            >
                <Popup>
                    <div>
                        <h3>{area.nombre}</h3>
                        <p>{area.ciudad}</p>
                        <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => { setCurrentArea(area); setOpen(true); }}
                            sx={{ mr: 1 }}
                        >
                            Editar
                        </Button>
                        <Button 
                            variant="contained" 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(area._id)}
                        >
                            Eliminar
                        </Button>
                    </div>
                </Popup>
            </Polygon>
        ));
    }, [areas]);

    return (
         <DashboardLayout sx={{ width: "100%" }}>
        <DashboardNavbar />
        <div style={{ height: '100vh', width: '100%' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Gestión de Áreas Geográficas
                    </Typography>
                    {loading && (
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            Cargando...
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
            <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                <div style={{ width: '300px', padding: '16px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                        Lista de Áreas ({areas.length})
                    </Typography>
                    {areas.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                            No hay áreas disponibles
                        </Typography>
                    ) : (
                    <List>
                    {areas.map((area) => (
                        <ListItem key={area._id} dense sx={{ py: 0.5 }}>
                        <Checkbox
                            checked={area.visible}
                            onChange={() => toggleVisibility(area._id)}
                            size="small"
                            disabled={loading}
                            sx={{ p: 0.5 }}
                        />
                        <ListItemText 
                            primary={
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                {area.nombre}
                            </Typography>
                            } 
                            secondary={
                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                                {area.ciudad}
                            </Typography>
                            } 
                            sx={{ my: 0 }}
                        />
                        <Button 
                            size="small" 
                            onClick={() => { setCurrentArea(area); setOpen(true); }}
                            disabled={loading}
                            sx={{ 
                            minWidth: 'auto', 
                            fontSize: '0.65rem',
                            p: 0.5,
                            mx: 0.5
                            }}
                        >
                            Editar
                        </Button>
                        <Button 
                            size="small" 
                            onClick={() => handleDelete(area._id)}
                            color="error"
                            disabled={loading}
                            sx={{ 
                            minWidth: 'auto', 
                            fontSize: '0.65rem',
                            p: 0.5
                            }}
                        >
                            Eliminar
                        </Button>
                        </ListItem>
                    ))}
                    </List>
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <MapContainer 
                        center={[20.0217, -75.8294]} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer 
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
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
                                    polygon: {
                                        allowIntersection: false,
                                        drawError: {
                                            color: '#e1e100',
                                            message: 'No se permiten polígonos que se intersecten'
                                        },
                                        shapeOptions: {
                                            color: '#3388ff'
                                        }
                                    },
                                }}
                            />
                        </FeatureGroup>
                        {visibleAreas}
                    </MapContainer>
                </div>
            </div>
            
            <Dialog open={open} onClose={() => !loading && setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{currentArea._id ? 'Editar Área' : 'Nueva Área'}</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Nombre" 
                        value={currentArea.nombre} 
                        onChange={(e) => setCurrentArea({ ...currentArea, nombre: e.target.value })} 
                        fullWidth 
                        margin="normal"
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        disabled={loading}
                    />
                    <TextField 
                        label="Ciudad" 
                        value={currentArea.ciudad} 
                        onChange={(e) => setCurrentArea({ ...currentArea, ciudad: e.target.value })} 
                        fullWidth 
                        margin="normal"
                        error={!!errors.ciudad}
                        helperText={errors.ciudad}
                        disabled={loading}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Puntos del polígono: {currentArea.poligono?.length || 0}
                        {errors.poligono && (
                            <span style={{ color: 'red', display: 'block' }}>{errors.poligono}</span>
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
     <Footer />
    </DashboardLayout>
    );
};

export default Mapa;
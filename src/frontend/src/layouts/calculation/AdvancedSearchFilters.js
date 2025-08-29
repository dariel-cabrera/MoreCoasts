import React from 'react';
import { TextField, MenuItem, Grid, Button, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const AdvancedSearchFilters = ({
  filters,
  locations,
  onFilterChange,
  onApplyFilters,
  onClearFilters
}) => {
  return (
    <Box mb={3}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Fecha Inicio"
              value={filters.fechaInicio ? dayjs(filters.fechaInicio) : null}
              onChange={(date) =>
                onFilterChange({
                  target: {
                    name: 'fechaInicio',
                    value: date ? date.format('YYYY-MM-DD') : ''
                  }
                })
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Fecha Fin"
              value={filters.fechaFin ? dayjs(filters.fechaFin) : null}
              onChange={(date) =>
                onFilterChange({
                  target: {
                    name: 'fechaFin',
                    value: date ? date.format('YYYY-MM-DD') : ''
                  }
                })
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Ubicación"
              name="ubicacion"
              value={filters.ubicacion}
              onChange={onFilterChange}
              fullWidth
            >
              <MenuItem value="">Todas las ubicaciones</MenuItem>
              {locations.map((loc, index) => (
                <MenuItem key={index} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3} display="flex" alignItems="center">
            <Button
              variant="contained"
              color="info"
              onClick={onApplyFilters}
              sx={{ color: 'black', mr: 2 }}
            >
              Filtrar
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={onClearFilters}
              sx={{ color: 'black', borderColor: 'black' }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default AdvancedSearchFilters;

AdvancedSearchFilters.propTypes = {
  filters: PropTypes.shape({
    fechaInicio: PropTypes.string,
    fechaFin: PropTypes.string,
    ubicacion: PropTypes.string,
  }).isRequired,
  locations: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};
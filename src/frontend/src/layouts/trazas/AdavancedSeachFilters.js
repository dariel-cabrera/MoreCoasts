import React from 'react'; 
import { TextField, MenuItem, Grid, Button, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const AdvancedSearchFilters = ({
  filters,
  users,
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
              label="Usuarios"
              name="users" 
              value={filters.users}
              onChange={onFilterChange}
              fullWidth
            >
              <MenuItem value="">Todos los usuarios</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.user_name}
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

// ✅ Corrección en propTypes
AdvancedSearchFilters.propTypes = {
  filters: PropTypes.shape({
    fechaInicio: PropTypes.string,
    fechaFin: PropTypes.string,
    users: PropTypes.string, // <- estaba mal como 'user'
  }).isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired, // <- estaba como 'locations'
  onFilterChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

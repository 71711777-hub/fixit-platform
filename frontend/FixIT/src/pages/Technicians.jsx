
import { useEffect, useState } from 'react';
import TechnicianCard from '../components/TechnicianCard';
import { obtenerTecnicos } from '../services/api';
import './Technicians.css';

function Technicians() {
  const [orden, setOrden] = useState('recomendados');
  const [tecnicos, setTecnicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarTecnicos() {
      try {
        setCargando(true);
        setError('');

        const datos = await obtenerTecnicos();

        if (activo) {
          setTecnicos(datos);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || 'No se pudieron cargar los técnicos.');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarTecnicos();

    return () => {
      activo = false;
    };
  }, []);

  const tecnicosAdaptados = tecnicos.map((tecnico) => ({
    ...tecnico,
    especialidad: tecnico.especialidades?.length
      ? tecnico.especialidades.join(' · ')
      : 'Especialidad no registrada',
    disponibilidad: tecnico.acepta_reservas
      ? 'Acepta reservas'
      : 'Consultar disponibilidad',
    ubicacion: 'Ubicación no registrada',
  }));

  const tecnicosOrdenados = [...tecnicosAdaptados].sort((a, b) => {
    if (orden === 'calificacion') {
      return b.calificacion - a.calificacion;
    }

    if (orden === 'resenas') {
      return b.resenas - a.resenas;
    }

    return b.calificacion - a.calificacion || b.resenas - a.resenas;
  });

  return (
    <div className="technicians-container">
      <aside className="filters-sidebar">
        <h3>Filtros</h3>

        <div className="filter-group">
          <h4>Compatibilidad</h4>
          <label>
            <input type="checkbox" defaultChecked />
            Alta (Sugeridos)
          </label>
          <label>
            <input type="checkbox" />
            Media
          </label>
          <label>
            <input type="checkbox" />
            Todos
          </label>
        </div>

        <div className="filter-group">
          <h4>Cercanía</h4>
          <label>
            <input type="checkbox" />
            Menos de 2 km
          </label>
          <label>
            <input type="checkbox" />
            Menos de 5 km
          </label>
          <label>
            <input type="checkbox" />
            Todo Lima
          </label>
        </div>

        <div className="filter-group">
          <h4>Disponibilidad</h4>
          <label>
            <input type="checkbox" />
            Inmediata
          </label>
          <label>
            <input type="checkbox" />
            Hoy
          </label>
          <label>
            <input type="checkbox" />
            Próximas 24 hrs
          </label>
        </div>
      </aside>

      <main className="technicians-list-section">
        <div className="list-header">
          <h2>Técnicos compatibles con tu diagnóstico</h2>

          <div className="sort-wrapper">
            <label htmlFor="ordenar">Ordenar por:</label>
            <select
              id="ordenar"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="sort-select"
            >
              <option value="recomendados">Recomendados</option>
              <option value="calificacion">Mejor calificación</option>
              <option value="resenas">Más reseñas</option>
            </select>
          </div>
        </div>

        {cargando && (
          <p role="status">Cargando técnicos...</p>
        )}

        {!cargando && error && (
          <div role="alert" className="technicians-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && tecnicosOrdenados.length === 0 && (
          <p className="technicians-message">
            Todavía no hay técnicos registrados.
          </p>
        )}

        {!cargando && !error && tecnicosOrdenados.length > 0 && (
          <div className="technicians-list">
            {tecnicosOrdenados.map((tecnico) => (
              <TechnicianCard
                key={tecnico.id}
                data={tecnico}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Technicians;

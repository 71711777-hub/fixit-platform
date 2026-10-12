import { useNavigate } from 'react-router-dom'
import './TechnicianCard.css'

function TechnicianCard({ data }) {
const navigate = useNavigate()

const handleVerPerfil = () => {
navigate(`/technician/${data.id}`)
}

const tieneCalificacion = Number(data.calificacion) > 0
const tieneTarifas =
data.tarifa_hora_min != null && data.tarifa_hora_max != null

return (
<article className="technician-card">
{/* AVATAR */}
<div className="tech-avatar-placeholder">
{data.nombre?.charAt(0)?.toUpperCase() || 'T'}
</div>

  {/* INFORMACIÓN PRINCIPAL */}
  <div className="tech-info">
    <div className="tech-header-row">
      <h3>{data.nombre}</h3>

      <span
        className={`status-tag ${
          data.acepta_reservas ? 'tag-today' : 'tag-tomorrow'
        }`}
      >
        {data.acepta_reservas
          ? 'Acepta reservas'
          : 'Consultar disponibilidad'}
      </span>
    </div>

    <p className="tech-specialty">
      {data.especialidad || 'Especialidad no registrada'}
    </p>

    {/* CALIFICACIÓN Y RESEÑAS */}
    <div className="tech-stats">
      <span className="star-icon">★</span>

      <strong>
        {tieneCalificacion
          ? Number(data.calificacion).toFixed(1)
          : 'Sin calificación'}
      </strong>

      <span className="tech-reviews">
        ({Number(data.resenas) || 0} reseñas)
      </span>
    </div>

    {/* TARIFA POR HORA */}
    <p className="tech-price">
      {tieneTarifas
        ? `S/ ${Number(data.tarifa_hora_min).toFixed(2)} – S/ ${Number(
            data.tarifa_hora_max
          ).toFixed(2)} por hora`
        : 'Tarifa por consultar'}
    </p>

    {/* UBICACIÓN */}
    <p className="tech-location">
      {data.ubicacion || 'Ubicación no registrada'}
    </p>
  </div>

  {/* ACCIÓN */}
  <div className="tech-action">
    <button className="btn-primary" onClick={handleVerPerfil}>
      Ver perfil
    </button>
  </div>
</article>

)
}

export default TechnicianCard
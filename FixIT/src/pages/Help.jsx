import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Help.css'

function Help() {
  const navigate = useNavigate()
  const [faqAbierta, setFaqAbierta] = useState(null)

  const faqs = [
    {
      pregunta: '¿Cómo funciona el diagnóstico automático (Triaje)?',
      respuesta:
        'Al registrar una incidencia, respondes unas breves preguntas sobre la falla de tu equipo. El sistema evalúa tus respuestas y te muestra un diagnóstico preliminar con un rango de precio estimado antes de elegir un técnico.'
    },
    {
      pregunta: '¿Qué incluye la Tarifa de Visita Técnica?',
      respuesta:
        'La tarifa cubre la revisión física preliminar y evaluación en tu domicilio o taller por parte del técnico seleccionado. Si decides realizar la reparación con él, este monto se descuenta del costo total del servicio.'
    },
    {
      pregunta: '¿Cómo subo fotos del problema de mi equipo?',
      respuesta:
        'En el formulario "Registrar Incidencia", puedes adjuntar hasta 3 imágenes (JPG o PNG de máximo 5MB cada una) para que el técnico entienda mejor la falla antes de acudir.'
    },
    {
      pregunta: '¿Puedo cancelar o reprogramar una solicitud?',
      respuesta:
        'Sí, desde tu panel de "Mis Servicios" puedes gestionar el estado de tus solicitudes y contactar al técnico o al equipo de soporte para coordinar cambios de horario.'
    },
    {
      pregunta: '¿Cómo sé si un técnico está verificado?',
      respuesta:
        'Todos los técnicos listados cuentan con un perfil donde puedes revisar sus certificaciones validadas (como CompTIA, Cisco, Microsoft), años de experiencia y las reseñas de otros clientes.'
    }
  ]

  const toggleFaq = (index) => {
    setFaqAbierta(faqAbierta === index ? null : index)
  }

  return (
    <div className="help-container">
      <div className="help-content">
        {/* CABECERA */}
        <header className="help-header">
          <h2>Centro de Ayuda FixIT</h2>
          <p>
            Encuentra respuestas rápidas a tus dudas sobre el registro de
            incidencias, diagnósticos y servicios técnicos.
          </p>
        </header>

        {/* ACCIONES RÁPIDAS */}
        <div className="help-quick-cards">
          <div className="help-card" onClick={() => navigate('/registrar-incidencia')}>
            <span className="card-icon">🛠️</span>
            <h3>¿Tienes una falla?</h3>
            <p>Registra tu equipo y obtén un diagnóstico estimado en minutos.</p>
            <span className="card-link">Registrar incidencia →</span>
          </div>

          <div className="help-card" onClick={() => navigate('/technicians')}>
            <span className="card-icon">👨‍💻</span>
            <h3>Buscar Especialistas</h3>
            <p>Conoce a los técnicos verificados y sus tarifas por hora.</p>
            <span className="card-link">Ver catálogo →</span>
          </div>
        </div>

        {/* SECCIÓN PREGUNTAS FRECUENTES */}
        <section className="faq-section">
          <h3>Preguntas Frecuentes</h3>
          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${faqAbierta === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <h4>{faq.pregunta}</h4>
                  <span className="faq-icon">
                    {faqAbierta === index ? '−' : '+'}
                  </span>
                </div>
                {faqAbierta === index && (
                  <p className="faq-answer">{faq.respuesta}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SOPORTE DIRECTO */}
        <section className="support-banner">
          <div className="support-info">
            <h3>¿Necesitas asistencia directa?</h3>
            <p>Nuestro equipo de soporte atiende las 24 horas, los 7 días de la semana.</p>
          </div>
          <div className="support-actions">
            <a href="mailto:soporte@fixit.pe" className="btn-support-secondary">
              ✉️ soporte@fixit.pe
            </a>
            <button
              className="btn-support-primary"
              onClick={() => alert('Soporte telefónico disponible las 24 horas: 01 800-FIXIT')}
            >
              📞 Central de Ayuda
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Help
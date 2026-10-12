import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'

function RecoverPassword() {
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')

  const manejarRecuperacion = (e) => {
    e.preventDefault()
    
    // TODO: Conectar con API de Node (POST /api/recuperar) 
    // reciba este correo y envíe el link real.
    console.log("Solicitando recuperación para:", correo)
    
    setMensaje("Si el correo está registrado, recibirás un enlace de recuperación en los próximos minutos.")
    setCorreo('')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '0.5rem' }}>
            Recuperar Contraseña
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
        </div>

        <form onSubmit={manejarRecuperacion} className="auth-form">
          
          {mensaje && <div className="success-message">{mensaje}</div>}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Enviar enlace de recuperación
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
            ← Volver a Iniciar Sesión
          </Link>
        </div>

      </div>
    </div>
  )
}

export default RecoverPassword
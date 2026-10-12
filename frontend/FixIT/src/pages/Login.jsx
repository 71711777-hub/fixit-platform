import { useState } from 'react'
import { iniciarSesion } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

function Login() {
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')

  // MANEJADORES DE EVENTOS
  const manejarLogin = async (e) => {
  e.preventDefault()

  try {
    const resultado = await iniciarSesion({
      correo,
      contrasena
    })

   localStorage.setItem('fixit_token', resultado.data.token)

    alert('¡Inicio de sesión exitoso!')

    navigate('/dashboard-cliente')
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    alert(error.message || 'No se pudo iniciar sesión')
  }
}

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="auth-tabs">
          <Link to="/login" className="tab-active" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Iniciar Sesión
          </Link>
          <Link to="/register" className="tab-inactive" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Crear Cuenta
          </Link>
        </div>

        {/* FORMULARIO DE INGRESO */}
        <form onSubmit={manejarLogin} className="auth-form">
          
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          {/* OPCIONES ADICIONALES */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', margin: '0.5rem 0 1.5rem' }}>
            <label style={{ color: '#6B7280', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" /> Recordarme
            </label>
            
            {/* TODO: Crear ruta para recuperar contraseña en el futuro */}
            <Link to="/recuperar-password" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn-primary">
            Iniciar Sesión
          </button>
          
        </form>
      </div>
    </div>
  )
}

export default Login
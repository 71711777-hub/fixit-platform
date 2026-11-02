import { useState, useEffect } from 'react'
import './UserProfile.css'
import { obtenerUsuarioActual, actualizarUsuario } from '../services/api'

function UserProfile() {
  // ESTADOS DEL FORMULARIO
  // Inicializamos el estado simulando los datos que llegarían de la base de datos.
  // TODO: Crear un endpoint (ej. GET /api/usuarios/me) para traer estos datos.
  // Usaríamos useEffect para llenar este estado cuando la página cargue.
 const [formData, setFormData] = useState({
  nombre_completo: '',
  correo: '',
  telefono: '',
  tipo_documento: 'DNI',
  nro_documento: ''
})

const [mensajeExito, setMensajeExito] = useState('')
const [mensajeError, setMensajeError] = useState('')
const [cargando, setCargando] = useState(false)
const [cargandoUsuario, setCargandoUsuario] = useState(true)

useEffect(() => {
  let activo = true

  async function cargarUsuario() {
    try {
      const resultado = await obtenerUsuarioActual()

      const usuario =
        resultado?.data?.usuario ??
        resultado?.data?.user ??
        resultado?.data

      if (!usuario) {
        throw new Error('No se encontraron los datos del usuario.')
      }

      if (activo) {
        setFormData({
          nombre_completo: usuario.nombre_completo || '',
          correo: usuario.correo || '',
          telefono: usuario.telefono || '',
          tipo_documento: usuario.tipo_documento || 'DNI',
          nro_documento: usuario.nro_documento || '',
        })

        setMensajeError('')
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error)

      if (activo) {
        setMensajeError(
          error.message || 'No se pudieron cargar tus datos.'
        )
      }
    } finally {
      if (activo) {
        setCargandoUsuario(false)
      }
    }
  }

  cargarUsuario()

  return () => {
    activo = false
  }
}, [])


  // MANEJADORES DE EVENTOS
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value
    })
    setMensajeExito('')
  }
  
const validarFormulario = () => {
  const nombre = formData.nombre_completo.trim()
  const telefono = formData.telefono.trim()
  const documento = formData.nro_documento.trim()

  if (nombre.length < 3) {
    return 'Ingresa tu nombre completo.'
  }

  if (formData.tipo_documento === 'DNI') {
    if (!/^\d{8}$/.test(documento)) {
      return 'El DNI debe contener exactamente 8 dígitos.'
    }
  } else if (formData.tipo_documento === 'CE') {
    if (!/^[a-zA-Z0-9]{9,11}$/.test(documento)) {
      return 'El CE debe contener entre 9 y 11 caracteres alfanuméricos.'
    }
  }

  if (!/^9\d{8}$/.test(telefono)) {
    return 'El celular debe tener 9 dígitos y comenzar con 9.'
  }

  return ''
}

  
  
  const handleSubmit = async (event) => {
      event.preventDefault()

      const errorValidacion = validarFormulario()

      if (errorValidacion) {
        setMensajeExito('')
        setMensajeError(errorValidacion)
        return
      }

      setCargando(true)
      setMensajeExito('')
      setMensajeError('')

    try {
      const resultado = await actualizarUsuario({
        nombre_completo: formData.nombre_completo.trim(),
        telefono: formData.telefono.trim(),
        tipo_documento: formData.tipo_documento,
        nro_documento: formData.nro_documento.trim(),
      })

      const usuarioActualizado = resultado?.data

      if (usuarioActualizado) {
        setFormData((anterior) => ({
          ...anterior,
          nombre_completo:
            usuarioActualizado.nombre_completo ?? anterior.nombre_completo,
          correo: usuarioActualizado.correo ?? anterior.correo,
          telefono: usuarioActualizado.telefono ?? '',
          tipo_documento:
            usuarioActualizado.tipo_documento ?? anterior.tipo_documento,
          nro_documento:
            usuarioActualizado.nro_documento ?? '',
        }))
      }

      setMensajeExito('¡Tus datos se actualizaron correctamente!')
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      setMensajeError(
        error.message || 'No se pudieron actualizar los datos.'
      )
    } finally {
      setCargando(false)
    }
  }


  return (
    <div className="dashboard-container">
      
      {/* BARRA LATERAL (SIDEBAR DEL USUARIO) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-user-info">
          <div className="sidebar-avatar">A</div>
          <div className="sidebar-names">
            <h3>{formData.nombre_completo.split(' ')[0]}</h3>
            <span>Miembro desde 2026</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button className="sidebar-link active">👤 Información Personal</button>
          <button className="sidebar-link">🔒 Seguridad y Contraseña</button>
          <button className="sidebar-link">💳 Métodos de Pago</button>
          <button className="sidebar-link">🔔 Notificaciones</button>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL (FORMULARIO) */}
      
      <main className="dashboard-main">
        {cargandoUsuario ? (
          <div className="dashboard-card">
            <p>Cargando tu información personal...</p>
          </div>
        ) : (
          <div className="dashboard-card">

          
          <div className="dashboard-header">
            <h2>Información Personal</h2>
            <p>Actualiza tus datos personales y cómo te contactaremos.</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            
            {mensajeExito && (
              <div className="success-message" role="status">
                {mensajeExito}
              </div>
            )}

            {mensajeError && (
              <div className="error-message" role="alert">
                {mensajeError}
              </div>
            )}

            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                // Muchas veces el correo no se deja editar directamente porque es el login.
                // Le ponemos 'disabled' para que sea de solo lectura por ahora.
                disabled 
                className="input-disabled"
              />
              <small className="form-hint">El correo electrónico no se puede cambiar ya que está vinculado a tu cuenta.</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo Doc.</label>
                <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange}>
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Número de documento</label>
                <input
                  type="text"
                  name="nro_documento"
                  value={formData.nro_documento}
                  onChange={handleChange}
                  required 
maxLength={formData.tipo_documento === 'DNI' ? 8 : 11}
inputMode="text"

                />
                
              </div>
            </div>

            <div className="form-group">
              <label>Teléfono Celular</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions-right">
              {/* Deshabilitamos el botón mientras simula cargar para evitar dobles clics */}
              <button type="submit" className="btn-primary" disabled={cargando}>
                {cargando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

          </form>
        
          </div>
        )}
      </main>


    </div>
  )
}

export default UserProfile
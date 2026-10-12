import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { obtenerUsuarioActual } from '../services/api'
import './Navbar.css'

function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()

    const [menuAbierto, setMenuAbierto] = useState(false)
    const [usuario, setUsuario] = useState(null)
    const [cargandoUsuario, setCargandoUsuario] = useState(true)

    useEffect(() => {
        async function cargarUsuario() {
            const token = localStorage.getItem('fixit_token')

            if (!token) {
                setUsuario(null)
                setCargandoUsuario(false)
                return
            }

            try {
                const resultado = await obtenerUsuarioActual()

                console.log('Usuario del Navbar:', resultado)

                setUsuario(resultado.data)
            } catch (error) {
                console.error('Error al cargar usuario en Navbar:', error)

                localStorage.removeItem('fixit_token')
                setUsuario(null)
            } finally {
                setCargandoUsuario(false)
            }
        }

        cargarUsuario()
    }, [location.pathname])

    const isActive = (path) => {
        return location.pathname === path
            ? 'nav-link active'
            : 'nav-link'
    }

    const handleLogout = () => {
        localStorage.removeItem('fixit_token')
        setUsuario(null)
        setMenuAbierto(false)
        navigate('/login')
    }

    const obtenerInicial = () => {
        if (!usuario?.nombre_completo) {
            return '?'
        }

        return usuario.nombre_completo
            .trim()
            .charAt(0)
            .toUpperCase()
    }

    return (
        <nav className="navbar">

            <Link to="/" className="navbar-logo">
                <div className="logo-icon">🔧</div>
                <span className="logo-text">FixIT</span>
            </Link>

            <div className="navbar-links">
                <Link
                    to="/"
                    className={isActive('/')}
                >
                    Inicio
                </Link>

                <Link
                    to="/registrar-incidencia"
                    className={isActive('/registrar-incidencia')}
                >
                    Registrar Incidencia
                </Link>

                <Link
                    to="/technicians"
                    className={isActive('/technicians')}
                >
                    Técnicos
                </Link>

                <Link
                    to="/help"
                    className={isActive('/help')}
                >
                    Ayuda
                </Link>
            </div>

            <div className="navbar-right">

                <span className="support-text">
                    Soporte: 24/7
                </span>

                {!cargandoUsuario && !usuario ? (

                    <div className="auth-links">
                        <Link
                            to="/login"
                            className="nav-auth-link highlight"
                        >
                            Ingresar
                        </Link>
                    </div>

                ) : !cargandoUsuario && usuario ? (

                    <div className="user-menu-container">

                        <button
                            className="user-avatar-btn"
                            onClick={() => setMenuAbierto(!menuAbierto)}
                        >
                            {obtenerInicial()}
                        </button>

                        {menuAbierto && (

                            <div className="dropdown-menu">

                                <div className="dropdown-header">
                                    <strong>
                                        {usuario.nombre_completo}
                                    </strong>

                                    <span>
                                        {usuario.correo}
                                    </span>
                                </div>

                                <hr />

                                <Link
                                    to="/mi-cuenta"
                                    className="dropdown-item"
                                    onClick={() => setMenuAbierto(false)}
                                >
                                    👤 Mi Cuenta
                                </Link>

                                <Link
                                    to="/mis-servicios"
                                    className="dropdown-item"
                                    onClick={() => setMenuAbierto(false)}
                                >
                                    📋 Mis Servicios
                                </Link>

                                <hr />

                                <button
                                    className="dropdown-item text-danger"
                                    onClick={handleLogout}
                                >
                                    Cerrar Sesión
                                </button>

                            </div>

                        )}

                    </div>

                ) : null}

            </div>

        </nav>
    )
}

export default Navbar
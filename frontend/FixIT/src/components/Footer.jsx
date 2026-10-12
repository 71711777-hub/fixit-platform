import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="global-footer">
      <div className="footer-content">
        <p>© 2026 FixIT. Todos los derechos reservados.</p>
        <div className="footer-links">
          <Link to="#">Términos de Servicio</Link>
          <Link to="#">Privacidad</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
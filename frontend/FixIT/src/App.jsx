import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from "./pages/Home"
import Technicians from './pages/Technicians'
import Login from './pages/Login'
import Register from './pages/Register'
import RegistrarIncidencia from './pages/RegistrarIncidencia'
import Triaje from './pages/Triaje'
import ResultadoDiagnostico from './pages/ResultadoDiagnostico'
import TechnicianProfile from './pages/TechnicianProfile'
import RecoverPassword from "./pages/RecoverPassword";
import UserProfile from './pages/UserProfile'
import DashboardCliente from './pages/DashboardCliente'
import DetalleIncidencia from './pages/DetalleIncidencia'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/registrar-incidencia" element={<RegistrarIncidencia />} />
            <Route path="/triaje" element={<Triaje />} />
            <Route path="/resultado-diagnostico" element={<ResultadoDiagnostico />} />
            <Route path="/technician/:id" element={<TechnicianProfile />} />
            <Route path="/recuperar-password" element={<RecoverPassword />} />
            <Route path="/mi-cuenta" element={<UserProfile />} />
            <Route path="/dashboard-cliente" element={<DashboardCliente />} />
            <Route path="/incidencias/:id" element={<DetalleIncidencia />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App
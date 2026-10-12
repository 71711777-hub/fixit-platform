import { Link, useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
    const navigate = useNavigate();

    // DATOS ESTÁTICOS (MOCKS)
    // Arreglo de objetos que representa los dispositivos soportados.
    const dispositivos = [
        { id: 'laptop', nombre: 'Laptop', icono: '💻' },
        { id: 'pc', nombre: 'PC Escritorio', icono: '🖥️' },
        { id: 'smartphone', nombre: 'Smartphone', icono: '📱' },
        { id: 'tablet', nombre: 'Tablet', icono: '📲' },
        { id: 'otro', nombre: 'Otro', icono: '❔' }
    ];

    // Arreglo con los pasos del flujo de trabajo de FixIT.
    const pasos = [
        { num: 1, titulo: 'Describe tu problema', desc: 'Completa el formulario de incidencia.' },
        { num: 2, titulo: 'Triaje automático', desc: 'Analizamos la causa con preguntas clave.' },
        { num: 3, titulo: 'Conecta con técnico', desc: 'Elige la mejor propuesta en minutos.' }
    ];

    // MANEJADORES DE EVENTOS
    const handleDeviceSelect = (dispositivo) => {
        console.log(`Dispositivo seleccionado: ${dispositivo.nombre}`);
        navigate('/registrar-incidencia');
    };

    return (
        <div className="home-container">
            
            {/* BANNER PRINCIPAL (HERO) */}
            <section className="hero-section">
                <div className="hero-text">
                    <h1>Hola, ¿en qué podemos ayudarte hoy?</h1>
                    <p>Encuentra soporte técnico verificado para tus dispositivos de forma rápida y segura.</p>
                </div>
                <Link to="/registrar-incidencia" className="btn-primary hero-btn">
                    Registrar Incidencia
                </Link>
            </section>

            {/* GRILLA DE DISPOSITIVOS */}
            <section className="devices-section">
                <h2>Selecciona tu dispositivo</h2>
                <div className="devices-grid">
                    {dispositivos.map((disp) => (
                        <button 
                            key={disp.id} 
                            className="device-card"
                            onClick={() => handleDeviceSelect(disp)}
                        >
                            <span className="device-icon">{disp.icono}</span>
                            <span className="device-name">{disp.nombre}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* SECCIÓN: CÓMO FUNCIONA */}
            <section className="how-it-works-section">
                <h2>Cómo funciona FixIT</h2>
                <div className="steps-grid">
                    {pasos.map((paso) => (
                        <div key={paso.num} className="step-card">
                            <div className="step-number">{paso.num}</div>
                            <div className="step-content">
                                <h3>{paso.titulo}</h3>
                                <p>{paso.desc}</p>
                            </div>
                            <span className="step-arrow">→</span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    )
}

export default Home
import { motion } from 'framer-motion';
import Cabecera from './components/Cabecera';
import PanelControl from './components/PanelControl';
import PantallaPublica from './components/PantallaPublica';
import FormularioTurno from './components/FormularioTurno';
import useTurnos from './hooks/useTurnos';

const App = () => {
  const {
    turnos,
    turnoActual,
    notificacion,
    turnosPendientes,
    generarNuevoTurno,
    setNotificacion,
    llamarSiguienteTurno,
    cancelarTurno
  } = useTurnos();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#dbe9f5]">
      <Cabecera />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 grid md:grid-cols-3 gap-6"
      >
        {/* Columna izquierda */}
        <div className="md:col-span-2 space-y-6">
          <PantallaPublica turnoActual={turnoActual}
            turnosPendientes={turnosPendientes} />
          <FormularioTurno onGenerarTurno={generarNuevoTurno} />
        </div>

        {/* Columna derecha - Panel de control con cola de turnos */}
        <PanelControl
          onGenerarTurno={generarNuevoTurno}
          onNotificacion={setNotificacion}
          onLlamarTurno={llamarSiguienteTurno}
          turnosPendientes={turnosPendientes}
          onCancelarTurno={cancelarTurno}
        />
      </motion.div>

      {/* Notificación flotante */}
      {notificacion && (
        <div className={`fixed bottom-4 right-32 p-4 rounded-lg shadow-lg text-white animate-fade-in ${notificacion.tipo === 'error' ? 'bg-red-500' :
          notificacion.tipo === 'success' ? 'bg-green-500' :
            'bg-blue-500'
          }`}>
          <div className="flex items-center">
            {notificacion.tipo === 'error' && (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {notificacion.tipo === 'success' && (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{notificacion.mensaje}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
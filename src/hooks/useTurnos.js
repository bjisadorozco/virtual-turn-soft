import { useState, useEffect } from 'react';
import { 
  guardarTurno, 
  obtenerTodosTurnos, 
  obtenerUltimoNumero,
  marcarTurnoComoAtendido,
  eliminarTurno,
  limpiarBaseDeDatos
} from '../services/almacenamiento';

const useTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [ultimoNumero, setUltimoNumero] = useState(0);
  const [notificacion, setNotificacion] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [turnosDB, ultimoNum] = await Promise.all([
          obtenerTodosTurnos(),
          obtenerUltimoNumero()
        ]);

        setTurnos(turnosDB);
        setUltimoNumero(ultimoNum || 0);
        
        // Recuperar el último turno no atendido
        const turnoPendiente = turnosDB.find(t => !t.atendido);
        if (turnoPendiente) setTurnoActual(turnoPendiente);
        
      } catch (error) {
        console.error("Error cargando datos:", error);
        setNotificacion({
          tipo: 'error',
          mensaje: 'Error al cargar turnos'
        });
      }
    };

    cargarDatosIniciales();
  }, []);

  // Generar nuevo turno
  const generarNuevoTurno = async (categoria = 'general', paciente = {}) => {
    try {
      const nuevoNumero = ultimoNumero + 1;
      const nuevoTurno = {
        id: Date.now(),
        numero: nuevoNumero,
        categoria,
        timestamp: new Date().toISOString(),
        atendido: false,
        paciente: {
          nombre: paciente.nombre?.trim() || '',
          cedula: paciente.cedula?.trim() || ''
        }
      };

      await guardarTurno(nuevoTurno);
      setTurnos([...turnos, nuevoTurno]);
      setUltimoNumero(nuevoNumero);

      // setNotificacion({
      //   tipo: 'success',
      //   mensaje: `Turno ${categoria}-${nuevoNumero} generado`
      // });

      return nuevoTurno;
    } catch (error) {
      console.error("Error generando turno:", error);
      // setNotificacion({
      //   tipo: 'error',
      //   mensaje: 'Error al generar turno'
      // });
      return null;
    }
  };
  
  // Llamar siguiente turno
  const llamarSiguienteTurno = async () => {
    try {
      const pendientes = turnos.filter(t => !t.atendido);
      if (pendientes.length === 0) {
        setNotificacion({
          tipo: 'warning',
          mensaje: 'No hay turnos pendientes'
        });
        return;
      }
  
      const proximoTurno = {
        ...pendientes[0],
        timestamp: new Date().toISOString() // ¡Importante! Actualiza el timestamp
      };
  
      // Actualiza el turno en la base de datos
      await guardarTurno(proximoTurno);
      
      setTurnoActual(proximoTurno);
      setTurnos(turnos.map(t => 
        t.id === proximoTurno.id ? proximoTurno : t
      ));
  
      // setNotificacion({
      //   tipo: 'info',
      //   mensaje: `Turno ${proximoTurno.categoria}-${proximoTurno.numero} en atención`
      // });
  
      // Marcar como atendido después de 5 minutos
      setTimeout(async () => {
        try {
          await marcarTurnoComoAtendido(proximoTurno.id);
          setTurnos(turnos.map(t => 
            t.id === proximoTurno.id ? {...t, atendido: true} : t
          ));
          setTurnoActual(null);
        } catch (error) {
          console.error("Error marcando turno:", error);
        }
      }, 300000); // 5 minutos
  
    } catch (error) {
      console.error("Error llamando turno:", error);
      setNotificacion({
        tipo: 'error',
        mensaje: 'Error al llamar turno'
      });
    }
  };
  
  // Cancelar turno
  const cancelarTurno = async (id) => {
    try {
      await eliminarTurno(id);
      
      // Verificar si el turno eliminado es el turno actual
      if (turnoActual && turnoActual.id === id) {
        setTurnoActual(null);
      }
      
      setTurnos(turnos.filter(t => t.id !== id));
      
      // setNotificacion({
      //   tipo: 'success',
      //   mensaje: 'Turno atendido correctamente'
      // });
      setTimeout(() => setNotificacion(null), 3000);
      
    } catch (error) {
      console.error("Error cancelando turno:", error);
      // setNotificacion({
      //   tipo: 'error',
      //   mensaje: 'Error al cancelar turno'
      // });
    }
  };

  // Reiniciar sistema
  const reiniciarSistema = async () => {
    try {
      await limpiarBaseDeDatos();
      setTurnos([]);
      setUltimoNumero(0);
      setTurnoActual(null);
      
      // setNotificacion({
      //   tipo: 'success',
      //   mensaje: 'Sistema reiniciado'
      // });
    } catch (error) {
      console.error("Error reiniciando sistema:", error);
      // setNotificacion({
      //   tipo: 'error',
      //   mensaje: 'Error al reiniciar'
      // });
    }
  };

  return {
    turnos,
    turnoActual,
    notificacion,
    turnosPendientes: turnos.filter(t => !t.atendido),
    turnosAtendidos: turnos.filter(t => t.atendido),
    generarNuevoTurno,
    llamarSiguienteTurno,
    cancelarTurno,
    reiniciarSistema,
    eliminarTurno
  };
};

export default useTurnos;
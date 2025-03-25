// Versión de la base de datos (incrementar cuando cambie la estructura)
const DB_VERSION = 3;
const DB_NAME = 'TurnosDB';
const STORE_NAME = 'turnos';

// Inicializar/abrir la base de datos
export const inicializarDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Eliminar store existente si existe (para migraciones)
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      
      // Crear nuevo object store
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      
      // Crear índices para búsquedas rápidas
      store.createIndex('por_numero', 'numero', { unique: true });
      store.createIndex('por_atendido', 'atendido');
      store.createIndex('por_categoria', 'categoria');
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error("Error abriendo DB:", event.target.error);
      reject(event.target.error);
    };
  });
};

// Guardar un turno
export const guardarTurno = async (turno) => {
  try {
    const db = await inicializarDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.put(turno);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error("Error guardando turno:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error en guardarTurno:", error);
    throw error;
  }
};

// Obtener todos los turnos
export const obtenerTodosTurnos = async () => {
  try {
    const db = await inicializarDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => {
        console.error("Error obteniendo turnos:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error en obtenerTodosTurnos:", error);
    return [];
  }
};

// Obtener el último número de turno usado
export const obtenerUltimoNumero = async () => {
  try {
    const turnos = await obtenerTodosTurnos();
    if (turnos.length === 0) return 0;
    
    return Math.max(...turnos.map(t => t.numero));
  } catch (error) {
    console.error("Error en obtenerUltimoNumero:", error);
    return 0;
  }
};

// Marcar turno como atendido
export const marcarTurnoComoAtendido = async (id) => {
  try {
    const db = await inicializarDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const turno = getRequest.result;
        if (!turno) {
          reject(new Error("Turno no encontrado"));
          return;
        }
        
        const updatedTurno = { ...turno, atendido: true };
        const putRequest = store.put(updatedTurno);
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = (event) => {
          console.error("Error actualizando turno:", event.target.error);
          reject(event.target.error);
        };
      };
      
      getRequest.onerror = (event) => {
        console.error("Error buscando turno:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error en marcarTurnoComoAtendido:", error);
    throw error;
  }
};

// Eliminar un turno
export const eliminarTurno = async (id) => {
  try {
    const db = await inicializarDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error("Error eliminando turno:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error en eliminarTurno:", error);
    throw error;
  }
};

// Limpiar toda la base de datos
export const limpiarBaseDeDatos = async () => {
  try {
    const db = await inicializarDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error("Error limpiando DB:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error en limpiarBaseDeDatos:", error);
    throw error;
  }
};

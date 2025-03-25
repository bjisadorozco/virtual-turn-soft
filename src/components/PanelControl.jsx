import { useState } from 'react';

const PanelControl = ({
    onGenerarTurno,
    onLlamarTurno,
    turnosPendientes,
    onCancelarTurno,
    turnoActual // Nueva prop recibida
}) => {
    const [categoria, setCategoria] = useState('general');

    const handleCancelarTurno = (id) => {
        // Verificar si es el turno actual
        if (turnoActual && turnoActual.id === id) {
            if (!window.confirm('¿Está seguro de cancelar el turno EN ATENCIÓN?')) {
                return;
            }
        }
        onCancelarTurno(id);
    };

    return (
        <div className="bg-primary p-6 rounded-lg space-y-4 shadow-md h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white">Control de Turnos</h2>

            {/* Sección de generación de turnos */}
            <div className="flex flex-col md:flex-row gap-4">
                <select
                    className="flex-1 p-2 rounded border-none"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                >
                    <option value="general">General</option>
                    <option value="prioritario">Prioritario</option>
                    <option value="retiro">Retiro de Resultados</option>
                </select>

                <button
                    onClick={() => onGenerarTurno(categoria)}
                    className="bg-secondary hover:bg-dark text-white px-4 py-2 rounded transition-colors"
                >
                    Generar Turno
                </button>
            </div>

            {/* Botón para llamar turnos */}
            <button
                onClick={onLlamarTurno}
                className="w-full bg-dark hover:bg-secondary text-white py-3 rounded font-bold transition-colors"
            >
                Llamar Siguiente Turno
            </button>

            {/* Lista de turnos pendientes */}
            <div className="bg-white p-4 rounded-lg flex-1 overflow-auto">
                <h3 className="font-semibold mb-3 text-lg">Turnos en Espera ({turnosPendientes.length})</h3>
                {turnosPendientes.length > 0 ? (
                    <ul className="space-y-2">
                        {turnosPendientes.map((turno) => (
                            <li
                                key={turno.id}
                                className={`flex justify-between items-center p-2 border-b ${turnoActual?.id === turno.id ? 'bg-yellow-50' : ''
                                    }`}
                            >
                                <span>
                                    <span className="font-medium">
                                        {turno.categoria.toUpperCase()}-{turno.numero}
                                    </span>
                                    {turno.paciente.nombre && (
                                        <span className="text-gray-600 ml-2">({turno.paciente.nombre})</span>
                                    )}
                                </span>
                                <button
                                    onClick={() => handleCancelarTurno(turno.id)}
                                    className="text-red-500 hover:text-red-700 text-lg"
                                    title="Finalizar atención"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">No hay turnos pendientes</p>
                )}
            </div>
        </div>
    );
};

export default PanelControl;
import { useState } from 'react';

const FormularioTurno = ({ onGenerarTurno, onNotificacion }) => {
    const [paciente, setPaciente] = useState({
        nombre: '',
        cedula: '',
        categoria: 'general'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paciente.nombre.trim()) {
            return; // Validación básica
        }

        try {
            const turnoGenerado = await onGenerarTurno(
                paciente.categoria,
                {
                    nombre: paciente.nombre.trim(),
                    cedula: paciente.cedula.trim()
                }
            );

            // Limpiar campos ANTES de la notificación
            setPaciente({
                nombre: '',
                cedula: '',
                categoria: 'general'
            });

            onNotificacion({
                tipo: 'success',
                mensaje: `Turno ${turnoGenerado.categoria}-${turnoGenerado.numero} asignado`
            });

        } catch (error) {
            console.error(error);
            onNotificacion({
                tipo: 'error',
                mensaje: 'Error al guardar el turno'
            });
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Registro de Paciente</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                    <input
                        type="text"
                        value={paciente.nombre}
                        onChange={(e) => setPaciente({ ...paciente, nombre: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Cédula</label>
                    <input
                        type="text"
                        value={paciente.cedula}
                        onChange={(e) => setPaciente({ ...paciente, cedula: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Atención</label>
                    <select
                        value={paciente.categoria}
                        onChange={(e) => setPaciente({ ...paciente, categoria: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="general">Consulta General</option>
                        <option value="prioritario">Adulto Mayor/Embarazada</option>
                        <option value="retiro">Retiro de Exámenes</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-dark text-white py-2 rounded transition-colors"
                >
                    Registrar y Generar Turno
                </button>
            </form>
        </div>
    );
};

export default FormularioTurno;
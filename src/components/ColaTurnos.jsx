const ColaTurnos = ({ turnos }) => {
    const turnosPendientes = turnos.filter(t => !t.atendido);

    return (
        <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-xl font-semibold mb-3">Turnos en Espera</h3>
            {turnosPendientes.length > 0 ? (
                <ul className="divide-y">
                    {turnosPendientes.map((turno) => (
                        <li key={turno.id} className="py-2 flex justify-between">
                            <span className="font-medium">
                                {turno.categoria}-{turno.numero}
                            </span>
                            <span className="text-gray-500">
                                {new Date(turno.timestamp).toLocaleTimeString()}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay turnos en espera</p>
            )}
        </div>
    );
};

export default ColaTurnos;
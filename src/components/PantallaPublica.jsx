import { useEffect, useState } from 'react';

const PantallaPublica = ({ turnoActual, turnosPendientes }) => {  // Recibe turnosPendientes como prop
    const [tiempoRestante, setTiempoRestante] = useState(300);

    // Obtener el próximo turno (excluyendo el actual)
    const proximoTurno = turnosPendientes.find(t =>
        turnoActual ? t.id !== turnoActual.id : true
    );

    useEffect(() => {
        let interval;

        if (turnoActual) {
            setTiempoRestante(300);
            interval = setInterval(() => {
                setTiempoRestante(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);
        } else {
            setTiempoRestante(0);
        }

        return () => clearInterval(interval);
    }, [turnoActual]);

    return (
        <div className="bg-dark text-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-4">Turno Actual</h2>

            {turnoActual ? (
                <>
                    <div className="text-7xl font-mono my-6 animate-pulse">
                        {turnoActual.categoria.toUpperCase()}-{turnoActual.numero}
                    </div>

                    {turnoActual.paciente.nombre && (
                        <div className="text-2xl mb-3">
                            Paciente: {turnoActual.paciente.nombre}
                        </div>
                    )}

                    <div className="text-xl mb-6">
                        Tiempo restante: {Math.floor(tiempoRestante / 60)}m {tiempoRestante % 60}s
                    </div>

                    {tiempoRestante < 120 && tiempoRestante > 0 && (
                        <div className="bg-secondary text-white p-3 rounded-lg animate-bounce">
                            {proximoTurno ? (
                                <>
                                    {/* <p>¡Prepárese! Su turno es próximo</p> */}
                                    <p className="font-bold mt-1">
                                        Siguiente turno: {proximoTurno.categoria.toUpperCase()}-{proximoTurno.numero}
                                        {proximoTurno.paciente.nombre && ` (${proximoTurno.paciente.nombre})`}
                                    </p>
                                </>
                            ) : (
                                <p>¡Prepárese! Su turno es próximo</p>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <p className="text-xl">No hay turnos en atención</p>
            )}
        </div>
    );
};

export default PantallaPublica;
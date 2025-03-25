const Cabecera = () => {
    return (
        <header className="bg-dark text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Sistema de Turnos Virtuales</h1>
                <div className="bg-primary px-3 py-1 rounded-full text-sm">
                    Versión 1.0
                </div>
            </div>
        </header>
    );
};

export default Cabecera;
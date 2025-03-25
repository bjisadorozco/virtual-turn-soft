import { motion } from 'framer-motion';

const Notificacion = ({ mensaje }) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-secondary text-white p-3 rounded-lg mt-4"
        >
            🔔 {mensaje}
        </motion.div>
    );
};

export default Notificacion;
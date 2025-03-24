import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { motion } from "framer-motion";

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </motion.div>
  );
}

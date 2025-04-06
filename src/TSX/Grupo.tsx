import React, { useState } from "react";
import "../CSS/Grupo.css";

interface UnirseGrupoModalProps {
  onClose: () => void;
}

const UnirseGrupoModal: React.FC<UnirseGrupoModalProps> = ({ onClose }) => {
  const [codigo, setCodigo] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Código ingresado:", codigo);
    onClose();
  };

  return (
    <>
      <div className="ventana-backdrop active" onClick={onClose} />
      <div className="ventana active">
        <h2>Introduce el código del grupo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ej: ABC123"
            required
          />
          <button type="submit">Unirse</button>
        </form>
      </div>
    </>
  );
};

export default UnirseGrupoModal;
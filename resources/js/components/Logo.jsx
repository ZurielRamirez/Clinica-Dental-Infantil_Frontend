import React from 'react';

const Logo = ({ showText = true }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* 
        Contenedor limpio. Usamos mix-blend-mode: multiply 
        para eliminar el fondo cuadrado de la imagen al instante.
      */}
      <div className="mb-2 flex justify-center items-center">
        <img 
          src="/logo.png" 
          alt="Logo Clinica Dental Infantil" 
          className="h-28 w-auto object-contain" 
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Textos del encabezado */}
      {showText && (
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#004D40] tracking-tight">
            Clinica dental infantil
          </h2>
          <p className="text-sm font-medium text-[#00695C]">
            Sonrisas felices desde el primer diente
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
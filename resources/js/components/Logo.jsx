import React from 'react';

const Logo = ({ className = "w-20 h-20", showText = true }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Contenedor circular (Fondo verde claro como el anterior) */}
      <div className={`${className} bg-[#E0F2F1] rounded-full flex items-center justify-center mb-4 p-3 shadow-inner`}>
        {/* Tu imagen logo.png dentro del círculo */}
        <img 
          src="/logo.png" 
          alt="Logo KiddieDent" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Textos exactos del diseño anterior */}
      {showText && (
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-[#004D40] tracking-tight">
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
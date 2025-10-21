// roshi_fit/src/components/auth/RegistrationProgress.tsx
import React from 'react';

interface RegistrationProgressProps {
  currentStep: 1 | 2; // 1 = Registro, 2 = Pago
}

const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ currentStep }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className={currentStep >= 1 ? 'text-gold font-bold' : 'text-text-gray'}>Registro</span>
        <span className={currentStep >= 2 ? 'text-gold font-bold' : 'text-text-gray'}>Pago</span>
      </div>
      <div className="h-2 bg-accent rounded-full overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-300"
          style={{ width: currentStep === 1 ? '50%' : '100%' }}
        />
      </div>
    </div>
  );
};

export default RegistrationProgress;
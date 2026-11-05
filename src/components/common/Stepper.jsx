import React from 'react';
import './Stepper.css';

/**
 * Stepper Component - Hiển thị 4 bước trong quy trình đặt tour
 * @param {number} currentStep - Bước hiện tại (1-4)
 * @param {Array} steps - Tên các bước (mặc định 4 bước)
 */
const Stepper = ({ currentStep = 1, steps = null }) => {
  const defaultSteps = [
    'Chọn tour',
    'Thông tin',
    'Xác nhận',
    'Hoàn tất'
  ];

  const stepLabels = steps || defaultSteps;

  return (
    <div className="stepper">
      <div className="stepper-track">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step circle */}
              <div className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                <div className="stepper-circle">
                  {isCompleted ? (
                    <svg className="stepper-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="stepper-number">{stepNumber}</span>
                  )}
                </div>
                <span className="stepper-label">{label}</span>
              </div>

              {/* Line giữa các step */}
              {index < stepLabels.length - 1 && (
                <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

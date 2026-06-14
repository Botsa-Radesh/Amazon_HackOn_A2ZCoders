'use client';
import React from 'react';

interface Step {
  label: string;
  icon: string;
}

const steps: Step[] = [
  { label: 'Cart', icon: '🛒' },
  { label: 'Review', icon: '📋' },
  { label: 'Slot', icon: '🚚' },
  { label: 'Pay', icon: '💳' },
];

interface CheckoutStepperProps {
  currentStep: number; // 0-based: 0=Cart, 1=Review, 2=Slot, 3=Pay
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="checkout-stepper">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <div className="stepper-step">
            <div className={`stepper-circle ${i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending'}`}>
              {i < currentStep ? '✓' : step.icon}
            </div>
            <span className={`stepper-label ${i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`stepper-line ${i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

import React, { useState } from "react";
import PaymentForm from "./PaymentForm";
import PriceLedger from "./PriceLedger";

export default function MultiStepForm() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const handlePackageSelection = (packageData) => {
    setSelectedPackage(packageData);
  };

  const handleDurationSelection = (durationData) => {
    setSelectedDuration(durationData);
  };

  return (
    <div>
      {/* Add logic for package and duration selection */}
      <PriceLedger
        selectedPackage={selectedPackage}
        selectedDuration={selectedDuration}
      />
      <PaymentForm
        selectedPackage={selectedPackage}
        selectedDuration={selectedDuration}
      />
    </div>
  );
}
export const serviceMetadata = [
  {
    serviceId: 1, // Private lessons - In your home
    formSteps: [1, 2, 3, 4, 5], // General Info -> Location -> Schedule -> Confirmation
  },
  {
    serviceId: 2, // Private lessons - At my home
    formSteps: [1, 2, 3, 4, 5], // General Info -> Location -> Schedule -> Confirmation
  },
  {
    serviceId: 3, // Private lessons - Virtual
    formSteps: [1, 3, 5], // General Info -> Schedule -> Confirmation (no location needed)
  },
  {
    serviceId: 4, // Piano tuning
    formSteps: [1, 2, 3, 4, 5], // General Info -> Location -> Schedule -> Confirmation
  },
  {
    serviceId: 5, // Group music class - Virtual
    formSteps: [1, 3, 5], // General Info -> Schedule -> Confirmation (no location needed)
  },
];

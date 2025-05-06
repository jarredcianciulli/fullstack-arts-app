export const formSteps = [
  {
    step: 1,
    title: "General Info",
    fieldIds: [1, 6, 2], // Include child name and age fields in step 1
  },
  {
    step: 2,
    title: "Location",
    fieldIds: [3], // Updated to match new field IDs
  },
  {
    step: 3,
    title: "Package",
    fieldIds: [5], // Updated to match new field IDs
  },
  {
    step: 4,
    title: "Schedule",
    fieldIds: [4],
  },
  {
    step: 5,
    title: "Confirmation",
    fieldIds: [],
  },
  {
    step: 6,
    title: "Payment",
    affirm: true,
    fieldIds: [], // Add empty fieldIds for consistency
  },
];

export const formSteps = [
  {
    id: 1,
    step: 1,
    title: "General Info",
    fieldIds: [1, 6, 2, 8, 9], // Include child name and age fields in step 1
  },
  {
    id: 2,
    step: 2,
    title: "Location",
    fieldIds: [3], // Updated to match new field IDs
  },
  {
    id: 3,
    step: 3,
    title: "Package",
    fieldIds: [5], // Updated to match new field IDs
  },
  {
    id: 4,
    step: 4,
    title: "Schedule",
    fieldIds: [4],
  },
  {
    id: 5,
    step: 5,
    title: "Confirmation",
    fieldIds: [],
  },

  {
    id: 7,
    step: 3,
    title: "Package",
    fieldIds: [7], // Updated to match new field IDs
  },
  {
    id: 8,
    step: 1,
    title: "General Info",
    fieldIds: [1, 6], // Include child name and age fields in step 1
  },
];

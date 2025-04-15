export const formFields = [
  {
    id: 1,
    type: "input", // input, select, checkbox, etc.
    input_type: "text", // text, email, location, distance, etc.
    label: "What's your name?",
    placeholder: "Your name",
    required: true,
    validation: {
      min_char: 3,
      max_char: 120,
    },
    visibility: "always", // "always", "conditional", "hidden"
    section: "general",
    field_key: "student_name",
  },
  {
    id: 2,
    type: "select",
    input_type: "text",
    label: "Who are these lessons for?",
    required: true,
    default_option: "",
    options: [1, 2, 3, 4, 5], // references FormFieldOption IDs
    section: "general",
    field_key: "student_relationship",
  },
  {
    id: 3,
    type: "input",
    input_type: "location",
    label: "What is your location?",
    required: true,
    location_pricing: [
      {
        radius_miles: 5,
        coordinates: [40.241493, -75.283783],
        additional_price: 15,
      },
      {
        radius_miles: 10,
        coordinates: [40.241493, -75.283783],
        additional_price: 22,
      },
    ],
    section: "location",
    field_key: "location_radius",
  },
];

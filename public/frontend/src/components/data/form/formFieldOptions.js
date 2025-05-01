export const formFieldOptions = [
  {
    id: 1,
    label: "",
    value: "",
    if_selected: [], // IDs of conditional fields
  },
  {
    id: 2,
    label: "Myself",
    value: "Myself",
    if_selected: [],
  },
  {
    id: 3,
    label: "My child",
    value: "My child",
    if_selected: [3, 4],
  },
  {
    id: 4,
    label: "My grandchild",
    value: "My grandchild",
    if_selected: [5, 6],
  },
  {
    id: 5,
    label: "Other",
    value: "Other",
    if_selected: [7, 8, 9],
  },
  {
    id: 6,
    label: "Weekly",
    value: "Weekly",
    if_selected: [10],
  },
  {
    id: 7,
    label: "Bi-weekly",
    value: "Bi-weekly",
    if_selected: [10],
  },
  {
    id: 8,
    label: "Custom",
    value: "Custom",
    if_selected: [11],
  },
];

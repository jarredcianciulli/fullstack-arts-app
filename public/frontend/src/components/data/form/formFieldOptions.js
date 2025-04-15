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
    if_selected: [1], // shows FormField with id 1 if selected
  },
  {
    id: 3,
    label: "My child",
    value: "My child",
    if_selected: [3, 4], // show child's name/age fields
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
    value: "other",
    if_selected: [7, 8, 9],
  },
];

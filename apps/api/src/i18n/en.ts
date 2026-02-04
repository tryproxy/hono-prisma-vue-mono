export const messages = {
  steps: {
    create: "Step 1/3: Choose item",
    item: "Step 2/3: Set quantity",
    qty: (text: any) =>
      `Step 3/3: Confirm Order? (Yes/No) ${text.item.name} - ${text.qty}`,
  },
  confirm: {
    yesList: ["Yes", "ye", "y", "пися", "попа"],
    yes: "Yes",
    no: "No",
  },
  submit: "Submitted.",
  cancel: "Canceled. Type /create again!",
  wildcard: "пися попа",
  product: [
    {
      label: "item:A",
      name: "пися",
      id: 0,
    },
    {
      label: "item:B",
      name: "попа",
      id: 1,
    },
  ],
};

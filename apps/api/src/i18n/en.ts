export const messages = {
  steps: {
    create: "Step 1/3: Choose item",
    item: "Step 2/3: Set quantity",
    qty: (text: any) =>
      `Step 3/3: Confirm? [y/n] ${text.item.name} - ${text.qty}`,
  },
  confirm: {
    yesResponses: ["yes", "ye", "y"],
    noResponses: ["no", "n", "cancel"],
    yes: "Yes",
    no: "No",
  },
  onSubmitSuccess: "Your order",
  submit: "Submitted.",
  cancel: "Canceled. Type /create again!",
  wildcard: "Try /create",
  open: "open web site",
  product: [
    {
      label: "item:A",
      name: "ItemA",
      id: 0,
    },
    {
      label: "item:B",
      name: "ItemB",
      id: 1,
    },
  ],
};

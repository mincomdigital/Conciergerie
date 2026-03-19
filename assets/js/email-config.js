// Email configuration for contact form delivery.
// Keep provider as "none" to disable external email sending.
// Supported providers: "none", "formsubmit", "formspree", "web3forms"

window.CLE_DOR_EMAIL_CONFIG = {
  provider: "formsubmit",

  // FormSubmit (no backend):
  // On first submit, FormSubmit sends an activation email to this address.
  // Confirm it once to start receiving leads.
  recipient: "mincomdigital@gmail.com",
  // Optional custom endpoint, otherwise generated from recipient.
  endpoint: "",

  // Formspree:
  // formspreeEndpoint: "https://formspree.io/f/yourFormId",
  formspreeEndpoint: "",

  // Web3Forms:
  // accessKey: "your_public_access_key",
  accessKey: "",

  // Optional shared subject:
  subject: "Nouvelle demande - Cle d'Or Conciergerie"
};

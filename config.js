/* Global configuration for OK TV frontend modules. */
window.OKTV_CONFIG = window.OKTV_CONFIG || {
  // Base URL for auth API. Empty string = same origin.
  authApiBaseUrl: "",
  // OK AI webhook endpoint (kept for backward compatibility).
  okaiWebhookUrl: "",
};
// OK AI chatbot endpoint (single source of truth).
window.OKAI_CHAT_ENDPOINT =
  "https://gadela.app.n8n.cloud/webhook/a622e709-443c-47bc-840c-4d5018e0de04/chat";
window.OKTV_CONFIG.okaiWebhookUrl = window.OKAI_CHAT_ENDPOINT;
// OK AI does not require authentication.
window.OKAI_AUTH_REQUIRED = false;

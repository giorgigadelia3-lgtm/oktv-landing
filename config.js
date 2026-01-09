/* Global configuration for OK TV frontend modules. */
window.OKTV_CONFIG = window.OKTV_CONFIG || {
  // Base URL for auth API. Empty string = same origin.
  authApiBaseUrl: "",
  // OK AI webhook endpoint (kept for backward compatibility).
  okaiWebhookUrl: "",
};
// OK AI chatbot endpoint (single source of truth).
window.OKAI_CHAT_ENDPOINT =
  "http://localhost:5678/webhook-test/2a787182-692b-4a4a-b84a-4e0f079c0632";
window.OKTV_CONFIG.okaiWebhookUrl = window.OKAI_CHAT_ENDPOINT;
// OK AI does not require authentication.
window.OKAI_AUTH_REQUIRED = false;


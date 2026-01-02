const config = require("./config");

function replacePlaceholders(value, vars) {
  if (typeof value === "string") {
    return value
      .replace(/{{\s*phone\s*}}/g, vars.phone)
      .replace(/{{\s*message\s*}}/g, vars.message);
  }
  return value;
}

function applyTemplate(template, vars) {
  if (Array.isArray(template)) {
    return template.map((item) => applyTemplate(item, vars));
  }
  if (template && typeof template === "object") {
    return Object.keys(template).reduce((acc, key) => {
      acc[key] = applyTemplate(template[key], vars);
      return acc;
    }, {});
  }
  return replacePlaceholders(template, vars);
}

async function sendOtpSms({ phone, message }) {
  if (!config.smsProviderUrl) {
    const error = new Error("SMS provider URL is not configured.");
    error.code = "SMS_NOT_CONFIGURED";
    throw error;
  }

  const headers = {
    "Content-Type": "application/json",
    ...(config.smsProviderHeaders || {}),
  };

  if (config.smsProviderApiKey && !headers.Authorization) {
    headers.Authorization = `Bearer ${config.smsProviderApiKey}`;
  }

  const template =
    config.smsProviderBodyTemplate || { to: "{{phone}}", message: "{{message}}" };
  const payload = applyTemplate(template, { phone, message });

  const response = await fetch(config.smsProviderUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = new Error("SMS provider request failed.");
    error.code = "SMS_PROVIDER_ERROR";
    error.status = response.status;
    throw error;
  }

  return true;
}

module.exports = { sendOtpSms };

function getFieldByLabel(labelRegex) {
  const labels = Array.from(document.querySelectorAll("label"));
  for (const label of labels) {
    if (label.textContent.trim().toLowerCase().match(labelRegex)) {
      const target = label.htmlFor ? document.getElementById(label.htmlFor) : label.querySelector("input,textarea");
      if (target) {
        return target;
      }
    }
  }
  return null;
}

function fillInput(selector, value) {
  const input = document.querySelector(selector);
  if (input && !input.disabled) {
    input.focus();
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function safeFillProfile(profile) {
  const mapping = [
    { regex: /name/i, value: profile.fullName },
    { regex: /email/i, value: profile.email },
    { regex: /phone|mobile/i, value: profile.phone },
    { regex: /linkedin/i, value: profile.linkedin },
    { regex: /github/i, value: profile.github }
  ];

  mapping.forEach((entry) => {
    const field = getFieldByLabel(entry.regex);
    if (field && entry.value) {
      field.focus();
      field.value = entry.value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "FILL_FORM") {
    safeFillProfile(message.payload);
    sendResponse({ success: true });
  }
});

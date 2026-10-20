const tabs = document.querySelector(".tabs");
const activeTab = tabs ? tabs.querySelector('.tab[aria-current="page"]') : null;

if (tabs && activeTab && tabs.scrollWidth > tabs.clientWidth) {
  activeTab.scrollIntoView({ block: "nearest", inline: "center" });
}

const copyStatus = document.querySelector(".copy-status");
let copyStatusTimer;

function showCopyStatus(message, isError = false) {
  if (!copyStatus) return;
  clearTimeout(copyStatusTimer);
  copyStatus.textContent = message;
  copyStatus.classList.toggle("error", isError);
  copyStatusTimer = setTimeout(() => {
    copyStatus.textContent = "";
    copyStatus.classList.remove("error");
  }, 4000);
}

async function copyToClipboard(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall back to the legacy copy path when permission is denied.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textarea.remove();
  }

  return copied;
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      const copied = await copyToClipboard(button.dataset.copy);
      if (copied) {
        showCopyStatus("[ok] تم النسخ إلى الحافظة.");
      } else {
        showCopyStatus("[err] تعذّر النسخ. حدّد القيمة وانسخها يدوياً.", true);
      }
    } catch (error) {
      showCopyStatus("[err] تعذّر النسخ. حدّد القيمة وانسخها يدوياً.", true);
    }
  });
});

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const nameInput = document.querySelector("#contact-name");
  const messageInput = document.querySelector("#contact-message");
  const formStatus = document.querySelector("#form-status");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    formStatus.classList.remove("error");

    if (!name) {
      formStatus.textContent = "[err] اكتب اسمك firstly.";
      formStatus.classList.add("error");
      nameInput.focus();
      return;
    }

    if (!message) {
      formStatus.textContent = "[err] اكتب نص الرسالة.";
      formStatus.classList.add("error");
      messageInput.focus();
      return;
    }

    const text = `مرحبا عبدالله،\n\n${message}\n\n— ${name}`;
    const link = document.createElement("a");
    link.href = `https://wa.me/201012012544?text=${encodeURIComponent(text)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();

    formStatus.textContent = "[ok] تم فتح واتساب برسالتك.";
    contactForm.reset();
  });
}

// Language switcher functionality
const langBtn = document.querySelector(".lang-btn");
const htmlEl = document.documentElement;

if (langBtn) {
  // Check for saved preference or default to English
  const savedLang = localStorage.getItem("site-lang");
  const defaultLang = "en";
  let currentLang = savedLang || defaultLang;

  // Apply saved language on page load
  function setLanguage(lang) {
    currentLang = lang;
    htmlEl.setAttribute("lang", lang);
    htmlEl.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    if (langBtn) {
      langBtn.dataset.lang = lang;
      langBtn.setAttribute("aria-pressed", lang === "ar");
      langBtn.textContent = lang === "ar" ? "AR" : "EN";
    }
  }

  // Initialize with saved or default language
  setLanguage(currentLang);

  // Add click handler to language button
  langBtn.addEventListener("click", () => {
    const newLang = currentLang === "en" ? "ar" : "en";
    setLanguage(newLang);
    localStorage.setItem("site-lang", newLang);
  });
}
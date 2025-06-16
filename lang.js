function loadLanguageFile(lang, callback) {
  fetch(`translations/${lang}.json`)
    .then(response => {
      if (!response.ok) throw new Error("Language file not found");
      return response.json();
    })
    .then(data => {
      applyTranslations(data);
      if (callback) callback();
    })
    .catch(error => {
      console.error("Error loading translation file:", error);
    });
}

function applyTranslations(translations) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) {
      el.innerHTML = translations[key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
  const langInput = document.getElementById('language');
  if (langInput) {
    langInput.value = savedLang;
  }

  loadLanguageFile(savedLang);

  // Update dropdown text
  const langButton = document.getElementById('selected-lang');
  const selectedLi = document.querySelector(`#lang-list li[data-value="${savedLang}"]`);
  if (langButton && selectedLi) {
    langButton.textContent = selectedLi.textContent;
  }

  const langList = document.getElementById('lang-list');
  if (langList) {
    langList.onclick = (e) => {
      if (e.target.tagName === 'LI') {
        const selectedLang = e.target.dataset.value;
        if (langInput) langInput.value = selectedLang;
        if (langButton) langButton.textContent = e.target.textContent;
        localStorage.setItem('preferredLanguage', selectedLang);
        loadLanguageFile(selectedLang);
      }
    };
  }

  // Toggle dropdown
  const dropdownBtn = document.getElementById('selected-lang');
  if (dropdownBtn && langList) {
    dropdownBtn.onclick = () => {
      langList.style.display = langList.style.display === 'block' ? 'none' : 'block';
    };

    document.addEventListener('click', (e) => {
      if (!dropdownBtn.contains(e.target) && !langList.contains(e.target)) {
        langList.style.display = 'none';
      }
    });
  }
});

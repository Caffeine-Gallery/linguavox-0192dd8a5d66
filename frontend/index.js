import { backend } from "declarations/backend";

const sourceText = document.getElementById('sourceText');
const targetLang = document.getElementById('targetLang');
const translateBtn = document.getElementById('translateBtn');
const translatedText = document.getElementById('translatedText');
const speakBtn = document.getElementById('speakBtn');
const spinner = translateBtn.querySelector('.spinner-border');

async function translateText(text, targetLang) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseStatus === 200) {
            const translation = data.responseData.translatedText;
            // Store translation in backend
            await backend.storeTranslation(text, translation, targetLang);
            return translation;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

function speak(text, lang) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    }
}

translateBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();
    const lang = targetLang.value;
    
    if (!text) return;

    // Show loading state
    spinner.classList.remove('d-none');
    translateBtn.disabled = true;
    speakBtn.disabled = true;
    translatedText.value = '';

    try {
        const translation = await translateText(text, lang);
        translatedText.value = translation;
        speakBtn.disabled = false;
    } catch (error) {
        translatedText.value = 'Translation failed. Please try again.';
    } finally {
        spinner.classList.add('d-none');
        translateBtn.disabled = false;
    }
});

speakBtn.addEventListener('click', () => {
    const text = translatedText.value;
    const lang = targetLang.value;
    if (text) {
        speak(text, lang);
    }
});

// Debounce function for real-time translation
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Real-time translation
const debouncedTranslate = debounce(async (text, lang) => {
    if (!text) {
        translatedText.value = '';
        speakBtn.disabled = true;
        return;
    }

    try {
        const translation = await translateText(text, lang);
        translatedText.value = translation;
        speakBtn.disabled = false;
    } catch (error) {
        translatedText.value = 'Translation failed. Please try again.';
    }
}, 1000);

sourceText.addEventListener('input', (e) => {
    const text = e.target.value.trim();
    const lang = targetLang.value;
    debouncedTranslate(text, lang);
});

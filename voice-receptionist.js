/**
 * Hong's Little Kitchen — AI Voice Receptionist
 * Uses browser-native Web Speech API for speech-to-text and text-to-speech.
 * No external APIs required.
 * Version 1.0
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // 1. Knowledge Base (same as chat-widget.js)
  // ──────────────────────────────────────────────

  const KB = {
    restaurant: {
      name: "Hong's Little Kitchen",
      cuisine: "Asian Fusion",
      rating: "4.9 out of 5 stars"
    },
    menu: {
      dumplings: "Our signature hand-made dumplings with juicy filling wrapped in delicate pastry. They're one of our most popular dishes!",
      wonton_noodle_soup: "Wonton Noodle Spicy Soup — savoury wontons in a rich, aromatic spicy broth with springy egg noodles. Pure comfort food.",
      sweet_and_sour_pork: "Sweet and Sour Pork — crispy battered pork tossed in a tangy-sweet sauce with pineapple, capsicum, and onion. A classic!",
      prawn_toast: "Prawn Toast — golden, crispy toast topped with seasoned prawn paste and sesame seeds. A perfect starter.",
      sesame_prawn_toast: "Sesame Prawn Toast — the same delicious prawn toast, generously coated in sesame seeds for extra crunch.",
      xiao_long_bao: "Xiao Long Bao — delicate steamed soup dumplings filled with seasoned pork and a burst of hot, savoury soup inside. Be careful, they're hot!",
      spring_onion_pancake: "Spring Onion Pancake — flaky, pan-fried flatbread with fragrant spring onions. Crispy outside, soft inside.",
      wat_tan_hor: "Wat Tan Hor — silky flat rice noodles in a savoury egg gravy. A comforting Malaysian-Chinese classic.",
      pan_fried_dumpling: "Pan Fried Dumplings — golden-bottomed dumplings with a crispy sear and juicy filling. Absolutely moreish!",
      all: "We serve hand-made dumplings, wonton noodle spicy soup, sweet and sour pork, prawn toast, sesame prawn toast, xiao long bao soup dumplings, spring onion pancake, wat tan hor flat rice noodles, and pan fried dumplings. Prices range from $9.90 to $18.90."
    },
    hours: "We're open 7 days a week! Monday to Thursday from 11 AM to 8:30 PM, Friday and Saturday from 11 AM to 9 PM, and Sunday from 11 AM to 8:30 PM.",
    location: "We're located at 9/300 Point Cook Road, Point Cook, Victoria 3030, in the Sanctuary Lakes Shopping Centre.",
    phone: "You can reach us at (03) 9899 8588.",
    pricing: "Our prices range from about $9.90 to $18.90 per dish, and you can expect to spend around $20 to $40 per person.",
    services: "We offer dine-in, takeaway, and online ordering for your convenience.",
    dietary: "Yes, we have good vegetarian options available! Our chef is happy to accommodate dietary needs — just let us know.",
    free_tea: "Yes! We offer complimentary free hot tea with every dine-in meal.",
    bike_parking: "Yes, we have bike parking available for cyclists.",
    parking: "Sanctuary Lakes Shopping Centre has plenty of free car parking. We also have bike parking!"
  };

  // ──────────────────────────────────────────────
  // 2. Response Engine
  // ──────────────────────────────────────────────

  const KEYWORDS_RESPONSES = [
    { words: ['dumpling', 'dumplings'], response: KB.menu.dumplings + ' Would you like to try some?' },
    { words: ['wonton', 'wonton noodle', 'spicy soup'], response: KB.menu.wonton_noodle_soup },
    { words: ['sweet and sour', 'sweet sour pork'], response: KB.menu.sweet_and_sour_pork },
    { words: ['prawn toast', 'shrimp toast'], response: KB.menu.prawn_toast },
    { words: ['sesame prawn', 'sesame shrimp'], response: KB.menu.sesame_prawn_toast },
    { words: ['xiao long bao', 'soup dumpling', 'soup dumplings', 'xiaolongbao'], response: KB.menu.xiao_long_bao },
    { words: ['spring onion pancake', 'scallion pancake'], response: KB.menu.spring_onion_pancake },
    { words: ['wat tan hor', 'flat rice noodle', 'rice noodle', 'hor fun'], response: KB.menu.wat_tan_hor },
    { words: ['pan fried dumpling', 'pan-fried dumpling', 'pot sticker', 'guotie'], response: KB.menu.pan_fried_dumpling },
    { words: ['menu', 'what do you have', 'what do you serve', 'food', 'dishes', 'eat', 'recommend', 'popular', 'signature'], response: KB.menu.all + ' What sounds good to you?' },
    { words: ['hour', 'open', 'opening', 'closing', 'when are you open', 'time'], response: KB.hours },
    { words: ['monday', 'mon'], response: 'On Mondays, we\'re open from 11 AM to 8:30 PM.' },
    { words: ['tuesday', 'tue'], response: 'On Tuesdays, we\'re open from 11 AM to 8:30 PM.' },
    { words: ['wednesday', 'wed'], response: 'On Wednesdays, we\'re open from 11 AM to 8:30 PM.' },
    { words: ['thursday', 'thu'], response: 'On Thursdays, we\'re open from 11 AM to 8:30 PM.' },
    { words: ['friday', 'fri'], response: 'On Fridays, we\'re open from 11 AM to 9 PM.' },
    { words: ['saturday', 'sat'], response: 'On Saturdays, we\'re open from 11 AM to 9 PM.' },
    { words: ['sunday', 'sun'], response: 'On Sundays, we\'re open from 11 AM to 8:30 PM.' },
    { words: ['location', 'address', 'where', 'directions', 'find', 'located'], response: KB.location + ' You can find us in the Sanctuary Lakes Shopping Centre.' },
    { words: ['phone', 'call', 'number', 'telephone', 'contact'], response: KB.phone + ' Give us a call anytime during business hours!' },
    { words: ['price', 'cost', 'expensive', 'cheap', 'how much', 'price range', 'per person', 'budget', 'dollar'], response: KB.pricing },
    { words: ['dine in', 'dine-in', 'dining', 'eat in', 'eat inside'], response: 'Yes, you can dine in with us! We also offer free hot tea with every dine-in meal.' },
    { words: ['takeaway', 'take away', 'take-out', 'takeout'], response: 'Yes, we do takeaway! Just call us at (03) 9899 8588 to place your order.' },
    { words: ['delivery', 'deliver', 'online order', 'order online', 'ubereats', 'doordash'], response: 'You can order online for delivery or pickup. Call us at (03) 9899 8588 or order through your favourite delivery platform.' },
    { words: ['order', 'ordering', 'buy', 'purchase'], response: 'You can order online, or call us at (03) 9899 8588 for takeaway!' },
    { words: ['vegetarian', 'vegan', 'vegetable', 'dietary', 'veggie', 'diet', 'allergy'], response: KB.dietary },
    { words: ['free tea', 'hot tea', 'complimentary tea', 'free drink', 'tea'], response: KB.free_tea },
    { words: ['bike', 'bicycle', 'cycling', 'bike parking'], response: KB.bike_parking },
    { words: ['parking', 'car park', 'car', 'park'], response: KB.parking },
    { words: ['chef', 'owner', 'service', 'accommodate', 'request'], response: 'Our chef listens! We pride ourselves on generous service and accommodating special requests.' },
    { words: ['rating', 'review', 'stars', 'recommended', 'reputation'], response: KB.restaurant.rating + ' Our customers love the authentic food, generous service, and warm atmosphere!' },
    { words: ['thank', 'thanks', 'appreciate'], response: 'You\'re very welcome! We look forward to serving you at Hong\'s Little Kitchen. Have a wonderful day!' },
    { words: ['bye', 'goodbye', 'see you', 'talk later'], response: 'Goodbye! Thank you for calling Hong\'s Little Kitchen. We hope to see you soon! 🍜' }
  ];

  const GREETING_RESPONSE = "Hi! Welcome to Hong's Little Kitchen! I'm your AI receptionist. How can I help you today? You can ask about our menu, hours, location, or anything else!";
  const FALLBACK_RESPONSE = "I'm sorry, I didn't quite catch that. You can call us directly at (03) 9899 8588 and our team will be happy to help! Or you can try asking your question again.";

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  }

  function findBestResponse(text) {
    const normalized = normalize(text);
    if (!normalized) return null;

    // Check greeting keywords
    const greetingWords = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetingWords.some(w => normalized.includes(w))) {
      return GREETING_RESPONSE;
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of KEYWORDS_RESPONSES) {
      const score = entry.words.reduce((acc, word) => {
        return acc + (normalized.includes(normalize(word)) ? 1 : 0);
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestScore >= 1 && bestMatch) {
      return bestMatch.response;
    }

    return null;
  }

  // ──────────────────────────────────────────────
  // 3. Web Speech API Manager
  // ──────────────────────────────────────────────

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

  function isSpeechSupported() {
    return !!(SpeechRecognition && window.speechSynthesis);
  }

  // ──────────────────────────────────────────────
  // 4. Voice Receptionist UI
  // ──────────────────────────────────────────────

  const COLORS = {
    primary: '#C41E3A',
    primaryDark: '#A0182E',
    gold: '#D4A017',
    goldLight: '#F0D060',
    cream: '#FFF8F0',
    dark: '#2D1B0E',
    brown: '#6B4F3A',
    border: '#E8D5C0',
    green: '#27AE60'
  };

  function injectVoiceStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #hlk-voice-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000000;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        animation: hlk-voice-fadeIn 0.3s ease-out;
      }

      #hlk-voice-overlay.open {
        display: flex;
      }

      @keyframes hlk-voice-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      #hlk-voice-modal {
        background: ${COLORS.cream};
        border-radius: 20px;
        padding: 32px;
        max-width: 520px;
        width: calc(100% - 40px);
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: hlk-voice-slideUp 0.4s ease-out;
        position: relative;
      }

      @keyframes hlk-voice-slideUp {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      #hlk-voice-close {
        position: absolute;
        top: 12px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: ${COLORS.brown};
        padding: 4px 8px;
        border-radius: 8px;
        transition: background 0.2s;
        line-height: 1;
      }

      #hlk-voice-close:hover {
        background: rgba(0,0,0,0.05);
      }

      #hlk-voice-icon {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background: ${COLORS.primary};
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 44px;
        transition: all 0.3s;
        box-shadow: 0 4px 20px rgba(196, 30, 58, 0.3);
      }

      #hlk-voice-icon.listening {
        background: ${COLORS.green};
        animation: hlk-voice-pulse 1.2s ease-in-out infinite;
        box-shadow: 0 4px 30px rgba(39, 174, 96, 0.4);
      }

      #hlk-voice-icon.speaking {
        background: ${COLORS.gold};
        animation: hlk-voice-pulse-gold 1s ease-in-out infinite;
        box-shadow: 0 4px 30px rgba(212, 160, 23, 0.4);
      }

      #hlk-voice-icon.thinking {
        background: ${COLORS.brown};
        animation: hlk-voice-blink 0.8s ease-in-out infinite;
      }

      @keyframes hlk-voice-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }

      @keyframes hlk-voice-pulse-gold {
        0%, 100% { transform: scale(1); box-shadow: 0 4px 30px rgba(212, 160, 23, 0.4); }
        50% { transform: scale(1.05); box-shadow: 0 4px 40px rgba(212, 160, 23, 0.6); }
      }

      @keyframes hlk-voice-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }

      #hlk-voice-title {
        font-family: 'Playfair Display', serif;
        font-size: 22px;
        color: ${COLORS.primary};
        margin: 0 0 8px;
      }

      #hlk-voice-status {
        font-size: 14px;
        color: ${COLORS.brown};
        margin: 0 0 16px;
        min-height: 24px;
      }

      #hlk-voice-status .highlight {
        color: ${COLORS.primary};
        font-weight: 600;
      }

      #hlk-voice-transcript {
        background: white;
        border: 1px solid ${COLORS.border};
        border-radius: 12px;
        padding: 16px;
        min-height: 60px;
        max-height: 120px;
        overflow-y: auto;
        font-size: 15px;
        color: ${COLORS.dark};
        margin-bottom: 16px;
        text-align: left;
        line-height: 1.5;
      }

      #hlk-voice-transcript .placeholder {
        color: ${COLORS.brown};
        font-style: italic;
        opacity: 0.6;
      }

      #hlk-voice-response {
        background: white;
        border: 1px solid ${COLORS.border};
        border-radius: 12px;
        padding: 16px;
        min-height: 60px;
        max-height: 120px;
        overflow-y: auto;
        font-size: 14px;
        color: ${COLORS.dark};
        margin-bottom: 20px;
        text-align: left;
        line-height: 1.5;
        display: none;
      }

      #hlk-voice-response.show {
        display: block;
        animation: hlk-voice-fadeIn 0.3s;
      }

      #hlk-voice-response .response-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: ${COLORS.gold};
        font-weight: 600;
        margin-bottom: 6px;
      }

      #hlk-voice-toggle-btn {
        background: ${COLORS.primary};
        color: white;
        border: none;
        padding: 14px 36px;
        border-radius: 40px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      #hlk-voice-toggle-btn:hover {
        background: ${COLORS.primaryDark};
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(196, 30, 58, 0.3);
      }

      #hlk-voice-toggle-btn.listening {
        background: ${COLORS.green};
        animation: hlk-voice-btn-pulse 1.2s ease-in-out infinite;
      }

      #hlk-voice-toggle-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        animation: none;
      }

      @keyframes hlk-voice-btn-pulse {
        0%, 100% { box-shadow: 0 4px 20px rgba(39, 174, 96, 0.3); }
        50% { box-shadow: 0 4px 30px rgba(39, 174, 96, 0.5); }
      }

      #hlk-voice-waves {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 30px;
        margin: 8px 0;
      }

      #hlk-voice-waves.active {
        display: flex;
      }

      .hlk-voice-wave {
        width: 6px;
        height: 10px;
        background: ${COLORS.primary};
        border-radius: 3px;
        animation: hlk-wave 0.8s ease-in-out infinite;
      }

      .hlk-voice-wave:nth-child(2) { animation-delay: 0.1s; }
      .hlk-voice-wave:nth-child(3) { animation-delay: 0.2s; }
      .hlk-voice-wave:nth-child(4) { animation-delay: 0.3s; }
      .hlk-voice-wave:nth-child(5) { animation-delay: 0.4s; }

      @keyframes hlk-wave {
        0%, 100% { height: 6px; }
        50% { height: 24px; }
      }

      #hlk-voice-btn-text {
        font-size: 16px;
      }

      #hlk-voice-error {
        color: ${COLORS.primary};
        font-size: 13px;
        margin-top: 12px;
        display: none;
      }

      /* Unsupporting browser message */
      #hlk-voice-unsupported {
        display: none;
        padding: 12px;
        background: #FFF3CD;
        border: 1px solid #FFEAA7;
        border-radius: 8px;
        color: #856404;
        font-size: 14px;
        margin-bottom: 16px;
      }

      #hlk-voice-unsupported.show {
        display: block;
      }

      /* Call button on page */
      #hlk-call-receptionist-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, ${COLORS.gold}, #B8860B);
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 40px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 16px rgba(212, 160, 23, 0.3);
      }

      #hlk-call-receptionist-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(212, 160, 23, 0.4);
      }

      #hlk-call-receptionist-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      @media (max-width: 480px) {
        #hlk-voice-modal {
          padding: 24px 20px;
          border-radius: 16px;
          width: calc(100% - 24px);
        }
        #hlk-voice-icon {
          width: 72px;
          height: 72px;
          font-size: 34px;
        }
        #hlk-voice-title {
          font-size: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ──────────────────────────────────────────────
  // 5. Voice Receptionist Core Logic
  // ──────────────────────────────────────────────

  function createVoiceReceptionist() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'hlk-voice-overlay';

    overlay.innerHTML = `
      <div id="hlk-voice-modal">
        <button id="hlk-voice-close" aria-label="Close voice receptionist">✕</button>
        <div id="hlk-voice-icon">🎤</div>
        <h2 id="hlk-voice-title">AI Receptionist</h2>
        <p id="hlk-voice-status">Press the button and <span class="highlight">speak your question</span></p>
        <div id="hlk-voice-waves">
          <span class="hlk-voice-wave"></span>
          <span class="hlk-voice-wave"></span>
          <span class="hlk-voice-wave"></span>
          <span class="hlk-voice-wave"></span>
          <span class="hlk-voice-wave"></span>
        </div>
        <div id="hlk-voice-transcript"><span class="placeholder">Your speech will appear here...</span></div>
        <div id="hlk-voice-response">
          <div class="response-label">🤖 Response</div>
          <div id="hlk-voice-response-text"></div>
        </div>
        <div id="hlk-voice-unsupported">
          Your browser doesn't support voice recognition. You can still use our chat widget or call us at (03) 9899 8588.
        </div>
        <button id="hlk-voice-toggle-btn">
          <span id="hlk-voice-btn-icon">🎤</span>
          <span id="hlk-voice-btn-text">Start Speaking</span>
        </button>
        <div id="hlk-voice-error"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Create call button (inserted into hero section or floating)
    const callBtn = document.createElement('button');
    callBtn.id = 'hlk-call-receptionist-btn';
    callBtn.innerHTML = '🎤 Call AI Receptionist';
    callBtn.setAttribute('aria-label', 'Call AI Receptionist — speak your questions');

    return { overlay, callBtn };
  }

  function initVoiceReceptionist() {
    if (!isSpeechSupported()) {
      // Still create the UI but show unsupported message
      const els = createVoiceReceptionist();
      const overlay = els.overlay;
      const callBtn = els.callBtn;

      document.getElementById('hlk-voice-unsupported').classList.add('show');
      document.getElementById('hlk-voice-toggle-btn').disabled = true;

      // Add call button to hero
      const heroActions = document.querySelector('.hero-actions');
      if (heroActions) {
        heroActions.appendChild(callBtn);
      }

      callBtn.addEventListener('click', () => {
        overlay.classList.add('open');
      });

      document.getElementById('hlk-voice-close').addEventListener('click', () => {
        overlay.classList.remove('open');
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
      });

      console.log('🔇 Voice Receptionist: Speech recognition not supported in this browser');
      return;
    }

    const els = createVoiceReceptionist();
    const overlay = els.overlay;
    const callBtn = els.callBtn;

    const iconEl = document.getElementById('hlk-voice-icon');
    const statusEl = document.getElementById('hlk-voice-status');
    const transcriptEl = document.getElementById('hlk-voice-transcript');
    const responseEl = document.getElementById('hlk-voice-response');
    const responseTextEl = document.getElementById('hlk-voice-response-text');
    const toggleBtn = document.getElementById('hlk-voice-toggle-btn');
    const btnIcon = document.getElementById('hlk-voice-btn-icon');
    const btnText = document.getElementById('hlk-voice-btn-text');
    const wavesEl = document.getElementById('hlk-voice-waves');
    const errorEl = document.getElementById('hlk-voice-error');
    const closeBtn = document.getElementById('hlk-voice-close');

    let recognition = null;
    let isListening = false;
    let isSpeaking = false;
    let manualStop = false;

    // Create speech recognition instance
    function createRecognition() {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = 'en-AU';

      let finalTranscript = '';

      recog.onstart = function() {
        isListening = true;
        manualStop = false;
        iconEl.className = 'listening';
        iconEl.textContent = '🎤';
        toggleBtn.classList.add('listening');
        btnText.textContent = 'Listening...';
        statusEl.innerHTML = '🎧 Listening... <span class="highlight">speak now</span>';
        wavesEl.classList.add('active');
        errorEl.style.display = 'none';
        transcriptEl.innerHTML = '<span class="placeholder">Listening...</span>';
      };

      recog.onresult = function(event) {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }

        const displayText = finalTranscript + (interimText ? ' ' + interimText : '');
        if (displayText.trim()) {
          transcriptEl.innerHTML = displayText;
        }
      };

      recog.onerror = function(event) {
        console.warn('Voice Receptionist error:', event.error);
        isListening = false;
        iconEl.className = '';
        iconEl.textContent = '🎤';
        toggleBtn.classList.remove('listening');
        wavesEl.classList.remove('active');

        if (event.error === 'no-speech') {
          statusEl.innerHTML = 'I didn\'t hear anything. <span class="highlight">Try again?</span>';
          btnText.textContent = 'Try Again';
          toggleBtn.classList.remove('listening');
          toggleBtn.disabled = false;
        } else if (event.error === 'not-allowed') {
          statusEl.textContent = 'Microphone access was denied. Please allow microphone access and try again.';
          btnText.textContent = 'Start Speaking';
          toggleBtn.classList.remove('listening');
          toggleBtn.disabled = false;
          errorEl.style.display = 'block';
          errorEl.textContent = '🔇 Microphone access is required. Check your browser permissions.';
        } else {
          statusEl.textContent = 'Something went wrong. Please try again.';
          btnText.textContent = 'Try Again';
          toggleBtn.classList.remove('listening');
          toggleBtn.disabled = false;
        }
      };

      recog.onend = function() {
        isListening = false;
        toggleBtn.classList.remove('listening');
        wavesEl.classList.remove('active');

        if (manualStop) {
          iconEl.className = '';
          iconEl.textContent = '🎤';
          statusEl.innerHTML = 'Press the button and <span class="highlight">speak your question</span>';
          btnText.textContent = 'Start Speaking';
          return;
        }

        if (finalTranscript.trim()) {
          // Process the question
          processQuestion(finalTranscript.trim());
        } else {
          iconEl.className = '';
          iconEl.textContent = '🎤';
          statusEl.innerHTML = 'I didn\'t catch that. Press the button and <span class="highlight">try again</span>';
          btnText.textContent = 'Try Again';
        }

        finalTranscript = '';
      };

      return recog;
    }

    function speakText(text) {
      return new Promise((resolve) => {
        if (!window.speechSynthesis) {
          resolve();
          return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-AU';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a good voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en-AU') || v.lang.startsWith('en-GB'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        isSpeaking = true;
        iconEl.className = 'speaking';
        iconEl.textContent = '🔊';
        statusEl.innerHTML = '🔊 <span class="highlight">Speaking...</span>';
        btnText.textContent = 'Speaking...';
        toggleBtn.disabled = true;

        utterance.onend = function() {
          isSpeaking = false;
          iconEl.className = '';
          iconEl.textContent = '🎤';
          statusEl.innerHTML = 'Press the button and <span class="highlight">speak your question</span>';
          btnText.textContent = 'Start Speaking';
          toggleBtn.disabled = false;
          resolve();
        };

        utterance.onerror = function() {
          isSpeaking = false;
          iconEl.className = '';
          iconEl.textContent = '🎤';
          statusEl.innerHTML = 'Press the button and <span class="highlight">speak your question</span>';
          btnText.textContent = 'Start Speaking';
          toggleBtn.disabled = false;
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    }

    function processQuestion(question) {
      iconEl.className = 'thinking';
      iconEl.textContent = '🤔';
      statusEl.innerHTML = '🤔 <span class="highlight">Thinking...</span>';
      btnText.textContent = 'Processing...';
      toggleBtn.disabled = true;

      // Display transcript
      transcriptEl.innerHTML = question;

      // Find response
      const response = findBestResponse(question);

      setTimeout(async () => {
        const answer = response || "I'm sorry, I didn't quite find an answer to that. You can call us directly at (03) 9899 8588 and our team will be happy to help!";

        // Display response
        responseTextEl.textContent = answer;
        responseEl.classList.add('show');

        // Save for retry
        responseEl.dataset.lastAnswer = answer;

        // Speak the response
        await speakText(answer);

        // Done speaking — offer to ask another question
        statusEl.innerHTML = '💬 Ask another question, or press the button to <span class="highlight">speak again</span>';
        btnText.textContent = 'Ask Another Question';
        toggleBtn.disabled = false;
        iconEl.className = '';
        iconEl.textContent = '🎤';
      }, 800);
    }

    function startListening() {
      if (isListening || isSpeaking) return;

      // Hide previous response
      responseEl.classList.remove('show');

      try {
        recognition = createRecognition();
        recognition.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        statusEl.textContent = 'Could not start listening. Please try again.';
        btnText.textContent = 'Try Again';
      }
    }

    function stopListening() {
      if (recognition && isListening) {
        manualStop = true;
        recognition.stop();
      }
    }

    // Toggle button
    toggleBtn.addEventListener('click', function() {
      if (isSpeaking) return;

      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    });

    // Close button
    closeBtn.addEventListener('click', function() {
      if (isListening) {
        manualStop = true;
        if (recognition) recognition.stop();
      }
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
      }
      overlay.classList.remove('open');
    });

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        if (isListening) {
          manualStop = true;
          if (recognition) recognition.stop();
        }
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          isSpeaking = false;
        }
        overlay.classList.remove('open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        if (isListening) {
          manualStop = true;
          if (recognition) recognition.stop();
        }
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          isSpeaking = false;
        }
        overlay.classList.remove('open');
      }
    });

    // Pre-load voices
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function() {
        window.speechSynthesis.getVoices();
      };
    }

    // Add call button to hero section
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
      heroActions.appendChild(callBtn);
    }

    // Open on call button click
    callBtn.addEventListener('click', function() {
      overlay.classList.add('open');
    });
  }

  // ──────────────────────────────────────────────
  // 6. Bootstrap
  // ──────────────────────────────────────────────

  function bootstrap() {
    injectVoiceStyles();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initVoiceReceptionist);
    } else {
      initVoiceReceptionist();
    }
  }

  bootstrap();

})();
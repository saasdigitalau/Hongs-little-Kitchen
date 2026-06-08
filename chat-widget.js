/**
 * Hong's Little Kitchen — AI Chat Widget
 * Floating chat bubble with knowledge base for restaurant FAQs.
 * Version 1.0
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // 1. Knowledge Base
  // ──────────────────────────────────────────────

  const KNOWLEDGE_BASE = {
    restaurant: {
      name: "Hong's Little Kitchen",
      cuisine: "Asian Fusion",
      tagline: "Authentic, high-quality Asian comfort food with generous service",
      rating: "4.9★"
    },

    menu: {
      dumplings: "Our signature dumplings — handmade with love, juicy filling wrapped in delicate pastry. A fan favourite!",
      wonton_noodle_soup: "Wonton Noodle Spicy Soup — Savoury wontons in a rich, aromatic spicy broth with springy egg noodles. Perfect comfort food.",
      wonton_noodle_spicy_soup: "Wonton Noodle Spicy Soup — Savoury wontons in a rich, aromatic spicy broth with springy egg noodles. Perfect comfort food.",
      sweet_and_sour_pork: "Sweet and Sour Pork — Crispy battered pork tossed in a tangy-sweet sauce with capsicum, pineapple, and onion. A classic done right.",
      prawn_toast: "Prawn Toast — Golden, crispy toast topped with seasoned prawn paste and sesame seeds. A perfect starter!",
      sesame_prawn_toast: "Sesame Prawn Toast — Same delicious prawn toast generously coated in sesame seeds for extra crunch and nutty flavour.",
      xiao_long_bao: "Xiao Long Bao (Soup Dumplings) — Delicate steamed dumplings filled with seasoned pork and a burst of hot, savoury soup inside. Handle with care!",
      spring_onion_pancake: "Spring Onion Pancake — Flaky, pan-fried flatbread with fragrant spring onions. Crispy outside, soft inside.",
      wat_tan_hor: "Wat Tan Hor (Flat Rice Noodles) — Silky flat rice noodles in a savoury egg gravy, often served with your choice of meat or vegetables. A comforting classic.",
      flat_rice_noodle: "Flat Rice Noodles (Wat Tan Hor) — Silky flat rice noodles in a savoury egg gravy. A comforting classic.",
      pan_fried_dumpling: "Pan Fried Dumpling — Golden-bottomed dumplings with a crispy sear and juicy filling. Crispy, savoury, and absolutely moreish!"
    },

    hours: {
      monday_thursday: "11:00 AM – 9:00 PM",
      friday_saturday: "11:00 AM – 10:00 PM",
      sunday: "11:00 AM – 8:00 PM",
      summary: "We're open 7 days a week!\n\n• Monday – Thursday: 11:00 AM – 9:00 PM\n• Friday – Saturday: 11:00 AM – 10:00 PM\n• Sunday: 11:00 AM – 8:00 PM"
    },

    location: {
      address: "9/300 Point Cook Rd, Point Cook VIC 3030",
      centre: "Sanctuary Lakes Shopping Centre",
      directions: "We're located in the Sanctuary Lakes Shopping Centre on Point Cook Road. Plenty of parking available, and we have bike parking too!",
      landmarks: "Near Sanctuary Lakes, in the Sanctuary Lakes Shopping Centre complex"
    },

    contact: {
      phone: "(03) 9899 8588",
      email: null,
      social: null
    },

    pricing: {
      per_person: "$20 – $40",
      note: "Great value for the quality and portion size!",
      average: "$30"
    },

    services: {
      dine_in: true,
      takeaway: true,
      online_ordering: true,
      summary: "We offer dine-in, takeaway, and online ordering for your convenience."
    },

    dietary: {
      vegetarian_options: true,
      note: "Yes! We have good vegetarian options available. Our chef is happy to accommodate dietary needs — just let us know!"
    },

    extras: {
      hot_tea: "We offer complimentary free hot tea with your meal!",
      bike_parking: "We have bike parking available for cyclists.",
      chef: "Our chef listens! We're known for our generous service and willingness to accommodate requests."
    }
  };

  // ──────────────────────────────────────────────
  // 2. Search / Response Engine
  // ──────────────────────────────────────────────

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  }

  const KEYWORDS_MAP = [
    // Menu items
    { words: ['dumpling', 'dumplings', 'jiaozi'], response: `🍜 **Our Dumplings**\n\n${KNOWLEDGE_BASE.menu.dumplings}\n\nThey're one of our most popular dishes — come try them!` },
    { words: ['wonton', 'wonton noodle', 'spicy soup', 'wonton noodle soup'], response: `🍜 **Wonton Noodle Spicy Soup**\n\n${KNOWLEDGE_BASE.menu.wonton_noodle_soup}\n\nRich, aromatic, and full of flavour!` },
    { words: ['sweet and sour', 'sweet sour pork', 'sweet and sour pork'], response: `🐷 **Sweet and Sour Pork**\n\n${KNOWLEDGE_BASE.menu.sweet_and_sour_pork}\n\nA timeless classic, perfectly executed!` },
    { words: ['prawn toast', 'shrimp toast'], response: `🍤 **Prawn Toast**\n\n${KNOWLEDGE_BASE.menu.prawn_toast}\n\nAlso available as Sesame Prawn Toast for extra crunch!` },
    { words: ['sesame prawn', 'sesame prawn toast'], response: `🍤 **Sesame Prawn Toast**\n\n${KNOWLEDGE_BASE.menu.sesame_prawn_toast}\n\nGolden, crunchy, and utterly delicious!` },
    { words: ['xiao long bao', 'soup dumpling', 'soup dumplings', 'xiaolongbao', 'xlb'], response: `🥟 **Xiao Long Bao (Soup Dumplings)**\n\n${KNOWLEDGE_BASE.menu.xiao_long_bao}\n\nA must-try! Be careful — the soup inside is piping hot!` },
    { words: ['spring onion pancake', 'scallion pancake', 'spring onion pancake'], response: `🥞 **Spring Onion Pancake**\n\n${KNOWLEDGE_BASE.menu.spring_onion_pancake}\n\nCrispy, flaky, and packed with fragrant spring onions!` },
    { words: ['wat tan hor', 'flat rice noodle', 'rice noodle', 'hor fun', 'kway teow'], response: `🍜 **Wat Tan Hor (Flat Rice Noodles)**\n\n${KNOWLEDGE_BASE.menu.wat_tan_hor}\n\nSilky smooth noodles in a savoury egg gravy — pure comfort!` },
    { words: ['pan fried dumpling', 'pan-fried dumpling', 'pot sticker', 'potsticker', 'guotie', 'pan fried dumplings'], response: `🥟 **Pan Fried Dumplings**\n\n${KNOWLEDGE_BASE.menu.pan_fried_dumpling}\n\nGolden, crispy, and packed with flavour!` },

    // Hours
    { words: ['hours', 'open', 'opening hours', 'opening time', 'closing time', 'when are you open', 'when are you open'], response: `⏰ **Opening Hours**\n\n${KNOWLEDGE_BASE.hours.summary}` },

    // Days of week
    { words: ['monday', 'mon'], response: `⏰ **Monday Hours:** ${KNOWLEDGE_BASE.hours.monday_thursday}` },
    { words: ['tuesday', 'tue'], response: `⏰ **Tuesday Hours:** ${KNOWLEDGE_BASE.hours.monday_thursday}` },
    { words: ['wednesday', 'wed'], response: `⏰ **Wednesday Hours:** ${KNOWLEDGE_BASE.hours.monday_thursday}` },
    { words: ['thursday', 'thu'], response: `⏰ **Thursday Hours:** ${KNOWLEDGE_BASE.hours.monday_thursday}` },
    { words: ['friday', 'fri'], response: `⏰ **Friday Hours:** ${KNOWLEDGE_BASE.hours.friday_saturday}` },
    { words: ['saturday', 'sat'], response: `⏰ **Saturday Hours:** ${KNOWLEDGE_BASE.hours.friday_saturday}` },
    { words: ['sunday', 'sun'], response: `⏰ **Sunday Hours:** ${KNOWLEDGE_BASE.hours.sunday}` },

    // Location
    { words: ['location', 'address', 'where', 'directions', 'find', 'located'], response: `📍 **Find Us**\n\n**${KNOWLEDGE_BASE.location.address}**\n\n${KNOWLEDGE_BASE.location.directions}\n\n🚲 Bike parking available!` },

    // Contact
    { words: ['phone', 'call', 'number', 'telephone', 'contact'], response: `📞 **Contact Us**\n\nCall us at **${KNOWLEDGE_BASE.contact.phone}**\n\nWe'd love to hear from you!` },

    // Pricing
    { words: ['price', 'pricing', 'cost', 'expensive', 'cheap', 'affordable', 'how much', 'menu price', 'price range', '$$', 'per person', 'budget'], response: `💰 **Price Range**\n\nExpect to spend around **${KNOWLEDGE_BASE.pricing.per_person}** per person.\n\n${KNOWLEDGE_BASE.pricing.note}` },

    // Services
    { words: ['dine in', 'dine-in', 'dining', 'eat in', 'eat-in'], response: `🍽️ **Dine-In**\n\nYes! Come visit us at Sanctuary Lakes Shopping Centre. Free hot tea included with your meal!` },
    { words: ['takeaway', 'take away', 'take-out', 'takeout', 'take away'], response: `🛍️ **Takeaway**\n\nOrder for takeaway! Call **${KNOWLEDGE_BASE.contact.phone}** to place your order and we'll have it ready for you.` },
    { words: ['delivery', 'deliver', 'online order', 'online ordering', 'order online', 'ubereats', 'doordash', 'menulog'], response: `🛵 **Online Ordering**\n\nYou can order online for delivery or pickup! Call us at **${KNOWLEDGE_BASE.contact.phone}** or order through your favourite delivery platform.` },

    // Dietary
    { words: ['vegetarian', 'vegan', 'dietary', 'veggie', 'vegetable', 'vegetables', 'dietary requirement', 'dietary restriction', 'diet', 'allergy', 'allergies', 'gluten'], response: `🥦 **Dietary Options**\n\n${KNOWLEDGE_BASE.dietary.note}\n\nOur chef is happy to customise dishes for you — just ask!` },

    // Extras
    { words: ['free tea', 'hot tea', 'complimentary tea', 'free hot tea', 'tea'], response: `🫖 **Free Hot Tea**\n\n${KNOWLEDGE_BASE.extras.hot_tea}\n\nIt's our way of saying welcome!` },
    { words: ['bike', 'bicycle', 'cycling', 'bike parking', 'parking'], response: `🚲 **Bike Parking**\n\n${KNOWLEDGE_BASE.extras.bike_parking}\n\nWe're a bike-friendly restaurant!` },
    { words: ['parking', 'car', 'car park'], response: `🅿️ **Parking**\n\nSanctuary Lakes Shopping Centre has plenty of free car parking available. We also have bike parking!` },

    // Chef / Service
    { words: ['chef', 'owner', 'service', 'generous', 'accommodate', 'customise', 'customize', 'special request'], response: `👨‍🍳 **Our Chef**\n\n${KNOWLEDGE_BASE.extras.chef}\n\nWe pride ourselves on making every guest feel welcome!` },

    // General / About
    { words: ['menu', 'what do you have', 'what do you serve', 'food', 'dishes', 'eat', 'recommend', 'popular', 'best', 'favourite', 'signature'], response: `📋 **Our Menu Highlights**\n\nWe serve a variety of authentic Asian dishes:\n\n🥟 **Dumplings** — Handmade, juicy & delicious\n🍜 **Wonton Noodle Spicy Soup** — Rich, aromatic broth\n🐷 **Sweet and Sour Pork** — Tangy & crispy\n🍤 **Prawn Toast / Sesame Prawn Toast** — Golden & crunchy\n🥟 **Xiao Long Bao (Soup Dumplings)** — Bursting with flavour\n🥞 **Spring Onion Pancake** — Flaky & fragrant\n🍜 **Wat Tan Hor (Flat Rice Noodles)** — Silky comfort\n🥟 **Pan Fried Dumplings** — Crispy & moreish\n\nPrice range: **${KNOWLEDGE_BASE.pricing.per_person}** per person\n\nWhich dish sounds good to you? 😊` },

    // Rating
    { words: ['rating', 'review', 'reputation', 'stars', 'recommended', 'google review'], response: `⭐ **${KNOWLEDGE_BASE.restaurant.rating}**\n\nWe're proud to maintain a **${KNOWLEDGE_BASE.restaurant.rating}** rating! Our customers love the authentic food, generous service, and cosy atmosphere.` }
  ];

  function findBestResponse(userMessage) {
    const normalized = normalize(userMessage);
    if (!normalized) return null;

    // Score each keyword set
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of KEYWORDS_MAP) {
      const score = entry.words.reduce((acc, word) => {
        const nw = normalize(word);
        // Check if the word appears as a whole or partial match
        return acc + (normalized.includes(nw) ? 1 : 0);
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    // Require at least 1 keyword match
    if (bestScore >= 1 && bestMatch) {
      return bestMatch.response;
    }

    return null;
  }

  // ──────────────────────────────────────────────
  // 3. Greetings & Fallbacks
  // ──────────────────────────────────────────────

  const GREETING = "Hi! Welcome to Hong's Little Kitchen! How can I help you? 😊";

  const ORDER_RESPONSE = "You can order online, or call us at **" + KNOWLEDGE_BASE.contact.phone + "** for takeaway! 🛵";

  const FALLBACK = "I'm sorry, I couldn't quite find the answer to that. Let me connect you with the restaurant directly! Call **" + KNOWLEDGE_BASE.contact.phone + "** and our team will be happy to help. 😊";

  const CHAT_GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy'];

  // ──────────────────────────────────────────────
  // 4. Chat Widget UI
  // ──────────────────────────────────────────────

  const COLORS = {
    primary: '#C41E3A',       // Rich Chinese red
    primaryDark: '#A0182E',   // Darker red for hover
    secondary: '#D4A017',     // Gold accent
    bg: '#FFF8F0',            // Warm cream background
    text: '#2D1B0E',          // Dark brown text
    lightText: '#6B4F3A',     // Muted brown
    bubbleBg: '#FFF0E0',      // Light warm bubble
    userBubble: '#C41E3A',    // User message bubble
    userText: '#FFFFFF',      // White text on user bubble
    border: '#E8D5C0',        // Warm border
    shadow: 'rgba(196, 30, 58, 0.15)'
  };

  // --- Inject CSS ---

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #hlk-chat-widget * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      }

      #hlk-chat-bubble {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${COLORS.primary};
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px ${COLORS.shadow};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        z-index: 999999;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: hlk-pulse 2s infinite;
      }

      #hlk-chat-bubble:hover {
        transform: scale(1.1);
        background: ${COLORS.primaryDark};
        box-shadow: 0 6px 28px ${COLORS.shadow};
      }

      @keyframes hlk-pulse {
        0% { box-shadow: 0 4px 20px ${COLORS.shadow}; }
        50% { box-shadow: 0 4px 28px rgba(196, 30, 58, 0.3); }
        100% { box-shadow: 0 4px 20px ${COLORS.shadow}; }
      }

      #hlk-chat-window {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 380px;
        max-width: calc(100vw - 48px);
        height: 540px;
        max-height: calc(100vh - 120px);
        background: ${COLORS.bg};
        border-radius: 16px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        z-index: 999998;
        overflow: hidden;
        border: 1px solid ${COLORS.border};
        animation: hlk-slideUp 0.3s ease-out;
      }

      #hlk-chat-window.open {
        display: flex;
      }

      @keyframes hlk-slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      #hlk-chat-header {
        background: ${COLORS.primary};
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-radius: 16px 16px 0 0;
        flex-shrink: 0;
      }

      #hlk-chat-header-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${COLORS.secondary};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      #hlk-chat-header-text {
        flex: 1;
      }

      #hlk-chat-header-title {
        font-weight: 600;
        font-size: 15px;
        margin: 0;
      }

      #hlk-chat-header-subtitle {
        font-size: 12px;
        opacity: 0.85;
        margin: 2px 0 0 0;
      }

      #hlk-chat-close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 20px;
        padding: 4px;
        opacity: 0.8;
        transition: opacity 0.2s;
        line-height: 1;
      }

      #hlk-chat-close-btn:hover {
        opacity: 1;
      }

      #hlk-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        scroll-behavior: smooth;
      }

      #hlk-chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      #hlk-chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      #hlk-chat-messages::-webkit-scrollbar-thumb {
        background: ${COLORS.border};
        border-radius: 3px;
      }

      .hlk-message {
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
        animation: hlk-msgIn 0.3s ease-out;
      }

      @keyframes hlk-msgIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .hlk-message.bot {
        align-self: flex-start;
        background: ${COLORS.bubbleBg};
        color: ${COLORS.text};
        border-bottom-left-radius: 4px;
      }

      .hlk-message.user {
        align-self: flex-end;
        background: ${COLORS.userBubble};
        color: ${COLORS.userText};
        border-bottom-right-radius: 4px;
      }

      .hlk-message.system {
        align-self: center;
        background: transparent;
        color: ${COLORS.lightText};
        font-size: 13px;
        text-align: center;
        max-width: 100%;
        font-style: italic;
      }

      .hlk-message.bot strong {
        color: ${COLORS.primary};
      }

      .hlk-message.user strong {
        color: ${COLORS.secondary};
      }

      #hlk-chat-input-area {
        padding: 12px 16px;
        border-top: 1px solid ${COLORS.border};
        display: flex;
        gap: 8px;
        align-items: center;
        flex-shrink: 0;
        background: white;
      }

      #hlk-chat-input {
        flex: 1;
        border: 1px solid ${COLORS.border};
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        outline: none;
        background: ${COLORS.bg};
        color: ${COLORS.text};
        transition: border-color 0.2s;
      }

      #hlk-chat-input:focus {
        border-color: ${COLORS.primary};
      }

      #hlk-chat-input::placeholder {
        color: ${COLORS.lightText};
      }

      #hlk-chat-send-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${COLORS.primary};
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      #hlk-chat-send-btn:hover {
        background: ${COLORS.primaryDark};
        transform: scale(1.05);
      }

      #hlk-chat-send-btn:disabled {
        background: ${COLORS.border};
        cursor: not-allowed;
        transform: none;
      }

      .hlk-typing {
        align-self: flex-start;
        background: ${COLORS.bubbleBg};
        padding: 12px 18px;
        border-radius: 12px;
        border-bottom-left-radius: 4px;
        display: flex;
        gap: 5px;
      }

      .hlk-typing span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${COLORS.lightText};
        animation: hlk-bounce 1.4s infinite ease-in-out;
      }

      .hlk-typing span:nth-child(1) { animation-delay: 0s; }
      .hlk-typing span:nth-child(2) { animation-delay: 0.2s; }
      .hlk-typing span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes hlk-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-8px); }
      }

      @media (max-width: 480px) {
        #hlk-chat-window {
          bottom: 0;
          right: 0;
          width: 100vw;
          height: 100vh;
          max-height: 100vh;
          border-radius: 0;
          max-width: 100vw;
        }

        #hlk-chat-header {
          border-radius: 0;
        }

        #hlk-chat-bubble {
          bottom: 16px;
          right: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // --- Build DOM ---

  function createWidget() {
    // Bubble
    const bubble = document.createElement('div');
    bubble.id = 'hlk-chat-bubble';
    bubble.setAttribute('aria-label', 'Open chat with Hong\'s Little Kitchen');
    bubble.setAttribute('role', 'button');
    bubble.setAttribute('tabindex', '0');
    bubble.innerHTML = '💬';
    document.body.appendChild(bubble);

    // Chat window
    const window = document.createElement('div');
    window.id = 'hlk-chat-window';

    window.innerHTML = `
      <div id="hlk-chat-header">
        <div id="hlk-chat-header-icon">🍜</div>
        <div id="hlk-chat-header-text">
          <p id="hlk-chat-header-title">Hong's Little Kitchen</p>
          <p id="hlk-chat-header-subtitle">${KNOWLEDGE_BASE.restaurant.rating} · We're here to help!</p>
        </div>
        <button id="hlk-chat-close-btn" aria-label="Close chat">✕</button>
      </div>
      <div id="hlk-chat-messages"></div>
      <div id="hlk-chat-input-area">
        <input id="hlk-chat-input" type="text" placeholder="Ask us anything..." aria-label="Type your message" autocomplete="off">
        <button id="hlk-chat-send-btn" aria-label="Send message">➤</button>
      </div>
    `;

    document.body.appendChild(window);

    return { bubble, window };
  }

  // ──────────────────────────────────────────────
  // 5. Chat Logic
  // ──────────────────────────────────────────────

  function initChat() {
    const els = createWidget();
    const messagesEl = document.getElementById('hlk-chat-messages');
    const inputEl = document.getElementById('hlk-chat-input');
    const sendBtn = document.getElementById('hlk-chat-send-btn');
    const closeBtn = document.getElementById('hlk-chat-close-btn');
    const windowEl = els.window;
    const bubbleEl = els.bubble;

    let isOpen = false;

    // Show greeting
    function addMessage(text, type = 'bot') {
      const div = document.createElement('div');
      div.className = `hlk-message ${type}`;
      // Convert markdown-style bold to HTML
      div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'hlk-typing';
      div.id = 'hlk-typing-indicator';
      div.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
      const el = document.getElementById('hlk-typing-indicator');
      if (el) el.remove();
    }

    function handleSend() {
      const text = inputEl.value.trim();
      if (!text) return;

      // Show user message
      addMessage(text, 'user');
      inputEl.value = '';
      sendBtn.disabled = true;

      // Show typing indicator
      showTyping();

      // Simulate processing delay
      setTimeout(() => {
        hideTyping();

        const normalized = normalize(text);

        // Check for greeting
        const isGreeting = CHAT_GREETING_KEYWORDS.some(g => normalized.includes(g));
        if (isGreeting) {
          addMessage(GREETING);
          sendBtn.disabled = false;
          return;
        }

        // Check for order-related keywords
        const orderWords = ['order', 'ordering', 'buy', 'purchase', 'delivery', 'takeaway', 'take away', 'online order'];
        const wantsOrder = orderWords.some(w => normalized.includes(w));

        // Find best response from knowledge base
        const response = findBestResponse(text);

        if (response) {
          addMessage(response);
          // If they were asking about ordering, also mention ordering options
          if (wantsOrder && !response.includes(ORDER_RESPONSE)) {
            setTimeout(() => {
              addMessage(ORDER_RESPONSE);
            }, 500);
          }
        } else {
          // Fallback
          addMessage(FALLBACK);
        }

        sendBtn.disabled = false;
      }, 600);
    }

    // Toggle chat window
    function openChat() {
      isOpen = true;
      windowEl.classList.add('open');
      bubbleEl.style.display = 'none';
      // If first open, add greeting
      if (messagesEl.children.length === 0) {
        addMessage(GREETING);
      }
      inputEl.focus();
    }

    function closeChat() {
      isOpen = false;
      windowEl.classList.remove('open');
      bubbleEl.style.display = 'flex';
    }

    bubbleEl.addEventListener('click', openChat);
    bubbleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openChat();
      }
    });

    closeBtn.addEventListener('click', closeChat);

    sendBtn.addEventListener('click', handleSend);

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });
  }

  // ──────────────────────────────────────────────
  // 6. Bootstrap
  // ──────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectStyles();
      initChat();
    });
  } else {
    injectStyles();
    initChat();
  }

})();
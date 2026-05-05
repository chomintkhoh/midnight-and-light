import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #1a1a1a;
    --ink-mid: #444;
    --ink-soft: #777;
    --ink-faint: #aaa;
    --cream: #faf8f5;
    --warm: #f3efe8;
    --accent: #c8a96e;
    --accent-dark: #a8833e;
    --accent-bg: #fdf6e8;
    --white: #ffffff;
    --border: #e8e4dc;
    --border-strong: #d0cac0;
    --green: #2d6a4f;
    --green-bg: #f0f7f3;
    --red-soft: #f8f0f0;
    --red-text: #8b3a3a;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06);
    --radius: 14px;
    --radius-sm: 8px;
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
  }

  .lp-root {
    font-family: var(--font-body);
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── NAV BAR ── */
  .lp-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(250,248,245,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .lp-nav-logo {
    font-family: var(--font-display);
    font-size: 18px;
    color: var(--ink);
    letter-spacing: -0.02em;
  }
  .lp-nav-logo span { color: var(--accent); }
  .lp-nav-cta {
    background: var(--ink);
    color: var(--white);
    border: none;
    border-radius: 99px;
    padding: 8px 20px;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    text-decoration: none;
    display: inline-block;
  }
  .lp-nav-cta:hover { background: #333; transform: translateY(-1px); }

  /* ── HERO ── */
  .lp-hero {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 80px 24px 72px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .lp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% -20%, rgba(200,169,110,0.12), transparent 70%);
    pointer-events: none;
  }
  .lp-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-bg);
    border: 1px solid rgba(200,169,110,0.3);
    color: var(--accent-dark);
    font-size: 12px;
    font-weight: 500;
    padding: 5px 13px;
    border-radius: 99px;
    margin-bottom: 28px;
    letter-spacing: 0.03em;
  }
  .lp-hero-badge::before { content: '●'; font-size: 8px; }
  .lp-hero h1 {
    font-family: var(--font-display);
    font-size: clamp(32px, 5.5vw, 56px);
    font-weight: 400;
    line-height: 1.12;
    letter-spacing: -0.03em;
    color: var(--ink);
    max-width: 720px;
    margin: 0 auto 20px;
  }
  .lp-hero h1 em {
    font-style: italic;
    color: var(--accent-dark);
  }
  .lp-hero-sub {
    font-size: 17px;
    color: var(--ink-mid);
    max-width: 460px;
    margin: 0 auto 40px;
    line-height: 1.65;
    font-weight: 300;
  }
  .lp-hero-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .lp-btn-primary {
    background: var(--ink);
    color: var(--white);
    border: none;
    border-radius: 99px;
    padding: 14px 32px;
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }
  .lp-btn-primary:hover {
    background: #2a2a2a;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }
  .lp-btn-ghost {
    background: transparent;
    color: var(--ink-mid);
    border: 1.5px solid var(--border-strong);
    border-radius: 99px;
    padding: 13px 28px;
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 400;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, transform 0.15s;
    text-decoration: none;
    display: inline-block;
  }
  .lp-btn-ghost:hover {
    border-color: var(--ink);
    color: var(--ink);
    transform: translateY(-1px);
  }
  .lp-hero-trust {
    margin-top: 36px;
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .lp-trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--ink-soft);
  }
  .lp-trust-item svg {
    width: 15px;
    height: 15px;
    color: var(--accent);
    flex-shrink: 0;
  }

  /* ── VALUE PILLARS ── */
  .lp-value {
    background: var(--cream);
    padding: 64px 24px;
    border-bottom: 1px solid var(--border);
  }
  .lp-value-inner {
    max-width: 880px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }
  .lp-value-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px 24px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .lp-value-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  .lp-value-icon {
    width: 40px;
    height: 40px;
    background: var(--accent-bg);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 16px;
  }
  .lp-value-card h3 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--ink);
  }
  .lp-value-card p {
    font-size: 13.5px;
    color: var(--ink-soft);
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── PRICING ── */
  .lp-pricing {
    background: var(--white);
    padding: 72px 24px;
    border-bottom: 1px solid var(--border);
  }
  .lp-section-label {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent-dark);
    margin-bottom: 14px;
  }
  .lp-section-title {
    font-family: var(--font-display);
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 400;
    text-align: center;
    letter-spacing: -0.025em;
    color: var(--ink);
    margin-bottom: 10px;
    line-height: 1.2;
  }
  .lp-section-sub {
    text-align: center;
    font-size: 15px;
    color: var(--ink-soft);
    margin-bottom: 48px;
    font-weight: 300;
  }
  .lp-pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    max-width: 860px;
    margin: 0 auto;
  }
  .lp-price-card {
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 36px 28px;
    background: var(--cream);
    position: relative;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .lp-price-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-3px);
  }
  .lp-price-card.featured {
    border-color: var(--ink);
    background: var(--ink);
    color: var(--white);
  }
  .lp-price-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent);
    color: var(--white);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 4px 12px;
    border-radius: 99px;
    white-space: nowrap;
  }
  .lp-price-type {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin-bottom: 8px;
  }
  .lp-price-card.featured .lp-price-type { color: rgba(255,255,255,0.55); }
  .lp-price-name {
    font-size: 20px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 4px;
  }
  .lp-price-card.featured .lp-price-name { color: var(--white); }
  .lp-price-desc {
    font-size: 13px;
    color: var(--ink-soft);
    margin-bottom: 24px;
    font-weight: 300;
    line-height: 1.5;
  }
  .lp-price-card.featured .lp-price-desc { color: rgba(255,255,255,0.6); }
  .lp-price-amount {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 24px;
  }
  .lp-price-currency {
    font-size: 16px;
    font-weight: 500;
    color: var(--ink-mid);
  }
  .lp-price-card.featured .lp-price-currency { color: rgba(255,255,255,0.7); }
  .lp-price-num {
    font-family: var(--font-display);
    font-size: 48px;
    font-weight: 400;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -0.03em;
  }
  .lp-price-card.featured .lp-price-num { color: var(--white); }
  .lp-price-per {
    font-size: 13px;
    color: var(--ink-faint);
  }
  .lp-price-card.featured .lp-price-per { color: rgba(255,255,255,0.4); }
  .lp-price-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .lp-price-features li {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 13.5px;
    color: var(--ink-mid);
    font-weight: 300;
  }
  .lp-price-card.featured .lp-price-features li { color: rgba(255,255,255,0.8); }
  .lp-check {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--green-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 9px;
    color: var(--green);
  }
  .lp-price-card.featured .lp-check {
    background: rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.9);
  }
  .lp-pricing-note {
    text-align: center;
    font-size: 12.5px;
    color: var(--ink-faint);
    margin-top: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  /* ── FIT FILTER ── */
  .lp-filter {
    background: var(--cream);
    padding: 72px 24px;
    border-bottom: 1px solid var(--border);
  }
  .lp-filter-inner {
    max-width: 760px;
    margin: 0 auto;
  }
  .lp-filter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 40px;
  }
  @media (max-width: 560px) { .lp-filter-grid { grid-template-columns: 1fr; } }
  .lp-filter-card {
    border-radius: var(--radius);
    padding: 28px 24px;
    border: 1.5px solid;
  }
  .lp-filter-card.good {
    background: var(--green-bg);
    border-color: rgba(45,106,79,0.2);
  }
  .lp-filter-card.skip {
    background: var(--red-soft);
    border-color: rgba(139,58,58,0.15);
  }
  .lp-filter-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .lp-filter-card.good .lp-filter-title { color: var(--green); }
  .lp-filter-card.skip .lp-filter-title { color: var(--red-text); }
  .lp-filter-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .lp-filter-list li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 300;
  }
  .lp-filter-card.good .lp-filter-list li { color: #2a5a3f; }
  .lp-filter-card.skip .lp-filter-list li { color: var(--red-text); }
  .lp-filter-bullet {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .lp-filter-card.good .lp-filter-bullet { background: rgba(45,106,79,0.15); color: var(--green); }
  .lp-filter-card.skip .lp-filter-bullet { background: rgba(139,58,58,0.12); color: var(--red-text); }

  /* ── HOW IT WORKS ── */
  .lp-how {
    background: var(--white);
    padding: 72px 24px;
    border-bottom: 1px solid var(--border);
  }
  .lp-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 0;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
  }
  .lp-steps::before {
    content: '';
    position: absolute;
    top: 24px;
    left: 10%;
    right: 10%;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, var(--border), var(--border), transparent);
    z-index: 0;
  }
  @media (max-width: 560px) { .lp-steps::before { display: none; } }
  .lp-step {
    text-align: center;
    padding: 0 16px;
    position: relative;
    z-index: 1;
  }
  .lp-step-num {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1.5px solid var(--border-strong);
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-family: var(--font-display);
    font-size: 18px;
    color: var(--ink-mid);
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .lp-step:hover .lp-step-num {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--white);
  }
  .lp-step-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 7px;
    color: var(--ink);
  }
  .lp-step-desc {
    font-size: 12.5px;
    color: var(--ink-soft);
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── BOOKING ── */
  .lp-booking {
    background: var(--cream);
    padding: 72px 24px;
    border-bottom: 1px solid var(--border);
  }
  .lp-booking-inner { max-width: 760px; margin: 0 auto; }
  .lp-calendar-wrap {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }
  .lp-calendar-wrap iframe {
    display: block;
    width: 100%;
    height: 600px;
    border: none;
  }

  /* ── POLICY ── */
  .lp-policy {
    background: var(--white);
    padding: 72px 24px;
    border-bottom: 1px solid var(--border);
  }
  .lp-policy-inner { max-width: 640px; margin: 0 auto; }
  .lp-policy-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 40px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--cream);
  }
  .lp-policy-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .lp-policy-item:last-child { border-bottom: none; }
  .lp-policy-item:hover { background: var(--warm); }
  .lp-policy-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--accent-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .lp-policy-text {
    font-size: 14px;
    color: var(--ink-mid);
    line-height: 1.6;
    font-weight: 300;
  }
  .lp-policy-text strong {
    display: block;
    font-weight: 600;
    color: var(--ink);
    font-size: 13.5px;
    margin-bottom: 2px;
  }

  /* ── FAQ ── */
  .lp-faq {
    background: var(--cream);
    padding: 72px 24px;
    border-bottom: 1px solid var(--border);
  }
  .lp-faq-inner { max-width: 640px; margin: 0 auto; }
  .lp-faq-list {
    margin-top: 40px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--white);
  }
  .lp-faq-item { border-bottom: 1px solid var(--border); }
  .lp-faq-item:last-child { border-bottom: none; }
  .lp-faq-btn {
    width: 100%;
    background: none;
    border: none;
    padding: 20px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s;
  }
  .lp-faq-btn:hover { background: var(--warm); }
  .lp-faq-q {
    font-size: 14.5px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.4;
  }
  .lp-faq-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
    color: var(--ink-soft);
    transition: transform 0.25s, background 0.2s;
    line-height: 1;
  }
  .lp-faq-icon.open {
    transform: rotate(45deg);
    background: var(--ink);
    color: var(--white);
  }
  .lp-faq-answer {
    padding: 0 22px 18px;
    font-size: 13.5px;
    color: var(--ink-soft);
    line-height: 1.7;
    font-weight: 300;
  }

  /* ── FINAL CTA ── */
  .lp-cta {
    background: var(--ink);
    padding: 88px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .lp-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 80% at 50% 110%, rgba(200,169,110,0.18), transparent 65%);
    pointer-events: none;
  }
  .lp-cta h2 {
    font-family: var(--font-display);
    font-size: clamp(28px, 4.5vw, 46px);
    font-weight: 400;
    color: var(--white);
    letter-spacing: -0.025em;
    margin-bottom: 14px;
    line-height: 1.15;
    position: relative;
  }
  .lp-cta h2 em { font-style: italic; color: var(--accent); }
  .lp-cta p {
    font-size: 15px;
    color: rgba(255,255,255,0.55);
    margin-bottom: 40px;
    font-weight: 300;
    position: relative;
  }
  .lp-btn-wa {
    background: #25d366;
    color: var(--white);
    border: none;
    border-radius: 99px;
    padding: 15px 36px;
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    box-shadow: 0 4px 18px rgba(37,211,102,0.35);
    position: relative;
  }
  .lp-btn-wa:hover {
    background: #1fb855;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(37,211,102,0.45);
  }
  .lp-cta-note {
    margin-top: 20px;
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    position: relative;
  }

  /* ── FOOTER ── */
  .lp-footer {
    background: var(--ink);
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 24px;
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    font-weight: 300;
  }
`;

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const toggleFAQ = (i) => setOpenFAQ(openFAQ === i ? null : i);

  const faqs = [
    {
      q: "Can I request a discount?",
      a: "Lesson fees are fixed based on type — online, language centre, or home visit. This keeps things fair and consistent for all students, and ensures the quality of every session is fully committed to.",
    },
    {
      q: "Why is the pricing fixed?",
      a: "Fixed pricing means no negotiation overhead, predictable budgeting for you, and full focus on learning rather than logistics. It also reflects the consistent preparation and structured approach put into every lesson.",
    },
    {
      q: "What languages do you teach?",
      a: "Both Mandarin Chinese and Japanese — from beginner foundations all the way through conversational fluency and exam preparation.",
    },
    {
      q: "How do I confirm my booking?",
      a: "After selecting a time slot, send a message on WhatsApp to confirm. Your slot is reserved only once payment is received.",
    },
  ];

  const policies = [
    {
      icon: "💳",
      title: "Payment confirms your slot",
      detail: "A lesson is only officially booked once payment has been made. Unpaid slots may be released.",
    },
    {
      icon: "📅",
      title: "Monthly lessons paid in advance",
      detail: "If you are on a regular monthly schedule, full payment is collected at the start of each month.",
    },
    {
      icon: "🔁",
      title: "Per-lesson payment before each session",
      detail: "For ad-hoc bookings, payment is required before the lesson begins.",
    },
    {
      icon: "⏱️",
      title: "Reschedule with at least 3 hours' notice",
      detail: "Changes are accommodated when notified at least 3 hours ahead. Late cancellations may forfeit the session.",
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="lp-root">

        {/* ── NAV ── */}
        <nav className="lp-nav">
          <div className="lp-nav-logo">Midnight<span>&</span>Light</div>
          <a href="#booking" className="lp-nav-cta">Book a Lesson</a>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-badge">Now accepting new students</div>
          <h1>
            Learn Chinese & Japanese<br />
            with <em>structured</em> private lessons
          </h1>
          <p className="lp-hero-sub">
            Build real speaking confidence through step-by-step guidance,
            practical usage, and lessons designed around you.
          </p>
          <div className="lp-hero-actions">
            <a href="#booking" className="lp-btn-primary">Book a Lesson →</a>
            <a href="#pricing" className="lp-btn-ghost">View Pricing</a>
          </div>
          <div className="lp-hero-trust">
            {[
              "Real conversation focus",
              "Structured curriculum",
              "Flexible lesson types",
            ].map((t) => (
              <div key={t} className="lp-trust-item">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 8 6 12 14 4" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* ── VALUE ── */}
        <section className="lp-value">
          <div className="lp-value-inner">
            {[
              { icon: "🗣️", title: "Speak Confidently", desc: "Every lesson is built around real-life conversation — not just grammar drills." },
              { icon: "📈", title: "Structured Progress", desc: "A clear, step-by-step learning path so you always know where you are and where you're headed." },
              { icon: "🌏", title: "Practical Usage", desc: "Language you can actually use — in daily situations, travel, and real interactions." },
            ].map((v) => (
              <div key={v.title} className="lp-value-card">
                <div className="lp-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="lp-pricing">
          <div className="lp-section-label">Lesson Types & Pricing</div>
          <h2 className="lp-section-title">Simple, transparent fees</h2>
          <p className="lp-section-sub">Choose the format that fits your schedule and learning style.</p>

          <div className="lp-pricing-grid">
            {/* Online */}
            <div className="lp-price-card">
              <div className="lp-price-type">Format</div>
              <div className="lp-price-name">Online Lesson</div>
              <div className="lp-price-desc">Learn from anywhere via video call — flexible and convenient.</div>
              <div className="lp-price-amount">
                <span className="lp-price-currency">RM</span>
                <span className="lp-price-num">90</span>
                <span className="lp-price-per">/ lesson</span>
              </div>
              <ul className="lp-price-features">
                {["Video call session","Flexible scheduling","Digital materials"].map(f => (
                  <li key={f}><span className="lp-check">✓</span>{f}</li>
                ))}
              </ul>
            </div>

            {/* Language Lesson — featured */}
            <div className="lp-price-card featured">
              <div className="lp-price-badge">Most Popular</div>
              <div className="lp-price-type">Format</div>
              <div className="lp-price-name">Language Centre</div>
              <div className="lp-price-desc">In-person at a dedicated learning space — structured and focused.</div>
              <div className="lp-price-amount">
                <span className="lp-price-currency">RM</span>
                <span className="lp-price-num">100</span>
                <span className="lp-price-per">/ lesson</span>
              </div>
              <ul className="lp-price-features">
                {["In-person instruction","Printed materials included","Dedicated study environment"].map(f => (
                  <li key={f}><span className="lp-check">✓</span>{f}</li>
                ))}
              </ul>
            </div>

            {/* Home */}
            <div className="lp-price-card">
              <div className="lp-price-type">Format</div>
              <div className="lp-price-name">Home Lesson</div>
              <div className="lp-price-desc">Tutor comes to you — maximum comfort, zero commute.</div>
              <div className="lp-price-amount">
                <span className="lp-price-currency">RM</span>
                <span className="lp-price-num">135</span>
                <span className="lp-price-per">/ lesson</span>
              </div>
              <ul className="lp-price-features">
                {["Home visit","Personalised environment","Travel included"].map(f => (
                  <li key={f}><span className="lp-check">✓</span>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="lp-pricing-note">
            <span>🔒</span> All pricing is fixed. No hidden fees, no negotiation.
          </p>
        </section>

        {/* ── FILTER ── */}
        <section className="lp-filter">
          <div className="lp-filter-inner">
            <div className="lp-section-label">Is This Right For You?</div>
            <h2 className="lp-section-title">Made for motivated learners</h2>
            <div className="lp-filter-grid">
              <div className="lp-filter-card good">
                <div className="lp-filter-title">
                  <span>✓</span> This is for you if…
                </div>
                <ul className="lp-filter-list">
                  {[
                    "You want to genuinely improve your speaking",
                    "You prefer a structured, guided approach",
                    "You're ready to show up consistently",
                  ].map((item) => (
                    <li key={item}>
                      <span className="lp-filter-bullet">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lp-filter-card skip">
                <div className="lp-filter-title">
                  <span>✕</span> Not the right fit if…
                </div>
                <ul className="lp-filter-list">
                  {[
                    "You're mainly looking for heavy discounts",
                    "You prefer irregular or casual drop-in sessions",
                    "You're not ready for a learning commitment",
                  ].map((item) => (
                    <li key={item}>
                      <span className="lp-filter-bullet">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-how">
          <div className="lp-section-label">The Process</div>
          <h2 className="lp-section-title">How it works</h2>
          <p className="lp-section-sub" style={{marginBottom: 52}}>Four simple steps from interest to first lesson.</p>
          <div className="lp-steps">
            {[
              { n: "1", title: "Choose lesson type", desc: "Online, language centre, or home — pick what suits you best." },
              { n: "2", title: "Book a time slot", desc: "Select an available slot from the calendar below." },
              { n: "3", title: "Confirm on WhatsApp", desc: "Send a quick message and complete payment to secure your place." },
              { n: "4", title: "Start learning", desc: "Show up, engage, and build real language skills." },
            ].map((s) => (
              <div key={s.n} className="lp-step">
                <div className="lp-step-num">{s.n}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BOOKING ── */}
        <section id="booking" className="lp-booking">
          <div className="lp-booking-inner">
            <div className="lp-section-label">Availability</div>
            <h2 className="lp-section-title">Book available time slots</h2>
            <p className="lp-section-sub">Select a slot below, then confirm via WhatsApp to complete your booking.</p>
            <div className="lp-calendar-wrap">
              <iframe
                src="YOUR_CALENDAR_LINK_HERE"
                title="Booking Calendar"
              />
            </div>
          </div>
        </section>

        {/* ── POLICY ── */}
        <section className="lp-policy">
          <div className="lp-policy-inner">
            <div className="lp-section-label">Before You Book</div>
            <h2 className="lp-section-title">Booking & payment policy</h2>
            <div className="lp-policy-list">
              {policies.map((p) => (
                <div key={p.title} className="lp-policy-item">
                  <div className="lp-policy-icon">{p.icon}</div>
                  <div className="lp-policy-text">
                    <strong>{p.title}</strong>
                    {p.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="lp-faq">
          <div className="lp-faq-inner">
            <div className="lp-section-label">Questions</div>
            <h2 className="lp-section-title">Frequently asked</h2>
            <div className="lp-faq-list">
              {faqs.map((item, i) => (
                <div key={i} className="lp-faq-item">
                  <button className="lp-faq-btn" onClick={() => toggleFAQ(i)}>
                    <span className="lp-faq-q">{item.q}</span>
                    <span className={`lp-faq-icon${openFAQ === i ? " open" : ""}`}>+</span>
                  </button>
                  {openFAQ === i && (
                    <p className="lp-faq-answer">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="lp-cta">
          <h2>
            Ready to start<br /><em>learning?</em>
          </h2>
          <p>Limited slots available each week — secure yours today.</p>
          <a href="https://wa.me/YOUR_NUMBER" className="lp-btn-wa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact on WhatsApp
          </a>
          <p className="lp-cta-note">Typically responds within a few hours</p>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          © {new Date().getFullYear()} Midnight & Light Language Lessons · All rights reserved
        </footer>

      </div>
    </>
  );
}

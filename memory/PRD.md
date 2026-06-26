# Novelty Wealth — PRD

## Vision
Visual-first mobile wealth app for Indian retail investors. Insights are glanceable — numbers and mini-charts carry the meaning, text only labels them.

## Personas (demo-switched in header)
- **Aarav** — MF-only investor, ₹4.82L portfolio, 70/30 equity:debt. Insight: nudge to 80/20 for +₹14L by 2040.
- **Meera** — Stocks + F&O trader, ₹18.4L portfolio. Insight: F&O exposure (15%) over self-set 10% limit.

## Screens (all functional)
1. **Home** — gradient value hero with donut, NovaAI insight card (with visual bars/risk line), 3 portfolio tiles, PRO upsell, WhatsApp pulse.
2. **NovaAI chat** — initial scripted message, suggestion chips, typing dots, canned reply, text input.
3. **Rebalance** — model corpus by 2040 with equity slider (50–90%), live growth curve overlay vs baseline 70/30.
4. **SIP health** — 3 SIPs, retry CTA for the failed one (Mirae ELSS).
5. **80C tax gap** — slider 5k–40k → live tax-saved number, ELSS CTA.
6. **Goal** — Retirement 2040 / House 2028, top-up stepper changes funded %.
7. **F&O risk** — exposure number + limit-line bar; closing the larger position drops exposure 15% → 8%.
8. **Book profits** — multi-select 3 stocks (Titan / ICICI / L&T), CTA "Book 25% of N".

## Tech
- Expo SDK 54, expo-router (file-based), React Native 0.81
- react-native-svg for Ring/Donut/GrowthCurve/Icon
- expo-linear-gradient for hero
- @react-native-community/slider for sliders
- Frontend-only with mock data (no backend)
- Light + dark theme toggle (☾/☀ in header)

## Design tokens
- Navy ink `#0E1726`, brand navy `#16223A`, gold accent `#B8902F`, slate `#5B6472`, line `#E5E9F0`
- Dark mode swaps surface/card/line + brightens accents
- Sora-style display weight via system bold; Inter-ish body

## Not in scope (v1)
- No backend, no auth, no real API integrations
- NovaAI uses canned scripted replies (per user choice)
- No notifications, no real trading

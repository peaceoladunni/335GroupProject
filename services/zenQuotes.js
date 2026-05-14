"use strict";

/* service for fetching random quotes from zenquotes.io */
/* docs: https://zenquotes.io/api */
/* note: zenquotes rate limits to ~5 requests per 30 sec per ip */

const ZEN_URL = "https://zenquotes.io/api/random";

/* fallback in case the api is down or we're rate limited */
const FALLBACK = {
  quote: "The journey of a thousand miles begins with a single step.",
  author: "Lao Tzu"
};

/* fetch a random quote, always resolves with { quote, author } */
async function getRandomQuote() {
  try {
    const response = await fetch(ZEN_URL);

    if (response.ok == false) {
      console.error("zenquotes returned status:", response.status);
      return FALLBACK;
    }

    const data = await response.json();

    /* zenquotes returns an array like [{ q: "...", a: "...", h: "..." }] */
    if (Array.isArray(data) == false || data.length == 0) {
      console.error("zenquotes returned unexpected shape:", data);
      return FALLBACK;
    }

    const first = data[0];
    return {
      quote: first.q,
      author: first.a
    };
  } catch (err) {
    console.error("error fetching quote:", err.message);
    return FALLBACK;
  }
}

module.exports = { getRandomQuote };
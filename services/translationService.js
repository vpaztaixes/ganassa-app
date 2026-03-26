const DEFAULT_TARGETS = ['ja', 'ko'];

/**
 * Minimal translation abstraction for future Phase 4 integration.
 * If no provider key is configured, it returns source text as a safe fallback.
 */
async function translateText(text, targetLang, sourceLang = 'en') {
	if (!text || typeof text !== 'string') return '';

	const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
	if (!apiKey) {
		return text;
	}

	const endpoint = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ q: text, source: sourceLang, target: targetLang, format: 'text' })
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(`Translation request failed (${response.status}): ${details}`);
	}

	const data = await response.json();
	return data?.data?.translations?.[0]?.translatedText || text;
}

async function translateToDefaultTargets(text, sourceLang = 'en') {
	const [ja, ko] = await Promise.all([
		translateText(text, DEFAULT_TARGETS[0], sourceLang),
		translateText(text, DEFAULT_TARGETS[1], sourceLang)
	]);

	return { ja, ko };
}

module.exports = {
	translateText,
	translateToDefaultTargets
};

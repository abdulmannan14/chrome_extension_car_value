chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_RETAIL") {
        try {
            const items = document.querySelectorAll("li.PricingGuide__Li-sc-ttp78x-6");

            for (const li of items) {
                const label = li.querySelector("p")?.innerText?.trim();
                if (label === "Retail") {
                    const priceText = li.querySelector("span.PricingGuide__Price-sc-ttp78x-7")?.innerText;
                    if (priceText) {
                        const price = parseInt(priceText.replace(/[^\d]/g, ""));
                        sendResponse({price});
                        return true; // async response
                    }
                }
            }

            // If Retail not found
            sendResponse({price: null});
        } catch (err) {
            console.error("Retail scraping error:", err);
            sendResponse({price: null});
        }
    }
    return true; // Keep channel open for async
});

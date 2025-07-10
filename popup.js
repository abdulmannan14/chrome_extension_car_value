import {generatePDFFromPopup} from './generatePdf.js';

document.addEventListener("DOMContentLoaded", () => {
    const retailInput = document.getElementById("retail");
    const positionInput = document.getElementById("position");
    const marginInput = document.getElementById("margin");
    const costsInput = document.getElementById("costs");
    const resultEl = document.getElementById("result");

    const commissionRateInput = document.getElementById("commissionRate");
    const commissionEl = document.getElementById("commission");
    const totalMarginEl = document.getElementById("totalMargin");

    let baseRetailPrice = 0;

    // Ask content.js for the scraped retail price
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (!tabs[0]?.id) return;

        chrome.tabs.sendMessage(tabs[0].id, {type: "GET_RETAIL"}, (response) => {
            if (chrome.runtime.lastError) {
                console.warn("Content script not ready or not loaded on this page.");
                return;
            }

            if (response?.price) {
                baseRetailPrice = parseFloat(response.price);
                retailInput.value = baseRetailPrice;
                updateCalculation();
            } else {
                console.warn("Retail price not found in response:", response);
            }
        });
    });

    // Live update: input changes trigger recalculation
    [retailInput, positionInput, marginInput, costsInput, commissionRateInput].forEach(input => {
        input.addEventListener("input", () => {
            if (input === positionInput && baseRetailPrice) {
                const position = parseFloat(positionInput.value || 0);
                const adjustedRetail = baseRetailPrice * (position / 100);
                retailInput.value = Math.round(adjustedRetail);
            }
            updateCalculation();
        });
    });

    function updateCalculation() {
        const retailPrice = parseFloat(retailInput.value || 0);
        const pricePosition = parseFloat(positionInput.value || 0);
        const margin = parseFloat(marginInput.value || 0);
        const costs = parseFloat(costsInput.value || 0);
        const commissionRate = parseFloat(commissionRateInput.value || 0);

        if (
            isNaN(retailPrice) ||
            isNaN(pricePosition) ||
            isNaN(margin) ||
            isNaN(costs) ||
            isNaN(commissionRate)
        ) {
            resultEl.value = "Invalid input";
            return;
        }

        const targetBuyPrice = calculateTargetBuyPrice({
            retailPrice,
            pricePosition,
            margin,
            costs
        });

        const commission = Math.round(retailPrice * (commissionRate / 100));
        const totalPotentialMargin = margin + commission;

        resultEl.value = `${targetBuyPrice}`;
        commissionEl.value = `${commission}`;
        totalMarginEl.value = `${totalPotentialMargin}`;
    }

    document.getElementById("saveBtn").addEventListener("click", async () => {
        generatePDFFromPopup();
    });


    function calculateTargetBuyPrice({retailPrice, pricePosition, margin, costs}) {
        const target = (retailPrice * (pricePosition / 100)) - margin - costs;
        return Math.round(target);
    }




});

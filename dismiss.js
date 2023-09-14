// ==UserScript==
// @name         Dismiss all GitHub reviews
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       DrSmugleaf
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const urlRegex = new RegExp(/github\.com\/.*\/.*\/pull\/.*/);
    const changesRegex = new RegExp(/\d+ change(?:s{0,1}) requested/);

    function createButton() {
        const urlMatch = urlRegex.exec(window.location.href);
        if (!urlMatch?.[0]) {
            return;
        }

        if (document.getElementById("dismissAllButton")) {
            return;
        }

        const requested = document.querySelector("#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details.is-squashing.is-updating-via-merge > div.js-merge-message-container > div > div > div > div:nth-child(1) > div.merge-status-list > details:nth-child(1) > summary > div > div.color-fg-muted.mr-3.css-truncate.css-truncate-target.flex-auto.flex-self-start > strong");
        if (!requested) {
            return;
        }

        const match = changesRegex.exec(requested.textContent);
        if (!match?.[0]) {
           return;
        }

        const buttonContainer = document.querySelector("#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details.is-squashing.is-updating-via-merge > div.js-merge-message-container > div > div > div > div:nth-child(1) > div.merge-status-list > details:nth-child(1) > summary > div");
        const dismissDropdown = document.querySelector("#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details.is-squashing.is-updating-via-merge > div.js-merge-message-container > div > div > div > div:nth-child(1) > div.merge-status-list > details:nth-child(1) > summary > div > div.flex-self-end.flex-shrink-0");
        if (!buttonContainer || !dismissDropdown) {
            return;
        }

        const dismissAll = document.createElement("button");
        dismissAll.id = "dismissAllButton";
        dismissAll.className = "dismissAllButton";
        dismissAll.innerText = "Dismiss All";

        dismissAll.style.marginRight = "1em";
        dismissAll.style.border = "1px solid #238636";
        dismissAll.style.borderRadius = "6px";
        dismissAll.style.backgroundColor = "#238636";

        dismissAll.onclick = () => {
            const sections = document.querySelectorAll("#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details > div.js-merge-message-container > div > div > div > div.Details > div.merge-status-list > details > summary > div > div > strong");
            sections.forEach(section => {
                if (!section.textContent.trim().endsWith(" requested")) {
                    return;
                }

                const details = section.parentElement.parentElement.parentElement.parentElement;
                details.querySelectorAll(":scope > div > form").forEach(review => {
                    const dismissInput = review.querySelector(":scope > div > div.TableObject-item.TableObject-item--primary > input");
                    console.log(review);
                    if (!dismissInput || dismissInput.placeholder === "Why are you dismissing your review?") {
                        return;
                    }

                    dismissInput.value = "outdated";
                    review.submit();
                });
            });
        };

        buttonContainer.insertBefore(dismissAll, dismissDropdown);
    }

    function loopCreateButton() {
        createButton();
        setTimeout(loopCreateButton, 1000);
    }

    loopCreateButton();
})();
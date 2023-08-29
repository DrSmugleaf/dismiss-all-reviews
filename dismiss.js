// ==UserScript==
// @name         Dismiss all GitHub reviews
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       DrSmugleaf
// @match        https://github.com/space-wizards/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const changesRegex = new RegExp(/\d+ change(?:s{0,1}) requested/);

    setTimeout(() => {
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
        dismissAll.className = "dismissAllButton";
        dismissAll.innerText = "Dismiss All";

        dismissAll.style.marginRight = "1em";
        dismissAll.style.border = "1px solid #238636";
        dismissAll.style.borderRadius = "6px";
        dismissAll.style.backgroundColor = "#238636";

        dismissAll.onclick = () => {
            const dismissInputs = document.querySelectorAll("#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details.is-squashing.is-updating-via-merge > div.js-merge-message-container > div > div > div > div:nth-child(1) > div.merge-status-list > details > div > form > div > div.TableObject-item.TableObject-item--primary > input");
            dismissInputs.forEach(input => {
                input.value = "outdated";
            });

            const dismissButtons = document.querySelectorAll("#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details.is-squashing.is-updating-via-merge > div.js-merge-message-container > div > div > div > div:nth-child(1) > div.merge-status-list > details > div > form");
            dismissButtons.forEach(dismiss => {
                dismiss.submit();
            });
        };

        buttonContainer.insertBefore(dismissAll, dismissDropdown);
    }, 2000)
})();
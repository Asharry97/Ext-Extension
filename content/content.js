/* Set The Extension Flag for the Respective Website */

console.log('Inside File: Content');
console.log('DOM fully loaded and parsed');

function showAlertOnModal(message, className) {
	const div = document.createElement('div');
	div.className = `alert alert-${className}`;
	div.appendChild(document.createTextNode(message));
	const mainContainer = document.querySelector('body');
	const modalContent = document.querySelector('div');
	mainContainer.insertBefore(div, modalContent);
	//setTimeout(() => document.querySelector('.alert').remove(), 100000); // Vanish in 3 seconds
}

showAlertOnModal("Disable Form Input Fields", "danger");

Array.from(document.querySelectorAll("input")).forEach(function (oneInputElement) {
	oneInputElement.disabled = true;
	console.log("DISABLING ALL INPUT ELEMENTS");
})

setInterval(function () {
	let all_ads_element_class_id = document.querySelectorAll(`[class*='ads' i], [id*='ads' i]`);
	Array.from(all_ads_element_class_id).forEach(function (one_ads_class) {
		console.log("Removing ads Class: ", one_ads_class.classList[0], one_ads_class);
		one_ads_class.remove();
	})
}, 2000);


Array.from(document.querySelectorAll("form")).forEach(function (oneInputElement) {
	oneInputElement.disabled = true;
	console.log("DISABLING ALL FORM ELEMENTS");
})

Array.from(document.querySelectorAll("a")).forEach(function (oneAElement) {
	oneAElement.style.backgroundColor = "red"
	console.log("RED ALL ANCHOR ");
})


function setFlag(extensionFlagImage, extensionFlagLabel) {

	let certifiedSection = `<div class="extensionFlagDiv">
								<img src="${extensionFlagImage}" class="extensionFlagImage">
								<label id="extensionFlagLabel">
									<b>${extensionFlagLabel}</b>
								</label>
							</div>`

	document.body.innerHTML += certifiedSection;
}

/* Ask the Background Js Script to provide details for the Host and Its details */
function requestHostDetails() {
	message = { reqMessage: "mainSitename" }
	chrome.runtime.sendMessage(message,
		function (response) {
			console.log("SendMessage: [Request & Response]: ", { message, response });
			if (response.unknown) {
				// Set the Flag
				setFlag(chrome.extension.getURL("images/popupIcon.png"), "Testing");
			} else {
				// Set the Flag
				setFlag(chrome.extension.getURL("images/popupIcon.png"), "Testing");
			}
		}
	);
}

requestHostDetails();




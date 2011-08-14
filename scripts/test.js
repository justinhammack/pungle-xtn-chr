if (document.domain == 'www.amazon.com') {
    chrome.extension.sendRequest({ greeting: document.domain });
}
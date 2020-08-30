var chromeURL = new RegExp("^(chrome(:|-extension:)|file:)");
var blockedRegex_Test = new RegExp("googleads|ads.google|pubmatic");

var chromeTabs = {};
var chromeTabsDomains = {};

/**
 * Structure Design
 * Each Tab has a Unique ID, Example: 22
 * Each Tab has a main Url 
 * Each Tab will have a website and a list of domains
*/

/* Chrome Extension Installation and Update Feature */
chrome.runtime.onInstalled.addListener(
    function (details) {
        if (details.reason == "install") {
            console.log("It is a First Install, Details: ", details);
        }
        else if (details.reason == "update") {
            console.log("It is a Update, Details: ", details);
        }
        else {
            console.log("Not Identifed, Details: ", details);
        }
    }
);

/* When a New Tab is Created */
chrome.tabs.onCreated.addListener(
    function (tabInfo) {
        let reqProtocol = getProtocol(tabInfo);
        if (!chromeURL.test(reqProtocol)) {
            console.log(`tabs API: onCreated Tab With [Tab ID:${tabInfo.id}], TabInfo: `, tabInfo);
        }
    }
);


/* When a Update on a Tab is Processed */
chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tabInfo) {
        let reqProtocol = getProtocol(tabInfo);
        if (!chromeURL.test(reqProtocol)) {
            console.log(`On Update Tab, TabInfo: `, { tabId, changeInfo, tabInfo });
            mainUrl = tabInfo.url;
            if (mainUrl) {
                mainUrl = mainUrl.split("#")[0];
            }
            else {
                console.log("Error............", tabInfo);
            }
        }
    }
);

/* When the Tab is Removed  */
chrome.tabs.onRemoved.addListener(
    function (tabId, removeInfo) {
        console.log(`On Removed Tab, TabInfo: `, { tabId, removeInfo });
    }
);

/* cancel = true means BLOCKED, cancel = false means ALLOWED */
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        cancel = false;
        let { tabId, reqURL, reqProtocol, reqHostname, reqFilePath, reqSearchFields } = getURLDetails(details);
        console.log({ tabId, reqURL, reqProtocol, reqHostname, reqFilePath, reqSearchFields });
        if (!chromeURL.test(reqProtocol)) {
            console.log(`webRequest API: onBeforeRequest, URL Received: ${details.url}, Details:  `, details);
            cancel = processRequest(reqHostname);
        }
        return { cancel: cancel };
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

function processRequest(reqHostname) {
    if (blockedRegex_Test.test(reqHostname)) {
        console.log(`Matched Host:${reqHostname} With Regex: ${blockedRegex_Test}`);
        return true;
    }
    else {
        console.log(`DID NOT Match Host:${reqHostname} With Regex: ${blockedRegex_Test}`);
        return false
    }
}

/* Chrome Runtime Mesaage Passing  */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(`On Message , TabInfo: `, { request, sender, sendResponse });
    }
);

function getURLDetails(details) {
    tabId = details.tabId;
    reqURL = details.url;
    urlObject = new URL(reqURL);
    reqProtocol = urlObject.protocol;
    reqHostname = urlObject.host;
    reqFilePath = urlObject.pathname;
    reqSearchFields = urlObject.search;
    console.log(`details.url:${details.url}, reqProtocol: ${reqProtocol}, reqHostname: ${reqHostname}, reqFilepath: ${reqFilePath}, reqSearchFields: ${reqSearchFields}`);
    return { tabId, reqURL, reqProtocol, reqHostname, reqFilePath, reqSearchFields };
}

function getProtocol(details) {
    reqURL = details.url;
    let reqProtocol = "";
    try {
        urlObject = new URL(reqURL);
        reqProtocol = urlObject.protocol;
    } catch (error) {
        console.log("(Using reqUrl as reqProtocol Error Occcured: ", { error, details });
        reqProtocol = reqURL;
    }
    return reqProtocol;
}

function getHostname(details) {
    reqURL = details.url;
    let reqHostname = "";
    try {
        urlObject = new URL(reqURL);
        reqHostname = urlObject.host;
    } catch (error) {
        console.log(`(Error While Processing:${reqURL} to extract reqHostname:${reqHostname} : `, { error, details });
        reqHostname = reqURL;
    }
    return reqHostname;
}
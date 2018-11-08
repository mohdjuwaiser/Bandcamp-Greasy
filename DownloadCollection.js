// ==UserScript==
// @name         DownloadCollection
// @namespace    https://bandcamp.com
// @version      1.0
// @description  Opens the download page for each album in your collection
// @author       Ryan Bluth
// @match        https://bandcamp.com/YOUR_USERNAME
// @grant        GM_openInTab
// ==/UserScript==

var ignoreDuplicateTitles = true; // Ignore albums with the same title and artist
var albumLoadDuration = 10000; // The number of milliseconds spent scrolling down to load all albums

(function () {
    'use strict';

    var allLinks = [];

    var mainContainer = document.createElement('div');
    mainContainer.style.width = "100%";
    mainContainer.style.backgroundColor = "#1DA0C3";
    mainContainer.style.position = "fixed";
    mainContainer.style.color = "white"
    mainContainer.style.top = "0";
    mainContainer.style.left = "0";
    mainContainer.style.padding = "20px";
    mainContainer.style.zIndex = "9999999";
    mainContainer.style.maxHeight = "700px";
    mainContainer.style.overflowY = "auto";
    mainContainer.innerHTML = "<div><h4>BANDCAMP GREASY<h4></div>"
    document.body.appendChild(mainContainer);

    var statusSpan = document.createElement('span');
    statusSpan.style.fontWeight = "bold";
    statusSpan.innerText = "Loading albums..."

    var downloadControls = document.createElement("div");
    downloadControls.style.position = "fixed";
    downloadControls.style.padding = "20px";
    downloadControls.style.color = "black";
    downloadControls.style.top = "0";
    downloadControls.style.right = "0";
    downloadControls.style.display = "none";
    
    var downloadAllButton = document.createElement("button");
    downloadAllButton.innerText = "Download All";
    downloadAllButton.style.display = "block";
    downloadAllButton.style.marginBottom = "10px";
    downloadAllButton.onclick = function(){
        for(var i = 0; i < allLinks.length; i++){
            window.open(allLinks[i], '_blank');
        }
    }

    var downloadSelectedButton = document.createElement("button");
    downloadSelectedButton.innerText = "Download Selected";
    downloadSelectedButton.style.display = "block";
    downloadSelectedButton.style.marginBottom = "10px";
    downloadSelectedButton.onclick = function(){
        var checkboxes = mainContainer.getElementsByTagName("input");
        for(var i = 0; i < checkboxes.length; i++){
            if(checkboxes[i].checked){
                window.open(checkboxes[i].link, '_blank');
            }
        }
    }

    var downloadRangeStart = document.createElement("input");
    downloadRangeStart.type = "text";
    downloadRangeStart.style.display = "block";
    downloadRangeStart.style.marginBottom = "10px";
    downloadRangeStart.placeholder = "Range Start";

    var downloadRangeEnd = document.createElement("input");
    downloadRangeEnd.type = "text";
    downloadRangeEnd.style.display = "block";
    downloadRangeEnd.style.marginBottom = "10px";
    downloadRangeEnd.placeholder = "Range End";

    var downloadRangeButton = document.createElement("button");
    downloadRangeButton.innerText = "Download Range";
    downloadRangeButton.style.display = "block";
    downloadRangeButton.style.marginBottom = "10px";
    downloadRangeButton.onclick = function(){
        var rangeStart = parseInt(downloadRangeStart.value);
        var rangeEnd = parseInt(downloadRangeEnd.value);
        for(var i = rangeStart; i <= rangeEnd && i < allLinks.length; i++){
            window.open(allLinks[i], '_blank');
        }
    }
    
    downloadControls.appendChild(downloadAllButton);
    downloadControls.appendChild(downloadSelectedButton);
    downloadControls.appendChild(downloadRangeButton);
    downloadControls.appendChild(downloadRangeStart);
    downloadControls.appendChild(downloadRangeEnd);
    
    mainContainer.appendChild(downloadControls);
    mainContainer.appendChild(statusSpan);

    var showMoreButton = document.getElementsByClassName('show-more')[0];
    setTimeout(function () {
        showMoreButton.click();
    }, 2000);

    var scrollInterval = setInterval(function () { window.scrollTo(0, window.scrollY + 50) }, 1);

    setTimeout(function () {
        downloadControls.style.display = "block";
        window.clearInterval(scrollInterval);
        var collectionItems = document.getElementsByClassName("collection-item-container");
        var downloadedItems = [];
        statusSpan.innerText = "Found the following albums:"
        for (var i = 0; i < collectionItems.length; i++) {
            var collectionItem = collectionItems[i];
            var itemDetails = collectionItem.getElementsByClassName("collection-item-details-container")[0];
            var albumTitle = itemDetails.getElementsByClassName("collection-item-title")[0].innerText;
            var albumArtist = itemDetails.getElementsByClassName("collection-item-artist")[0].innerText;
            var downloadLink = collectionItem.getElementsByClassName("redownload-item")[0].children[0].href;
            var titleArtistKey = albumTitle + albumArtist;
            var albumInfoContainer = document.createElement('div');
            var includeCheckbox = document.createElement('input');
            var titleArtistSpan = document.createElement('span');
            includeCheckbox.type = "checkbox";
            includeCheckbox.link = downloadLink;
            albumInfoContainer.appendChild(includeCheckbox);
            titleArtistSpan.innerText = albumTitle + " " + albumArtist;
            albumInfoContainer.appendChild(titleArtistSpan);
            mainContainer.appendChild(albumInfoContainer);
            if (!ignoreDuplicateTitles || (ignoreDuplicateTitles && downloadedItems.indexOf(titleArtistKey) < 0)) {
                allLinks.push(downloadLink);
            }
            downloadedItems.push(titleArtistKey);
        }
    }, albumLoadDuration);
})();
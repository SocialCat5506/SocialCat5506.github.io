/* 1. Search */

var UI = {};

UI.EnterPress = function(){};

UI.SubmitClick = function(){};


/* 2. Query Soundcloud API */


var SoundCloudAPI = {};

SoundCloudAPI.init = function () { //connects to SC API

    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });

};

SoundCloudAPI.init();

SoundCloudAPI.getTrack = function (inputValue) { //sends query to SC using inputValue

    // find all sounds of buskers licensed under 'creative commons share alike'
    SC.get('/tracks', {
        q: inputValue
    }).then(function (tracks) {
        console.log(tracks);
        SoundCloudAPI.renderTracks(tracks);
    });

};

SoundCloudAPI.getTrack("Rilo Kiley");




/* 3. Display the cards */

//Dynamically creates and populates song cards
SoundCloudAPI.renderTracks = function (tracks) {

    //gets all the tracks using forEach and populates the html
    tracks.forEach(function (tracks) {

        //card
        var card = document.createElement('div');
        card.classList.add("card");

        //image
        var imageDiv = document.createElement('div');
        imageDiv.classList.add('image');

        var image_img = document.createElement('img');
        image_img.classList.add('image_img');
        image_img.src = tracks.artwork_url || 'http://lorempixel.com/100/100/abstract/';

        imageDiv.appendChild(image_img);

        //content
        var content = document.createElement('div');
        content.classList.add('content');

        var header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = '<a href="' + tracks.permalink_url + '" target="_blank">' + tracks.title + '</a>';

        //button
        var button = document.createElement('div');
        button.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');

        var icon = document.createElement('i');
        icon.classList.add('add', 'icon');

        var buttonText = document.createElement('span');
        buttonText.innerHTML = "Add to playlist";

        content.appendChild(header);

        button.appendChild(icon);
        button.appendChild(buttonText);

        //Add to playlist, calls embeded player to sidebar
        button.addEventListener('click', function () {
            SoundCloudAPI.getEmbed(tracks.permalink_url);
        });

        card.appendChild(imageDiv);
        card.appendChild(content);
        card.appendChild(button);

        var searchResults = document.querySelector(".js-search-results");
        searchResults.appendChild(card);
    });

};



/* 4. Add to playlist and play */
SoundCloudAPI.getEmbed = function (trackURL) {
    SC.oEmbed(trackURL, {
        auto_play: true
    }).then(function (embed) {
        console.log('oEmbed response: ', embed);
        //injects the embeded player to sidebar
        var sidebar = document.querySelector('.js-playlist');
        
        var box = document.createElement('div');
        box.innerHTML = embed.html;
        
        //inserts a new element in sidebar (to where, before what)
        sidebar.insertBefore(box, sidebar.firstChild);
        
        //after creating playlist it will be stored in the local storage so user can come back to it later so storing will be done right after a new track added
        //localStorage.setItem("column name or key you want to create or update", value you want to store);
        localStorage.setItem("key", sidebar.innerHTML);
        
    });
};

//load the data in local storage on load of the page
var sideBar = document.querySelector(".js-playlist");
sideBar.innerHTML = localStorage.getItem("key");

//ADD CLEAR PLAYLIST BUTTON HERE






/*
<div class="image" ><img class="image_img" src="' + imageSrc + '"></div><div class="content"><div class="header"><a href="' + soundSrc + '" target="_blank">"' + trackTitle + '"</a></div></div><div class="ui bottom attached button js-button" onclick="SoundCloudAPI.getEmbed(\'' + soundSrc + '\')"><i class="add icon"></i><span>Add to playlist</span></div>
*/
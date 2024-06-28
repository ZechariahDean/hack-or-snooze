"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  // console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** show submission form when submit link is clicked */

function navSubmitStory(evt) {
  // console.debug("navSubmitStory", evt);
  hidePageComponents();
  putStoryFormOnPage();
  putStoriesOnPage();
}

$navSubmit.on("click", navSubmitStory);
/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  // console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// function to switch screen contents to favorites
function navFavorites() {
  console.debug("navFavorites");
  hidePageComponents();
  putFavoritesOnPage();
}

// event listener for navigation to favorites
$navFavorites.on('click', navFavorites);

// function to switch screen contents to my stories
function navMyStories() {
  console.debug("navMyStories");
  hidePageComponents();
  putMyStoriesOnPage();
}

// event listener for navigation to my stories
$navMyStories.on('click', navMyStories);
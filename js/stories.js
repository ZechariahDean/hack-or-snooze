"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

// create a delete button
function getDelBtn() {
  return `<span class="del-button"><i class="fas fa-trash-alt"></i></span>`;
}

// Make stars for 
function getStar(story, user) {
  const fav = user.isFaved(story);
  return `<span class="star"><i class="${fav ? "fas fa-star" : "far fa-star"}"></i></span>`;
}
/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, delBtn = false) {
  // console.debug("generateStoryMarkup", story);
  const fav = Boolean(currentUser);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${delBtn ? getDelBtn() : ''}
        ${fav ? getStar(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// // event listener for detecting submit being clicked
// $navSubmit.on("submit", storyList.addStory(localStorage.getItem("username"), {'title':  $("#story-title"), 'author': $("#author-input"), 'url': $("#story-url")}));


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  // console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// function to put story form on screen
function putStoryFormOnPage() {
  console.debug("putStoryFormOnPage");
  $storyForm.toggleClass('hidden');
  $storyForm.show();
}

// function to create a new story on click
async function createNewStory(evt) {
  console.debug("createNewStory");
  evt.preventDefault();

  const title = $('#story-title').val();
  const author = $('#story-author').val();
  const url = $('#story-url').val();
  const username = currentUser.username;
  const data = {title, url, author, username};

  const newStory = await storyList.addStory(currentUser, data);

  const $newMarkup = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newMarkup);

  hidePageComponents();
  putStoriesOnPage();
}

// event listener for detecting submit being clicked
$storyForm.on("submit", createNewStory);

//  function to fill page with favorite stories
function putFavoritesOnPage() {
  // console.log("putFavoritesOnPage");

  $favoriteStories.empty();
  if (currentUser.favorites.length === 0) {
    $favoriteStories.append("<h3>No favorites added!</h3>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }

  $favoriteStories.show()
}

// create function to favorite/unfavorite stories
async function toggleFavorite(evt) {
  console.debug("toggleFavorite");

  // find the correct story object
  const $target = $(evt.target);
  const $storyLi = $target.closest('li');
  const storyId = $storyLi.attr('id');
  const story = storyList.stories.find(stry => stry.storyId === storyId);

  // toggle favorite status
  if ($target.hasClass('fas')) {
    await currentUser.unFavorite(story);
    $target.closest("i").toggleClass('fas far');
  } else {
    await currentUser.favorite(story)
    $target.closest('i').toggleClass('fas far');
  }
}

// event listener to call toggleFavorite
$storiesList.on("click", ".star", toggleFavorite);

// function to fill screen with my stories
function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $myStories.empty();
  if (currentUser.ownStories.length === 0) 
    $myStories.append("<h3>No stories added by user yet!</h3>");
  else for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, true);
    $myStories.append($story);
  };
  $myStories.show();
}

// function to delete story
async function deleteStory(evt) {
  console.debug("deleteStory");

  // find the correct story object
  const $storyLi = $(evt.target).closest('li');
  const storyId = $storyLi.attr('id');

  await storyList.removeStory(storyId);

  putMyStoriesOnPage();
}

// event listener to call delete story
$storiesList.on('click', '.del-button', deleteStory);
document.addEventListener("DOMContentLoaded", function () {
  const commentNameInput = document.getElementById("comment_name");
  const commentTextInput = document.getElementById("comment_text");
  const submitCommentButton = document.getElementById("submit_comment");
  const commentForm = document.getElementById("comment_form");
  const commentsContainer = document.getElementById("comments_container");
  const sortAscButton = document.getElementById("sort_asc");
  const sortDescButton = document.getElementById("sort_desc");

  let comments = [];

  commentNameInput.addEventListener("input", function () {
    checkCommentValidity();
  });

  commentTextInput.addEventListener("input", function () {
    checkCommentValidity();
  });

  function checkCommentValidity() {
    const nameValue = commentNameInput.value.trim();
    const textValue = commentTextInput.value.trim();
    submitCommentButton.disabled = !(nameValue && textValue);
  }

  submitCommentButton.addEventListener("click", function (e) {
    e.preventDefault();
    const name = commentNameInput.value.trim();
    const text = commentTextInput.value.trim();

    if (!name || !text) {
      return;
    }

    addComment(name, text, new Date());
    commentForm.reset();
    checkCommentValidity();
  });

  function addComment(name, text, date) {
    const commentElement = document.createElement("p");
    commentElement.innerHTML =
      "Name: "+name +
      "<p>Comment: "+text+"<p><small>"+date.toLocaleString()+"</small>";
    commentsContainer.appendChild(commentElement);

    comments.push({ name: name, text: text, date: date });
  }

  function sortComments(ascending) {
    comments.sort(function (a, b) {
      return ascending ? a.date - b.date : b.date - a.date;
    });
    renderComments();
  }

  function renderComments() {
    commentsContainer.innerHTML = "";
    comments.forEach(function (comment) {
      const commentElement = document.createElement("p");
      commentElement.innerHTML =
        "Name: "+comment.name +
        "<p>Comment: "+comment.text +
        "<p><small>"+comment.date.toLocaleString()+"</small>";
      commentsContainer.appendChild(commentElement);
    });
  }

  sortAscButton.addEventListener("click", function () {
    sortComments(true);
    sortAscButton.blur();
  });

  sortDescButton.addEventListener("click", function () {
    sortComments(false);
    sortDescButton.blur();
  });
});

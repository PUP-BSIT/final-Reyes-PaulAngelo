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

function searchCountry() {
  let countryName = document.getElementById("country_input").value.trim();
  if (!countryName) {
    document.getElementById("country_details").innerHTML =
      "<p>Please enter a country name.</p>";
    document.getElementById("same_region_countries").innerHTML = "";
    return;
  }

  fetch("https://restcountries.com/v3.1/name/" + countryName)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Country not found");
      }
      return response.json();
    })
    .then(function (country_data) {
      let country = country_data[0];
      let details = `
        <h2>Country Details - ${country.name.common}</h2>
        <p><strong>Capital:</strong> 
          ${country.capital ? country.capital[0] : "N/A"}
        </p>
        <p><strong>Population:</strong> 
          ${country.population ? country.population.toLocaleString() : "N/A"}
        </p>
        <p><strong>Region:</strong> 
          ${country.region ? country.region : "N/A"}
        </p>
        <p><strong>Languages:</strong> 
          ${
           country.languages? Object.values(country.languages).join(", "):"N/A"
          }
        </p>
        <p><strong>Timezones:</strong> 
          ${country.timezones ? country.timezones.join(", ") : "N/A"}
        </p>`;
        document.getElementById("country_details").innerHTML = details;

      return fetch("https://restcountries.com/v3.1/region/" + country.region);
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Region not found");
      }
      return response.json();
    })
    .then(function (regionData) {
      let region = regionData[0].region;
      let sameRegionCountriesList = regionData
        .map(function (c) {
         return `<div class="same-region-country">
             <img src="${c.flags.svg}"alt="Flag of ${c.name.common}"width="50">
             <p>${c.name.common}</p>
            </div>`;
        }).join("");
        document.getElementById("same_region_countries").innerHTML = `
          <h2>Countries in the Same Region (${region})</h2>
          <div>${sameRegionCountriesList}</div>`;
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
      document.getElementById("country_details").innerHTML =
        "<p>An error occurred: " + error.message + "</p>";
      document.getElementById("same_cegion_countries").innerHTML = "";
    });
}

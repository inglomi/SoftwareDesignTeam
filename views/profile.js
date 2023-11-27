const backend_url = "http://localhost:8080";
//we need to find a way to retrieve the user id whenever they login with their username and password
//then store that userID locally like: window.localStorage.setItem("userID", userID);
//and this id we can get it like:  const id = window.localStorage.getItem("userID");
//and in the logout we need to also clear the localstorage when logout like: window.localStorage().clear();
const id = 2;

document.addEventListener("DOMContentLoaded", function () {
  fetch(backend_url + "/user_info/" + id)
    .then((res) => res.json())
    .then((data) => load_user_info_by_id(data["data"]));
});

function load_user_info_by_id(data) {
  let user_info = data[0];
  const form = document.querySelector("#user_update_info_form");
  let elements = Array.from(form.elements);
  //insert the data into the input box according to the name
  for (let element of elements) {
    if (user_info[element.name]) element.value = user_info[element.name];
  }
}

document
  .getElementById("user_update_info_form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById("user_update_info_form");
    //get input data from the form
    const formData = new FormData(form);

    // Convert the form data to a JSON object
    const jsonObject = {};
    //convert it into an json object
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    //fetch the api to update the user information
    fetch(backend_url + "/update_user_info/" + id, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      //send the body as json object
      body: JSON.stringify(jsonObject),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  });

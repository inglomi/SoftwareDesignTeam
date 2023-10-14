document.addEventListener("DOMContentLoaded", () => {
    // Fetch the user's address when the page loads
    async function getAddress() {
      const res = await fetch("/api/user/address", {
        method: "GET",
      })
      // Populate the address data with the retrieved data.
      try {
        const data = await res.json()
        document.getElementById("address").value = data.address;
        document.getElementById("second__address").value = data.second__address;
        document.getElementById("city").value = data.city;
        document.getElementById("state").value = data.state;
        document.getElementById("zip").value = data.zip;
      }
      catch(error) {
        console.error("Error fetching user's address:", error);
      }
    }
    getAddress();
});
    
    /* Function to populate the address fields from the user profile data
    function populateAddressFields(userProfileData) {
      document.getElementById("address").value = userProfileData.address;
      document.getElementById("second__address").value = userProfileData.second__address;
      document.getElementById("city").value = userProfileData.city;
      document.getElementById("state").value = userProfileData.state;
      document.getElementById("zip").value = userProfileData.zip;
    }

    const userProfileData = {
      address: "123 Main St",
      second__address: "Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001"
    };
    
    populateAddressFields(userProfileData);*/

// Check that gallon amount is a positive number
const gallonsInput = document.getElementById("gallons");
gallonsInput.addEventListener("input", function () { 
  const gallons = parseFloat(gallonsInput.value);
  if (gallons <= 0 || isNaN(gallons)) {
    gallonsInput.setCustomValidity("Gallons must be a positive number.");
  } 
  else {
    gallonsInput.setCustomValidity("");
  }
});
  
// Check that Date input is a future date
const deliveryDateInput = document.querySelector('input[name="delivery__date"]');
deliveryDateInput.addEventListener("input", function () {
  const selectedDate = new Date(deliveryDateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to midnight for accurate comparison
  if (isNaN(selectedDate) || selectedDate < today) {
    deliveryDateInput.setCustomValidity("Please select a valid future date.");
  } else {
    deliveryDateInput.setCustomValidity("");
  }
});

// Get the suggested price and total amount due to disply before submit
document.getElementById("quote__form").addEventListener("input", async (event) => {
  const gallonsInput = parseFloat(document.getElementById("gallons"))
  const gallons = event.target.value;

  if (gallons) {
    try {
      const response = await fetch("/api/user/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({gallons}),
      });

      if (response.ok) {
        const data = await response.json();
        document.getElementById("price").value = data.pricePerGallon.toFixed(2);
        document.getElementById("total").value = data.totalAmountDue.toFixed(2);
      }
      else {
        console.error("Error fetching estimate data");
      }
    }
    catch (error) {
      console.error("Error:", error);
    }
  }
});

// Form submit event handler
document.getElementById("quote__form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Gather user input data
  const gallons = parseFloat(document.getElementById("gallons").value);
  const deliveryDate = document.getElementById("delivery__date").value;

  // Send the data to the server
  fetch("/api/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gallons, deliveryDate }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

/* Calculate and display the price and total amount due
document.getElementById("quote__form").addEventListener("input", function () {
  const gallons = parseFloat(document.getElementById("gallons").value);

  // Calculate total amount due based on a predefined price per gallon
  const pricePerGallon = 2.50; // Replace with the actual price per gallon
  const totalAmountDue = gallons * pricePerGallon;

  // Display the calculated price and total amount due
  document.getElementById("price").value = pricePerGallon.toFixed(2);
  document.getElementById("total").value = totalAmountDue.toFixed(2);
});*/

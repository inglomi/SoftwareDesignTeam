
//Adds new quote in table
function newQuote(qoute){
    let newqoute = document.createElement("tr");
    qoute.forEach(function(data){
    let cell = document.createElement("td");
    cell.innerHTML = data;
    newqoute.appendChild(cell);
    });
    return newqoute;
}

//Test
id = 20435;
fullname = "Edith Finch";
date = "2-17-2023";
gallon_requested = 24;
price = "$5300";
address = "54 Tack Way";
state = "Houston, Texas";
zipcode = 77012;
price_per_gallon = 220.8;
deliverydate = "2-30-2023";

//qoute properties
let id,fullname,date,gallon_requested,price,address,state,zipcode,price_per_gallon,deliverydate;

let qouteinfo = [id, fullname, date, gallon_requested, price, address, state, zipcode, price_per_gallon, deliverydate];

let table = document.querySelector("tbody");
table.appendChild(newQuote(qouteinfo));


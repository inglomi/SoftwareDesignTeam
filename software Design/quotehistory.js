const express = require('express');
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
//qoute properties
let id,fullname,date,gallon_requested,price,address,state,zipcode,price_per_gallon,deliverydate;

let qouteinfo = [id, fullname, date, gallon_requested, price, address, state, zipcode, price_per_gallon, deliverydate];

let table = document.querySelector("tbody");
table.appendChild(newQuote(qouteinfo));


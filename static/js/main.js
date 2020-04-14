/*
author: Luke Chambers
date: 4/8/2020
desc: for SDEV300
*/

var NUM_INPUTS = 1;

const createInputCard = (id, title) => {
  console.log("Adding input");
  // create parent div
  let div = document.createElement("div");
  div.className = "inputTable";

  // create table label element
  let label = document.createElement("label");
  label.className = "tableLabel";
  label.textContent = title;

  // create an empty input table
  let table = document.createElement("table");
  table.className = "inputTable__table";
  table.id = id.toString();

  //create trs and tds for the table
  for (let row = 1; row <= 3; row++) {
    let tr = document.createElement("tr");

    for (let col = 1; col <= 3; col++) {
      let td = document.createElement("td");

      let input = document.createElement("input");
      input.type = "text";
      input.form = "inputTable_form";
      input.required = true;
      input.minLength = "1";
      input.maxLength = "3";
      input.size = "1";
      input.id = "abc"[row] + "123"[col];

      // append created tds to the tr
      td.appendChild(input);
      tr.appendChild(td);
    }

    // append the tr to the table
    table.appendChild(tr);
  }

  // append the label, then the table to the parent div
  div.appendChild(label);
  div.appendChild(table);

  return div;
};

const removeInputCard = () => {
  let form = document.getElementById("inputTable_form");
  form.removeChild(form.lastChild);
};

const createOutputCard = (array, title) => {
  // create parent div
  let div = document.createElement("div");
  div.className = "outputTable";

  // create table label element
  let label = document.createElement("label");
  label.className = "tableLabel";
  label.textContent = title;

  // create an empty input table
  let table = document.createElement("table");
  table.className = "outputTable__table";

  //create trs and tds for the table
  for (let row = 0; row < array.length; row++) {
    let tr = document.createElement("tr");

    for (let col = 0; col < array[row].length; col++) {
      let td = document.createElement("td");
      td.textContent = array[row][col];

      // append created tds to the tr
      tr.appendChild(td);
    }

    // append the tr to the table
    table.appendChild(tr);
  }

  // append the label, then the table to the parent div
  div.appendChild(label);
  div.appendChild(table);

  return div;
};

const removeOutputCards = () => {
  let outputArea = document.getElementById("outputArea");
  while (outputArea.hasChildNodes()) {
    outputArea.removeChild(outputArea.firstChild);
  }
};

const removeLastOutputCard = () => {
  let outputArea = document.getElementById("outputArea");
  outputArea.removeChild(outputArea.lastChild);
};

const sendInputs = (url) => {
  const divs = document.getElementsByClassName("inputTable");
  const arrays = [];

  for (let div of divs) {
    // div contains a label and a table
    let table = div.lastElementChild;
    // empty container array
    let array = [[], [], []];

    // push values into container array
    let row = 0;
    for (let tr of table.getElementsByTagName("tr")) {
      for (let td of tr.getElementsByTagName("input")) {
        //console.log(td.value);
        array[row].push(td.value);
      }
      row++;
    }

    // push the array into our return list
    arrays.push(array);
  }

  // using fetch to hit whatever endpoint with the input data
  const response = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      numArrays: arrays.length,
      arrays: arrays,
    }),
  });

  return response; // returns promise obj
};

const populateOutputArea = (response, clear = true) => {
  // uses promises so we don't have to wait for the data
  response.json().then(
    (data) => {
      console.log(data);
      let outputArea = document.getElementById("outputArea");

      if (clear) {
        removeOutputCards();
      }

      let i = 1;
      for (let array of data["arrays"]) {
        // first two for loops produce a1, a2, a3, b1, b2...
        let node = createOutputCard(array, "Output Array " + i);
        outputArea.appendChild(node);
        i++;
      }
    },
    (err) => {
      console.error(err);
    }
  );
};

const addInputArea = () => {
  const ordinal = [
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
  ];
  document
    .getElementById("inputTable_form")
    .appendChild(
      createInputCard(
        `inputTable__table_${NUM_INPUTS}`,
        `${ordinal[NUM_INPUTS - 1]} Matrix`
      )
    );
  NUM_INPUTS++;
};

const removeInputArea = () => {
  console.log("removing input card");
  if (!(NUM_INPUTS == 1)) {
    removeInputCard();
    NUM_INPUTS--;
  }
};

const errorBlock = (type) => {
  let div = document.createElement("div");
  div.className = "outputTable";

  let p = document.createElement("p");
  p.innerHTML = `Need more than one matrix to ${type}! Use the<span class='fakeButton'>+</span> and <span class='fakeButton'>-</span>buttons to add and remove input matrices.`;

  div.appendChild(p);
  return div;
};

const transpose = () => {
  sendInputs("/transpose").then((data) => {
    populateOutputArea(data);
  });
};

const multiply = () => {
  if (document.getElementById("inputTable_form").childElementCount >= 2) {
    sendInputs("/matmul").then((data) => {
      populateOutputArea(data);
    });
  } else {
    removeOutputCards();
    let outputArea = document.getElementById("outputArea");
    let div = errorBlock("multiply")
    outputArea.appendChild(div);
  }
};

const add = () => {
  if (document.getElementById("inputTable_form").childElementCount >= 2) {
    sendInputs("/add").then((data) => {
      populateOutputArea(data);
    });
  } else {
    removeOutputCards();
    let outputArea = document.getElementById("outputArea");
    let div = errorBlock("add")
    outputArea.appendChild(div);
  }
};

const subtract = () => {
  if (document.getElementById("inputTable_form").childElementCount >= 2) {
    sendInputs("/subtract").then((data) => {
      populateOutputArea(data);
    });
  } else {
    removeOutputCards();
    let outputArea = document.getElementById("outputArea");
    let div = errorBlock("subtract")
    outputArea.appendChild(div);
  }
};

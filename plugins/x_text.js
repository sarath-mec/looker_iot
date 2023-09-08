looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "x_text",
  label: "~Text",
  options: {
    font_size: {
      type: "string",
      label: "Font Size",
      values: [
        {"Large": "large"},
        {"Small": "small"}
      ],
      display: "radio",
      default: "large"
    }
  },
  // Set up the initial state of the visualization
  create: function(element, config) {

    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
        .vis {
          /* Vertical centering */
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
		  align-items: flex-end;
          text-align: center;
          font-family: Roboto;
        }
        .text-large {
          font-size: 24px;
        }
        .text-small {
          font-size: 10px;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    var container = element.appendChild(document.createElement("div"));
    container.className = "vis";

    // Create an element to contain the text.
    this._textElement = container.appendChild(document.createElement("div"));

  },
 // Render in response to the data or settings changing
 updateAsync: function(data, element, config, queryResponse, details, done) {

  // Clear any errors from previous updates
  this.clearErrors();

  // Throw some errors and exit if the shape of the data isn't what this chart needs
  if (queryResponse.fields.dimensions.length == 0) {
    this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
    return;
  }

  // Initialize an empty string to store the entire content
  var content = "";

  // Iterate through each row in the data array
  for (let row of data) {
    for (let dimension of queryResponse.fields.dimensions) {
      let cell = row[dimension.name];
      content += LookerCharts.Utils.htmlForCell(cell) + "<br>"; // Use a line break to separate each cell's content
    }
  }

  // Insert the data into the page
  this._textElement.innerHTML = content;

  // Set the size to the user-selected size
  if (config.font_size == "small") {
    this._textElement.className = "text-small";
  } else {
    this._textElement.className = "text-large";
  }

  // We are done rendering! Let Looker know.
  done()
  }
});

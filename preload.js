// preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
//var KahootClient = require('./kahoot-client.js');
//let client = new KahootClient();
let client = require('./kahoot-client.js');

window.addEventListener('DOMContentLoaded', async () => {
  let PIN, NAME;

  // On index page.
  if (document.getElementsByClassName('index')[0]) {

    var form = document.getElementById('submitGameCode') /*Your Form Element*/ ;
    var submitBtnPin = document.getElementById('submitBtnPin');
    var ele = document.getElementsByClassName("inputPin")[0];

    form.onsubmit = (e) => {
      e.preventDefault();
    }

    submitBtnPin.onclick = async () => {
      let formData = new FormData(form);
      for (var key of formData.entries()) {
        if (key[0] == "code") {
          PIN = key[1];
          if (PIN == "") return ele.classList.add('error');
          if (isNaN(PIN)) {
            return ele.classList.add('error');
          }
          let pinTrue = false;
          document.getElementById("loader").classList.add("loading")
          pinTrue = await client.validatePIN(PIN);
          document.getElementById("loader").classList.remove("loading")
          if (!pinTrue) {
            ele.classList.add('error');
          } else {
            submitBtnPin.setAttribute("id", "submitBtnName");
            var submitBtnName = document.getElementById('submitBtnName');
            ele.setAttribute("name", "name");
            ele.setAttribute("maxlength", "15")
            ele.setAttribute("placeholder", "Enter A Nickname");
            submitBtnName.innerText = "Ok, GO!";
            ele.value = "";
          }
        } else if (key[0] == "name") {
          NAME = key[1];
          if (NAME == "") {
            return ele.classList.add('error');
          }
          if (NAME.length > 15) return ele.classList.add('error');

          document.getElementById("loader").classList.add("loading")
          clientJoined = await client.join(PIN, NAME);
          document.getElementById("loader").classList.remove("loading")
          if (clientJoined == !true) {
            // Joined Success
            client.on('NameAccept', (Obj) => {
              client.updateName(Obj.playerName);
              document.getElementById('wrapper').style.display = "none";
              let NC = require('./instructions-page')(Obj.playerName);
              document.getElementById('loader').classList.remove('index');
              document.getElementById('loader').classList.add('instructions');
              document.getElementById('wrapper-2').innerHTML = NC;
              client.on('Disconnect', Disconnect)

              // Now this parent if statement will return false.
            });

          } else {
            // <div class="errorMessageDiv"><div class="innerErrorMessage"><i class="far fa-exclamation-circle errorMessageIcon"></i><div class="errorMessage"></div></div></div>
            errorMessage(clientJoined);
          }
        }
      }
    }
  }

  // Events for client.
  function Disconnect(reason) {
    //Disconnected
    document.getElementById('wrapper').style.display = "block";
    document.getElementById('wrapper-2').remove();
    document.getElementById('loader').classList.add('index');
    document.getElementById('loader').classList.remove('instructions');
    errorMessage(`Disconnected: ${reason}`)
  }

  function errorMessage(error) {
    let errorMessageDiv = document.createElement('div');
    errorMessageDiv.setAttribute('class', 'errorMessageDiv');
    let innerErrorMessage = document.createElement('div');
    innerErrorMessage.setAttribute('class', 'innerErrorMessage');
    let icon = document.createElement('i').setAttribute('class', 'far fa-exclamation-circle errorMessageIcon')
    innerErrorMessage.appendChild(icon);
    let errorMessage = document.createElement('div').setAttribute('class', 'errorMessage');
    errorMessage.innerHTML = error;
    errorMessageDiv.appendChild(errorMessage);
    errorMessageDiv.appendChild(innerErrorMessage);
    document.append(errorMessageDiv);
    setTimeout(() => {
      errorMessageDiv.remove();
    }, 5000);
  }
});
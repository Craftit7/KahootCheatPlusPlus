let client = require('./classes/kahoot-client.js');
let settingsClass = require('./classes/settings.js');

window.addEventListener('DOMContentLoaded', async () => {
  let PIN, NAME;

  let settings = document.getElementById('settings');
  let settingsWrapper = document.getElementById('settings-wrapper');
  let settingsForm = document.getElementById('settings-form')
  let QidEle = document.getElementById('Qid');
  let QnameEle = document.getElementById('Qname');
  document.getElementById('answerCooldown').value = settingsClass.answerDelay;
  QidEle.value = client.Qid;
  QnameEle.value = client.Qname;
  settingsForm.onsubmit = (e) => {
    e.preventDefault();
  }
  document.getElementById('settings-form-submit').onclick = async () => {
    let formData = new FormData(settingsForm);
    let data = {};
    for (let i of formData.entries()) {
      data[i[0]] = i[1];
    }

    if (data.manualMode) settingsClass.autoAnswer = false;
    else settingsClass.autoAnswer = true;

    if (!isNaN(data.answerCooldown)) settingsClass.answerDelay = data.answerCooldown;
    if (isNaN(data.answerCooldown)) return document.getElementById('answerCooldown').classList.add('error')
    if (data.Qid) {
      let QidValid = await client.validateQid(data.Qid);
      if (!QidValid) return document.getElementById('Qid').classList.add('error')
      else {
        settings.click();
        await client.updateQid(data.Qid);
      }
    } else if (data.Qname) {
      let QnameValid = await client.getQidFromQname(data.Qname);
      if (!QnameValid) return document.getElementById('Qname').classList.add('error')
      else settings.click();
    }


  }

  settings.onclick = () => {
    document.getElementById('answerCooldown').value = settingsClass.answerDelay;
    QidEle.value = client.Qid;
    QnameEle.value = client.Qname;
    settingsWrapper.classList.toggle("settings-show");
    settingsWrapper.classList.toggle("settings-hide");
    settings.classList.toggle('down');
  }

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
              let NC = require('./pages/quiz/instructions-page')(Obj.playerName);
              document.getElementById('loader').classList.remove('index');
              document.getElementById('loader').classList.add('instructions');
              document.getElementById('wrapper-2').innerHTML = NC;
              client.on('Disconnect', Disconnect);
              client.on('QuestionEnd', QuestionEnd);
              client.on('QuestionReady', QuestionReady);
              client.on('QuestionStart', QuestionStart);
              client.on('QuizEnd', QuizEnd);
              client.on('QuizStart', QuizStart);
              client.on('TimeOver', TimeOver);

              // Now this parent if statement will return false.
            });

          } else {
            //console.log(clientJoined)
            errorMessage(clientJoined);
          }
        }
      }
    }
  }

  // Events for client.
  function QuizStart(quiz) {
    client.joinedBeforeQuizStarts = true;
    document.getElementById('wrapper').style.display = "none";
    let NC = require('./pages/quiz/quizLoading-page')(client.playerName);
    document.getElementById('loader').classList.add('game');
    document.getElementById('loader').classList.remove('instructions');
    document.getElementById('wrapper-2').innerHTML = NC;
  }

  function TimeOver(Obj) {
    // Nothing to do here
  }

  function QuizEnd(Obj) {
    // Things to do here...
    NC = require('./pages/quiz/quizEnd-page')(Obj.rank, client)
    document.getElementById('wrapper-2').innerHTML = NC;
  }

  function QuestionStart(Obj) {
    // Things to do here...
    if (!client.joinedBeforeQuizStarts) {
      // This means that things are not initialized properly, so we initialize them.
      document.getElementById('wrapper').style.display = "none";
      let NC = require('./pages/quiz/quizLoading-page')(client.playerName);
      document.getElementById('loader').classList.add('game');
      document.getElementById('loader').classList.remove('instructions');
      document.getElementById('wrapper-2').innerHTML = NC;
      client.joinedBeforeQuizStarts = true;
    }

    //console.log(Obj.gameBlockLayout)
    let NC;


    if (Obj.gameBlockType.includes("multiple")) {
      if (Obj.gameBlockType.includes("quiz")) {
        // Quiz handler Multiple select only 4 possible buttons with the on form submit event.
        NC = require('./pages/question/questionMultiple-page')(Obj, client)
        document.getElementById('wrapper-2').innerHTML = NC;

        let formEle = document.getElementById('formElementMultiQuestion'),
          formSubmitButton = document.getElementById('formSubmitButton');

        formEle.onsubmit = (e) => {
          e.preventDefault();
        }

        formSubmitButton.onclick = () => {
          let data = new FormData(formEle);
          let dataArr = client.returnNumberFromData(data);
          Obj.answer(dataArr);
        }
        if (client.choice != null) {
          setTimeout(() => {
            Obj.answer(client.choice);
            client.choice = false;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }, (settingsClass.answerDelay * 1000));
        }
      } else if (Obj.gameBlockType.includes("poll")) {
        // Poll Handler Multiple select with the on form submit event.
        NC = require('./pages/question/questionMultiple-page')(Obj, client)
        document.getElementById('wrapper-2').innerHTML = NC;
        let formEle = document.getElementById('formElementMultiQuestion'),
          formSubmitButton = document.getElementById('formSubmitButton');

        formEle.onsubmit = (e) => {
          e.preventDefault();
        }

        formSubmitButton.onclick = () => {
          let data = new FormData(formEle);
          let dataArr = client.returnNumberFromData(data);
          Obj.answer(dataArr);
        }
      }
    } else {
      if (Obj.gameBlockType.includes("quiz")) {
        // Quiz number of choices functions with the onclick event.
        if (Obj.quizQuestionAnswers[Obj.questionIndex] == 2) {
          if (Obj.gameBlockLayout == "TRUE_FALSE") {
            NC = require('./pages/question/questionSingle-page')(Obj, client, true, true)
          } else {
            NC = require('./pages/question/questionSingle-page')(Obj, client, true, false)
          }
          document.getElementById('wrapper-2').innerHTML = NC;
          /* onclick s including if is set auto answer and is set quiz id, 
          automatically call onclick with client.answer. 
          if (!client.answer) return and make the user himself select the answer. */
          let redButton = document.getElementById('red'),
            blueButton = document.getElementById('blue');

          blueButton.onclick = () => {
            Obj.answer((Obj.gameBlockLayout == "TRUE_FALSE") ? 0 : 1);
            blueButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          redButton.onclick = () => {
            Obj.answer((Obj.gameBlockLayout == "TRUE_FALSE") ? 1 : 0);
            redButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }


          if (client.choice != null) {

            setTimeout(() => {
              Obj.answer(client.choice);
              client.choice = false;
              let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
                customText: "WAITING"
              });
              document.getElementById('wrapper-2').innerHTML = NC;
            }, (settingsClass.answerDelay * 1000));
          }
        } else {
          NC = require('./pages/question/questionSingle-page')(Obj, client, false)
          document.getElementById('wrapper-2').innerHTML = NC;
          // onclick s
          let redButton = document.getElementById('red'),
            blueButton = document.getElementById('blue'),
            yellowButton = document.getElementById('yellow'),
            greenButton = document.getElementById('green');

          redButton.onclick = () => {
            Obj.answer(0);
            redButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          blueButton.onclick = () => {
            Obj.answer(1);
            blueButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          yellowButton.onclick = () => {
            Obj.answer(2);
            yellowButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          greenButton.onclick = () => {
            Obj.answer(3);
            greenButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          //* Reaches here
          if (client.choice != null) {

            setTimeout(() => {
              Obj.answer(client.choice);
              client.choice = false;
              let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
                customText: "WAITING"
              });
              document.getElementById('wrapper-2').innerHTML = NC;
            }, (settingsClass.answerDelay * 1000));
          }
        }
      } else if (Obj.gameBlockType.includes("poll")) {
        // Poll Handler with the onclick event.
        if (Obj.quizQuestionAnswers[Obj.questionIndex] == 2) {
          NC = require('./pages/question/questionSingle-page')(Obj, client, true)
          document.getElementById('wrapper-2').innerHTML = NC;
          /* onclick s only user can answer this. */
          let redButton = document.getElementById('red'),
            blueButton = document.getElementById('blue');

          redButton.onclick = () => {
            Obj.answer(0);
            redButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          blueButton.onclick = () => {
            Obj.answer(1);
            blueButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }
        } else {
          NC = require('./pages/question/questionSingle-page')(Obj, client, false)
          document.getElementById('wrapper-2').innerHTML = NC;
          // onclick s
          let redButton = document.getElementById('red'),
            blueButton = document.getElementById('blue'),
            yellowButton = document.getElementById('yellow'),
            greenButton = document.getElementById('green');

          redButton.onclick = () => {
            Obj.answer(0);
            redButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          blueButton.onclick = () => {
            Obj.answer(1);
            blueButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          yellowButton.onclick = () => {
            Obj.answer(2);
            yellowButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }

          greenButton.onclick = () => {
            Obj.answer(3);
            greenButton.onclick = null;
            let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
              customText: "WAITING"
            });
            document.getElementById('wrapper-2').innerHTML = NC;
          }
        }
      }
    }
    // let NC = require('./questionSingle-page')(Obj, client, is2)

  }

  function QuestionEnd(Obj) {
    // Things to do here...
    if (!client.joinedBeforeQuizStarts) {
      // This means that things are not initialized properly, so we initialize them.
      document.getElementById('wrapper').style.display = "none";
      let NC = require('./pages/quiz/quizLoading-page')(client.playerName);
      document.getElementById('loader').classList.add('game');
      document.getElementById('loader').classList.remove('instructions');
      document.getElementById('wrapper-2').innerHTML = NC;
      client.joinedBeforeQuizStarts = true;
    }

    if (!client.quizQuestionAnswers) return;

    client.totalScore = Obj.totalScore;
    let NC = require('./pages/question/questionEnd-page')(Obj, client);
    document.getElementById('wrapper-2').innerHTML = NC;
  }

  function QuestionReady(Obj) {
    // Things to do here...
    if (!client.joinedBeforeQuizStarts) {
      // This means that things are not initialized properly, so we initialize them.
      document.getElementById('wrapper').style.display = "none";
      let NC = require('./pages/quiz/quizLoading-page')(client.playerName);
      document.getElementById('loader').classList.add('game');
      document.getElementById('loader').classList.remove('instructions');
      document.getElementById('wrapper-2').innerHTML = NC;
      client.joinedBeforeQuizStarts = true;
    }

    // Now we are good to go.
    if (Obj.gameBlockType.includes("content")) { //*Obj.gameBlockType.includes("quiz") || Obj.gameBlockType.includes("poll")
      let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
        customText: "NOT_QUIZ"
      });
      document.getElementById('wrapper-2').innerHTML = NC;
    } else {
      client.quizQuestionAnswers = Obj.quizQuestionAnswers;
      let NC = require('./pages/question/questionPre-page')(client.playerName, client.totalScore, Obj.questionIndex, Obj.quizQuestionAnswers.length, client.Qname, {
        customText: "NORMAL"
      });
      document.getElementById('wrapper-2').innerHTML = NC;
      // if is set auto answer and is set quiz id, set client.answer with the answer.
    }
    if (settingsClass.autoAnswer) {
      client.makeChoice(Obj);
    }
  }

  function Disconnect(reason) {
    //Disconnected
    var ele = document.getElementsByClassName("inputPin")[0];
    document.getElementById('wrapper').style.display = "flex";
    document.getElementById('wrapper-2').innerHTML = "";
    document.getElementById('loader').classList.add('index');
    document.getElementById('loader').classList.remove('instructions');
    document.getElementById('loader').classList.remove('game');
    for (const e of document.getElementsByTagName('link')) {
      if (e.getAttribute('href').includes("instructions.css")) {
        e.remove();
      }
    }
    var submitBtnName = document.getElementById('submitBtnName');
    submitBtnName.setAttribute("id", "submitBtnPin");
    var submitBtnPin = document.getElementById('submitBtnPin');
    ele.setAttribute("name", "code");
    ele.removeAttribute("maxlength")
    ele.setAttribute("placeholder", "Enter Code");
    submitBtnPin.innerText = "Enter";
    ele.value = "";
    errorMessage(`Disconnected: ${reason}`)
  }

  function errorMessage(error) {
    let errorMessageDiv = document.createElement('div');
    errorMessageDiv.setAttribute('class', 'errorMessageDiv');
    let innerErrorMessage = document.createElement('div');
    innerErrorMessage.setAttribute('class', 'innerErrorMessage');
    let iconA = document.createElement('i');
    iconA.setAttribute('class', 'fa fa-2x fa-exclamation-circle errorMessageIcon')
    innerErrorMessage.appendChild(iconA);
    let errorMessage = document.createElement('div');
    errorMessage.setAttribute('class', 'errorMessage');
    errorMessage.innerHTML = error;
    errorMessage.style.marginLeft = "0.5rem"
    innerErrorMessage.appendChild(errorMessage);
    errorMessageDiv.appendChild(innerErrorMessage);
    errorMessageDiv.style.transform = "translateY(100%)";
    document.body.append(errorMessageDiv);
    setTimeout(() => errorMessageDiv.style.transform = "translateY(0)", 500);
    setTimeout(() => {
      errorMessageDiv.style.transform = "translateY(100%)";
    }, 5000);
  }
});
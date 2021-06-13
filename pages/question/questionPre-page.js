module.exports = (playerName, score, questionIndex, totalQuestions, questionName, opts) => {
  let str = `
  <link rel="stylesheet" href="./assets/css/questionPre.css" />
    <div class="header">
      <div class="headPad">
        <div class="quizProgress" id="quizProgress">${questionIndex+1} of ${totalQuestions}</div>
        `;

  if (questionName == "") {
    str += `<div class="currentQuestionType" id="currentQuestionType">Please open the settings and type either a quiz name or an id.</div>`
  } else {
    str += `<div class="currentQuestionType" id="currentQuestionType">${questionName} (Edit in settings)</div>`
  }

  if (opts.customText != "NOT_QUIZ") {
    str += `
      </div>
    </div>

    <div class="main">
      <div class="text">Question ${questionIndex+1}</div>
      <div class="parent-circle"><div class="loading-circle"></div></div>
      <div class="text2">Ready...</div>
    </div>

    <div class="footer">
      <div class="name" id="nickname">${playerName}</div>
      <div class="score" id="score">${score}</div>
    </div>
  `
  } else {
    str += `
    </div>
  </div>

  <div class="main">
    <div class="text">No need to answer.</div>
    <div class="parent-circle"><div class="loading-circle"></div></div>
    <div class="text2">Please wait...</div>
  </div>

  <div class="footer">
    <div class="name" id="nickname">${playerName}</div>
    <div class="score" id="score">${score}</div>
  </div>
`
  }

  return str;
}
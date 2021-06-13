module.exports = (Obj, client, is2) => {
  let str = "";

  str += `
    <link rel="stylesheet" href="./assets/css/questionSingle.css" />
      <div class="header">
        <div class="headPad">
          <div class="quizProgress" id="quizProgress">${Number(Obj.questionIndex)+1} of ${client.quizQuestionAnswers.length}</div>
          `;

  if (client.Qname == "") {
    str += `<div class="currentQuestionType" id="currentQuestionType">Please open the settings and type either a quiz name or an id.</div>`
  } else {
    str += `<div class="currentQuestionType" id="currentQuestionType">${client.Qname} (Edit in settings)</div>`
  }

  str += `</div></div>`;
  if (is2) {
    str += `
    <div class="main">
      <button class="blue" id="blue"><div></div></button>
      <button class="red" id="red"><div></div></button>
    </div>
    `
  } else {
    str += `
    <div class="main">
      <button class="red" id="red"><div></div></button>
      <button class="blue" id="blue"><div></div></button>
      <button class="yellow" id="yellow"><div></div></button>
      <button class="green" id="green"><div></div></button>
    </div>
    `
  }

  str += `
        <div class="footer">
        <div class="name" id="nickname">${client.playerName}</div>
        <div class="score" id="score">${client.totalScore}</div>
      </div>
        `
  return str;
}
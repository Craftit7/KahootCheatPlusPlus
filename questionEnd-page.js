module.exports = (Obj, client) => {
  let str = "";

  str += `
  <link rel="stylesheet" href="questionPre.css" />
    <div class="header">
      <div class="headPad">
        <div class="quizProgress" id="quizProgress">${Number(Obj.pointsData.lastGameBlockIndex)+1} of ${client.quizQuestionAnswers.length}</div>
        `;

  if (client.Qname == "") {
    str += `<div class="currentQuestionType" id="currentQuestionType">Please open the settings and type either a quiz name or an id.</div>`
  } else {
    str += `<div class="currentQuestionType" id="currentQuestionType">${client.Qname} (Edit in settings)</div>`
  }
  if (!Obj.isCorrect) {
    str += `</div></div>
    <div class="main">
      <div class="text">Incorrect</div>
      <div class="circleError">
        <i class="errorIcon fas fa-4x fa-times"></i>
      </div>`
  } else {
    str += `</div></div>
    <div class="main">
      <div class="text">Correct +${Obj.points} points</div>
      <div class="circleCorrect">
        <i class="errorIcon fas fa-4x fa-check"></i>
      </div>`
  }

  if (Obj.rank < 4) {
    str += `
      <div class="text2">You are on the podium.</div>
    </div>
`
  } else {
    str += `
      <div class="text2">You are the ${client.ordinal_suffix_of(Obj.rank)}, ${Obj.nemesis.totalScore - Obj.totalScore} points behind ${Obj.nemesis.name}.</div>
    </div>
`
  }
  str += `
    <div class="footer">
    <div class="name" id="nickname">${client.playerName}</div>
    <div class="score" id="score">${Obj.totalScore}</div>
  </div>
    `
  return str;
}
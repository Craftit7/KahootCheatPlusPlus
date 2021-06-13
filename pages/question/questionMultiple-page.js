module.exports = (Obj, client) => {
    let str = "";

    str += `
      <link rel="stylesheet" href="./assets/css/questionMultiple.css" />
        <div class="header">
          <div class="headPad">
            <div class="quizProgress" id="quizProgress">${Number(Obj.questionIndex)+1} of ${client.quizQuestionAnswers.length}</div>
            `;

    if (client.Qname == "") {
        str += `<div class="currentQuestionType" id="currentQuestionType">Please open the settings and type either a quiz name or an id.</div>`
    } else {
        str += `<div class="currentQuestionType" id="currentQuestionType">${client.Qname} (Edit in settings)</div>`
    }

    str += `
      </div></div>
      <form action="#" method="GET" id="formElementMultiQuestion">
      <div class="main">
        <label for="red-input" class="red">
          <span></span>
          <div></div>
        </label>
        <input
          type="checkbox"
          class="red-input"
          id="red-input"
          name="red-input"
        />

        <label class="blue" for="blue-input">
          <span></span>
          <div></div>
        </label>
        <input
          type="checkbox"
          class="blue-input"
          id="blue-input"
          name="blue-input"
        />
        <label class="yellow" for="yellow-input">
          <span></span>
          <div></div>
        </label>
        <input
          type="checkbox"
          class="yellow-input"
          id="yellow-input"
          name="yellow-input"
        />
        <label class="green" for="green-input">
          <span></span>
          <div></div>
        </label>
        <input
          type="checkbox"
          class="green-input"
          id="green-input"
          name="green-input"
        />
      </div>
      <button type="submit" class="submitBut" id="formSubmitButton">Submit</button>
    </form>
      `

    str += `
          <div class="footer">
          <div class="name" id="nickname">${client.playerName}</div>
          <div class="score" id="score">${client.totalScore}</div>
        </div>
          `
    return str;
}
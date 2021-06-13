module.exports = (playerName) => {
  return `


<link rel="stylesheet" href="./assets/css/instructions.css" />
<div class="main">
  <h1>You're in!</h1>
  <p>See your nickname on the screen?</p>
</div>
<div class="footer">
  <div class="name" id="nickname">${playerName}</div>
</div>


`
}
module.exports = (rank, client) => {
    let str = "";

    str += `<link rel="stylesheet" type="text/css" href="./assets/css/quizEnd.css">`

    if (rank <= 3) {
        if (rank == 1) str += `<div class="medal gold"></div>`;
        if (rank == 2) str += `<div class="medal silver"></div>`;
        if (rank == 3) str += `<div class="medal bronze"></div>`;
        str += `<p class="p1">You are the ${client.ordinal_suffix_of(rank)}</p>`
        str += `<p class="p2">#${rank}</p>`
    } else {
        str += `<p class="p1">Awesome Effort!</p>`
        str += `<p class="p2">#${rank}</p>`
    }
    str += `
          <div class="footer">
          <div class="name" id="nickname">${client.playerName}</div>
          <div class="score" id="score">${client.totalScore}</div>
        </div>
          `

    return str;
}
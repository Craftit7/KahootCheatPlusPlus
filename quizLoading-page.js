module.exports = (nickname) => {
    return `
    <div class="main">
      <div class="text">Get Ready!</div>
      <div class="parent-circle"><div class="loading-circle"></div></div>
      <div class="text2">Loading...</div>
    </div>

    <div class="footer">
      <div class="name" id="nickname">${nickname}</div>
      <div class="score" id="score">0</div>
    </div>

    <style type="text/css">
      .score {
        overflow: hidden;
        min-width: 5rem;
        padding: 0px 0.75rem;
        background: rgb(51, 51, 51);
        border-radius: 0.1875rem;
        font-size: 1.25rem;
        line-height: 1.875;
        text-align: center;
        color: rgb(255, 255, 255);
        margin: 0px 0.625rem;
      }

      .text,
      .text2 {
        font-family: Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: rgb(255, 255, 255);
      }

      .text {
        font-size: 4rem;
      }

      .text2 {
        font-size: 2rem;
      }

      body {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      .parent-circle {
        width: 72px;
        height: 72px;
        flex: 0 1 auto;
        flex-direction: row;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        animation: 0.9s ease-out 0s infinite normal none running fJiXoE; /* 0.6 */
        transition: all 0.6s ease;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 1rem;
      }

      .loading-circle {
        border: 20px solid rgb(255, 255, 255);
        width: 72px;
        height: 36px;
        border-top-left-radius: 100px;
        border-top-right-radius: 100px;
        border-bottom: 0;

        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }

      .name {
        margin: 0px 0.625rem;
        font-size: 1.25rem;
        line-height: 1.875;
        margin: 0px 0.625rem;
      }

      .footer {
        display: flex;
        align-self: stretch;
        left: 0px;
        right: 0px;
        bottom: 0px;
        box-shadow: rgb(0 0 0 / 10%) 0px -2px 10px 0px;
        min-height: 60px;
        padding: 4px 16px;
        font-size: 40px;
        flex: 0 1 auto;
        flex-direction: row;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        justify-content: space-between;
        position: absolute;
        background-color: rgb(255, 255, 255);
        font-family: Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        color: rgb(0, 0, 0);
        bottom: 0;
      }
    </style>
    
    `
}
<script>
  import { push, location } from "svelte-spa-router";
  import moment from "moment";
  import Utils from "../Utils.js";

  let originAddr = Utils.GetServerAdress();
  let article = $location.slice($location.indexOf("=") + 1, $location.length);

  $: display = "default display";
  $: title = "loading...";
  let newComment = {
    userName: "פלוני",
    text: "דעתי המשמעותית בנוגע לעניינים שאיני מבין בהם",
    article
  };
  $: comments = [];

  function SubmitComment() {
    fetch(originAddr + "/postComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment)
    })
      .then(dat => {
        comments = [newComment, ...comments];
        newComment = {
          userName: "סתם מישהו",
          text: "דעתי החשובה מאוד באשר לאיש הסגול",
          article
        };
      })
      .then(dat => {})
      .catch(err => {
        alert(err);
      });
  }

  async function GetComments() {
    return fetch(originAddr + "/comments?article=" + article)
      .then(dat => {
        console.log(dat);
        return dat.json();
      })
      .then(dat => {
        comments = dat;
      })
      .catch(err => {
        alert(err);
      });
  }

  function GetArticle() {
    return fetch(originAddr + "/article?num=" + article)
      .then(dat => {
        return dat.json();
      })
      .then(dat => {
        if (dat.text == "404") {
          throw new Error("404 - article not found!");
        }
        GetComments();
        title = dat.title;
        return dat;
      })
      .catch(err => {
        alert(err);
        window.location.href = Utils.GetServerAdress();
      });
  }

  export let title;
</script>

<style>
  main {
    overflow: auto;
    max-height: 80vh;
  }
  .title-div {
    position: relative;
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 1em;
    padding: 0;
    color: white;
    background: #ff6d6d;
    padding: 1em;
    margin-top: 0;
  }
  .back-span {
    cursor: pointer;
    text-align: left;
    margin: 0;
    font-size: 1.5em;
    position: absolute;
    z-index: 3;
    left: 0px;
    top: 0;
  }
  .article-body {
    background: white;
    padding: 2em;
    text-align: right;
    margin: auto;
    transition: ease 0.4s all;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .article-body:hover {
    box-shadow: 0 -6px 47px -34px #1da1f2, 0 6px 47px -34px #f44336;
  }

  @media screen and (max-width: 700px) {
    .article-body {
      width: 95%;
      overflow: auto;
      margin: 0;
      padding: 1vh;
      box-shadow: none;
      margin: auto;
    }
    .title-div {
      font-size: 1.1em;
      padding: 3px;
    }
  }
  .lds-ripple {
    width: 100px;
    height: 100px;
    margin: auto;
    position: relative;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid rgb(223, 44, 44);
    opacity: 1;
    text-align: center;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  .comment-userName-span {
    color: red;
    text-align: center;
    display: inline;
  }
  .comment-list-ol {
    text-align: center;
    padding: 0;
    overflow: auto;
    margin-bottom: 1em;
  }
  .comment-list-ol > li {
    max-width: 500px;
    text-align: center;
    display: block;
    box-shadow: -1px 0px 20px -17px;
    padding: 0.3em;
    margin: 1em auto;
  }
  .newCommentDiv {
    display: flex;
    flex-direction: column;
    width: 30%;
    justify-content: space-evenly;
    padding: 1em;
    margin: 1em auto;
    max-width: 500px;
    border-radius: 0.2em;
    background: #91a7a71f;
    border: 1px solid black;
    box-shadow: -1px 0px 20px -17px;
  }
  .newCommentDiv > textarea {
    resize: none;
    height: 5em;
    font-size: 0.9em;
    border: none;
  }
  .newCommentDiv > input {
    width: 10em;
    margin: 0.5em auto;
    border: none;
  }
  .newCommentDiv > button {
    cursor: pointer;
    width: 40%;
    margin: auto;
    background: none;
    font-weight: bold;
    box-sizing: border-box;
    color: rgb(0, 192, 0);
    border: solid 2px rgb(2, 112, 16);
    border-radius: 3px;
    transition: ease 0.4s all;
  }
  .newCommentDiv > button:hover {
    border: solid 2px rgb(60, 202, 79);
    background: rgba(60, 202, 79, 0.2);
  }
  .subTitle-p {
    text-align: right;
    margin: 1em;
    color: grey;
  }
  .start-section {
    text-align: right;
    background: #f3f3f3;
    padding: 0.2em;
    border: 1px solid #b9b9b9;
    border-radius: 4px;
  }
  .start-section time {
    display: inline-block;
  }
  .socialBar-div {
    position: fixed;
    top: calc(75vh - 4em);
    left: 0;
    display: flex;
    flex-direction: row;
    margin: 1em;
    flex-direction: column;
    transition: all ease 0.4s;
    border-radius: 30px;
    background: #f7f7f7;
    box-shadow: 0px 0px 0px 2px #c9ebff;
  }
  .socialBar-div:hover {
    box-shadow: 0px 0px 0px 2px #c9ebff, 0px 0px 0px 5px #60baee79;
  }
  .socialBar-div button {
    border: none;
    background-repeat: no-repeat;
    background-size: 2em;
    width: 3em;
    height: 3em;
    z-index: 2;
    border-radius: 30px;
    background-position: center;
    cursor: pointer !important;
    background-color: inherit;
  }
  .get-zucced-button {
    background-image: url(https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png);
  }

  .twitter-button {
    background-image: url(https://upload.wikimedia.org/wikipedia/he/thumb/a/a3/Twitter_bird_logo.svg/1259px-Twitter_bird_logo.svg.png);
  }
  .whatsapp-button-get-zucced-again {
    background-image: url(https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo-whatsapp-512.png);
  }
  @media screen and (max-width: 600px) {
    * {
      overflow-x: hidden;
      scroll-behavior: smooth;
      overflow-y: none;
    }

    .socialBar-div {
      bottom: 0;
      width: 100vw;
      height: 3.5em;
      left: 0;
      margin-bottom: 3.5em;
      justify-content: center;
      padding: 0;
      position: sticky;
      box-shadow: none;
      border: none;
      border-radius: 0px;
      background: #c9ebff;
      flex-direction: row;
    }

    main {
      max-height: 75vh;
    }
    .start-section {
      margin: 0;
      padding: 0;
    }
    .subTitle-p {
      margin: 1vh;
      padding: 0;
    }
    .comment-list-ol {
      margin-bottom: 0;
    }
    .newCommentDiv {
      padding: 1vh;
      width: 90%;
    }
  }
  @media screen and (max-height: 600px) {
  }
  @keyframes lds-ripple {
    0% {
      top: 36px;
      left: 36px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 72px;
      height: 72px;
      opacity: 0;
    }
  }
</style>

<div>
  <span
    class="back-span"
    on:click={() => {
      push('/');
    }}>
    🔙
  </span>
</div>
<main>
  <h2 class="title-div">{title}</h2>

  {#await GetArticle()}
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  {:then article}
    <div class="start-section">
      <time>{moment(article.time).format('DD/MM/YYYY [בשעה] HH:MM')}</time>
      <div class="author-p">
        {article.author.firstName + ' ' + article.author.lastName}
      </div>
    </div>

    <article>
      <p class="subTitle-p">{article.subTitle}</p>

      <div class="article-body">
        {@html article.text}
      </div>
    </article>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}

  <div class="newCommentDiv">
    <input type="text" bind:value={newComment.userName} />
    <textarea
      bind:value={newComment.text}
      on:keypress={event => {
        if (event.key == 'enter') {
          SubmitComment();
        }
      }} />
    <button on:click={SubmitComment}>פרסם</button>
  </div>
  <ol class="comment-list-ol">
    {#each comments as comment (comment.userName)}
      <li>
        <span class="comment-userName-span">{comment.userName}</span>
        <p>{comment.text}</p>
      </li>
    {/each}
  </ol>

</main>
<div class="socialBar-div">

  <a
    target="_blank"
    href="https://twitter.com/intent/tweet?url={encodeURIComponent(window.location.href)}"
    rel="nofollow noreferrer">
    <button class="twitter-button" />
  </a>

  <a
    class="share-btn"
    rel="nofollow noreferrer"
    target="_blank"
    href="https://www.facebook.com/sharer/sharer.php?app_id=491062121550142&sdk=joey&u={window.location.href}&display=popup&ref=plugin&src=share_button">
    <button
      class="get-zucced-button"
      on:click={() => {
        return !window.open(this.href, 'Facebook', 'width=640,height=580');
      }} />
  </a>

  <a
    target="_blank"
    href="https://api.whatsapp.com/send?text=%20{encodeURIComponent(window.location.href)}"
    rel="nofollow noreferrer">
    <button class="whatsapp-button-get-zucced-again" />
  </a>

</div>

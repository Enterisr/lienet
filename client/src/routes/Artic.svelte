<script>
  import { push, location } from "svelte-spa-router";
  import moment from "moment";
  let originAddr = GetServerAdress();
  let article = parseInt($location.slice(1));
  $: display = "default display";
  $: title = "loading...";
  let newComment = {
    userName: "פלוני",
    text: "דעתי המשמעותית בנוגע לעניינים שאיני מבין בהם",
    article
  };
  $: comments = [];

  function GetServerAdress() {
    if (window.location.href.includes("localhost")) {
      const uri = new URL(window.location.href);
      uri.port = "6969";
      return uri.origin;
    } else {
      return document.location.origin;
    }
  }
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

  async function GetArticle() {
    return fetch(originAddr + "/article?num=" + article)
      .then(dat => {
        console.log(dat);
        return dat.json();
      })
      .then(dat => {
        GetComments();
        title = dat.title;
        console.log(dat);
        return dat;
      })
      .catch(err => {
        alert(err);
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
    padding: 1em;
    text-align: center;
    margin: auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  @media screen and (max-width: 700px) {
    .article-body {
      min-width: 100%;
      overflow: auto;
      max-height: 70vh;
      margin: 0;
      padding: 0;
    }
    .title-div {
      font-size: 1.2em;
      padding: 3px;
      max-height: 1.2em;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      white-space: nowrap;
    }
  }
  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
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
    margin-bottom: 3em;
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
    width: 60%;
    justify-content: space-evenly;
    padding: 1em;
    margin: 1em auto;
    max-width: 500px;
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
  <h2 class="title-div">{title}</h2>
</div>
<main>
  {#await GetArticle()}
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  {:then article}
    <div class="start-section">
      <time>{moment(article.time).format('DD/MM/YYYY [בשעה] HH:MM')}</time>
      <div class="author-p">{article.author}</div>
    </div>

    <article>
      <p class="subTitle-p">{article.subTitle}</p>

      <div class="article-body">{article.text}</div>
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

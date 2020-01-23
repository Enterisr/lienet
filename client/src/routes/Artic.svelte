<script>
  import { push, location } from "svelte-spa-router";
  let originAddr = document.location.origin;
  let fetchAll = GetData;

  $: display = "default display";
  $: title = "loading...";
  $: comments = [];
  let newComment = {
    userName: "סתם מישהו",
    text: "דעתי החשובה מאוד באשר לאיש הסגול",
    article: parseInt($location.slice(1))
  };

  function SubmitComment() {
    fetch(originAddr + "/postComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment)
    })
      .then(dat => {
        fetchAll = GetData;
      })
      .then(dat => {})
      .catch(err => {
        alert(err);
      });
  }
  async function GetData() {
    let article = $location.slice(1);
    if (!isNaN(article)) {
      if (window.location.href.includes("localhost")) {
        const uri = new URL(window.location.href);
        uri.port = "6969";

        originAddr = uri.origin;
      }
    }
    const data = await Promise.all([
      GetArticle(originAddr, article),
      GetComments(originAddr, article)
    ]);
    let articleAndComments = { article: data[0], comments: data[1] };
    console.log(articleAndComments);
    return articleAndComments;
  }
  async function GetComments(originAddr, article) {
    return fetch(originAddr + "/comments?article=" + article)
      .then(dat => {
        console.log(dat);
        return dat.json();
      })
      .then(dat => {
        return dat;
      })
      .catch(err => {
        alert(err);
      });
  }

  async function GetArticle(originAddr, article) {
    return fetch(originAddr + "/connect?num=" + article)
      .then(dat => {
        console.log(dat);
        return dat.json();
      })
      .then(dat => {
        title = dat.title;
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
    text-align: center;
  }
  .title-div {
    position: relative;
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 1em;
    padding: 0;
  }
  .back-span {
    cursor: pointer;
    text-align: left;
    margin: 0;
    font-size: 1.5em;
    display: block;
  }
  .article-body {
    background: white;
    padding: 5vh;

    text-align: center;
    margin: auto;
  }
  @media screen and (max-width: 700px) {
    .article-body {
      min-width: 100%;
      overflow: auto;
      max-height: 70vh;
      margin: 0;
      padding: 0;
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

{#await fetchAll()}
  <div class="lds-ripple">
    <div />
    <div />
  </div>
{:then data}
  <main>
    <article>
      <div class="article-body">{data.article.text}</div>
    </article>
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
      {#each data.comments as comment (comment.userName)}
        <li>
          <span class="comment-userName-span">{comment.userName}</span>
          <p>{comment.text}</p>
        </li>
      {/each}
    </ol>
  </main>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

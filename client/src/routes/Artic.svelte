<script>
  import { push, location } from "svelte-spa-router";
  $: display = "default display";
  $: title = "loading...";
  let comments = [];
  async function GetData(){
    let originAddr = document.location.origin;
    let article = $location.slice(1);
    if (!isNaN(article)) {
      
      if (window.location.href.includes("localhost")) {
        const uri = new URL(window.location.href);
        uri.port = "6969";

        originAddr = uri.origin;
      }
    }
    const data =  await Promise.all([GetArticle(originAddr,article),GetComments(originAddr,article)]);
    let articleAndComments = {article:data[0],comments:data[1]};
    console.log(articleAndComments);
    return articleAndComments;
  }
  async function GetComments(originAddr,article){
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
  
  async function GetArticle(originAddr,article) {
 
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
    padding: 4vh;
    overflow: auto;
    max-height: 70vh;
   
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
  .zucced-button{
    background-color: #3c579e;
    background-repeat: no-repeat;
    background-size: contain;
    color: White;
    border-radius: 30px;
    margin: 1em;
    padding-left: 2em;
    transition: ease .3s all;
    cursor: pointer;
    background-image: url('https://i.ya-webdesign.com/images/facebook-icon-png-circle-4.png');
  }
  .zucced-button:hover{
    box-shadow: 0px 0px 3px 3px #a0bbff;
    
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

  {#await GetData()}
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  {:then data}
<article>
    <div class="article-body">{data.article.text}</div>
    </article>
    <ol>
    {#each data.comments as comment(comment.id)}
      <li>
      <span>{comment.userName}</span>
      <p>{comment.text}</p>
      </li>>
      {/each}
      </ol>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}


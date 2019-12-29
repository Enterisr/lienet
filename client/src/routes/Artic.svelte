<script>
  import { push, location } from "svelte-spa-router";
  $: display = "default display";
  $: title = "loading...";
  console.log($location);
  let article = $location.slice(1);
  if (!isNaN(article)) {
    let originAddr = document.location.origin;
    if (window.location.href.includes("localhost")) {
      const uri = new URL(window.location.href);
      uri.port = "6969";
      urlAddr = uri;
      originAddr = urlAddr.origin;
    }
    fetch(originAddr + "/connect?num=" + article)
      .then(dat => {
        console.log(dat);
        return dat.json();
      })
      .then(dat => {
        display = dat.text;
        title = dat.title;
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
    max-width: 39vw;
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
<article>
  <div class="article-body">{display}</div>
</article>

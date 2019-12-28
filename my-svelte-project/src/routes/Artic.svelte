<script>
  import { push, location } from "svelte-spa-router";
  $: display = "default display";
  $: title = "loading...";
  console.log($location);
  let article = $location.slice(1);
  if (!isNaN(article)) {
    let urlAddr = document.location.origin;
    if (window.location.href.includes("localhost")) {
      const uri = new URL(window.location.href);
      uri.port = "6969";
      urlAddr = uri;
    }
    fetch(urlAddr.origin + "/connect?num=" + article)
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
    margin: 0;
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
    padding: 10px;
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

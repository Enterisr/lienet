<script>
  import routes from "./routes";

  import Router from "svelte-spa-router";
  function OpenMail() {}
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Tinos&display=swap");
  .wrapper {
    background: rgb(248, 247, 247);
    padding: 1em;
    height: 100%;
    max-width: 70vw;
    text-align: center;
    margin: 0;
    overflow: hidden;
    padding: 1em;
    margin: auto;
  }
  .yellowMail {
    background: yellow;

    cursor: pointer;
    position: fixed;
    top: calc(100% - 2em);
    left: 0em;
    font-size: 1em;
  }

  @keyframes adMatay {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
  .router-wrap {
    background: rgb(241, 238, 231);
    height: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.32), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
  header {
    height: 10vh;
    overflow: hidden;
    margin: 0;
  }
  header > h3 {
    color: black;
    max-height: 10vh;
    font-family: "Tinos", serif;
  }
  h3 > img {
    height: 6vh;
  }

  @media screen and (max-width: 600px) {
    .wrapper {
      max-width: 100vw;
      margin: 0;
      padding: 0;
      max-height: none;
    }
    .yellowMail {
      display: none;
    }
  }
</style>

<div class="wrapper">
  <header>
    <h3>
      <img alt="logo" src="././logo_transparent.png" />
      <span>האמת. בלי בולשיט.</span>

    </h3>
  </header>
  <button
    onclick={() => {
      window.location.href = 'mailto:yourmom@ismy.babe?subject= יש לי חדשות לא מעניינות בשבילכם&body=אהמ אהמ';
    }}
    title="רק כתבות בעלות אפס תועלת לציבור בבקשה!!!"
    class="yellowMail">
    המייל הצהוב!
  </button>
  <div class="router-wrap">

    <Router {routes} />
  </div>
</div>

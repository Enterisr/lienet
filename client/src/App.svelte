<script>
  import routes from "./routes";
  import Router from "svelte-spa-router";
  import {
    link,
    push,
    pop,
    replace,
    location,
    querystring
  } from "svelte-spa-router";
  import Modal from "svelte-simple-modal";
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";

  import SignIn from "./routes/SignIn.svelte";
  let toShowSignInModal = false;
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Tinos&display=swap");
  .wrapper {
    padding: 1em;
    height: 100%;
    max-width: 70vw;
    margin: 0;
    background: rgb(250, 252, 252);
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
    height: 85vh;
    overflow: auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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
  .site-nav {
    background: rgb(255, 255, 255);
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
    font-size: 1.1em;
  }
  .site-nav a {
    text-decoration: none;
    color: red;
  }
  .site-nav a:hover {
    font-weight: bold;
  }
  a::before {
    content: "|";
  }
  .modal-background {
    background-color: rgba(111, 111, 111, 0.38);
    width: 100vw;
    height: 100vh;
    z-index: 4;
    top: 0;
    left: 0;
    position: absolute;
    justify-items: center;
  }
  .blur {
    filter: blur(6px);
  }
  .popup {
    background: white;
    border: solid black 3px;
    border-radius: 30px;
    width: 400px;
    margin: auto;
    top: 40%;
    position: relative;
    transform: translateY(-50%);
  }
  .popup-exit-button {
    background: none;
    color: red;
    position: absolute;
    cursor: pointer;
    font-weight: 500;
    margin: 0px;
    padding: 0;
    top: 5px;
    width: 1em;
    right: 10px;
    font-size: 1em;
    height: 1em;
    line-height: 0;
    border: none;
    font-family: cursive;
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
    header {
      height: fit-content;
    }
    nav {
      margin: 1vh;
    }
    h3 {
      margin: 0;
    }
    .popup {
      width: 95%;
    }
  }
</style>

<nav class="site-nav">
  <a href="/" use:link>דף הבית</a>
  <a href="/privacy" use:link>פרטיות</a>
  <a href="/about" use:link>אודות</a>
  <a
    on:click={() => {
      toShowSignInModal = true;
    }}
    href="/#">
    כניסת כתבים
  </a>

</nav>

<div class={toShowSignInModal ? 'wrapper blur' : 'wrapper'}>

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
{#if toShowSignInModal}
  <div transition:fly={{ duration: 300 }} class="modal-background">
    <div transition:fly={{ y: 200, duration: 300 }} class="popup">
      <button
        class="popup-exit-button"
        on:click={() => {
          toShowSignInModal = false;
        }}>
        x
      </button>
      <SignIn
        CloseModal={() => {
          toShowSignInModal = false;
        }}
        isRegister={false} />

    </div>
  </div>
{/if}

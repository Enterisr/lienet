<script>
  import routes from "../routes";

  import Router from "svelte-spa-router";
  import {
    link,
    push,
    pop,
    replace,
    location,
    querystring
  } from "svelte-spa-router";
  $: artics = [];
  GetTitles();

  async function GetTitles() {
    let urlAddr = document.location.origin;
    if (window.location.href.includes("localhost")) {
      const uri = new URL(window.location.origin);
      uri.port = "6969";
      urlAddr = uri;
      urlAddr += "titles";
    } else {
      urlAddr += "/titles";
    }
    const res = await fetch(urlAddr);
    console.log(res);
    const resJasoned = await res.json();
    console.log(resJasoned);
    if (resJasoned) {
      artics = resJasoned;
    } else {
      throw new Error(resJasoned);
    }
  }
  function GenerateRandomNumber() {
    return Math.floor(Math.random() * 100 + 1);
  }
</script>

<style>
  ul {
    list-style: none;
    text-align: center;
    padding: 0;
    margin: 0 auto;
    max-width: 50vw;
    overflow: auto;

    border-radius: 0px 1em 1em 0em;
  }
  li {
    padding: 2em;
    font-size: 1em;
    margin: 1em;
    box-shadow: 0px 0px 8px -5px rgb(32, 121, 255);
    height: 10vh;
    background-color: rgba(153, 153, 153, 0.76);
    color: black !important;
    position: relative;
    overflow: hidden;
    transition: 0.5s ease all;
    box-sizing: border-box;
  }
  li:first-child {
    font-size: 2rem;
    padding: 1.4em;
    margin-bottom: 1em;
  }
  li:first-child img {
    border-radius: 0;
  }

  li:nth-child(even) {
    background: rgb(85, 85, 255);
  }
  li:nth-child(odd) {
    background: rgb(255, 0, 0);
  }

  li > .img-div > img {
    border-radius: 30px;
    position: absolute;
    /* margin: auto; */
    height: 3em;
    transform: translateY(-50%);
    top: 50%;
    width: 3em;
  }
  li > .img-div {
    color: black;
    /* left: 0; */
    text-overflow: ellipsis;
    overflow: visible;
    max-width: calc(100% - 1.5em);
    position: relative;
    text-align: left;
    height: 100%;
  }
  .title-div {
    max-width: 70%;
    position: absolute;
    text-align: right;
    transform: translateY(-50%);
    top: 50%;
  }

  .title-span {
    cursor: pointer;
    color: white;
    text-decoration: blink;
    right: 0;
    position: relative;
    display: block;
  }
  li:hover {
    box-shadow: 0px 0px 10px 3px rgb(255, 126, 126);
  }
  @media screen and (max-width: 600px) {
    ul {
      max-height: none;
      padding: 0;
      margin: 0;
      max-width: none;
    }
  }
</style>

<ul>
  {#each artics as artic (artic.id)}
    <li>

      <div class="img-div">

        <img
          src="https://source.unsplash.com/{GenerateRandomNumber()}x{GenerateRandomNumber()}/?politics,israel,holystate,netanyahu,usa,street,trump"
          alt="איש סגול רע" />
      </div>
      <div class="title-div">
        <span
          class="title-span"
          href={'gref'}
          on:click={() => push('/article=' + artic.id)}
          title={artic.title}>
          {artic.title}
        </span>
      </div>
    </li>
  {/each}
</ul>

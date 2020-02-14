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
    //let the api think this is not scraping..
    return Math.floor(Math.random() * 500 + 200);
  }
  function ChoosePohtoForArticle(photoUrl) {
    if (photoUrl) {
      return photoUrl;
    } else {
      return (
        `https://source.unsplash.com/${GenerateRandomNumber()}` +
        `x` +
        `${GenerateRandomNumber()}/?politics,israel,holystate,netanyahu,usa,street,trump`
      );
    }
  }
</script>

<style>
  ul {
    list-style: none;
    text-align: center;
    padding: 0;
    margin: 0 auto;
    max-width: 45vw;
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

    position: relative;
    overflow: hidden;
    transition: 0.5s ease all;
    box-sizing: border-box;
  }
  li:first-child {
    font-size: 1.5em;
    width: 75%;
    margin-bottom: 1em;
    background: inherit;
    margin: 1em auto;
    padding-left: 0;
    height: 25vh;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border: solid 3px #b1b1b1;
    border-radius: 10px;
  }
  li:first-child .img-div {
    max-width: none;
    left: 0;
  }

  li:first-child span {
    color: rgb(44, 44, 44);
  }
  li:first-child span:hover {
    color: rgb(0, 0, 0);
  }
  li:first-child img {
    border-radius: 0;
    border-radius: 0;
    height: 10em;
    width: 10em;
    left: 0;
  }

  li:nth-child(even) {
    background: rgb(43, 43, 243);
  }
  li:nth-child(even):hover {
    box-shadow: 0px 0px 10px 3px rgb(126, 156, 255);
  }
  li:nth-child(2n + 3) {
    background: rgb(255, 0, 0);
  }
  li:nth-child(2n + 3):hover {
    box-shadow: 0px 0px 10px 3px rgb(255, 126, 126);
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

  @media screen and (max-width: 600px) {
    ul {
      max-height: 80vh;
      padding: 0;
      margin: 0;
      max-width: none;
      border-radius: 0;
    }
    li:first-child {
      font-size: 1.5em;
      width: 100%;
      margin: 0;
      box-shadow: none;
      padding: 0;
      border: none;
      border-radius: 10px;
    }
    li:first-child .title-div {
      width: 100%;
      text-align: unset;
      margin: 0;
      position: relative;
      top: 0;
      height: 50%;
      display: inline-block;
    }
    li:first-child .img-div {
      height: calc(100% - 2em);
    }

    li:first-child span {
      width: 100%;
      top: 50%;
    }
    li:first-child img {
      border-radius: 0;
      position: relative;
      width: 100%;
      height: 100%;
      left: 0;
    }
  }
</style>

<ul>

  {#each artics as artic, i}
    <li>

      <div class="img-div">

        <img src={ChoosePohtoForArticle(artic.photoUrl)} alt="איש סגול רע" />
        {@debug artic}
      </div>
      <div class="title-div">
        <span
          class="title-span"
          href={'...'}
          on:click={() => push('/article=' + artic.id)}
          title={artic.title}>
          {artic.title}
        </span>
      </div>
    </li>
  {/each}
</ul>

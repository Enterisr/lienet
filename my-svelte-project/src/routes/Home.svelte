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
  /*const artics = [
    { name: "ביבי בייץ אותי", id: 0 },
    { name: "ביבי עשה מרק קטשופ בבית קפה ולא נתן טיפ למלצרית", id: 1 },
    { name: "ביבי שפך את החלב ובכה", id: 2 },
    { name: "ביבי אמר לבנט שההשתלת שיער שלו נראית כמו דשא סיתנטי", id: 3 },
    { name: "נתניהו שאל בחורה מה השעה בשביל להתחיל איתה", id: 4 },
    { name: " ביבי חטף מילד אמיתי סוכריה!", id: 5 },

  ];*/
  async function GetTitles() {
    let urlAddr = document.location.origin;
    if (window.location.href.includes("localhost")) {
      const uri = new URL(window.location.origin);
      uri.port = "6969";
      urlAddr = uri;
    }
    const res = await fetch(urlAddr + "titles");
    console.log(res);
    const resJasoned = await res.json();
    console.log(resJasoned);
    if (resJasoned) {
      artics = resJasoned;
    } else {
      throw new Error(resJasoned);
    }
  }
</script>

<style>
  ul {
    list-style: none;
    text-align: center;
    padding: 0;
    margin: 0;
    max-height: 70vh;
    overflow: auto;
    border-radius: 0px 1em 1em 0em;
  }
  li {
    padding: 2em;
    font-size: 1em;
    margin: 1em;
    box-shadow: 0px 0px 8px -5px rgb(32, 121, 255);
    background-color: rgba(153, 153, 153, 0.76);
    color: black !important;
    transition: 0.5s ease all;
  }
  li:nth-child(odd) {
    background: rgb(85, 85, 255);
  }
  li:nth-child(even) {
    background: rgb(255, 0, 0);
  }
  li > .img-div > img {
    border-radius: 30px;
    position: absolute;
  }
  li > .img-div {
    color: black;
    left: 0;
    margin: -25px 0;
    text-overflow: ellipsis;
    overflow: visible;
    text-align: left;
    max-width: calc(100% - 29px);
    position: relative;
  }
  .a-div {
    max-height: 1em;
    max-width: 79%;
    position: relative;
  }

  a {
    cursor: pointer;
    color: white;
    text-decoration: blink;
  }
  li:hover {
    box-shadow: 0px 0px 10px 3px rgb(255, 126, 126);
  }
</style>

<ul>
  {#each artics as artic (artic.id)}
    <li>
      <div class="img-div">
        <img src="https://picsum.photos/55" alt="איש סגול רע" />
      </div>
      <div class="a-div">
        <a href={'#/' + artic.id} title={artic.title}>{artic.title}</a>
      </div>

    </li>
  {/each}
</ul>

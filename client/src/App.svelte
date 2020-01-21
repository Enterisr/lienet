<script>
  import routes from "./routes";

  import Router from "svelte-spa-router";
  function OpenMail(){

  }
</script>

<style>
  .wrapper {
    background: linear-gradient(#fafafadc, #51a9c4);
    padding: 1em;
    height: 100%;
    max-width: 70vw;
    text-align: center;
    margin: 0;
    overflow: hidden;
    padding: 1em;
    margin: auto;
  }
  .yellowMail{
    background:yellow;
    
    cursor: pointer;
    position: fixed;
    top: calc(100% - 2em);
    left: 0em;
    font-size: 1em;
  }
  
  @keyframes adMatay{
    0%{
      transform: rotateZ(0deg);
    }
    100%{
      transform: rotateZ(360deg);
    }
  }
  .router-wrap {
    background: rgb(241, 238, 231);

    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.32), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
  h1 {
    font-size: 2em;
    background: rgba(229, 255, 0, 0.644);
    color: rgb(0, 195, 255);
    box-shadow: 10px 10px 52px 3px rgba(18, 102, 180, 0.158);
  }
  @media screen and (max-width: 600px) {
    .wrapper {
      max-width: 100vw;
    }
    .yellowMail{
      display: none;
    }
  }
</style>

<div class="wrapper">
  <h1>Lienet - עלילות הביבס בארץ הקודש</h1>
  <button  onclick={()=>{   window.location.href = "mailto:yourmom@ismy.babe?subject= יש לי חדשות לא מעניינות בשבילכם&body=אהמ אהמ";} } title = "רק כתבות בעלות אפס תועלת לציבור בבקשה!!!" class="yellowMail">המייל הצהוב!</button>
  <div class="router-wrap">
  
    <Router {routes} />
  </div>
</div>

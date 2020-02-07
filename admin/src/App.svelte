<script>
  $: user = {};
  import MediumEditor from "medium-editor";
  import { onMount } from "svelte";
  import moment from "moment";
  import MediumEditorColorPickerButtons from "medium-editor-colorpicker-buttons";
  let editor;
  $: isGotAnswer = false;
  let articleScheme = {title:'',date: moment(),subTitle:'',text:''}
  // Add it to the Statamic object.
  onMount(async () => {
    user = await getAuthorDetials();
    isGotAnswer = true;
    const colorPlugin = MediumEditorColorPickerButtons.get(MediumEditor);
    const TextColorButtonClass = colorPlugin.TextColorButtonClass;
    editor = new MediumEditor(".editor", {
      toolbar: {
        buttons: [
          "bold",
          "italic",
          "underline",
          "anchor",
          "h2",
          "h3",
          "textcolor"
        ]
      },
      /*textcolor?: {
        colors?: Array<string>;
        moreColorText?: string;
        pickerCloseTimeout?: number;
    },*/
      extensions: {
        textcolor: new TextColorButtonClass()
      }
    });
  });
  function getAuthorDetials() {
    return fetch("/adminDetails", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(res => {
      
      return res.json();
    }).then(aut=>{
      articleScheme.author = aut;
      return aut;
    });
  }
  function SubmitArticle() {
  articleScheme.text = editor.getContent();
   fetch("/postArticle", {
      method: "POST",
      headers:
       { "Content-Type": "application/json" },
           body: JSON.stringify(articleScheme)
    }).then(res => {
      return res.json();
    });
  }
  setInterval(() => {
    articleScheme.date = articleScheme.date.add("1", "second");
  }, 1000);
</script>

<style>
  main {
    text-align: center;
    padding: 1em;

    margin: 0 auto;
  }

  h1 {
    color: #ff0800;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  .editor {
    height: 40vh;
    text-align: right;
    padding: 1em;
    margin: 2em 10vh;
    background: rgb(251, 251, 251);
    box-shadow: 0px 0px 60px -36px rgb(145, 145, 145),
      0px 0px 60px -36px rgb(145, 145, 145);
    border-radius: 0.4em;
    transition: ease all 0.4s;
  }
  .editor:focus {
    box-shadow: 0px 0px 0px 2px rgba(163, 221, 255, 1),
      0px 0px 0px 6px rgba(163, 221, 255, 0.397);
    outline: none;
  }
  .titles-div {
    display: flex;
    flex-direction: column;
    width: 27em;
    justify-content: center;
    text-align: center;
    margin: 1em auto;
  }
  .titles-div input {
    display: block;
  }
  .titles-div textarea {
    display: block;
  }
  .date-p {
    width: 10em;
    border-radius: 0.3em;
    padding: 0.5em;
    background: #252525;
    color: #fa9b00;

    margin: auto;
  }
  @media screen and (max-height: 600px) {
    .titles-div {
      width: 100%;
    }
  }
</style>

<main>
  {#if !isGotAnswer}
    <h1>חכי רגע...</h1>
  {:else}
    <h1>היי {user.firstName}!</h1>
    <p>
      כתוב את הכתבה שלך כאן למטה, ואם היא עומדת בסנטדרנט האיכות המחמיר של
      lienet, היא אפילו תפורסם!
    </p>
  {/if}
  <div class="titles-div">
    <input bind:value={articleScheme.title} placeholder="כותרת" />
    <textarea bind:value={articleScheme.subTitle} placeholder="כותרת משנה" />
  </div>

  <p class="date-p">

    <date>{articleScheme.date.format('DD/MM/YYYY')}</date>
    <date>{articleScheme.date.format('HH:mm:ss')}</date>

  </p>
  <div bind:this={editor}  class="editor">הכתבה המדהימה שלי</div>
  <button on:click={SubmitArticle}>הגש כתבה!</button>

</main>

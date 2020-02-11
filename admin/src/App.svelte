<script>
  import Utils from "./Utils.js";
  import MediumEditor from "medium-editor";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import moment from "moment";
  import MediumEditorColorPickerButtons from "medium-editor-colorpicker-buttons";

  let editor;
  $: user = {};
  $: isGotAnswer = false;
  $: postSubmitMessage = "";
  let articleScheme = { title: "", date: moment(), subTitle: "", text: "" };

  onMount(async () => {
    user = await getAuthorDetials();
    isGotAnswer = true;
    //mount medium editor plugin
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
    })
      .then(res => {
        return res.json();
      })
      .then(aut => {
        articleScheme.author = aut;
        return aut;
      });
  }
  async function SubmitArticle() {
    let ansJsoned = "";
    articleScheme.text = editor.getContent();
    articleScheme.author = articleScheme.author.mail;
    try {
      let ans = await fetch("/postArticle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleScheme)
      });
      ansJsoned = await ans.json();
      console.table(ansJsoned);
    } catch (ex) {
      console.error(ex);
    } finally {
      if (ansJsoned.status == "failed") {
        if (ansJsoned.message == "mail not verified") {
          postSubmitMessage = "יש לאמת את המייל לפני הגשת כתבה :(";
        } else {
          postSubmitMessage = "הפרסום כשל, כנראה כי אתה לא כותב מספיק טוב";
        }
      } else {
        postSubmitMessage = "הכתבה פורסמה!";
        const url = Utils.GetServerAdress() + "/#/article=" + ansJsoned.id;
        window.open(url, "_blank");
      }
    }
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
  .postSubmitMessage-div {
    border-radius: 15px 0px 0px 15px;
    text-align: center;
    background-color: rgba(255, 0, 0, 0.77);
    position: absolute;
    padding: 0.5em;
    color: white;
    right: 0;
  }
  .popup-exit-button {
    background: none;
    color: black;
    position: relative;
    cursor: pointer;
    font-weight: 500;
    margin: 0px;
    padding: 0;
    width: 1em;
    font-size: 1em;
    height: 1em;
    line-height: 0;
    border: none;
    font-family: cursive;
  }
  @media screen and (max-height: 600px) {
    .titles-div {
      width: 100%;
    }
    .editor {
      padding: 1vh;
      margin: 1vh;
      width: 90%;
    }
  }
</style>

<main>
  {#if !isGotAnswer}
    <h1>חכי רגע...</h1>
  {:else}
    <h1>היי {user.firstName}!</h1>
    {#if postSubmitMessage}
      <div
        transition:fly={{ x: 200, duration: 400 }}
        class="postSubmitMessage-div">
        {postSubmitMessage}
        <button
          class="popup-exit-button"
          on:click={() => {
            postSubmitMessage = '';
          }}>
          x
        </button>
      </div>
    {/if}
  {/if}
  <div class="titles-div">
    <input bind:value={articleScheme.title} placeholder="כותרת" />
    <textarea bind:value={articleScheme.subTitle} placeholder="כותרת משנה" />
  </div>

  <p class="date-p">

    <date>{articleScheme.date.format('DD/MM/YYYY')}</date>
    <date>{articleScheme.date.format('HH:mm:ss')}</date>

  </p>
  <div bind:this={editor} class="editor">הכתבה המדהימה שלי</div>
  <button on:click={SubmitArticle}>הגש כתבה!</button>

</main>

<script>
  export let isRegister;
  export let CloseModal;
  $: formData = { mail: "", password: "" };
  $: errorMessage = "";
  let originAddr = GetServerAdress();
  function GetServerAdress() {
    if (window.location.href.includes("localhost")) {
      const uri = new URL(window.location.href);
      uri.port = "6969";
      return uri.origin;
    } else {
      return document.location.origin;
    }
  }
  async function SubmitForm(e) {
    e.preventDefault();
    console.table(formData);
    const request = isRegister ? "/Register" : "/SignIn";
    let answer = await fetch(originAddr + request, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (!answer || answer.status == 500) {
      errorMessage = answer;
    }
  }
</script>

<style>
  * {
    text-align: center;
  }
  h1 {
    background: #000000;
    top: 0;
    margin: -1px auto;
    width: 10em;
    color: white;
    font-size: 1.5em;
    position: relative;
    text-align: center;
  }
  .privacy-div {
    width: 600px;
    margin: auto;
  }
  button {
    display: block;
    position: relative;
    cursor: pointer;
    margin: 0.5em auto;
  }
</style>

{#if isRegister}
  <h1>הרשמה</h1>
{:else}
  <h1>התחבר והתחל לכתוב</h1>
{/if}

<form>
  <label>מייל</label>
  <input bind:value={formData.mail} type="email" />
  <label>סיסמה</label>
  <input bind:value={formData.password} type="password" />
  <button on:click={SubmitForm}>תכניס אותי</button>
  {#if !isRegister}
    <span>
      אין לך משתמש עדיין?
      <button
        on:click={() => {
          isRegister = true;
        }}>
        הירשם כאן
      </button>
    </span>
  {/if}
</form>

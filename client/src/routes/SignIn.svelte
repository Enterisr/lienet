<script>
  import Utils from "../Utils.js";
  export let isRegister;
  export let CloseModal;
  $: formData = { mail: "", password: "" };
  $: serverResponse = "";

  let isTriedToConnect = false;
  let originAddr = Utils.GetServerAdress();

  async function SubmitForm(e) {
    e.preventDefault();
    const request = isRegister ? "/Register" : "/SignIn";
    let answer = await fetch(originAddr + request, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (!answer || answer.status == 500) {
      errorMessage = answer;
    } else {
      let ansJsoned = await answer.json();
      serverResponse = ansJsoned.isSinged ? true : false;
      if (ansJsoned.isSinged) {
        localStorage.setItem("auth", JSON.stringify(answer));
        /*await fetch(originAddr + "/admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: ansJsoned.token
          }
        });*/
        window.location.href = "/admin?authorization=" + ansJsoned.token;
      }
    }
    isTriedToConnect = true;
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
  .sucsess {
    background: rgb(98, 226, 98);
  }
  .fail {
    background: red;
    color: white;
  }
</style>

{#if isRegister}
  <h1>הרשמה</h1>
{:else}
  <h1>התחבר והתחל לכתוב</h1>
{/if}

<form>
  {#if isRegister}
    <label>שם פרטי</label>
    <input bind:value={formData.firstName} type="text" />
    <label>שם משפחה</label>
    <input bind:value={formData.lastName} type="text" />
  {/if}
  <label>מייל</label>
  <input bind:value={formData.mail} type="email" />
  <label>סיסמה</label>
  <input bind:value={formData.password} type="password" />

  <button on:click={SubmitForm}>{isRegister ? 'הרשמה' : 'התחברות'}</button>
  {#if isTriedToConnect}
    <div
      class={serverResponse ? 'serverResponse-div sucsess' : 'serverResponse-div fail'}>
      {serverResponse ? 'התחברת בהצלחה' : 'מייל או ססמה לא נכונים'}
    </div>
  {/if}
  {#if !isRegister}
    <span>
      אין לך משתמש עדיין?
      <button
        on:click={() => {
          isRegister = true;
          isTriedToConnect = false;
        }}>
        הירשם כאן
      </button>
    </span>
  {/if}

</form>

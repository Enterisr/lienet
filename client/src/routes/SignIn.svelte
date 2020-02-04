<script>
  import Utils from "../Utils.js";
  export let isRegister;
  export let CloseModal;
  $: formInput = { mail: "", password: "" };
  $: serverResponse = "";
  $: statusMessage = "";
  let isTriedToConnect = false;
  let originAddr = Utils.GetServerAdress();

  function IsStrongPassword() {
    let rulesCount = 0;
    if (/[a-z]/.test(formInput.password)) {
      rulesCount++;
    }
    if (/[A-Z]/.test(formInput.password)) {
      rulesCount++;
    }
    if (/[0-9]/.test(formInput.password)) {
      rulesCount++;
    }
    if (/[!@#$&*]/.test(formInput.password)) {
      rulesCount++;
    }
    return rulesCount == 4;
  }

  function ValidateInput() {
    statusMessage = "";
    const regexMailTest = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isNotReallyLong =
      Object.values(formInput).findIndex(elm => {
        return elm.length > 100;
      }) == -1;
    const isEmailValid = regexMailTest.test(formInput.mail);
    const isPasswordValid =
      IsStrongPassword(formInput.password) && formInput.password.length >= 8;
    if (isEmailValid && isPasswordValid && isNotReallyLong) {
      return true;
    } else {
      if (!isEmailValid) {
        statusMessage = "בטוח שזה המייל?*";
      }
      if (!isPasswordValid) {
        statusMessage =
          "*הססמה צריכה להכיל אות אנגלית קטנה, גדולה, מספר וסימן מיוחד";
      }
      if (!isNotReallyLong) {
        statusMessage = "*אין לנו כל כך הרבה מקום בdb";
      }
      isTriedToConnect = true;
    }
  }
  async function SubmitForm(e) {
    e.preventDefault();
    if (!isRegister || ValidateInput()) {
      //IF register, needs to validate that the input was ok
      const request = isRegister ? "/Register" : "/SignIn";
      let answer = await fetch(originAddr + request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInput)
      });
      if (!answer || answer.status == 500) {
        errorMessage = answer;
      } else {
        let ansJsoned = await answer.json();
        serverResponse = ansJsoned.isSinged ? true : false;
        console.log(ansJsoned);
        window.location.replace("/admin");
      }
      isTriedToConnect = true;
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
    <input bind:value={formInput.firstName} type="text" />
    <label>שם משפחה</label>
    <input bind:value={formInput.lastName} type="text" />
  {/if}
  <label>מייל</label>
  <input bind:value={formInput.mail} type="email" />
  <label>סיסמה</label>
  <input bind:value={formInput.password} type="password" />

  <button on:click={SubmitForm}>{isRegister ? 'הרשמה' : 'התחברות'}</button>
  {#if isTriedToConnect}
    <div
      class={serverResponse ? 'serverResponse-div sucsess' : 'serverResponse-div fail'}>
      {statusMessage}
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

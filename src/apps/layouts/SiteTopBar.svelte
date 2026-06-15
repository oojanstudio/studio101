<script lang="ts">
  import { goto } from "$app/navigation";
  import { BrandLogo } from "studio-fe-components";

  function onClickLogin() {
    goto("/login");
  }
</script>

<div class="topbar">
  <BrandLogo />
  <button class="login-btn" onclick={onClickLogin}>Login</button>
</div>

<style>
  .topbar {
    height: 2.75rem;
    padding-right: 2rem;
    background: linear-gradient(to right, #eb7bc0, #ffe994);
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .login-btn {
    padding: 0.5rem 1rem;
    background-color: #801a86;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .login-btn:hover {
    background-color: #b64ba3;
  }
</style>

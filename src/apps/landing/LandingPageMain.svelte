<script lang="ts">
  import { goto } from "$app/navigation";
  import LandingPageFooter from "studio-fe-components/components/LandingPageFooter.svelte";
  import Canvas2DContent from "./Canvas2DContent.svelte";
  import LandingPageSection from "./LandingPageSection.svelte";
  import LandingPageSectionList from "./LandingPageSectionList.svelte";

  function onClickLogin() {
    goto("/login");
  }
</script>

<div class="shell" data-debug-name="landing-shell">
  <!-- <div class="sections">
    <section class="section1">
      <img
        src="/images/hero-image-desk.png"
        alt="Hero Image"
        class="hero-img"
      />
    </section>
  </div> -->

  <LandingPageSectionList>
    <LandingPageSection class="landing-sec1">
      <img
        src="/images/hero-image-desk.png"
        alt="Hero Image"
        class="hero-img"
      />
    </LandingPageSection>

    <LandingPageSection class="landing-sec2">
      <h1>Welcome to Studio 101</h1>
      <p>This is the landing page.</p>
      [#f0e6ef, #A499B3, #534B62, #1B1725]
    </LandingPageSection>

    <LandingPageSection class="landing-sec3">
      <Canvas2DContent
        colors={[
          "#ff5470",
          "#ffd23f",
          "#43f8b6",
          "#4cc9f0",
          "#7f5af0",
          "#f15bb5",
          "#ff8906",
        ]}
      />
    </LandingPageSection>
    <LandingPageSection class="landing-sec4">Section 4</LandingPageSection>
    <LandingPageSection class="landing-sec5">Section 5</LandingPageSection>
    <LandingPageSection class="landing-sec6">Section 6</LandingPageSection>
    <LandingPageSection class="landing-sec7">
      <LandingPageFooter />
    </LandingPageSection>
  </LandingPageSectionList>

  <div class="topbar">
    <button class="login-btn" onclick={onClickLogin}>Login</button>
  </div>
</div>

<style>
  .shell {
    width: 100%;
    min-height: 100vh;
    background-color: beige;
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .topbar {
    height: 4rem;
    position: absolute;
    inset: 0;
    top: 0;
    padding-right: 2rem;
    background: linear-gradient(
      to right,
      transparent,
      transparent 50%,
      #000000 95%,
      #000000
    );
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .login-btn {
    background: #7b62a8;
    border: 1px solid #b9abdc;
    color: #ffffff;
    padding: 0.5rem 2.2rem;
    border-radius: 9999px;
    font-size: 0.9rem;
    font-weight: 400;
    letter-spacing: 0.25ch;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .login-btn:hover {
    background: #a195c2;
  }

  .section1 {
    margin: 0;
    width: 100%;
    overflow: hidden;
  }
  .hero-img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  :global(.landing-sec1) {
    background-color: #000000;
    /* linear-gradient(#f0e6ef, #a499b3, #534b62, #1b1725); */
    color: #f0e6ef;
    /* z-index: 10; */
  }

  :global(.landing-sec2) {
    background-color: #534b62;
    /* linear-gradient(#f0e6ef, #a499b3, #534b62, #1b1725); */
    color: #f0e6ef;
    /* z-index: 19; */
    padding: 6rem 0;
    position: relative;
    margin-top: -2rem;
  }

  :global(.landing-sec3) {
    background: transparent;
    padding: 0;
    position: relative;
    overflow: hidden;
    /* z-index: 22; */
    padding: 6rem 0;
    height: 6rem;
  }

  :global(.landing-sec4) {
    background-color: #7f5af0;
    color: #f9f7ff;
    position: relative;
    /* z-index: 18; */
    padding: 6rem 0;
  }

  :global(.landing-sec5) {
    background-color: #2cb67d;
    color: #06281c;
    padding: 6rem 0;
  }

  :global(.landing-sec6) {
    background-color: #ff8906;
    color: #2b1400;
    padding: 6rem 0;
  }

  :global(.landing-sec7) {
    background-color: #3da9fc;
    color: #04203a;
  }
</style>

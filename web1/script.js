document.addEventListener("DOMContentLoaded", () => {
  const rulesLink  = document.querySelector('a[href="#rules"]');
  const rulesBox   = document.getElementById("rules");
  const overlay    = document.getElementById("rulesOverlay");
  const closeBtn = document.querySelector(".rules-close");

  function openRules(e){
    if (e) e.preventDefault();
    history.pushState({ rules: true }, "", "#rules");
    document.body.classList.add("rules-open");
  }

  function closeRules(e){
    if (e) e.preventDefault();
    document.body.classList.remove("rules-open");


    if (location.hash === "#rules") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  if (rulesLink) rulesLink.addEventListener("click", openRules);
  if (overlay) overlay.addEventListener("click", closeRules);
  if (closeBtn) closeBtn.addEventListener("click", closeRules);


  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("rules-open")) {
      closeRules(e);
    }
  });


  window.addEventListener("popstate", () => {
    if (document.body.classList.contains("rules-open")) {
      document.body.classList.remove("rules-open");
    }
  });


  if (location.hash === "#rules") {
    document.body.classList.add("rules-open");
  }
});

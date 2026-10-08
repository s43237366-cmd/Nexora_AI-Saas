document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal
  const reveal = () => {
    document.querySelectorAll(".reveal").forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 70) el.classList.add("visible");
    });
  };
  reveal();
  window.addEventListener("scroll", reveal, {passive:true});

  // Mobile navigation
  const menu = document.querySelector(".mobile-menu");
  const nav = document.querySelector(".nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("mobile-open");
      menu.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("mobile-open");
      menu.classList.remove("open");
    }));
  }

  // Pricing calculator
  const slider = document.getElementById("usersSlider");
  const usersValue = document.getElementById("usersValue");
  const totalPrice = document.getElementById("totalPrice");
  const period = document.getElementById("period");
  const seatPrice = document.getElementById("seatPrice");
  const billingButtons = document.querySelectorAll(".billing");
  let billing = "monthly";

  function calcPrice(users) {
    let monthlyPerSeat = users >= 25 ? 17 : 19;
    if (users >= 50) monthlyPerSeat = 15;
    let total = users * monthlyPerSeat;
    if (billing === "yearly") total = Math.round(total * 0.8);
    return {total, monthlyPerSeat};
  }

  function updatePrice() {
    if (!slider || !usersValue || !totalPrice) return;
    const users = Number(slider.value);
    const data = calcPrice(users);
    usersValue.textContent = users + (users === 100 ? "+" : "");
    totalPrice.textContent = "$" + data.total.toLocaleString();
    period.textContent = billing === "yearly" ? "/year" : "/month";
    seatPrice.textContent = "$" + (billing === "yearly" ? Math.round(data.monthlyPerSeat * .8) : data.monthlyPerSeat);
    slider.style.setProperty("--range", ((users-1)/99*100) + "%");
  }
  if (slider) slider.addEventListener("input", updatePrice);
  billingButtons.forEach(btn => btn.addEventListener("click", () => {
    billingButtons.forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    billing = btn.dataset.billing;
    updatePrice();
  }));
  updatePrice();

  // Feature tabs
  const featureData = {
    context: {
      eyebrow:"CONTEXT ENGINE", title:"Understand the whole system.",
      text:"Nexora maps your repositories into a semantic graph, giving the model the right files and dependencies before it writes a single line.",
      list:["Repository-wide semantic search","Dependency-aware suggestions","Architecture memory"], visual:"graph"
    },
    agent: {
      eyebrow:"AGENT MODE", title:"Delegate multi-step engineering.",
      text:"Give Nexora a goal and it can plan the work, edit multiple files, run checks and return a reviewable result.",
      list:["Task planning & execution","Multi-file patches","Human approval gates"], visual:"agent"
    },
    debug: {
      eyebrow:"DEBUG ENGINE", title:"Turn errors into fixes.",
      text:"Nexora reads stack traces alongside the relevant source, then explains the failure and proposes the smallest safe correction.",
      list:["Trace-aware diagnosis","Test generation","Fix verification"], visual:"debug"
    },
    review: {
      eyebrow:"CODE REVIEW", title:"Review changes before they ship.",
      text:"Scan pull requests for correctness, maintainability and risky edge cases with explanations your team can act on.",
      list:["Risk detection","Architecture checks","Actionable review notes"], visual:"review"
    }
  };
  const tabs = document.querySelectorAll(".tab");
  if (tabs.length) {
    tabs.forEach(tab => tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const d = featureData[tab.dataset.feature];
      document.getElementById("featureEyebrow").textContent = d.eyebrow;
      document.getElementById("featureTitle").textContent = d.title;
      document.getElementById("featureText").textContent = d.text;
      document.getElementById("featureList").innerHTML = d.list.map(x => `<li>${x}</li>`).join("");
      const v = document.getElementById("featureVisual");
      if (d.visual === "graph") {
        v.innerHTML = `<div class="graph-card"><div class="graph-node n1">API</div><div class="graph-node n2">AUTH</div><div class="graph-node n3">DB</div><div class="graph-node n4">UI</div><div class="graph-node n5">PAYMENTS</div><span class="graph-line l1"></span><span class="graph-line l2"></span><span class="graph-line l3"></span><span class="graph-line l4"></span><div class="graph-status"><i></i> semantic graph synced</div></div>`;
      } else {
        v.innerHTML = `<div class="terminal-visual"><div class="terminal-top"><i></i><i></i><i></i><span>nexora-agent</span></div><div class="terminal-lines"><p><b>›</b> ${d.eyebrow.toLowerCase()} --run</p><p class="dim">analyzing repository context...</p><p class="orange">✓ ${d.list[0]}</p><p class="orange">✓ ${d.list[1]}</p><p class="dim">completed in 1.82s</p></div></div>`;
      }
    }));
  }

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach(btn => btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const open = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach(x => x.classList.remove("open"));
    if (!open) item.classList.add("open");
  }));

  // Copy buttons
  document.querySelectorAll(".copy-code").forEach(btn => btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy || "");
      const old = btn.textContent; btn.textContent = "COPIED";
      setTimeout(() => btn.textContent = old, 1200);
    } catch { btn.textContent = "SELECT"; }
  }));


  // Dark / Light mode
  const themeButtons = document.querySelectorAll(".theme-toggle");
  const savedTheme = localStorage.getItem("nexora-theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");

  function updateThemeButtons() {
    const light = document.body.classList.contains("light-theme");
    themeButtons.forEach(btn => {
      const icon = btn.querySelector(".theme-icon");
      const text = btn.querySelector(".theme-text");
      if (icon) icon.textContent = light ? "☾" : "☀";
      if (text) text.textContent = light ? "Dark" : "Light";
      btn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    });
  }
  themeButtons.forEach(btn => btn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("nexora-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
    updateThemeButtons();
  }));
  updateThemeButtons();

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) { e.preventDefault(); target.scrollIntoView({behavior:"smooth", block:"start"}); }
  }));
});
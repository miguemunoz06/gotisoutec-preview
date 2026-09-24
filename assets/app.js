(function () {
  const header = document.querySelector(".header");
  const menuBtn = document.querySelector(".menu-btn");
  const mobile = document.querySelector(".mobile-nav");
  if (menuBtn && mobile && header) {
    menuBtn.addEventListener("click", () => {
      const open = !mobile.classList.contains("open");
      mobile.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      mobile.classList.remove("open");
      document.body.style.overflow = "";
    }));
  }
  const form = document.querySelector("#contacto-form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    if (data.get("company_website")) return;
    const submit = form.querySelector("[type=submit]");
    submit.disabled = true;
    const webhook = (window.SITE && window.SITE.webhookUrl) || "";
    try {
      if (webhook) {
        const res = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
        if (!res.ok) throw new Error("fail");
      }
      form.innerHTML = '<div class="thanks" role="status"><h3>Gracias</h3><p>Recibimos tu mensaje. Te contactaremos para revisar el proyecto.</p></div>';
    } catch (err) {
      form.querySelector(".form-msg").textContent = "No pudimos enviar el mensaje. Escríbenos por WhatsApp.";
      submit.disabled = false;
    }
  });
})();

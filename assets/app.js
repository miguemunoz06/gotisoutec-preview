(function () {
  const header = document.querySelector(".header");
  const menuBtn = document.querySelector(".menu-btn");
  const mobile = document.querySelector(".mobile-nav");

  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (menuBtn && mobile && header) {
    menuBtn.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      mobile.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobile.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        header.classList.remove("is-open");
        mobile.classList.remove("open");
        document.body.style.overflow = "";
      }),
    );
  }

  document.querySelectorAll(".faq button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const panel = item.querySelector(".ans");
      const expanded = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq button").forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        const p = other.parentElement.querySelector(".ans");
        if (p) p.hidden = true;
      });
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        if (panel) panel.hidden = false;
      }
    });
  });

  const form = document.querySelector("#contacto-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    if (data.get("company_website")) return;

    const payload = {
      nombre: String(data.get("nombre") || "").trim(),
      empresa: String(data.get("empresa") || "").trim(),
      cargo: String(data.get("cargo") || "").trim(),
      correo: String(data.get("correo") || "").trim().toLowerCase(),
      whatsapp: String(data.get("whatsapp") || "").trim(),
      ripsAlMes: String(data.get("ripsAlMes") || "").trim(),
      interes: String(data.get("interes") || "").trim(),
      origen: "gotisoutec.com",
      fecha: new Date().toISOString(),
    };

    const box = form.querySelector(".form-msg");
    const submit = form.querySelector("[type=submit]");
    submit.disabled = true;
    submit.textContent = "Enviando…";

    const webhook = (window.SITE && window.SITE.webhookUrl) || "";
    try {
      if (webhook) {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("fail");
      }
      form.innerHTML =
        '<div class="thanks" role="status"><h3>Gracias</h3><p>Recibimos tu mensaje. Te contactaremos para coordinar la demo o la cotización.</p><p style="margin-top:1.2rem"><a class="btn btn-primary" href="' +
        window.SITE.calendarUrl +
        '">Agendar demo ahora</a></p></div>';
    } catch (err) {
      box.textContent = "No pudimos enviar el mensaje. Escríbenos por WhatsApp.";
      submit.disabled = false;
      submit.textContent = "Enviar y agendar demo";
    }
  });
})();

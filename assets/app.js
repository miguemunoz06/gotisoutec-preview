(function () {
  const header = document.querySelector(".header");
  const menuBtn = document.querySelector(".menu-btn");
  const mobile = document.querySelector(".mobile-nav");
  if (menuBtn && mobile && header) {
    menuBtn.addEventListener("click", () => {
      const open = !mobile.classList.contains("open");
      mobile.classList.toggle("open", open);
      header.classList.toggle("is-open", open);
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
      interes: String(data.get("interes") || "").trim(),
      mensaje: String(data.get("mensaje") || "").trim(),
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
      form.innerHTML = '<div class="thanks" role="status"><h3>Gracias</h3><p>Recibimos tu mensaje. Te contactaremos para revisar el proyecto.</p><p style="margin-top:1.2rem"><a class="btn btn-primary" href="' + window.SITE.whatsappUrl + '">Escribir por WhatsApp</a></p></div>';
    } catch (err) {
      box.textContent = "No pudimos enviar el mensaje. Escríbenos por WhatsApp.";
      submit.disabled = false;
      submit.textContent = "Quiero automatizar mi proceso";
    }
  });
})();

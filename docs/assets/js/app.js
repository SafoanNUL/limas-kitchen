/* Lima's Kitchen — app logic.
   State: language, cart, friends code. Renders menu + bundles from LK_MENU,
   applies LK_I18N strings, computes prices, submits orders to Airtable. */
(function () {
  "use strict";

  var M = window.LK_MENU, I18N = window.LK_I18N, ALG = window.LK_ALLERGENS,
      IMG = window.LK_IMAGES || {}, CFG = window.LK_CONFIG;

  /* ─────────────────────────── state ─────────────────────────── */
  var state = {
    lang: (function () {
      try { var s = sessionStorage.getItem("lk-lang"); if (s === "bn" || s === "en") return s; } catch (e) {}
      return "en";
    })(),
    cart: [],          // { key, size, qty, spice }
    friends: false,
    // per-dish UI selections before "Add": { key: { size, spice } }
    picks: {},
  };

  function t(key) { return (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key; }

  /* Bengali numerals for sizes/counts in BN mode (prices stay Western for clarity) */
  var BN_DIGITS = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  function bnNum(s) { return String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; }); }

  /* ───────────────────────── pricing ─────────────────────────── */
  // Friends price is the real price (pence). Public = +markup, rounded per line.
  function displayUnit(pence) {
    return state.friends ? pence : Math.round(pence * (1 + M.PUBLIC_MARKUP));
  }
  function money(pence) { return "£" + (pence / 100).toFixed(2); }

  function findItem(key) {
    for (var i = 0; i < M.MENU.length; i++) if (M.MENU[i].key === key) return M.MENU[i];
    return null;
  }
  function findBundle(key) {
    for (var i = 0; i < M.BUNDLES.length; i++) if (M.BUNDLES[i].key === key) return M.BUNDLES[i];
    return null;
  }
  function unitPrice(key, size) {
    var b = findBundle(key); if (b) return b.price;
    var it = findItem(key); if (!it) return null;
    for (var i = 0; i < it.variants.length; i++) if (it.variants[i].size === size) return it.variants[i].price;
    return null;
  }

  /* ───────────────────────── i18n apply ───────────────────────── */
  function applyI18n() {
    document.documentElement.setAttribute("data-lang", state.lang);
    document.documentElement.setAttribute("lang", state.lang);
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i], key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    }
    var phs = document.querySelectorAll("[data-i18n-ph]");
    for (var j = 0; j < phs.length; j++) phs[j].setAttribute("placeholder", t(phs[j].getAttribute("data-i18n-ph")));
    var steps = document.querySelectorAll(".how-step__num");
    for (var k = 0; k < steps.length; k++)
      steps[k].textContent = state.lang === "bn" ? ["১", "২", "৩", "৪"][k] : String(k + 1);
    document.getElementById("lang-en").setAttribute("aria-pressed", state.lang === "en" ? "true" : "false");
    document.getElementById("lang-bn").setAttribute("aria-pressed", state.lang === "bn" ? "true" : "false");
    document.title = state.lang === "bn"
      ? "লিমা'স রান্নাঘর · Lima's Kitchen — ঘরে রান্না করা বাঙালি পার্টির খাবার, ওয়েলিং"
      : "Lima's Kitchen · লিমা'স রান্নাঘর — home-cooked Bengali party food, Welling";
  }

  function setLang(lang) {
    state.lang = lang;
    try { sessionStorage.setItem("lk-lang", lang); } catch (e) {}
    applyI18n();
    renderMenu();
    renderBundles();
    renderSummary();
  }

  /* ───────────────────────── menu render ──────────────────────── */
  var CAT_ORDER = ["noodles", "biryani", "rice", "curries", "sides", "sweets", "preorder"];
  var CAT_ICON = { noodles: "s-noodles", biryani: "s-biryani", rice: "s-rice", curries: "s-curry",
                   sides: "s-samosa", sweets: "s-sweet", preorder: "s-star" };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[<>&"]/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]; }); }

  function sizeLabel(v) { return state.lang === "bn" ? v.label_bn : v.label_en; }

  function allergenHtml(list) {
    if (!list || !list.length) return '<span class="allergens">' + esc(t("allergen_none")) + "</span>";
    var pills = list.map(function (a) {
      var names = ALG[a] || { en: a, bn: a };
      return '<span class="allergen-pill">' + esc(state.lang === "bn" ? names.bn : names.en) + "</span>";
    }).join(" ");
    return '<span class="allergens">' + esc(t("allergens_label")) + " " + pills + "</span>";
  }

  function renderMenu() {
    var root = document.getElementById("menu-root");
    root.innerHTML = "";
    CAT_ORDER.forEach(function (cat) {
      var items = M.MENU.filter(function (m) { return m.category === cat; });
      if (!items.length) return;

      var section = el("div", "cat" + (cat === "noodles" ? " cat--feature" : ""));
      var head = el("div", "cat__head");
      var sub = t("cat_" + cat + "_sub");
      head.innerHTML =
        '<span class="cat__title">' +
        '<svg class="cat__flourish" aria-hidden="true"><use href="#' + CAT_ICON[cat] + '"/></svg>' +
        "<h2>" + esc(t("cat_" + cat)) + "</h2></span>" +
        (sub !== "cat_" + cat + "_sub" && I18N[state.lang]["cat_" + cat + "_sub"] ? '<span class="cat__sub">' + esc(sub) + "</span>" : "");
      section.appendChild(head);

      var list = el("div", "dishes");
      items.forEach(function (item) { list.appendChild(dishRow(item)); });
      section.appendChild(list);
      root.appendChild(section);
    });
  }

  function dishRow(item) {
    var pick = state.picks[item.key] || (state.picks[item.key] = {
      size: item.variants[0].size,
      spice: item.spice ? "medium" : null,
    });

    var row = el("div", "dish");
    row.setAttribute("data-key", item.key);

    // medallion
    var med = el("div", "dish__medallion");
    var slot = IMG[item.category];
    if (slot) { med.style.setProperty("--dish-img", "url('assets/img/" + slot + "')"); med.style.setProperty("--dish-img-op", "1"); }
    med.innerHTML = '<svg aria-hidden="true"><use href="#' + CAT_ICON[item.category] + '"/></svg>';
    row.appendChild(med);

    // body
    var primary = state.lang === "bn" ? item.name_bn : item.name_en;
    var secondary = state.lang === "bn" ? item.name_en : item.name_bn;
    var body = el("div", "dish__body");
    body.innerHTML =
      '<div class="dish__name">' + esc(primary) + "</div>" +
      '<div class="dish__name-sub" lang="' + (state.lang === "bn" ? "en" : "bn") + '">' + esc(secondary) + "</div>" +
      '<div class="dish__meta">' + allergenHtml(item.allergens) + "</div>" +
      (item.note_en ? '<div class="dish__note">' + esc(state.lang === "bn" ? item.note_bn : item.note_en) + "</div>" : "");
    row.appendChild(body);

    // actions
    var act = el("div", "dish__actions");

    var priceEl = el("div", "dish__price");
    act.appendChild(priceEl);

    var sizes = el("div", "size-picker");
    sizes.setAttribute("role", "group");
    sizes.setAttribute("aria-label", t("choose"));
    item.variants.forEach(function (v) {
      var chip = el("button", "size-chip", esc(sizeLabel(v)));
      chip.type = "button";
      chip.setAttribute("aria-pressed", pick.size === v.size ? "true" : "false");
      chip.addEventListener("click", function () {
        pick.size = v.size;
        Array.prototype.forEach.call(sizes.children, function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        updatePrice();
      });
      sizes.appendChild(chip);
    });
    act.appendChild(sizes);

    if (item.spice) {
      var spices = el("div", "spice-picker");
      spices.setAttribute("role", "group");
      spices.setAttribute("aria-label", t("spice"));
      ["mild", "medium", "hot"].forEach(function (s) {
        var chip = el("button", "spice-chip", esc(t("spice_" + s)));
        chip.type = "button";
        chip.setAttribute("aria-pressed", pick.spice === s ? "true" : "false");
        chip.addEventListener("click", function () {
          pick.spice = s;
          Array.prototype.forEach.call(spices.children, function (c) { c.setAttribute("aria-pressed", "false"); });
          chip.setAttribute("aria-pressed", "true");
        });
        spices.appendChild(chip);
      });
      act.appendChild(spices);
    }
    row.appendChild(act);

    var addBtn = el("button", "btn add-btn", esc(t("add")));
    addBtn.type = "button";
    addBtn.style.padding = "0.55rem 1.3rem";
    addBtn.addEventListener("click", function () {
      addToCart(item.key, pick.size, pick.spice);
      addBtn.textContent = t("added") + " ✓";
      addBtn.classList.add("added");
      setTimeout(function () { addBtn.textContent = t("add"); addBtn.classList.remove("added"); }, 1400);
    });
    act.appendChild(addBtn);

    function updatePrice() {
      var unit = unitPrice(item.key, pick.size);
      var pub = Math.round(unit * (1 + M.PUBLIC_MARKUP));
      if (state.friends) {
        priceEl.innerHTML = "<del>" + money(pub) + "</del> " + '<span class="friend">' + money(unit) + "</span>";
      } else {
        priceEl.textContent = money(pub);
      }
    }
    updatePrice();
    return row;
  }

  /* ───────────────────────── bundles ─────────────────────────── */
  function renderBundles() {
    var root = document.getElementById("bundle-root");
    root.innerHTML = "";
    M.BUNDLES.forEach(function (b) {
      var primary = state.lang === "bn" ? b.name_bn : b.name_en;
      var secondary = state.lang === "bn" ? b.name_en : b.name_bn;
      var card = el("article", "bundle reveal in");
      var pub = Math.round(b.price * (1 + M.PUBLIC_MARKUP));
      var priceHtml = state.friends
        ? "<del>" + money(pub) + "</del> " + money(b.price)
        : money(pub);
      var art = el("div", "bundle__art");
      var slot = IMG[b.key];
      if (slot) { art.style.setProperty("--bundle-img", "url('assets/img/" + slot + "')"); art.style.setProperty("--bundle-img-op", "1"); }
      art.innerHTML =
        '<svg class="bundle__art-flourish" viewBox="0 0 320 200" aria-hidden="true">' +
        '<use href="#s-alpona" x="128" y="52" width="64" height="64"/>' +
        '<use href="#s-paisley" x="40" y="120" width="40" height="40"/>' +
        '<use href="#s-paisley" x="240" y="120" width="40" height="40" transform="scale(-1,1) translate(-520,0)"/>' +
        "</svg>" +
        '<span class="bundle__serves">' + esc(state.lang === "bn" ? b.serves_bn : b.serves_en) + "</span>";
      card.appendChild(art);

      var bodyEl = el("div", "bundle__body");
      bodyEl.innerHTML =
        '<h3 class="bundle__name">' + esc(primary) + "</h3>" +
        '<div class="bundle__name-sub" lang="' + (state.lang === "bn" ? "en" : "bn") + '">' + esc(secondary) + "</div>" +
        '<div class="bundle__inc-label">' + esc(t("bundle_includes")) + "</div>" +
        '<p class="bundle__inc">' + esc(state.lang === "bn" ? b.contents_bn : b.contents_en) + "</p>" +
        '<div class="dish__meta">' + allergenHtml(b.allergens) + "</div>" +
        '<div class="bundle__foot"><span class="bundle__price">' + priceHtml + "</span></div>";
      var btn = el("button", "btn", esc(t("add")));
      btn.type = "button";
      btn.addEventListener("click", function () {
        addToCart(b.key, "bundle", null);
        btn.textContent = t("added") + " ✓";
        setTimeout(function () { btn.textContent = t("add"); }, 1400);
      });
      bodyEl.querySelector(".bundle__foot").appendChild(btn);
      card.appendChild(bodyEl);
      root.appendChild(card);
    });
  }

  /* ───────────────────────── cart ────────────────────────────── */
  function addToCart(key, size, spice) {
    for (var i = 0; i < state.cart.length; i++) {
      var l = state.cart[i];
      if (l.key === key && l.size === size && l.spice === spice) { l.qty += 1; renderSummary(); return; }
    }
    state.cart.push({ key: key, size: size, qty: 1, spice: spice });
    renderSummary();
  }

  function cartTotals() {
    var friendsTotal = 0;
    state.cart.forEach(function (l) { friendsTotal += (unitPrice(l.key, l.size) || 0) * l.qty; });
    var publicTotal = Math.round(friendsTotal * (1 + M.PUBLIC_MARKUP));
    return { friends: friendsTotal, public: publicTotal, pay: state.friends ? friendsTotal : publicTotal };
  }

  function lineName(l) {
    var b = findBundle(l.key);
    if (b) return state.lang === "bn" ? b.name_bn : b.name_en;
    var it = findItem(l.key);
    return it ? (state.lang === "bn" ? it.name_bn : it.name_en) : l.key;
  }
  function lineSizeLabel(l) {
    var b = findBundle(l.key);
    if (b) return state.lang === "bn" ? b.serves_bn : b.serves_en;
    var it = findItem(l.key);
    if (!it) return l.size;
    for (var i = 0; i < it.variants.length; i++) if (it.variants[i].size === l.size) return sizeLabel(it.variants[i]);
    return l.size;
  }

  function renderSummary() {
    var body = document.getElementById("summary-body");
    var totalEl = document.getElementById("total-amount");
    var mobileBar = document.getElementById("mobile-bar");
    var mobileCount = document.getElementById("mobile-count");

    body.innerHTML = "";
    if (!state.cart.length) {
      body.appendChild(el("p", "summary__empty", esc(t("order_empty"))));
      totalEl.textContent = money(0);
      mobileBar.classList.remove("show");
      document.body.classList.remove("has-order");
      return;
    }

    state.cart.forEach(function (l, idx) {
      var unit = unitPrice(l.key, l.size) || 0;
      var shown = displayUnit(unit);
      var line = el("div", "line");
      var meta = lineSizeLabel(l) + (l.spice ? " · " + t("spice_" + l.spice) : "");
      line.innerHTML =
        "<div>" +
        '<div class="line__name">' + esc(lineName(l)) + "</div>" +
        '<div class="line__meta">' + esc(meta) + "</div>" +
        '<span class="line__qty">' +
        '<button type="button" class="qty-btn" data-act="dec" aria-label="−">−</button>' +
        "<span>" + (state.lang === "bn" ? bnNum(l.qty) : l.qty) + "</span>" +
        '<button type="button" class="qty-btn" data-act="inc" aria-label="+">+</button>' +
        "</span> " +
        '<button type="button" class="line__remove">' + esc(t("remove")) + "</button>" +
        "</div>" +
        '<div class="line__price">' + money(shown * l.qty) + "</div>";
      line.querySelector('[data-act="dec"]').addEventListener("click", function () {
        l.qty -= 1; if (l.qty <= 0) state.cart.splice(idx, 1); renderSummary();
      });
      line.querySelector('[data-act="inc"]').addEventListener("click", function () { l.qty += 1; renderSummary(); });
      line.querySelector(".line__remove").addEventListener("click", function () { state.cart.splice(idx, 1); renderSummary(); });
      body.appendChild(line);
    });

    var totals = cartTotals();
    if (state.friends) {
      totalEl.innerHTML = "<del>" + money(totals.public) + "</del> " + money(totals.friends);
    } else {
      totalEl.textContent = money(totals.pay);
    }

    var count = state.cart.reduce(function (n, l) { return n + l.qty; }, 0);
    mobileCount.textContent = state.lang === "bn" ? bnNum(count) : count;
    mobileBar.classList.add("show");
    document.body.classList.add("has-order");
  }

  /* ───────────────────────── friends code ─────────────────────── */
  function setupFriends() {
    var input = document.getElementById("friends-input");
    var btn = document.getElementById("friends-btn");
    var msg = document.getElementById("friends-msg");
    var box = document.getElementById("friends-box");

    function apply() {
      var v = (input.value || "").trim().toUpperCase();
      if (!v) return;
      if (v === M.FRIENDS_CODE.toUpperCase()) {
        state.friends = true;
        msg.className = "friends__msg good";
        msg.textContent = "✓ " + t("friends_applied");
        box.classList.add("applied");
        btn.textContent = t("friends_remove");
        input.disabled = true;
      } else {
        state.friends = false;
        msg.className = "friends__msg bad";
        msg.textContent = t("friends_bad");
      }
      renderMenu(); renderBundles(); renderSummary();
    }
    function remove() {
      state.friends = false;
      input.disabled = false; input.value = "";
      msg.className = "friends__msg"; msg.textContent = "";
      box.classList.remove("applied");
      btn.textContent = t("friends_apply");
      renderMenu(); renderBundles(); renderSummary();
    }
    btn.addEventListener("click", function () { state.friends ? remove() : apply(); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); apply(); } });
  }

  /* ───────────────────────── validation ───────────────────────── */
  function minDateStr() {
    var d = new Date(Date.now() + M.MIN_LEAD_HOURS * 3600 * 1000);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function validate() {
    var ok = true;
    var name = document.getElementById("f-name");
    var phone = document.getElementById("f-phone");
    var date = document.getElementById("f-date");
    var submitErr = document.getElementById("submit-err");
    submitErr.style.display = "none";

    function mark(fieldName, bad) {
      var f = document.querySelector('[data-field="' + fieldName + '"]');
      if (f) f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    }
    mark("name", name.value.trim().length < 2);
    mark("phone", phone.value.replace(/\D/g, "").length < 7);
    var badDate = !date.value || date.value < minDateStr();
    mark("date", badDate);

    if (!state.cart.length) {
      submitErr.textContent = t("err_empty");
      submitErr.style.display = "block";
      ok = false;
    }
    return ok;
  }

  /* ───────────────────────── submit ───────────────────────────── */
  function refCode() {
    var chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", out = "";
    var a = new Uint32Array(5);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.random() * 1e9; });
    for (var i = 0; i < 5; i++) out += chars[a[i] % chars.length];
    return "LK-" + out;
  }

  function orderText() {
    return state.cart.map(function (l) {
      var unit = displayUnit(unitPrice(l.key, l.size) || 0);
      var b = findBundle(l.key);
      var it = findItem(l.key);
      var name = b ? b.name_en : (it ? it.name_en : l.key);
      var size = b ? b.serves_en : (function () {
        if (!it) return l.size;
        for (var i = 0; i < it.variants.length; i++) if (it.variants[i].size === l.size) return it.variants[i].label_en;
        return l.size;
      })();
      var spice = l.spice ? ", " + l.spice : "";
      return l.qty + "× " + name + " (" + size + spice + ") — " + money(unit * l.qty);
    }).join("\n");
  }

  function submitOrder() {
    if (!validate()) {
      document.getElementById("order").scrollIntoView({ behavior: "smooth" });
      return;
    }
    var btn = document.getElementById("submit-btn");
    var submitErr = document.getElementById("submit-err");
    btn.disabled = true;
    btn.textContent = t("submitting");

    var totals = cartTotals();
    var ref = refCode();
    var fields = {
      "Ref": ref,
      "Status": "New",
      "Placed at": new Date().toISOString(),
      "Name": document.getElementById("f-name").value.trim(),
      "Phone": document.getElementById("f-phone").value.trim(),
      "Needed for": document.getElementById("f-date").value,
      "Collection time": document.getElementById("f-time").value,
      "Order": orderText(),
      "Total £": totals.pay / 100,
      "Without code £": totals.public / 100,
      "Friends code": state.friends,
      "Language": state.lang === "bn" ? "Bengali" : "English",
      "Items JSON": JSON.stringify(state.cart),
    };
    var email = document.getElementById("f-email").value.trim();
    var allergies = document.getElementById("f-allergies").value.trim();
    var notes = document.getElementById("f-notes").value.trim();
    if (email) fields["Email"] = email;
    if (allergies) fields["Allergies"] = allergies;
    if (notes) fields["Notes"] = notes;

    fetch("https://api.airtable.com/v0/" + CFG.AIRTABLE_BASE + "/" + CFG.AIRTABLE_TABLE, {
      method: "POST",
      headers: { "Authorization": "Bearer " + CFG.token(), "Content-Type": "application/json" },
      body: JSON.stringify({ records: [{ fields: fields }], typecast: true }),
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function () {
      document.getElementById("confirm-ref").textContent = ref;
      var ov = document.getElementById("confirm-overlay");
      ov.classList.add("open");
      document.getElementById("confirm-close").focus();
      state.cart = [];
      renderSummary();
      document.getElementById("order-form").reset();
      setMinDate();
    }).catch(function () {
      submitErr.textContent = t("err_generic") + " 07404 034660.";
      submitErr.style.display = "block";
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = t("submit");
    });
  }

  /* ───────────────────────── misc wiring ──────────────────────── */
  function setMinDate() {
    var date = document.getElementById("f-date");
    date.min = minDateStr();
  }

  function setupChrome() {
    var header = document.querySelector(".header");
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }, { passive: true });

    // reveal on scroll
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach(function (n) { io.observe(n); });

      // The floating order bar is redundant (and can block taps) once the
      // order section is on screen — hide it there.
      var orderIo = new IntersectionObserver(function (entries) {
        document.getElementById("mobile-bar").classList.toggle("suppressed", entries[0].isIntersecting);
      }, { threshold: 0.05 });
      orderIo.observe(document.getElementById("order"));
    } else {
      document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
    }

    document.getElementById("confirm-close").addEventListener("click", function () {
      document.getElementById("confirm-overlay").classList.remove("open");
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("confirm-overlay").addEventListener("click", function (e) {
      if (e.target === this) this.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") document.getElementById("confirm-overlay").classList.remove("open");
    });

    document.getElementById("year").textContent = new Date().getFullYear();

    // hero / story image slots
    if (IMG.hero) {
      var plate = document.getElementById("hero-plate");
      plate.style.setProperty("--plate-img", "url('assets/img/" + IMG.hero + "')");
      plate.style.setProperty("--plate-img-op", "1");
    }
    if (IMG.ownerNote) {
      var por = document.getElementById("story-portrait");
      por.style.setProperty("--portrait-img", "url('assets/img/" + IMG.ownerNote + "')");
      por.style.setProperty("--portrait-img-op", "1");
    }
  }

  /* ───────────────────────── init ─────────────────────────────── */
  document.getElementById("lang-en").addEventListener("click", function () { setLang("en"); });
  document.getElementById("lang-bn").addEventListener("click", function () { setLang("bn"); });
  document.getElementById("submit-btn").addEventListener("click", submitOrder);

  setMinDate();
  setupFriends();
  setupChrome();
  applyI18n();
  renderMenu();
  renderBundles();
  renderSummary();
})();

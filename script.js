document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mainHeader = document.getElementById("main-header");
  const heroSection = document.getElementById("hero-section");

  // Toggle menu mobile saat tombol diklik
  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });

  // Sembunyikan menu mobile saat link di dalamnya diklik (untuk navigasi)
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
    });
  });

  // Fungsi untuk menangani efek scroll navbar
  function handleScroll() {
    // Dapatkan tinggi hero section. Gunakan offsetHeight untuk mendapatkan tinggi elemen termasuk padding.
    // Kurangi tinggi header agar transisi terjadi sebelum header sepenuhnya meninggalkan hero.
    const scrollThreshold = heroSection.offsetHeight - mainHeader.offsetHeight;

    if (window.scrollY > scrollThreshold) {
      // Jika sudah melewati threshold, jadikan navbar solid
      mainHeader.classList.remove("bg-transparent", "shadow-none");
      mainHeader.classList.add("bg-white", "shadow-md");
    } else {
      // Jika masih di dalam atau di atas hero section, jadikan navbar transparan
      mainHeader.classList.remove("bg-white", "shadow-md");
      mainHeader.classList.add("bg-transparent", "shadow-none");
    }
  }

  // Panggil handleScroll saat halaman dimuat (untuk kasus refresh di tengah halaman)
  handleScroll();

  // Tambahkan event listener untuk guliran
  window.addEventListener("scroll", handleScroll);
});
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("chatbot-toggle");
  const box = document.getElementById("chatbot-box");
  const close = document.getElementById("chatbot-close");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  toggle.addEventListener("click", () => box.classList.toggle("hidden"));
  close.addEventListener("click", () => box.classList.add("hidden"));

  input.addEventListener("keypress", async function (e) {
    if (e.key === "Enter" && this.value.trim() !== "") {
      const userMsg = this.value.trim();
      appendMessage("Anda", userMsg);
      this.value = "";

      appendMessage("Bot", "Sedang mengetik...");

      const reply = await askOpenAI(userMsg);
      updateLastBotMessage(reply);
    }
  });

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function updateLastBotMessage(newText) {
    const all = messages.querySelectorAll("div");
    const last = all[all.length - 1];
    if (last) last.innerHTML = `<strong>Bot:</strong> ${newText}`;
  }

  async function askOpenAI(prompt) {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "Kamu adalah asisten pintar di website AGRIGROTECH. Jawablah pertanyaan dengan sopan dan ringkas. Berikut informasi penting tentang website ini:- AGRIGROTECH menyediakan solusi digital dan monitoring AI untuk petani.- Produk unggulan: AgriInsight (platform pemantauan lahan berbasis AI).- Lokasi kantor: Jl. KH. Guru Amin No.28, RT.1/RW.4.- Tersedia halaman Laporan, Karir, dan Kontak.- Karir: posisi tersedia antara lain Software Engineer, Field Agronomist, dan Customer Support.Jawablah semua pertanyaan dengan ramah, akurat, dan relevan dengan AGRIGROTECH.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      return (
        data.choices?.[0]?.message?.content?.trim() ||
        "Maaf, saya tidak bisa menjawab."
      );
    } catch (err) {
      console.error(err);
      return "Terjadi kesalahan. Coba lagi nanti.";
    }
  }
});

<script setup lang="ts">
const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Sermons", href: "#sermons" },
  { label: "Ministries", href: "#ministries" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { name: "Facebook", icon: "lucide:facebook" },
  { name: "Instagram", icon: "lucide:instagram" },
  { name: "YouTube", icon: "lucide:youtube" },
];
</script>

<template>
  <footer class="bg-foreground text-white">
    <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div class="lg:col-span-2">
          <div class="mb-5 flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary"
            >
              <UIcon name="lucide:church" size="22" />
            </div>

            <div>
              <h2 class="font-['Playfair_Display'] text-xl">Grace Community</h2>
              <p class="text-xs tracking-widest text-white/50 uppercase">
                Church
              </p>
            </div>
          </div>

          <p class="max-w-md text-sm leading-relaxed text-white/65">
            A community of faith, hope, and love. Join us as we grow together,
            serve our community, and live out the Gospel.
          </p>

          <!-- Socials -->
          <div class="mt-6 flex gap-3">
            <button
              v-for="social in socials"
              :key="social.name"
              :aria-label="social.name"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-secondary hover:bg-secondary hover:text-primary"
            >
              <UIcon :name="social.icon" size="18" />
            </button>
          </div>
        </div>
        <div>
          <h3 class="mb-5 font-['Playfair_Display'] text-lg">Explore</h3>

          <nav class="flex flex-col gap-3">
            <a
              v-for="item in navigation"
              :key="item.label"
              :href="item.href"
              class="w-fit text-sm text-white/60 transition-colors hover:text-secondary"
            >
              {{ item.label }}
            </a>
          </nav>
        </div>
        <div>
          <h3 class="mb-5 font-['Playfair_Display'] text-lg">Connect</h3>

          <div class="space-y-4 text-sm text-white/60">
            <div class="flex items-start gap-3">
              <UIcon
                name="lucide:map-pin"
                size="18"
                class="mt-0.5 shrink-0 text-secondary"
              />
              <span>
                4820 Lakeview Drive<br >
                Pinewood, BC V3R 4K1
              </span>
            </div>

            <div class="flex items-center gap-3">
              <UIcon name="lucide:phone" size="18" class="text-secondary" />
              <span>(604) 555-0182</span>
            </div>

            <div class="flex items-center gap-3">
              <UIcon name="lucide:mail" size="18" class="text-secondary" />
              <span>hello@gracecommunity.church</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8"
      >
        <p>
          © {{ new Date().getFullYear() }} Grace Community Church. All rights
          reserved.
        </p>

        <p class="font-['Playfair_Display'] italic text-white/50">
          "Together in faith. Together in love."
        </p>
      </div>
    </div>
  </footer>
</template>

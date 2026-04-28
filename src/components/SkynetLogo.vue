<script setup>
defineProps({
  showText: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="skynet-logo" :class="{ 'skynet-logo--text': showText, 'skynet-logo--compact': compact }">
    <svg class="skynet-logo__mark" viewBox="0 0 160 160" role="img" aria-label="Skynet Lintas Nusantara">
      <defs>
        <linearGradient id="skynetShellTop" x1="20" y1="16" x2="137" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#6be8ff" />
          <stop offset="0.34" stop-color="#158cff" />
          <stop offset="0.66" stop-color="#2454ff" />
          <stop offset="1" stop-color="#9b30ff" />
        </linearGradient>
        <linearGradient id="skynetShellSide" x1="22" y1="42" x2="134" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#7440ff" />
          <stop offset="0.48" stop-color="#158cff" />
          <stop offset="1" stop-color="#3d168d" />
        </linearGradient>
        <linearGradient id="skynetCore" x1="52" y1="44" x2="105" y2="101" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#43d5ff" />
          <stop offset="0.52" stop-color="#0b8dff" />
          <stop offset="1" stop-color="#005493" />
        </linearGradient>
        <filter id="skynetMarkShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="11" stdDeviation="8" flood-color="#03133d" flood-opacity="0.34" />
        </filter>
      </defs>

      <g filter="url(#skynetMarkShadow)">
        <path
          d="M28 42 80 12l52 30v24L80 36 47 55v38L28 82Z"
          fill="url(#skynetShellTop)"
        />
        <path
          d="M132 78v40l-52 30-52-30V94l52 30 33-19V67Z"
          fill="url(#skynetShellSide)"
        />
        <path
          d="M39 46 80 22l41 24v12L80 35 51 52v33L39 78Z"
          fill="none"
          stroke="#bdefff"
          stroke-width="5"
          stroke-linejoin="round"
          opacity="0.68"
        />
        <path
          d="M121 84v28l-41 24-41-24v-12l41 23 29-17V74Z"
          fill="none"
          stroke="#a468ff"
          stroke-width="5"
          stroke-linejoin="round"
          opacity="0.72"
        />
        <path
          d="M57 58 80 45l23 13v27L80 99 57 85Z"
          fill="url(#skynetCore)"
        />
        <path d="M57 58 80 45l23 13-23 13Z" fill="#4edcff" opacity="0.88" />
        <path d="M57 58v27l23 14V71Z" fill="#0875df" opacity="0.8" />
        <path d="M103 58v27L80 99V71Z" fill="#004f91" opacity="0.82" />
        <path
          d="M28 42 80 12l52 30M28 118l52 30 52-30"
          fill="none"
          stroke="#ffffff"
          stroke-linecap="round"
          stroke-width="2.5"
          opacity="0.22"
        />
      </g>
    </svg>

    <div v-if="showText" class="skynet-logo__copy">
      <span class="skynet-logo__brand">SKYNET</span>
      <span v-if="!compact" class="skynet-logo__company">LINTAS NUSANTARA</span>
    </div>
  </div>
</template>

<style scoped>
.skynet-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.skynet-logo--text {
  gap: 1rem;
  justify-content: flex-start;
}

.skynet-logo__mark {
  display: block;
  height: 100%;
  width: 100%;
}

.skynet-logo--text .skynet-logo__mark {
  height: 4.5rem;
  width: 4.5rem;
}

.skynet-logo__copy {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.8rem 1.35rem;
  font-family: "Arial Black", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  line-height: 0.9;
}

.skynet-logo__brand,
.skynet-logo__company {
  color: transparent;
  background: linear-gradient(90deg, #0d8cff 0%, #2277ff 45%, #9722d9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  letter-spacing: 0.035em;
}

.skynet-logo__brand {
  font-size: clamp(1.85rem, 4vw, 3.8rem);
}

.skynet-logo__company {
  font-size: clamp(1.2rem, 2.8vw, 2.65rem);
}

.skynet-logo--compact .skynet-logo__mark {
  height: 2.9rem;
  width: 2.9rem;
}

.skynet-logo--compact .skynet-logo__brand {
  font-size: 1.75rem;
}
</style>

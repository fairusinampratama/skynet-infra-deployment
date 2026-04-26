<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutDashboard, FileSpreadsheet } from 'lucide-vue-next'

const route = useRoute()
const isDashboardRoute = computed(() => route.path === '/')
</script>

<template>
  <div
    class="app-shell min-h-screen pb-12 selection:bg-blue-300/30"
    :class="isDashboardRoute ? 'text-slate-100 selection:text-white' : 'text-slate-900 selection:text-slate-900'"
  >
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <template v-if="isDashboardRoute">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,_#020712_0%,_#061225_38%,_#020712_100%)]" />
        <div class="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.24),_transparent_56%)]" />
        <div class="absolute left-[-8rem] top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div class="absolute right-[-6rem] top-12 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div class="absolute bottom-0 left-1/2 h-[28rem] w-[72rem] -translate-x-1/2 bg-[radial-gradient(circle,_rgba(59,130,246,0.08),_transparent_58%)]" />
      </template>
      <template v-else>
        <div class="absolute inset-0 bg-[linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_45%,_#f8fafc_100%)]" />
        <div class="absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_56%)]" />
        <div class="absolute left-[-8rem] top-40 h-64 w-64 rounded-full bg-cyan-300/14 blur-3xl" />
        <div class="absolute right-[-6rem] top-16 h-72 w-72 rounded-full bg-blue-500/14 blur-3xl" />
      </template>
    </div>

    <header
      class="sticky top-0 z-20 backdrop-blur-xl"
      :class="
        isDashboardRoute
          ? 'border-b border-white/8 bg-[rgba(2,7,18,0.82)]'
          : 'border-b border-white/60 bg-white/72'
      "
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex min-h-18 flex-col justify-center gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4">
            <div class="app-logo">
              <div class="app-logo__core">S</div>
            </div>
            <div>
              <p
                class="text-[11px] font-semibold uppercase tracking-[0.28em]"
                :class="isDashboardRoute ? 'text-blue-200/80' : 'text-blue-700/80'"
              >
                Dashboard Proyek
              </p>
              <h1
                class="text-lg font-black tracking-[0.02em] md:text-2xl"
                :class="isDashboardRoute ? 'text-white' : 'text-slate-950'"
              >
                Pembangunan ODP & ODC SkyNet
              </h1>
            </div>
          </div>

          <nav class="flex flex-wrap items-center gap-2" aria-label="Tabs">
            <router-link
              to="/"
              class="group inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
              active-class="bg-[linear-gradient(135deg,_#1d4ed8,_#2563eb_45%,_#06b6d4)] text-white shadow-[0_18px_35px_-18px_rgba(37,99,235,0.7)]"
              exact-active-class="bg-[linear-gradient(135deg,_#1d4ed8,_#2563eb_45%,_#06b6d4)] text-white shadow-[0_18px_35px_-18px_rgba(37,99,235,0.7)]"
              :class="[
                $route.path === '/'
                  ? ''
                  : isDashboardRoute
                    ? 'bg-white/6 text-slate-200 ring-1 ring-white/10 hover:-translate-y-0.5 hover:text-white hover:shadow-md'
                    : 'bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-md'
              ]"
            >
              <LayoutDashboard :size="18" class="mr-2" />
              Overview
            </router-link>

            <router-link
              to="/crud"
              class="group inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
              active-class="bg-[linear-gradient(135deg,_#1d4ed8,_#2563eb_45%,_#06b6d4)] text-white shadow-[0_18px_35px_-18px_rgba(37,99,235,0.7)]"
              :class="[
                $route.path === '/crud'
                  ? ''
                  : isDashboardRoute
                    ? 'bg-white/6 text-slate-200 ring-1 ring-white/10 hover:-translate-y-0.5 hover:text-white hover:shadow-md'
                    : 'bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-md'
              ]"
            >
              <FileSpreadsheet :size="18" class="mr-2" />
              Pencatatan Harian
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main :class="isDashboardRoute ? 'mx-auto mt-5 max-w-[1480px] px-3 sm:px-4 lg:px-5' : 'mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8'">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-shell {
  font-family: "Trebuchet MS", "Segoe UI", Tahoma, sans-serif;
}

.app-logo {
  position: relative;
  display: flex;
  height: 3.25rem;
  width: 3.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 1.25rem;
  background:
    linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(6, 182, 212, 0.18)),
    linear-gradient(145deg, #1d4ed8, #0f172a);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 18px 30px -18px rgba(29, 78, 216, 0.75);
}

.app-logo::before,
.app-logo::after {
  content: '';
  position: absolute;
  inset: 0.35rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.app-logo::after {
  inset: 0.7rem;
}

.app-logo__core {
  display: flex;
  height: 1.45rem;
  width: 1.45rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #ffffff, #bfdbfe);
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 900;
}
</style>

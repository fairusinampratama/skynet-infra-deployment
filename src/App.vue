<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, ChevronDown, FileSpreadsheet, LayoutDashboard, MapPinned } from 'lucide-vue-next'
import SkynetLogo from './components/SkynetLogo.vue'

const route = useRoute()
const router = useRouter()

const areaRoutes = [
  { id: 'randuagung', name: 'Randuagung', path: '/randuagung', crudPath: '/crud/randuagung' },
  { id: 'pasar-gadang', name: 'Pasar Gadang', path: '/gadang', crudPath: '/crud/pasar-gadang' },
  { id: 'mangliawan', name: 'Mangliawan', path: '/mangliawan', crudPath: '/crud/mangliawan' }
]

const isDashboardRoute = computed(() => route.name?.toString().startsWith('dashboard'))
const isCrudRoute = computed(() => route.path.startsWith('/crud'))
const activeAreaId = computed(() => {
  if (isCrudRoute.value) {
    return route.params.areaId ?? 'randuagung'
  }

  return route.meta.areaId ?? 'randuagung'
})
const activeArea = computed(() =>
  areaRoutes.find((area) => area.id === activeAreaId.value) ?? areaRoutes[0]
)
const activeAreaPath = computed(() => {
  return areaRoutes.find((area) => area.id === activeAreaId.value)?.path ?? '/randuagung'
})
const activeCrudPath = computed(() =>
  areaRoutes.find((area) => area.id === activeAreaId.value)?.crudPath ?? '/crud/randuagung'
)
const isAreaMenuOpen = ref(false)
const areaMenuRef = ref(null)

const toggleAreaMenu = () => {
  isAreaMenuOpen.value = !isAreaMenuOpen.value
}

const selectArea = (area) => {
  isAreaMenuOpen.value = false
  router.push(isCrudRoute.value ? area.crudPath : area.path)
}

const areaMenuPathLabel = (area) => isCrudRoute.value ? area.crudPath : area.path

const closeAreaMenu = (event) => {
  if (!areaMenuRef.value?.contains(event.target)) {
    isAreaMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeAreaMenu)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeAreaMenu)
})
</script>

<template>
  <div
    class="app-shell min-h-screen pb-12 selection:bg-blue-300/30"
    :class="[
      isDashboardRoute
        ? 'text-slate-100 selection:text-white'
        : 'text-slate-900 selection:text-slate-900',
      isCrudRoute
        ? 'bg-[linear-gradient(180deg,_#f6f9ff_0%,_#eef4ff_42%,_#f8fbff_100%)]'
        : ''
    ]"
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
              <SkynetLogo compact />
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
              :to="activeAreaPath || '/randuagung'"
              class="group inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
              active-class="bg-[linear-gradient(135deg,_#1d4ed8,_#2563eb_45%,_#06b6d4)] text-white shadow-[0_18px_35px_-18px_rgba(37,99,235,0.7)]"
              exact-active-class="bg-[linear-gradient(135deg,_#1d4ed8,_#2563eb_45%,_#06b6d4)] text-white shadow-[0_18px_35px_-18px_rgba(37,99,235,0.7)]"
              :class="[
                isDashboardRoute
                  ? ''
                  : isDashboardRoute
                    ? 'bg-white/6 text-slate-200 ring-1 ring-white/10 hover:-translate-y-0.5 hover:text-white hover:shadow-md'
                    : 'bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-md'
              ]"
            >
              <LayoutDashboard :size="18" class="mr-2" />
              Overview
            </router-link>

            <div ref="areaMenuRef" class="area-nav-menu">
              <button
                type="button"
                class="area-nav-menu__trigger"
                :class="[
                  isDashboardRoute ? 'area-nav-menu__trigger--dark' : 'area-nav-menu__trigger--light',
                  { 'area-nav-menu__trigger--open': isAreaMenuOpen }
                ]"
                aria-haspopup="menu"
                :aria-expanded="isAreaMenuOpen"
                @click.stop="toggleAreaMenu"
              >
                <span class="area-nav-menu__mark">
                  <MapPinned :size="16" />
                </span>
                <span class="area-nav-menu__copy">
                  <small>Area</small>
                  <strong>{{ activeArea.name }}</strong>
                </span>
                <ChevronDown :size="16" class="area-nav-menu__chevron" :class="{ 'area-nav-menu__chevron--open': isAreaMenuOpen }" />
              </button>

              <div v-if="isAreaMenuOpen" class="area-nav-menu__panel" role="menu">
                <button
                  v-for="area in areaRoutes"
                  :key="area.id"
                  type="button"
                  class="area-nav-menu__item"
                  :class="{ 'area-nav-menu__item--active': activeAreaId === area.id }"
                  role="menuitem"
                  @click="selectArea(area)"
                >
                  <span class="area-nav-menu__item-icon">
                    <MapPinned :size="15" />
                  </span>
                  <span class="area-nav-menu__item-copy">
                    <strong>{{ area.name }}</strong>
                    <small>{{ areaMenuPathLabel(area) }}</small>
                  </span>
                  <Check v-if="activeAreaId === area.id" :size="16" class="area-nav-menu__check" />
                </button>
              </div>
            </div>

            <router-link
              :to="activeCrudPath"
              class="group inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
              active-class="bg-[linear-gradient(135deg,_#1d4ed8,_#2563eb_45%,_#06b6d4)] text-white shadow-[0_18px_35px_-18px_rgba(37,99,235,0.7)]"
              :class="[
                isCrudRoute
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

    <main
      :class="
        isDashboardRoute
          ? 'mx-auto mt-5 max-w-[1480px] px-3 sm:px-4 lg:px-5'
          : 'mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8'
      "
    >
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
  display: flex;
  height: 3.35rem;
  width: 3.35rem;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 15px 18px rgba(29, 78, 216, 0.42));
}

.area-nav-menu {
  position: relative;
  z-index: 30;
}

.area-nav-menu__trigger {
  display: inline-flex;
  min-width: 13.8rem;
  align-items: center;
  gap: 0.72rem;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  outline: none;
  padding: 0.42rem 0.72rem 0.42rem 0.48rem;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.area-nav-menu__trigger:hover,
.area-nav-menu__trigger--open {
  transform: translateY(-1px);
}

.area-nav-menu__trigger--dark {
  border: 1px solid rgba(125, 211, 252, 0.26);
  background:
    radial-gradient(circle at 10% 0, rgba(56, 189, 248, 0.18), transparent 36%),
    linear-gradient(180deg, rgba(13, 37, 80, 0.96), rgba(4, 16, 39, 0.96));
  color: #eaf6ff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.09),
    0 18px 35px -25px rgba(14, 165, 233, 0.62);
}

.area-nav-menu__trigger--light {
  border: 1px solid rgba(148, 163, 184, 0.34);
  background:
    radial-gradient(circle at 10% 0, rgba(37, 99, 235, 0.12), transparent 38%),
    rgba(255, 255, 255, 0.92);
  color: #0f172a;
  box-shadow: 0 18px 35px -26px rgba(15, 23, 42, 0.3);
}

.area-nav-menu__trigger--open {
  border-color: rgba(56, 189, 248, 0.72);
  box-shadow:
    0 0 0 3px rgba(56, 189, 248, 0.13),
    0 20px 35px -26px rgba(14, 165, 233, 0.7);
}

.area-nav-menu__mark,
.area-nav-menu__item-icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
}

.area-nav-menu__mark {
  height: 2rem;
  width: 2rem;
  background: linear-gradient(135deg, #1d4ed8, #0891b2);
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24);
}

.area-nav-menu__copy {
  display: grid;
  flex: 1;
  min-width: 0;
  text-align: left;
}

.area-nav-menu__copy small {
  color: rgba(191, 219, 254, 0.82);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
}

.area-nav-menu__trigger--light .area-nav-menu__copy small {
  color: rgba(37, 99, 235, 0.78);
}

.area-nav-menu__copy strong {
  margin-top: 0.18rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 900;
  line-height: 1.1;
}

.area-nav-menu__chevron {
  flex: none;
  transition: transform 160ms ease;
}

.area-nav-menu__chevron--open {
  transform: rotate(180deg);
}

.area-nav-menu__panel {
  position: absolute;
  right: 0;
  top: calc(100% + 0.65rem);
  width: 18rem;
  overflow: hidden;
  border-radius: 1.05rem;
  border: 1px solid rgba(96, 165, 250, 0.28);
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 32%),
    linear-gradient(180deg, rgba(248, 251, 255, 0.98), rgba(226, 239, 255, 0.98));
  padding: 0.42rem;
  box-shadow:
    0 24px 50px -28px rgba(2, 6, 23, 0.74),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.area-nav-menu__item {
  display: grid;
  width: 100%;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  border: 0;
  border-radius: 0.78rem;
  background: transparent;
  color: #0f172a;
  cursor: pointer;
  padding: 0.68rem 0.72rem;
  text-align: left;
  transition: background 140ms ease, color 140ms ease, transform 140ms ease;
}

.area-nav-menu__item:hover,
.area-nav-menu__item--active {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.94), rgba(8, 145, 178, 0.92));
  color: #ffffff;
  transform: translateY(-1px);
}

.area-nav-menu__item-icon {
  height: 2rem;
  width: 2rem;
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
}

.area-nav-menu__item:hover .area-nav-menu__item-icon,
.area-nav-menu__item--active .area-nav-menu__item-icon {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.area-nav-menu__item-copy {
  display: grid;
  min-width: 0;
}

.area-nav-menu__item-copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 900;
}

.area-nav-menu__item-copy small {
  margin-top: 0.16rem;
  color: rgba(71, 85, 105, 0.78);
  font-size: 0.72rem;
  font-weight: 800;
}

.area-nav-menu__item:hover .area-nav-menu__item-copy small,
.area-nav-menu__item--active .area-nav-menu__item-copy small {
  color: rgba(239, 246, 255, 0.82);
}

.area-nav-menu__check {
  color: currentColor;
}
</style>

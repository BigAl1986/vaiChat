<template>
  <div class="settings">
    <h3>{{ $t("settings.title") }}</h3>

    <TabsRoot v-model="activeTab" class="tabs">
      <TabsList class="tabs-list">
        <TabsTrigger
          value="general"
          class="tabs-trigger"
          :class="{ active: activeTab === 'general' }"
          >{{ $t("settings.general") }}</TabsTrigger
        >
        <TabsTrigger
          value="model"
          class="tabs-trigger"
          :class="{ active: activeTab === 'model' }"
          >{{ $t("settings.model") }}</TabsTrigger
        >
        <TabsIndicator class="tabs-indicator" :style="indicatorStyle" />
      </TabsList>

      <TabsContent value="general">
        <div class="row">
          <Label>{{ $t("settings.language") }}</Label>

          <SelectRoot v-model="language">
            <SelectTrigger class="select-trigger">
              <SelectValue placeholder="请选择语言">
                {{
                  language === "zh-CN"
                    ? $t("settings.languageZhCN")
                    : $t("settings.languageEnUS")
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectPortal>
              <SelectContent class="bg-white rounded-md shadow-md z-100 border">
                <SelectViewport class="p-2">
                  <SelectItem value="zh-CN">
                    <SelectItemText>{{
                      $t("settings.languageZhCN")
                    }}</SelectItemText>
                  </SelectItem>
                  <SelectItem value="en-US">
                    <SelectItemText>{{
                      $t("settings.languageEnUS")
                    }}</SelectItemText>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>

        <div class="row">
          <Label>{{ $t("settings.fontSize") }}</Label>

          <NumberFieldRoot
            v-model.number="fontSize"
            class="number-field"
            aria-label="字体大小"
          >
            <NumberFieldDecrement class="nf-btn">-</NumberFieldDecrement>

            <NumberFieldInput
              v-model.number="fontSize"
              :min="MIN"
              :max="MAX"
              step="1"
              class="number-input"
              aria-label="font-size-input"
            />

            <NumberFieldIncrement class="nf-btn">+</NumberFieldIncrement>
          </NumberFieldRoot>

          <span class="font-size-display">{{ fontSize }} px</span>
        </div>

        <div class="row theme-color-row">
          <Label>{{ $t("settings.themeColor") }}</Label>

          <div class="theme-color-picker">
            <div
              v-for="colorOption in themeColorOptions"
              :key="colorOption.value"
              class="color-option"
              :class="{ active: themeColor === colorOption.value }"
              :style="{ backgroundColor: colorOption.value }"
              :title="colorOption.name"
              @click="selectThemeColor(colorOption.value)"
              :aria-label="colorOption.name"
            >
              <Icon
                v-if="themeColor === colorOption.value"
                icon="radix-icons:check"
                class="check-icon"
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="model">
        <div class="accordion-container">
          <AccordionRoot type="single" collapsible>
            <AccordionItem
              v-for="provider in providers"
              :key="provider.id"
              :value="provider.id.toString()"
              class="border border-gray-300 rounded-md p-2 mb-2"
            >
              <AccordionHeader>
                <AccordionTrigger
                  class="w-full flex items-center justify-between accordion-trigger"
                >
                  <span>{{ provider.name }}</span>
                  <Icon icon="radix-icons:chevron-right" class="icon" />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <div class="accordion-content">
                  <div
                    class="flex mb-1 items-center"
                    v-for="conf in configs[provider.name]"
                    :key="conf"
                  >
                    <label :for="conf" class="w-24">{{ conf }}</label>
                    <input
                      :type="conf === 'base-url' ? 'text' : 'password'"
                      :id="conf"
                      :name="conf"
                      class="flex-1 px-2 py-1 border rounded-md border-gray-300"
                      v-model="providerConfigs[provider.name][conf]"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </div>
      </TabsContent>
    </TabsRoot>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
  Label,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "radix-vue";
import { db } from "../db";
import { Icon } from "@iconify/vue";
import { ProviderProps } from "../types";

const language = ref<string>("zh-CN");
const fontSize = ref<number>(14);
const themeColor = ref<string>("#16a34a");
const MIN = 10;
const MAX = 48;
const activeTab = ref<string>("general");
const providers = ref<ProviderProps[]>([]);
const providerConfigs = ref<Record<string, Record<string, string>>>({});
const { locale, t } = useI18n();
const configs: { [key: string]: string[] } = {
  qianfan: ["access-key", "secret-key"],
  dashscope: ["api-key", "base-url"],
  deepseek: ["api-key", "base-url"],
};

// Tailwind CSS 颜色选项（600 色阶）
const themeColorOptions = computed(() => [
  { name: t("settings.themeColorRed"), value: "#dc2626" }, // red-600
  { name: t("settings.themeColorOrange"), value: "#ea580c" }, // orange-600
  { name: t("settings.themeColorAmber"), value: "#d97706" }, // amber-600
  { name: t("settings.themeColorYellow"), value: "#ca8a04" }, // yellow-600
  { name: t("settings.themeColorLime"), value: "#65a30d" }, // lime-600
  { name: t("settings.themeColorGreen"), value: "#16a34a" }, // green-600
  { name: t("settings.themeColorEmerald"), value: "#059669" }, // emerald-600
  { name: t("settings.themeColorTeal"), value: "#0d9488" }, // teal-600
  { name: t("settings.themeColorCyan"), value: "#0891b2" }, // cyan-600
  { name: t("settings.themeColorSky"), value: "#0284c7" }, // sky-600
  { name: t("settings.themeColorBlue"), value: "#2563eb" }, // blue-600
  { name: t("settings.themeColorIndigo"), value: "#4f46e5" }, // indigo-600
  { name: t("settings.themeColorViolet"), value: "#7c3aed" }, // violet-600
  { name: t("settings.themeColorPurple"), value: "#9333ea" }, // purple-600
  { name: t("settings.themeColorFuchsia"), value: "#c026d3" }, // fuchsia-600
  { name: t("settings.themeColorPink"), value: "#db2777" }, // pink-600
  { name: t("settings.themeColorRose"), value: "#e11d48" }, // rose-600
]);

const indicatorStyle = computed(() => {
  const left = activeTab.value === "general" ? 0 : "50%";
  return {
    left,
  };
});

function clamp(v: number) {
  if (v < MIN) return MIN;
  if (v > MAX) return MAX;
  return v;
}

function applyFontSize(size: number) {
  document.documentElement.style.fontSize = `${size}px`;
}

function applyThemeColor(color: string) {
  document.documentElement.style.setProperty("--theme-color", color);
  // 计算 hover 颜色（稍微变暗）
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const hoverR = Math.max(0, Math.floor(r * 0.9));
  const hoverG = Math.max(0, Math.floor(g * 0.9));
  const hoverB = Math.max(0, Math.floor(b * 0.9));
  const hoverColor = `#${hoverR.toString(16).padStart(2, "0")}${hoverG.toString(16).padStart(2, "0")}${hoverB.toString(16).padStart(2, "0")}`;
  document.documentElement.style.setProperty("--theme-color-hover", hoverColor);
  // 计算浅色背景（用于 plain 按钮）
  const lightR = Math.min(255, Math.floor(r + (255 - r) * 0.9));
  const lightG = Math.min(255, Math.floor(g + (255 - g) * 0.9));
  const lightB = Math.min(255, Math.floor(b + (255 - b) * 0.9));
  const lightColor = `rgb(${lightR}, ${lightG}, ${lightB})`;
  document.documentElement.style.setProperty("--theme-color-light", lightColor);
  // 计算文字颜色（根据亮度决定使用白色还是深色）
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 128 ? "#1f2937" : "#ffffff";
  document.documentElement.style.setProperty("--theme-text-color", textColor);
}

async function load() {
  const cfg = await window.appConfig.get();
  language.value = cfg.language ?? language.value;
  let loaded = Number(cfg.fontSize ?? fontSize.value);
  if (Number.isNaN(loaded)) loaded = fontSize.value;
  loaded = clamp(loaded);
  fontSize.value = loaded;
  applyFontSize(loaded);
  
  // 加载主题色，如果不在预设列表中则使用默认值
  const savedColor = cfg.themeColor ?? themeColor.value;
  const isValidColor = themeColorOptions.value.some(opt => opt.value === savedColor);
  themeColor.value = isValidColor ? savedColor : themeColor.value;
  applyThemeColor(themeColor.value);
  
  providerConfigs.value = cfg.providerConfigs ?? {};

  // 加载 providers 数据
  await loadProviders();
}

async function loadProviders() {
  try {
    // 从 db 中获取 providers 数据
    providers.value = await db.providers.toArray();
    ensureProviderConfigsShape();
  } catch (e) {
    console.error("load providers error", e);
    providers.value = [];
  }
}

function ensureProviderConfigsShape() {
  providers.value.forEach((provider) => {
    const name = provider.name;
    if (!providerConfigs.value[name]) {
      providerConfigs.value[name] = {};
    }
    (configs[name] || []).forEach((conf) => {
      if (typeof providerConfigs.value[name][conf] !== "string") {
        providerConfigs.value[name][conf] = "";
      }
    });
  });
}

async function saveFontSize(val: number) {
  try {
    await window.appConfig.set("fontSize", val);
  } catch (e) {
    console.error("save fontSize error", e);
  }
}

watch(
  fontSize,
  async (rawVal) => {
    let v = Number(rawVal);
    if (Number.isNaN(v)) v = MIN;
    const clamped = clamp(v);
    if (clamped !== v) {
      fontSize.value = clamped;
      v = clamped;
    }
    applyFontSize(v);
    await saveFontSize(v);
  },
  { immediate: false }
);

watch(
  providerConfigs,
  async (val) => {
    const plainVal = JSON.parse(JSON.stringify(val));
    try {
      await window.appConfig.set("providerConfigs", plainVal);
    } catch (e) {
      console.error("save provider configs error", e);
    }
  },
  { deep: true }
);

watch(
  language,
  async (val) => {
    try {
      locale.value = val as "zh-CN" | "en-US";
      await window.appConfig.set("language", val);
    } catch (e) {
      console.error("save language error", e);
    }
  },
  { immediate: false }
);

function selectThemeColor(color: string) {
  themeColor.value = color;
  applyThemeColor(color);
  saveThemeColor(color);
}

async function saveThemeColor(color: string) {
  try {
    await window.appConfig.set("themeColor", color);
  } catch (e) {
    console.error("save themeColor error", e);
  }
}

onMounted(load);
</script>

<style scoped>
.settings {
  padding: 16px;
  max-width: 480px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px 0;
}
.select-trigger {
  min-width: 160px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: inline-block;
}
.number-input {
  width: 80px;
  text-align: center;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.number-field {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.nf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  user-select: none;
}
.nf-btn:active {
  transform: translateY(1px);
}
.font-size-display {
  margin-left: 8px;
  min-width: 56px;
  text-align: left;
}
.tabs {
  margin-bottom: 16px;
}
.tabs-list {
  border-bottom: 2px solid #ccc;
  display: flex;
  gap: 16px;
  position: relative;
}
.tabs-trigger {
  flex: 1;
  padding: 8px 16px;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  white-space: nowrap;
}
.tabs-trigger.active {
  font-weight: bold;
  color: var(--theme-color, #16a34a);
}
.tabs-indicator {
  width: 50%;
  height: 2px;
  background: var(--theme-color, #16a34a);
  position: absolute;
  bottom: -2px;
  transition:
    left 0.3s ease,
    width 0.3s ease;
}
.accordion-container {
  margin-top: 16px;
}
.accordion-trigger[data-state="open"] .icon {
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}
.accordion-content {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}
.provider-details {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
.theme-color-row {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.theme-color-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 300px;
}
.color-option {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}
.color-option:hover {
  transform: scale(1.1);
  border-color: #ccc;
}
.color-option.active {
  border-color: #333;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}
.check-icon {
  width: 18px;
  height: 18px;
  color: white;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}
</style>

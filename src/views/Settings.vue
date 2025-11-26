<template>
  <div class="settings">
    <h3>{{ $t("settings.title") }}</h3>

    <div class="row">
      <label>{{ $t("settings.language") }}</label>

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
      <label>{{ $t("settings.fontSize") }}</label>

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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
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
} from "radix-vue";

const { locale } = useI18n();

const language = ref<string>("zh-CN");
const fontSize = ref<number>(14);
const MIN = 10;
const MAX = 48;

function clamp(v: number) {
  if (v < MIN) return MIN;
  if (v > MAX) return MAX;
  return v;
}

function applyFontSize(size: number) {
  document.documentElement.style.fontSize = `${size}px`;
}

async function load() {
  const cfg = await window.appConfig.get();
  language.value = cfg.language ?? language.value;
  let loaded = Number(cfg.fontSize ?? fontSize.value);
  if (Number.isNaN(loaded)) loaded = fontSize.value;
  loaded = clamp(loaded);
  fontSize.value = loaded;
  applyFontSize(loaded);

  // 同步 i18n locale
  const appLocale = (await window.electronI18n.getLocale()) as
    | "zh-CN"
    | "en-US";
  locale.value = appLocale;
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
  language,
  async (val) => {
    try {
      // 更新 i18n locale
      locale.value = val as "zh-CN" | "en-US";
      // 保存配置到主进程
      await window.appConfig.set("language", val);
    } catch (e) {
      console.error("save language error", e);
    }
  },
  { immediate: false }
);

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
.row label {
  width: 120px;
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
</style>

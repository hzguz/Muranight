const THEME_MAP_KEY = "nightModeByUrl";
const SETTINGS_KEY = "nightModeSettings";
const SETTINGS_VERSION = 3;

const MAX_THEME_INTENSITY = 500;
const INTENSITY_CAP_OPTIONS = [200, 300, 400, 500];

const PRESET_COLORS = {
  warm: "#FFCC66",
  blue: "#6F97FF"
};

const DEFAULT_PRESET = {
  intensity: 45,
  colorMode: "warm",
  customColor: PRESET_COLORS.warm,
  updatedAt: 0
};

const DEFAULT_SCHEDULE = {
  enabled: false,
  startTime: "21:00",
  endTime: "00:00"
};

const DEFAULT_ACCESSIBILITY = {
  reduceMotion: false,
  softenBrightness: false,
  reduceSaturation: false,
  flashMitigation: false
};

const DEFAULT_SETTINGS = {
  version: SETTINGS_VERSION,
  mode: "per_page",
  perPagePreset: { ...DEFAULT_PRESET },
  globalPreset: { ...DEFAULT_PRESET },
  intensityCap: 200,
  schedule: { ...DEFAULT_SCHEDULE },
  accessibility: { ...DEFAULT_ACCESSIBILITY },
  localeMode: "auto",
  manualLocale: "en",
  profiles: []
};

const EN_STRINGS = {
  logo_aria: "App logo and name",
  settings_open_title: "Open settings",
  settings_close_title: "Close settings",
  apply_mode_legend: "Apply mode",
  mode_per_page: "Per page",
  mode_all_pages: "All pages",
  enable_this_url: "Enable on this URL",
  intensity_label: "Intensity",
  color_title: "Color",
  color_warm: "Warm",
  color_blue: "Blue",
  color_custom: "Custom",
  picker_label: "Picker",
  hex_label: "Hex",
  settings_title: "Settings",
  settings_language_title: "Language",
  settings_language_selector_label: "Language",
  settings_language_default_prefix: "Default",
  settings_intensity_title: "Max intensity",
  settings_intensity_cap_label: "Upper limit",
  settings_schedule_title: "Activation schedule",
  settings_schedule_enabled_label: "Enable schedule",
  settings_schedule_start_label: "Start",
  settings_schedule_end_label: "End",
  settings_tab_general: "General",
  settings_tab_profiles: "Profiles",
  settings_tab_data: "File",
  settings_tab_accessibility: "Accessibility",
  settings_a11y_title: "Accessibility",
  settings_a11y_desc: "Always-on protections applied to every supported page.",
  settings_a11y_reduce_motion: "Reduce motion",
  settings_a11y_soften_brightness: "Soften brightness",
  settings_a11y_reduce_saturation: "Reduce strong colors",
  settings_a11y_flash_mitigation: "Flash mitigation",
  settings_profiles_title: "Local profiles",
  profile_name_placeholder: "My preset",
  profile_select_label: "Saved profiles",
  profile_select_empty: "No saved profiles",
  profile_save_button: "Save",
  profile_apply_button: "Apply",
  profile_delete_button: "Delete",
  profile_empty: "No saved profiles.",
  settings_file_title: "File",
  file_export_button: "Export .txt",
  file_import_button: "Import .txt",
  settings_reset_title: "Reset",
  reset_button: "Reset saved settings",
  locale_name_pt_br: "Portuguese (Brazil)",
  locale_name_en: "English",
  locale_name_es: "Spanish",
  locale_name_fr: "French",
  locale_name_de: "German",
  status_popup_load_failed: "Could not load the popup.",
  status_invalid_tab: "Invalid active tab.",
  status_unsupported_page: "This page does not allow extensions (chrome://, edge://, Web Store etc.).",
  status_apply_failed: "Could not apply to this tab right now.",
  status_remove_failed: "Could not remove from this tab right now.",
  status_reset_done: "Settings were reset successfully.",
  status_reset_failed: "Could not reset saved settings.",
  status_profile_saved: "Profile saved.",
  status_profile_deleted: "Profile deleted.",
  status_profile_applied: "Profile applied.",
  status_profile_name_required: "Type a profile name.",
  status_export_done: "File exported successfully.",
  status_export_failed: "Could not export file.",
  status_import_done: "File imported successfully.",
  status_import_failed: "Could not import file.",
  status_import_invalid: "Invalid file for import.",
  status_import_no_file: "Choose a file to import."
};

const I18N = {
  en: EN_STRINGS,
  "pt-BR": {
    ...EN_STRINGS,
    logo_aria: "Logo e nome do app",
    settings_open_title: "Abrir configurações",
    settings_close_title: "Fechar configurações",
    apply_mode_legend: "Modo de aplicação",
    mode_per_page: "Por página",
    mode_all_pages: "Todas",
    enable_this_url: "Ativar nesta URL",
    intensity_label: "Intensidade",
    color_title: "Cor",
    color_warm: "Amarelada",
    color_blue: "Azul",
    color_custom: "Personalizada",
    settings_title: "Configurações",
    settings_language_title: "Idioma",
    settings_language_selector_label: "Idioma",
    settings_language_default_prefix: "Padrão",
    settings_intensity_title: "Intensidade máxima",
    settings_intensity_cap_label: "Limite superior",
    settings_schedule_title: "Horário de ativação",
    settings_schedule_enabled_label: "Ativar agendamento",
    settings_schedule_start_label: "Início",
    settings_schedule_end_label: "Encerramento",
    settings_tab_general: "Geral",
    settings_tab_profiles: "Perfis",
    settings_tab_data: "Arquivo",
    settings_tab_accessibility: "Acessibilidade",
    settings_a11y_title: "Acessibilidade",
    settings_a11y_desc: "Proteções sempre ativas em todas as páginas compatíveis.",
    settings_a11y_reduce_motion: "Reduzir movimento",
    settings_a11y_soften_brightness: "Suavizar brilho",
    settings_a11y_reduce_saturation: "Reduzir cores fortes",
    settings_a11y_flash_mitigation: "Mitigar flashes",
    settings_profiles_title: "Perfis locais",
    profile_name_placeholder: "Meu preset",
    profile_select_label: "Perfis salvos",
    profile_select_empty: "Nenhum perfil salvo",
    profile_save_button: "Salvar",
    profile_delete_button: "Excluir",
    profile_empty: "Nenhum perfil salvo.",
    settings_file_title: "Arquivo",
    file_export_button: "Exportar .txt",
    file_import_button: "Importar .txt",
    reset_button: "Resetar opções salvas",
    locale_name_pt_br: "Português (Brasil)",
    locale_name_en: "Inglês",
    locale_name_es: "Espanhol",
    locale_name_fr: "Francês",
    locale_name_de: "Alemão",
    status_popup_load_failed: "Não foi possível carregar o popup.",
    status_invalid_tab: "Aba ativa inválida.",
    status_unsupported_page: "Esta página não permite extensões (chrome://, edge://, Web Store etc.).",
    status_apply_failed: "Não foi possível aplicar nesta aba agora.",
    status_remove_failed: "Não foi possível remover nesta aba agora.",
    status_reset_done: "Configurações resetadas com sucesso.",
    status_reset_failed: "Não foi possível resetar as configurações.",
    status_profile_saved: "Perfil salvo.",
    status_profile_deleted: "Perfil removido.",
    status_profile_applied: "Perfil aplicado.",
    status_profile_name_required: "Informe um nome para o perfil.",
    status_export_done: "Arquivo exportado com sucesso.",
    status_export_failed: "Não foi possível exportar o arquivo.",
    status_import_done: "Arquivo importado com sucesso.",
    status_import_failed: "Não foi possível importar o arquivo.",
    status_import_invalid: "Arquivo inválido para importação.",
    status_import_no_file: "Selecione um arquivo para importar."
  },
  es: {
    ...EN_STRINGS,
    mode_per_page: "Por pagina",
    mode_all_pages: "Todas",
    enable_this_url: "Activar en esta URL",
    intensity_label: "Intensidad",
    color_warm: "Amarillada",
    color_custom: "Personalizada",
    settings_title: "Configuracion",
    settings_language_title: "Idioma",
    settings_language_default_prefix: "Predeterminado",
    settings_profiles_title: "Perfiles locales",
    profile_save_button: "Guardar",
    profile_delete_button: "Eliminar",
    file_export_button: "Exportar .txt",
    file_import_button: "Importar .txt",
    locale_name_en: "Ingles",
    locale_name_es: "Espanol",
    locale_name_fr: "Frances",
    locale_name_de: "Aleman"
  },
  fr: {
    ...EN_STRINGS,
    mode_per_page: "Par page",
    mode_all_pages: "Toutes",
    enable_this_url: "Activer sur cette URL",
    intensity_label: "Intensite",
    color_custom: "Personnalisee",
    settings_title: "Parametres",
    settings_language_title: "Langue",
    settings_language_default_prefix: "Par defaut",
    profile_save_button: "Enregistrer",
    profile_delete_button: "Supprimer",
    locale_name_en: "Anglais",
    locale_name_es: "Espagnol",
    locale_name_fr: "Francais",
    locale_name_de: "Allemand"
  },
  de: {
    ...EN_STRINGS,
    mode_per_page: "Pro Seite",
    mode_all_pages: "Alle",
    enable_this_url: "Auf dieser URL aktivieren",
    intensity_label: "Intensitat",
    color_custom: "Benutzerdefiniert",
    settings_title: "Einstellungen",
    settings_language_title: "Sprache",
    settings_language_default_prefix: "Standard",
    profile_save_button: "Speichern",
    profile_delete_button: "Loschen",
    locale_name_en: "Englisch",
    locale_name_es: "Spanisch",
    locale_name_fr: "Franzosisch",
    locale_name_de: "Deutsch"
  }
};

const elements = {
  openSettingsButton: document.getElementById("openSettingsButton"),
  closeSettingsButton: document.getElementById("closeSettingsButton"),
  settingsPanel: document.getElementById("settingsPanel"),
  settingsTabPanelsContainer: document.getElementById("settingsTabPanelsContainer"),
  settingsTabButtons: Array.from(document.querySelectorAll("[data-settings-tab]")),
  settingsTabPanels: Array.from(document.querySelectorAll("[data-settings-tab-panel]")),
  applyModeRadios: Array.from(document.querySelectorAll('input[name="applyMode"]')),
  perPageToggleRow: document.getElementById("perPageToggleRow"),
  enabledToggle: document.getElementById("enabledToggle"),
  intensityRange: document.getElementById("intensityRange"),
  intensityValue: document.getElementById("intensityValue"),
  colorRadios: Array.from(document.querySelectorAll('input[name="colorMode"]')),
  customColorPanel: document.getElementById("customColorPanel"),
  customColorPicker: document.getElementById("customColorPicker"),
  customColorHex: document.getElementById("customColorHex"),
  statusMessage: document.getElementById("statusMessage"),
  languageSelect: document.getElementById("languageSelect"),
  intensityCapSelect: document.getElementById("intensityCapSelect"),
  scheduleTimePanel: document.getElementById("scheduleTimePanel"),
  scheduleEnabledToggle: document.getElementById("scheduleEnabledToggle"),
  scheduleStartTimeInput: document.getElementById("scheduleStartTimeInput"),
  scheduleEndTimeInput: document.getElementById("scheduleEndTimeInput"),
  a11yReduceMotionToggle: document.getElementById("a11yReduceMotionToggle"),
  a11ySoftenBrightnessToggle: document.getElementById("a11ySoftenBrightnessToggle"),
  a11yReduceSaturationToggle: document.getElementById("a11yReduceSaturationToggle"),
  a11yFlashMitigationToggle: document.getElementById("a11yFlashMitigationToggle"),
  profileNameInput: document.getElementById("profileNameInput"),
  profileSelect: document.getElementById("profileSelect"),
  saveProfileButton: document.getElementById("saveProfileButton"),
  applySelectedProfileButton: document.getElementById("applySelectedProfileButton"),
  deleteSelectedProfileButton: document.getElementById("deleteSelectedProfileButton"),
  exportSettingsButton: document.getElementById("exportSettingsButton"),
  importFileInput: document.getElementById("importFileInput"),
  resetAllButton: document.getElementById("resetAllButton")
};

let currentTabId = null;
let currentUrlKey = null;
let isSupportedPage = false;
let suspendHandlers = false;
let currentSettings = sanitizeSettings(DEFAULT_SETTINGS);
let currentApplyMode = "per_page";
let themeMapCache = {};
let isUiInitialized = false;
let activeLocale = "en";
let activeSettingsTab = "general";
let settingsTabAnimationToken = 0;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initializePopup().catch(() => {
  applyLocalization();
  setStatus(t("status_popup_load_failed"));
  setControlsEnabled(false);
});

async function initializePopup() {
  attachEventListeners();
  revealUiShell();

  currentSettings = await readSettings();
  currentApplyMode = currentSettings.mode;
  themeMapCache = await readThemeMap();

  applyLocalization();
  applySettingsPanelState();

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!activeTab || typeof activeTab.id !== "number" || !activeTab.url) {
    setUnsupportedState(t("status_invalid_tab"));
    applyFallbackMainControlsForUnsupportedPage();
    isUiInitialized = true;
    return;
  }

  currentTabId = activeTab.id;
  isSupportedPage = isSupportedPageUrl(activeTab.url);

  if (!isSupportedPage) {
    setUnsupportedState(t("status_unsupported_page"));
    applyFallbackMainControlsForUnsupportedPage();
    isUiInitialized = true;
    return;
  }

  currentUrlKey = normalizeUrlKey(activeTab.url);
  setControlsEnabled(true);
  clearStatus();

  await syncMainControlsFromStateAndPage({ applyThemeToTab: true });
  isUiInitialized = true;
}

function attachEventListeners() {
  elements.openSettingsButton?.addEventListener("click", openSettingsPanel);
  elements.closeSettingsButton?.addEventListener("click", closeSettingsPanel);
  for (const tabButton of elements.settingsTabButtons) {
    tabButton.addEventListener("click", () => {
      setSettingsTab(tabButton.getAttribute("data-settings-tab"), true);
    });
  }

  for (const modeRadio of elements.applyModeRadios) {
    modeRadio.addEventListener("change", async () => {
      if (suspendHandlers || !isSupportedPage) {
        return;
      }

      const nextMode = getSelectedApplyMode();
      if (nextMode === currentApplyMode) {
        return;
      }

      await onApplyModeChanged(nextMode);
    });
  }

  elements.enabledToggle?.addEventListener("change", async () => {
    if (suspendHandlers || !isSupportedPage || currentApplyMode !== "per_page") {
      return;
    }

    await onPerPageToggleChanged(Boolean(elements.enabledToggle.checked));
  });

  elements.intensityRange?.addEventListener("input", async () => {
    updateSliderVisualState({ animateValuePulse: true });

    if (suspendHandlers || !isSupportedPage) {
      return;
    }

    await handleThemeControlChange();
  });

  for (const radio of elements.colorRadios) {
    radio.addEventListener("change", async () => {
      updateCustomColorVisibility();
      updateSliderVisualState();

      if (suspendHandlers || !isSupportedPage) {
        return;
      }

      await handleThemeControlChange();
    });
  }

  elements.customColorPicker?.addEventListener("input", async () => {
    const normalizedHex = normalizeHex(elements.customColorPicker.value);
    if (!normalizedHex) {
      return;
    }

    elements.customColorHex.value = normalizedHex;
    elements.customColorHex.classList.remove("invalid");
    updateSliderVisualState();

    if (suspendHandlers || !isSupportedPage || getSelectedColorMode() !== "custom") {
      return;
    }

    await handleThemeControlChange();
  });

  elements.customColorHex?.addEventListener("input", async () => {
    const normalizedHex = normalizeHex(elements.customColorHex.value);

    if (!normalizedHex) {
      elements.customColorHex.classList.add("invalid");
      return;
    }

    elements.customColorHex.classList.remove("invalid");
    elements.customColorHex.value = normalizedHex;
    elements.customColorPicker.value = normalizedHex;
    updateSliderVisualState();

    if (suspendHandlers || !isSupportedPage || getSelectedColorMode() !== "custom") {
      return;
    }

    await handleThemeControlChange();
  });

  elements.customColorHex?.addEventListener("blur", () => {
    const normalizedHex = normalizeHex(elements.customColorHex.value);
    if (normalizedHex) {
      elements.customColorHex.value = normalizedHex;
      elements.customColorHex.classList.remove("invalid");
      return;
    }

    elements.customColorHex.classList.add("invalid");
  });

  elements.languageSelect?.addEventListener("change", async () => {
    if (suspendHandlers) {
      return;
    }
    await onLanguageSelectChanged();
  });

  elements.intensityCapSelect?.addEventListener("change", async () => {
    if (suspendHandlers) {
      return;
    }
    await onIntensityCapChanged();
  });

  elements.scheduleEnabledToggle?.addEventListener("change", async () => {
    if (suspendHandlers) {
      return;
    }
    updateScheduleInputsState();
    await onScheduleChanged();
  });

  const handleScheduleTimeInputChange = async () => {
    if (suspendHandlers || !elements.scheduleEnabledToggle?.checked) {
      return;
    }
    await onScheduleChanged();
  };

  elements.scheduleStartTimeInput?.addEventListener("change", handleScheduleTimeInputChange);
  elements.scheduleEndTimeInput?.addEventListener("change", handleScheduleTimeInputChange);

  elements.a11yReduceMotionToggle?.addEventListener("change", onAccessibilityChanged);
  elements.a11ySoftenBrightnessToggle?.addEventListener("change", onAccessibilityChanged);
  elements.a11yReduceSaturationToggle?.addEventListener("change", onAccessibilityChanged);
  elements.a11yFlashMitigationToggle?.addEventListener("change", onAccessibilityChanged);

  elements.saveProfileButton?.addEventListener("click", async () => {
    await saveCurrentProfile();
  });

  elements.applySelectedProfileButton?.addEventListener("click", async () => {
    const selectedProfileId = getSelectedProfileId();
    if (!selectedProfileId) {
      return;
    }
    await applyProfileById(selectedProfileId);
  });

  elements.deleteSelectedProfileButton?.addEventListener("click", async () => {
    const selectedProfileId = getSelectedProfileId();
    if (!selectedProfileId) {
      return;
    }
    await deleteProfileById(selectedProfileId);
  });

  elements.exportSettingsButton?.addEventListener("click", async () => {
    await exportSettingsToFile();
  });

  elements.importFileInput?.addEventListener("change", async () => {
    await importSettingsFromSelectedFile();
  });

  elements.resetAllButton?.addEventListener("click", async () => {
    await resetSavedOptions();
  });
}

async function onApplyModeChanged(nextMode) {
  await persistSettings({
    ...currentSettings,
    mode: normalizeApplyMode(nextMode)
  });

  await syncMainControlsFromStateAndPage({ applyThemeToTab: true });
}

async function onPerPageToggleChanged(enabled) {
  if (!currentUrlKey) {
    return;
  }

  if (enabled) {
    const preset = sanitizePreset(currentSettings.perPagePreset);
    const config = { ...preset, enabled: true, updatedAt: Date.now() };

    themeMapCache[currentUrlKey] = sanitizeThemeConfig(config, normalizeIntensityCap(currentSettings.intensityCap));
    await persistThemeMap(themeMapCache);

    applyPresetToUI(config, true);
    await sendApplyMessage(config);
    return;
  }

  delete themeMapCache[currentUrlKey];
  await persistThemeMap(themeMapCache);

  applyPresetToUI(currentSettings.perPagePreset, false);
  await sendRemoveMessage();
}

async function handleThemeControlChange() {
  const preset = buildPresetFromUI();

  if (currentApplyMode === "global") {
    await persistSettings({
      ...currentSettings,
      mode: "global",
      globalPreset: preset
    });

    await sendApplyMessage({ ...preset, enabled: true });
    return;
  }

  const activeUrlConfig = getCurrentUrlEnabledConfig();
  if (activeUrlConfig && currentUrlKey) {
    const config = { ...preset, enabled: true, updatedAt: Date.now() };
    themeMapCache[currentUrlKey] = sanitizeThemeConfig(config, normalizeIntensityCap(currentSettings.intensityCap));
    await persistThemeMap(themeMapCache);
    await sendApplyMessage(config);
    return;
  }

  await persistSettings({
    ...currentSettings,
    mode: "per_page",
    perPagePreset: preset
  });
}

async function syncMainControlsFromStateAndPage(options = {}) {
  const { applyThemeToTab = false } = options;

  currentApplyMode = normalizeApplyMode(currentSettings.mode);
  applyModeToUI(currentApplyMode);

  if (!isSupportedPage || !currentUrlKey) {
    applyFallbackMainControlsForUnsupportedPage();
    return;
  }

  if (currentApplyMode === "global") {
    const preset = sanitizePreset(currentSettings.globalPreset);
    const config = { ...preset, enabled: true, updatedAt: Date.now() };
    applyPresetToUI(config, true);

    if (applyThemeToTab) {
      await sendApplyMessage(config);
    }
    return;
  }

  const activeConfig = getCurrentUrlEnabledConfig();
  if (activeConfig) {
    applyPresetToUI(activeConfig, true);

    if (applyThemeToTab) {
      await sendApplyMessage(activeConfig);
    }
    return;
  }

  applyPresetToUI(currentSettings.perPagePreset, false);

  if (applyThemeToTab) {
    await sendRemoveMessage();
  }
}

function applyFallbackMainControlsForUnsupportedPage() {
  currentApplyMode = normalizeApplyMode(currentSettings.mode);
  applyModeToUI(currentApplyMode);

  const preset =
    currentApplyMode === "global"
      ? sanitizePreset(currentSettings.globalPreset)
      : sanitizePreset(currentSettings.perPagePreset);

  applyPresetToUI(preset, currentApplyMode === "global");
}

function applyModeToUI(mode) {
  suspendHandlers = true;

  const normalizedMode = normalizeApplyMode(mode);
  for (const radio of elements.applyModeRadios) {
    radio.checked = radio.value === normalizedMode;
  }

  setElementVisibility(elements.perPageToggleRow, normalizedMode !== "global", isUiInitialized);

  if (normalizedMode === "global" && elements.enabledToggle) {
    elements.enabledToggle.checked = true;
  }

  suspendHandlers = false;
}

function applyPresetToUI(rawPreset, enabledToggle) {
  suspendHandlers = true;

  const preset = sanitizePreset(rawPreset);

  if (elements.enabledToggle) {
    elements.enabledToggle.checked = Boolean(enabledToggle);
  }

  applyIntensityCapToSlider();

  if (elements.intensityRange) {
    const cap = normalizeIntensityCap(currentSettings.intensityCap);
    elements.intensityRange.value = String(clamp(toNumber(preset.intensity, 45), 0, cap));
  }

  const selectedColorMode = normalizeColorMode(preset.colorMode);
  for (const radio of elements.colorRadios) {
    radio.checked = radio.value === selectedColorMode;
  }

  const customHex = normalizeHex(preset.customColor) || PRESET_COLORS.warm;
  if (elements.customColorPicker) {
    elements.customColorPicker.value = customHex;
  }
  if (elements.customColorHex) {
    elements.customColorHex.value = customHex;
    elements.customColorHex.classList.remove("invalid");
  }

  updateCustomColorVisibility();
  updateSliderVisualState();

  suspendHandlers = false;
}

function applySettingsPanelState() {
  suspendHandlers = true;

  updateLanguageSelectOptions();

  if (elements.languageSelect) {
    const languageSelectValue =
      normalizeLocaleMode(currentSettings.localeMode) === "manual"
        ? normalizeSupportedLocale(currentSettings.manualLocale)
        : "auto";
    elements.languageSelect.value = languageSelectValue;
  }

  if (elements.intensityCapSelect) {
    elements.intensityCapSelect.value = String(normalizeIntensityCap(currentSettings.intensityCap));
  }

  const schedule = sanitizeSchedule(currentSettings.schedule);
  if (elements.scheduleEnabledToggle) {
    elements.scheduleEnabledToggle.checked = schedule.enabled;
  }
  setScheduleStartTimeInputValue(schedule.startTime);
  setScheduleEndTimeInputValue(schedule.endTime);
  updateScheduleInputsState();

  const accessibility = sanitizeAccessibility(currentSettings.accessibility);
  if (elements.a11yReduceMotionToggle) {
    elements.a11yReduceMotionToggle.checked = accessibility.reduceMotion;
  }
  if (elements.a11ySoftenBrightnessToggle) {
    elements.a11ySoftenBrightnessToggle.checked = accessibility.softenBrightness;
  }
  if (elements.a11yReduceSaturationToggle) {
    elements.a11yReduceSaturationToggle.checked = accessibility.reduceSaturation;
  }
  if (elements.a11yFlashMitigationToggle) {
    elements.a11yFlashMitigationToggle.checked = accessibility.flashMitigation;
  }

  applyIntensityCapToSlider();
  renderProfilesSelect();
  setSettingsTab(activeSettingsTab, false);

  suspendHandlers = false;
}

function applyIntensityCapToSlider() {
  if (!elements.intensityRange) {
    return;
  }

  const cap = normalizeIntensityCap(currentSettings.intensityCap);
  elements.intensityRange.max = String(cap);
  elements.intensityRange.value = String(clamp(toNumber(elements.intensityRange.value, 45), 0, cap));
}

function updateScheduleInputsState() {
  const isEnabled = Boolean(elements.scheduleEnabledToggle && elements.scheduleEnabledToggle.checked);
  setElementVisibility(elements.scheduleTimePanel, isEnabled, isUiInitialized);
  elements.scheduleStartTimeInput && (elements.scheduleStartTimeInput.disabled = !isEnabled);
  elements.scheduleEndTimeInput && (elements.scheduleEndTimeInput.disabled = !isEnabled);
}

function renderScheduleTimeControls() {
  const schedule = sanitizeSchedule(currentSettings.schedule);
  setScheduleStartTimeInputValue(schedule.startTime);
  setScheduleEndTimeInputValue(schedule.endTime);
}

function setScheduleStartTimeInputValue(timeString) {
  if (!elements.scheduleStartTimeInput) {
    return;
  }

  const normalized = normalizeTimeString(timeString, DEFAULT_SCHEDULE.startTime);
  elements.scheduleStartTimeInput.value = normalized;
}

function setScheduleEndTimeInputValue(timeString) {
  if (!elements.scheduleEndTimeInput) {
    return;
  }

  const normalized = normalizeTimeString(timeString, DEFAULT_SCHEDULE.endTime);
  elements.scheduleEndTimeInput.value = normalized;
}

function getScheduleStartTimeInputValue(fallback) {
  const safeFallback = normalizeTimeString(fallback, DEFAULT_SCHEDULE.startTime);
  if (!elements.scheduleStartTimeInput) {
    return safeFallback;
  }

  return normalizeTimeString(elements.scheduleStartTimeInput.value, safeFallback);
}

function getScheduleEndTimeInputValue(fallback) {
  const safeFallback = normalizeTimeString(fallback, DEFAULT_SCHEDULE.endTime);
  if (!elements.scheduleEndTimeInput) {
    return safeFallback;
  }

  return normalizeTimeString(elements.scheduleEndTimeInput.value, safeFallback);
}

function updateCustomColorVisibility() {
  setElementVisibility(elements.customColorPanel, getSelectedColorMode() === "custom", isUiInitialized);
}

function setUnsupportedState(reason) {
  setStatus(reason);
  setControlsEnabled(false);
}

function setControlsEnabled(enabled) {
  elements.enabledToggle && (elements.enabledToggle.disabled = !enabled);
  elements.intensityRange && (elements.intensityRange.disabled = !enabled);
  elements.customColorPicker && (elements.customColorPicker.disabled = !enabled);
  elements.customColorHex && (elements.customColorHex.disabled = !enabled);

  for (const radio of elements.colorRadios) {
    radio.disabled = !enabled;
  }

  for (const modeRadio of elements.applyModeRadios) {
    modeRadio.disabled = !enabled;
  }
}

function openSettingsPanel() {
  setSettingsTab(activeSettingsTab, false);
  setElementVisibility(elements.settingsPanel, true, isUiInitialized);
}

function closeSettingsPanel() {
  setElementVisibility(elements.settingsPanel, false, isUiInitialized);
}

function setSettingsTab(rawTabId, animate = true) {
  const tabId = normalizeSettingsTab(rawTabId);
  const previousTabId = activeSettingsTab;
  activeSettingsTab = tabId;

  for (const tabButton of elements.settingsTabButtons) {
    const isActive = tabButton.getAttribute("data-settings-tab") === tabId;
    tabButton.setAttribute("aria-selected", String(isActive));
    tabButton.classList.toggle("bg-white", isActive);
    tabButton.classList.toggle("border-slate-200", isActive);
    tabButton.classList.toggle("text-slate-900", isActive);
    tabButton.classList.toggle("shadow-sm", isActive);

    tabButton.classList.toggle("border-transparent", !isActive);
    tabButton.classList.toggle("text-slate-600", !isActive);
  }

  const nextPanel = elements.settingsTabPanels.find(
    (panel) => panel.getAttribute("data-settings-tab-panel") === tabId
  );
  const previousPanel = elements.settingsTabPanels.find(
    (panel) => panel.getAttribute("data-settings-tab-panel") === previousTabId
  );

  const shouldAnimatePanels =
    animate &&
    isUiInitialized &&
    !prefersReducedMotion &&
    nextPanel &&
    previousPanel &&
    nextPanel !== previousPanel;

  if (!shouldAnimatePanels) {
    settingsTabAnimationToken += 1;
    for (const tabPanel of elements.settingsTabPanels) {
      const isPanelActive = tabPanel === nextPanel;
      resetTabPanelInlineState(tabPanel);
      tabPanel.classList.toggle("hidden", !isPanelActive);
    }
    resetSettingsPanelsContainerInlineState();
    return;
  }

  runSettingsTabTransition(previousPanel, nextPanel);
}

function normalizeSettingsTab(rawTabId) {
  if (rawTabId === "profiles" || rawTabId === "data" || rawTabId === "accessibility") {
    return rawTabId;
  }
  return "general";
}

function runSettingsTabTransition(previousPanel, nextPanel) {
  settingsTabAnimationToken += 1;
  const token = settingsTabAnimationToken;

  for (const tabPanel of elements.settingsTabPanels) {
    if (typeof tabPanel.getAnimations === "function") {
      tabPanel.getAnimations().forEach((animation) => animation.cancel());
    }
    resetTabPanelInlineState(tabPanel);
    if (tabPanel !== previousPanel && tabPanel !== nextPanel) {
      tabPanel.classList.add("hidden");
    }
  }

  const container = elements.settingsTabPanelsContainer;

  if (typeof previousPanel.getAnimations === "function") {
    previousPanel.getAnimations().forEach((animation) => animation.cancel());
  }
  if (typeof nextPanel.getAnimations === "function") {
    nextPanel.getAnimations().forEach((animation) => animation.cancel());
  }

  previousPanel.classList.remove("hidden");
  nextPanel.classList.remove("hidden");

  const previousHeight = previousPanel.offsetHeight || 1;
  const nextHeight = nextPanel.offsetHeight || previousHeight;

  nextPanel.style.opacity = "0";
  nextPanel.style.transform = "translateY(8px) scale(0.996)";

  if (container) {
    if (typeof container.getAnimations === "function") {
      container.getAnimations().forEach((animation) => animation.cancel());
    }
    container.style.height = `${previousHeight}px`;
    container.style.overflow = "hidden";
  }

  const hideAnimation = previousPanel.animate(
    [
      { opacity: 1, transform: "translateY(0) scale(1)" },
      { opacity: 0, transform: "translateY(-6px) scale(0.994)" }
    ],
    {
      duration: 145,
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      fill: "forwards"
    }
  );

  const showAnimation = nextPanel.animate(
    [
      { opacity: 0, transform: "translateY(8px) scale(0.996)" },
      { opacity: 1, transform: "translateY(0) scale(1)" }
    ],
    {
      duration: 205,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards"
    }
  );

  if (container) {
    container.animate(
      [{ height: `${previousHeight}px` }, { height: `${nextHeight}px` }],
      {
        duration: 205,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards"
      }
    );
  }

  Promise.all([hideAnimation.finished.catch(() => undefined), showAnimation.finished.catch(() => undefined)]).then(
    () => {
      if (token !== settingsTabAnimationToken) {
        return;
      }

      previousPanel.classList.add("hidden");
      nextPanel.classList.remove("hidden");
      resetTabPanelInlineState(previousPanel);
      resetTabPanelInlineState(nextPanel);
      resetSettingsPanelsContainerInlineState();
    }
  );
}

function resetTabPanelInlineState(panel) {
  panel.style.opacity = "";
  panel.style.transform = "";
}

function resetSettingsPanelsContainerInlineState() {
  if (!elements.settingsTabPanelsContainer) {
    return;
  }

  elements.settingsTabPanelsContainer.style.height = "";
  elements.settingsTabPanelsContainer.style.overflow = "";
}

async function onLanguageSelectChanged() {
  const selectedLanguage = elements.languageSelect ? elements.languageSelect.value : "auto";

  if (selectedLanguage === "auto") {
    await persistSettings({
      ...currentSettings,
      localeMode: "auto"
    });
  } else {
    await persistSettings({
      ...currentSettings,
      localeMode: "manual",
      manualLocale: normalizeSupportedLocale(selectedLanguage)
    });
  }

  applyLocalization();
  applySettingsPanelState();
}

async function onIntensityCapChanged() {
  const nextCap = normalizeIntensityCap(elements.intensityCapSelect.value);
  if (nextCap === normalizeIntensityCap(currentSettings.intensityCap)) {
    return;
  }

  const mapChanged = clampStateIntensitiesToCap(nextCap);

  await persistSettings({
    ...currentSettings,
    intensityCap: nextCap
  });

  if (mapChanged) {
    await persistThemeMap(themeMapCache);
  }

  applySettingsPanelState();

  if (isSupportedPage && currentUrlKey) {
    await syncMainControlsFromStateAndPage({ applyThemeToTab: true });
  }
}

async function onScheduleChanged() {
  const nextSchedule = buildScheduleFromUI();
  const currentSchedule = sanitizeSchedule(currentSettings.schedule);

  if (
    nextSchedule.enabled === currentSchedule.enabled &&
    nextSchedule.startTime === currentSchedule.startTime &&
    nextSchedule.endTime === currentSchedule.endTime
  ) {
    return;
  }

  await persistSettings({
    ...currentSettings,
    schedule: nextSchedule
  });

  applySettingsPanelState();

  if (isSupportedPage && currentUrlKey) {
    await syncMainControlsFromStateAndPage({ applyThemeToTab: true });
  }
}

async function onAccessibilityChanged() {
  // Accessibility is global and must save regardless of the active tab, so it
  // is intentionally not gated on isSupportedPage. Content scripts pick the
  // change up via chrome.storage.onChanged with no extra messaging.
  if (suspendHandlers) {
    return;
  }

  await persistSettings({
    ...currentSettings,
    accessibility: readAccessibilityFromInputs()
  });
}

function readAccessibilityFromInputs() {
  return sanitizeAccessibility({
    reduceMotion: Boolean(elements.a11yReduceMotionToggle && elements.a11yReduceMotionToggle.checked),
    softenBrightness: Boolean(
      elements.a11ySoftenBrightnessToggle && elements.a11ySoftenBrightnessToggle.checked
    ),
    reduceSaturation: Boolean(
      elements.a11yReduceSaturationToggle && elements.a11yReduceSaturationToggle.checked
    ),
    flashMitigation: Boolean(
      elements.a11yFlashMitigationToggle && elements.a11yFlashMitigationToggle.checked
    )
  });
}

function clampStateIntensitiesToCap(cap) {
  let changed = false;

  const clampPreset = (preset) => {
    const sanitized = sanitizePreset(preset);
    const intensity = clamp(toNumber(sanitized.intensity, 45), 0, cap);
    if (intensity !== sanitized.intensity) {
      changed = true;
      return { ...sanitized, intensity, updatedAt: Date.now() };
    }
    return sanitized;
  };

  currentSettings.perPagePreset = clampPreset(currentSettings.perPagePreset);
  currentSettings.globalPreset = clampPreset(currentSettings.globalPreset);

  for (const [urlKey, rawConfig] of Object.entries(themeMapCache)) {
    const config = sanitizeThemeConfig(rawConfig);
    const intensity = clamp(toNumber(config.intensity, 45), 0, cap);

    if (intensity !== config.intensity) {
      themeMapCache[urlKey] = {
        ...config,
        intensity,
        updatedAt: Date.now()
      };
      changed = true;
      continue;
    }

    themeMapCache[urlKey] = config;
  }

  return changed;
}

async function saveCurrentProfile() {
  const name = String(elements.profileNameInput ? elements.profileNameInput.value : "").trim();
  if (!name) {
    setStatus(t("status_profile_name_required"));
    return;
  }

  const now = Date.now();
  const profile = {
    id: createProfileId(),
    name: name.slice(0, 40),
    bundle: buildProfileBundle(),
    createdAt: now,
    updatedAt: now
  };

  await persistSettings({
    ...currentSettings,
    profiles: [...currentSettings.profiles, profile]
  });

  if (elements.profileNameInput) {
    elements.profileNameInput.value = "";
  }

  renderProfilesSelect(profile.id);
  setStatus(t("status_profile_saved"));
}

function buildProfileBundle() {
  return {
    perPagePreset: sanitizePreset(currentSettings.perPagePreset),
    globalPreset: sanitizePreset(currentSettings.globalPreset),
    intensityCap: normalizeIntensityCap(currentSettings.intensityCap),
    schedule: sanitizeSchedule(currentSettings.schedule),
    localeMode: normalizeLocaleMode(currentSettings.localeMode),
    manualLocale: normalizeSupportedLocale(currentSettings.manualLocale)
  };
}

async function applyProfileById(profileId) {
  const profile = currentSettings.profiles.find((item) => item.id === profileId);
  if (!profile) {
    return;
  }

  const bundle = sanitizeProfileBundle(profile.bundle);

  await persistSettings({
    ...currentSettings,
    perPagePreset: bundle.perPagePreset,
    globalPreset: bundle.globalPreset,
    intensityCap: bundle.intensityCap,
    schedule: bundle.schedule,
    localeMode: bundle.localeMode,
    manualLocale: bundle.manualLocale
  });

  const mapChanged = clampStateIntensitiesToCap(currentSettings.intensityCap);
  if (mapChanged) {
    await persistSettings(currentSettings);
    await persistThemeMap(themeMapCache);
  }

  applyLocalization();
  applySettingsPanelState();

  if (isSupportedPage && currentUrlKey) {
    await syncMainControlsFromStateAndPage({ applyThemeToTab: true });
  } else {
    applyFallbackMainControlsForUnsupportedPage();
  }

  setStatus(t("status_profile_applied"));
}

async function deleteProfileById(profileId) {
  await persistSettings({
    ...currentSettings,
    profiles: currentSettings.profiles.filter((item) => item.id !== profileId)
  });

  renderProfilesSelect();
  setStatus(t("status_profile_deleted"));
}

function renderProfilesSelect(preferredProfileId = null) {
  if (!elements.profileSelect) {
    return;
  }

  const previousSelected = elements.profileSelect.value;
  const targetProfileId = preferredProfileId || previousSelected || "";
  elements.profileSelect.textContent = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = t("profile_select_empty");
  elements.profileSelect.appendChild(placeholder);

  for (const profile of currentSettings.profiles) {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.name;
    elements.profileSelect.appendChild(option);
  }

  if (targetProfileId && currentSettings.profiles.some((profile) => profile.id === targetProfileId)) {
    elements.profileSelect.value = targetProfileId;
  } else {
    elements.profileSelect.value = "";
  }
}

function getSelectedProfileId() {
  if (!elements.profileSelect) {
    return null;
  }

  const selectedId = String(elements.profileSelect.value || "");
  if (!selectedId) {
    return null;
  }

  return currentSettings.profiles.some((profile) => profile.id === selectedId) ? selectedId : null;
}

async function exportSettingsToFile() {
  try {
    const payload = {
      version: SETTINGS_VERSION,
      exportedAt: Date.now(),
      nightModeSettings: sanitizeSettings(currentSettings),
      nightModeByUrl: sanitizeThemeMap(themeMapCache)
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `muranight-backup-${formatDateForFilename(Date.now())}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
    setStatus(t("status_export_done"));
  } catch (_error) {
    setStatus(t("status_export_failed"));
  }
}

async function importSettingsFromSelectedFile() {
  const input = elements.importFileInput;
  if (!input || !input.files || !input.files.length) {
    setStatus(t("status_import_no_file"));
    return;
  }

  const [file] = input.files;
  if (!file) {
    setStatus(t("status_import_no_file"));
    return;
  }

  try {
    const parsed = JSON.parse(await file.text());

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Object.prototype.hasOwnProperty.call(parsed, "nightModeSettings") ||
      !Object.prototype.hasOwnProperty.call(parsed, "nightModeByUrl")
    ) {
      setStatus(t("status_import_invalid"));
      return;
    }

    const importedSettings = sanitizeSettings(parsed.nightModeSettings);
    const importedThemeMap = sanitizeThemeMap(parsed.nightModeByUrl);

    await chrome.storage.local.set({
      [SETTINGS_KEY]: importedSettings,
      [THEME_MAP_KEY]: importedThemeMap
    });

    currentSettings = importedSettings;
    currentApplyMode = importedSettings.mode;
    themeMapCache = importedThemeMap;

    applyLocalization();
    applySettingsPanelState();

    if (isSupportedPage && currentUrlKey) {
      setControlsEnabled(true);
      await syncMainControlsFromStateAndPage({ applyThemeToTab: true });
    } else {
      applyFallbackMainControlsForUnsupportedPage();
    }

    setStatus(t("status_import_done"));
  } catch (error) {
    if (error instanceof SyntaxError) {
      setStatus(t("status_import_invalid"));
    } else {
      setStatus(t("status_import_failed"));
    }
  } finally {
    input.value = "";
  }
}

async function resetSavedOptions() {
  try {
    await chrome.storage.local.remove([THEME_MAP_KEY, SETTINGS_KEY]);

    currentSettings = sanitizeSettings(DEFAULT_SETTINGS);
    currentApplyMode = currentSettings.mode;
    themeMapCache = {};

    applyLocalization();
    applySettingsPanelState();

    if (isSupportedPage && currentUrlKey) {
      setControlsEnabled(true);
      await syncMainControlsFromStateAndPage({ applyThemeToTab: true });
    } else {
      applyFallbackMainControlsForUnsupportedPage();
    }

    await removeThemeFromAllOpenTabs();
    setStatus(t("status_reset_done"));
  } catch (_error) {
    setStatus(t("status_reset_failed"));
  }
}

function buildPresetFromUI() {
  const cap = normalizeIntensityCap(currentSettings.intensityCap);
  const customHex =
    normalizeHex(elements.customColorHex ? elements.customColorHex.value : null) ||
    normalizeHex(elements.customColorPicker ? elements.customColorPicker.value : null) ||
    PRESET_COLORS.warm;

  return {
    intensity: clamp(toNumber(elements.intensityRange ? elements.intensityRange.value : 45, 45), 0, cap),
    colorMode: getSelectedColorMode(),
    customColor: customHex,
    updatedAt: Date.now()
  };
}

function buildScheduleFromUI() {
  const fallback = sanitizeSchedule(currentSettings.schedule);

  return {
    enabled: Boolean(elements.scheduleEnabledToggle && elements.scheduleEnabledToggle.checked),
    startTime: getScheduleStartTimeInputValue(fallback.startTime),
    endTime: getScheduleEndTimeInputValue(fallback.endTime)
  };
}

function getSelectedColorMode() {
  const selected = elements.colorRadios.find((radio) => radio.checked);
  return normalizeColorMode(selected ? selected.value : "warm");
}

function getSelectedApplyMode() {
  const selected = elements.applyModeRadios.find((radio) => radio.checked);
  return normalizeApplyMode(selected ? selected.value : "per_page");
}

function getCurrentUrlEnabledConfig() {
  if (!currentUrlKey) {
    return null;
  }

  const rawConfig = themeMapCache[currentUrlKey];
  if (!rawConfig || !rawConfig.enabled) {
    return null;
  }

  return sanitizeThemeConfig(rawConfig, normalizeIntensityCap(currentSettings.intensityCap));
}

async function sendApplyMessage(themeConfig) {
  if (!isSupportedPage || typeof currentTabId !== "number") {
    return;
  }

  try {
    await sendMessageToActiveTab({
      type: "APPLY_THEME",
      payload: sanitizeThemeConfig(themeConfig, normalizeIntensityCap(currentSettings.intensityCap))
    });
    clearStatus();
  } catch (_error) {
    setStatus(t("status_apply_failed"));
  }
}

async function sendRemoveMessage() {
  if (!isSupportedPage || typeof currentTabId !== "number") {
    return;
  }

  try {
    await sendMessageToActiveTab({ type: "REMOVE_THEME" });
    clearStatus();
  } catch (_error) {
    setStatus(t("status_remove_failed"));
  }
}

async function sendMessageToActiveTab(message) {
  if (typeof currentTabId !== "number") {
    throw new Error("No active tab id.");
  }

  await new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(currentTabId, message, () => {
      const maybeError = chrome.runtime.lastError;
      if (maybeError) {
        reject(new Error(maybeError.message));
        return;
      }
      resolve();
    });
  });
}

async function removeThemeFromAllOpenTabs() {
  const tabs = await chrome.tabs.query({});

  await Promise.all(
    tabs.map(
      (tab) =>
        new Promise((resolve) => {
          if (typeof tab.id !== "number" || !isSupportedPageUrl(tab.url)) {
            resolve();
            return;
          }

          chrome.tabs.sendMessage(tab.id, { type: "REMOVE_THEME" }, () => {
            resolve();
          });
        })
    )
  );
}

async function persistSettings(nextSettings) {
  const sanitized = sanitizeSettings(nextSettings);
  currentSettings = sanitized;
  currentApplyMode = sanitized.mode;
  await chrome.storage.local.set({ [SETTINGS_KEY]: sanitized });
}

async function persistThemeMap(nextThemeMap) {
  const sanitized = sanitizeThemeMap(nextThemeMap);
  themeMapCache = sanitized;
  await chrome.storage.local.set({ [THEME_MAP_KEY]: sanitized });
}

async function readThemeMap() {
  const raw = await chrome.storage.local.get(THEME_MAP_KEY);
  return sanitizeThemeMap(raw[THEME_MAP_KEY]);
}

async function readSettings() {
  const raw = await chrome.storage.local.get(SETTINGS_KEY);
  return sanitizeSettings(raw[SETTINGS_KEY]);
}

function sanitizeThemeMap(rawThemeMap) {
  if (!rawThemeMap || typeof rawThemeMap !== "object" || Array.isArray(rawThemeMap)) {
    return {};
  }

  const normalized = {};
  for (const [urlKey, rawConfig] of Object.entries(rawThemeMap)) {
    if (typeof urlKey !== "string" || !urlKey) {
      continue;
    }

    normalized[urlKey] = sanitizeThemeConfig(rawConfig);
  }

  return normalized;
}

function sanitizeSettings(rawSettings) {
  const mode = normalizeApplyMode(rawSettings && rawSettings.mode);
  const perPagePreset = sanitizePreset(rawSettings && rawSettings.perPagePreset);

  const globalPresetSource = rawSettings && (rawSettings.globalPreset || rawSettings.globalTheme);
  const globalPreset = sanitizePreset(globalPresetSource);

  const intensityCap = normalizeIntensityCap(rawSettings && rawSettings.intensityCap);
  const schedule = sanitizeSchedule(rawSettings && rawSettings.schedule);
  const accessibility = sanitizeAccessibility(rawSettings && rawSettings.accessibility);
  const localeMode = normalizeLocaleMode(rawSettings && rawSettings.localeMode);
  const manualLocale = normalizeSupportedLocale(rawSettings && rawSettings.manualLocale);
  const profiles = sanitizeProfiles(rawSettings && rawSettings.profiles);

  return {
    version: SETTINGS_VERSION,
    mode,
    perPagePreset,
    globalPreset,
    intensityCap,
    schedule,
    accessibility,
    localeMode,
    manualLocale,
    profiles
  };
}

function sanitizeAccessibility(rawAccessibility) {
  const accessibility =
    rawAccessibility && typeof rawAccessibility === "object" ? rawAccessibility : {};

  return {
    reduceMotion: Boolean(accessibility.reduceMotion),
    softenBrightness: Boolean(accessibility.softenBrightness),
    reduceSaturation: Boolean(accessibility.reduceSaturation),
    flashMitigation: Boolean(accessibility.flashMitigation)
  };
}

function sanitizeProfiles(rawProfiles) {
  if (!Array.isArray(rawProfiles)) {
    return [];
  }

  const profiles = [];
  for (const rawProfile of rawProfiles) {
    const profile = sanitizeProfile(rawProfile);
    if (profile) {
      profiles.push(profile);
    }
  }

  return profiles;
}

function sanitizeProfile(rawProfile) {
  if (!rawProfile || typeof rawProfile !== "object") {
    return null;
  }

  const name = String(rawProfile.name || "").trim().slice(0, 40);
  if (!name) {
    return null;
  }

  return {
    id: typeof rawProfile.id === "string" && rawProfile.id ? rawProfile.id : createProfileId(),
    name,
    bundle: sanitizeProfileBundle(rawProfile.bundle),
    createdAt: toNumber(rawProfile.createdAt, Date.now()),
    updatedAt: toNumber(rawProfile.updatedAt, Date.now())
  };
}

function sanitizeProfileBundle(rawBundle) {
  const bundle = rawBundle && typeof rawBundle === "object" ? rawBundle : {};
  return {
    perPagePreset: sanitizePreset(bundle.perPagePreset),
    globalPreset: sanitizePreset(bundle.globalPreset),
    intensityCap: normalizeIntensityCap(bundle.intensityCap),
    schedule: sanitizeSchedule(bundle.schedule),
    localeMode: normalizeLocaleMode(bundle.localeMode),
    manualLocale: normalizeSupportedLocale(bundle.manualLocale)
  };
}

function sanitizePreset(rawPreset) {
  const preset = rawPreset && typeof rawPreset === "object" ? rawPreset : {};

  return {
    intensity: clamp(toNumber(preset.intensity, DEFAULT_PRESET.intensity), 0, MAX_THEME_INTENSITY),
    colorMode: normalizeColorMode(preset.colorMode),
    customColor: normalizeHex(preset.customColor) || PRESET_COLORS.warm,
    updatedAt: toNumber(preset.updatedAt, Date.now())
  };
}

function sanitizeThemeConfig(rawConfig, intensityCap = MAX_THEME_INTENSITY) {
  const preset = sanitizePreset(rawConfig);
  const cap = clamp(toNumber(intensityCap, MAX_THEME_INTENSITY), 0, MAX_THEME_INTENSITY);
  return {
    enabled: Boolean(rawConfig && rawConfig.enabled),
    intensity: clamp(preset.intensity, 0, cap),
    colorMode: preset.colorMode,
    customColor: preset.customColor,
    updatedAt: preset.updatedAt
  };
}

function normalizeApplyMode(mode) {
  return mode === "global" ? "global" : "per_page";
}

function normalizeColorMode(colorMode) {
  return colorMode === "blue" || colorMode === "custom" ? colorMode : "warm";
}

function normalizeIntensityCap(rawCap) {
  const parsed = Number(rawCap);

  if (INTENSITY_CAP_OPTIONS.includes(parsed)) {
    return parsed;
  }

  if (!Number.isFinite(parsed)) {
    return INTENSITY_CAP_OPTIONS[0];
  }

  if (parsed <= 200) {
    return 200;
  }
  if (parsed <= 300) {
    return 300;
  }
  if (parsed <= 400) {
    return 400;
  }
  return 500;
}

function sanitizeSchedule(rawSchedule) {
  const schedule = rawSchedule && typeof rawSchedule === "object" ? rawSchedule : {};
  const legacyStartTime =
    typeof schedule.startTime === "string"
      ? schedule.startTime
      : typeof schedule.time === "string"
        ? schedule.time
        : schedule.start;
  const legacyEndTime = typeof schedule.endTime === "string" ? schedule.endTime : schedule.end;

  return {
    enabled: Boolean(schedule.enabled),
    startTime: normalizeTimeString(legacyStartTime, DEFAULT_SCHEDULE.startTime),
    endTime: normalizeTimeString(legacyEndTime, DEFAULT_SCHEDULE.endTime)
  };
}

function normalizeTimeString(rawValue, fallback) {
  const safeFallback = isValidTimeString(fallback) ? fallback : "00:00";

  if (typeof rawValue !== "string") {
    return safeFallback;
  }

  const trimmed = rawValue.trim();
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) {
    return safeFallback;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    return safeFallback;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return safeFallback;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function isValidTimeString(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function normalizeLocaleMode(mode) {
  return mode === "manual" ? "manual" : "auto";
}

function normalizeSupportedLocale(rawLocale) {
  if (typeof rawLocale !== "string") {
    return "en";
  }

  const normalized = rawLocale.toLowerCase();
  if (normalized.startsWith("pt")) {
    return "pt-BR";
  }
  if (normalized.startsWith("es")) {
    return "es";
  }
  if (normalized.startsWith("fr")) {
    return "fr";
  }
  if (normalized.startsWith("de")) {
    return "de";
  }
  return "en";
}

function normalizeUrlKey(rawUrl) {
  const parsed = new URL(rawUrl);
  return `${parsed.origin}${parsed.pathname}${parsed.search}`;
}

function normalizeHex(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return `#${trimmed.toUpperCase()}`;
  }

  return null;
}

function isSupportedPageUrl(rawUrl) {
  if (typeof rawUrl !== "string") {
    return false;
  }

  if (/^(chrome|edge|about|chrome-extension|edge-extension):/i.test(rawUrl)) {
    return false;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch (_error) {
    return false;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return false;
  }

  const host = parsedUrl.hostname.toLowerCase();
  const path = parsedUrl.pathname.toLowerCase();

  const isChromeStore =
    host === "chromewebstore.google.com" ||
    (host === "chrome.google.com" && path.startsWith("/webstore"));
  const isEdgeStore = host === "microsoftedge.microsoft.com" && path.startsWith("/addons");

  return !isChromeStore && !isEdgeStore;
}

function resolveActiveLocale(settings) {
  if (normalizeLocaleMode(settings.localeMode) === "manual") {
    return normalizeSupportedLocale(settings.manualLocale);
  }

  return detectBrowserLocale();
}

function detectBrowserLocale() {
  let language = "";

  try {
    if (chrome.i18n && typeof chrome.i18n.getUILanguage === "function") {
      language = chrome.i18n.getUILanguage();
    }
  } catch (_error) {
    language = "";
  }

  if (!language && typeof navigator !== "undefined" && navigator.language) {
    language = navigator.language;
  }

  return normalizeSupportedLocale(language);
}

function t(key) {
  const dictionary = I18N[activeLocale] || I18N.en;
  return dictionary[key] || I18N.en[key] || key;
}

function applyLocalization() {
  activeLocale = resolveActiveLocale(currentSettings);
  document.documentElement.lang = activeLocale;
  renderScheduleTimeControls();

  const textElements = document.querySelectorAll("[data-i18n]");
  for (const element of textElements) {
    const key = element.getAttribute("data-i18n");
    if (key) {
      element.textContent = t(key);
    }
  }

  const titleElements = document.querySelectorAll("[data-i18n-title]");
  for (const element of titleElements) {
    const key = element.getAttribute("data-i18n-title");
    if (key) {
      element.setAttribute("title", t(key));
    }
  }

  const ariaElements = document.querySelectorAll("[data-i18n-aria-label]");
  for (const element of ariaElements) {
    const key = element.getAttribute("data-i18n-aria-label");
    if (key) {
      element.setAttribute("aria-label", t(key));
    }
  }

  const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
  for (const element of placeholderElements) {
    const key = element.getAttribute("data-i18n-placeholder");
    if (!key) {
      continue;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.placeholder = t(key);
    }
  }

  updateLanguageSelectOptions();
  renderProfilesSelect();
}

function updateLanguageSelectOptions() {
  if (!elements.languageSelect) {
    return;
  }

  const browserLocale = detectBrowserLocale();
  const labels = {
    "pt-BR": t("locale_name_pt_br"),
    en: t("locale_name_en"),
    es: t("locale_name_es"),
    fr: t("locale_name_fr"),
    de: t("locale_name_de")
  };

  const defaultLocaleLabel = labels[browserLocale] || labels.en;

  for (const option of elements.languageSelect.options) {
    if (option.value === "auto") {
      option.textContent = `${t("settings_language_default_prefix")} (${defaultLocaleLabel})`;
      continue;
    }

    if (labels[option.value]) {
      option.textContent = labels[option.value];
    }
  }
}

function setStatus(message) {
  if (!elements.statusMessage) {
    return;
  }

  elements.statusMessage.textContent = message;
  setElementVisibility(elements.statusMessage, true, isUiInitialized);
}

function clearStatus() {
  if (!elements.statusMessage) {
    return;
  }

  elements.statusMessage.textContent = "";
  setElementVisibility(elements.statusMessage, false, isUiInitialized);
}

function revealUiShell() {
  if (!document.body) {
    return;
  }

  if (prefersReducedMotion) {
    document.body.classList.add("ui-ready");
    return;
  }

  requestAnimationFrame(() => {
    document.body.classList.add("ui-ready");
  });
}

function setElementVisibility(element, shouldShow, animate = true) {
  if (!element) {
    return;
  }

  const isHidden = element.classList.contains("hidden");
  if (shouldShow === !isHidden) {
    return;
  }

  if (typeof element.getAnimations === "function") {
    element.getAnimations().forEach((animation) => animation.cancel());
  }

  if (!animate || prefersReducedMotion) {
    element.classList.toggle("hidden", !shouldShow);
    return;
  }

  if (shouldShow) {
    element.classList.remove("hidden");
    element.animate(
      [
        { opacity: 0, transform: "translateY(-4px) scale(0.992)" },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ],
      {
        duration: 170,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );
    return;
  }

  const animation = element.animate(
    [
      { opacity: 1, transform: "translateY(0) scale(1)" },
      { opacity: 0, transform: "translateY(-4px) scale(0.992)" }
    ],
    {
      duration: 130,
      easing: "cubic-bezier(0.4, 0, 1, 1)"
    }
  );

  animation.onfinish = () => {
    element.classList.add("hidden");
  };
}

function updateSliderVisualState(options = {}) {
  if (!elements.intensityRange || !elements.intensityValue) {
    return;
  }

  const { animateValuePulse = false } = options;
  const value = clamp(
    toNumber(elements.intensityRange.value, 45),
    0,
    normalizeIntensityCap(currentSettings.intensityCap)
  );

  elements.intensityValue.textContent = `${value}%`;

  if (animateValuePulse) {
    animateIntensityValue();
  }
}

function animateIntensityValue() {
  if (!elements.intensityValue || prefersReducedMotion) {
    return;
  }

  if (typeof elements.intensityValue.getAnimations === "function") {
    elements.intensityValue.getAnimations().forEach((animation) => animation.cancel());
  }

  elements.intensityValue.animate(
    [
      { transform: "translateY(0) scale(1)", opacity: 0.74 },
      { transform: "translateY(-1px) scale(1.08)", opacity: 1 },
      { transform: "translateY(0) scale(1)", opacity: 1 }
    ],
    {
      duration: 180,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );
}

function createProfileId() {
  return `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatDateForFilename(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}-${hour}${minute}${second}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

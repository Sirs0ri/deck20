import { k as addFocusFn, l as removeFocusFn, u as useAnchorProps, a as useModelToggleProps, b as useTransitionProps, v as validatePosition, c as validateOffset, d as useModelToggleEmits, e as useTransition, f as useScrollTarget, g as useAnchor, h as useModelToggle, i as usePortal, r as removeClickOutside, s as setPosition, p as parsePosition, m as closePortalMenus, j as addClickOutside, Q as QItem } from "./position-engine.501c9e87.js";
import { w as watch, o as onMounted, a as onBeforeUnmount, z as inject, af as formKey, g as getCurrentInstance, r as ref, q as computed, t as debounce, ag as injectProp, ah as onBeforeUpdate, m as stopAndPrevent, b as nextTick, u as onDeactivated, v as onActivated, i as isRuntimeSsrPreHydration, h, f as prevent, H as getUid, _ as Transition, F as shouldIgnoreKey, c as client, s as stop, E as isKeyCode, j as position, ai as toRaw, n as noop, aj as fabKey, B as provide, a6 as storeToRefs, I as reactive, K as openBlock, L as createBlock, M as withCtx, N as createVNode, a4 as createTextVNode, R as unref, ak as withKeys, Z as toDisplayString, a8 as createCommentVNode, al as TransitionGroup, a7 as normalizeStyle, U as normalizeClass, P as createElementBlock, Q as renderList, S as Fragment, O as createBaseVNode, aa as withModifiers } from "./index.8c4d84bb.js";
import { Q as QIcon, b as useSize, a as useSizeProps } from "./QIcon.b4640500.js";
import { a as QSpinner, Q as QBtn } from "./QBtn.a5ef640f.js";
import { u as useDarkProps, d as useDark, f as useTick, h as useTimeout, g as getScrollTarget } from "./use-timeout.bbb666bb.js";
import { b as hSlot, c as createComponent, h as hMergeSlot } from "./render.cfc3f4d1.js";
import { f as childHasFocus } from "./Ripple.b67b5e2e.js";
import { Q as QPage } from "./QPage.062929ba.js";
import { u as useCharacterStore } from "./characters-store.10a572ce.js";
import "./bexBridge.ee75acc4.js";
function useFormChild({ validate, resetValidation, requiresQForm }) {
  const $form = inject(formKey, false);
  if ($form !== false) {
    const { props, proxy } = getCurrentInstance();
    Object.assign(proxy, { validate, resetValidation });
    watch(() => props.disable, (val) => {
      if (val === true) {
        typeof resetValidation === "function" && resetValidation();
        $form.unbindComponent(proxy);
      } else {
        $form.bindComponent(proxy);
      }
    });
    onMounted(() => {
      props.disable !== true && $form.bindComponent(proxy);
    });
    onBeforeUnmount(() => {
      props.disable !== true && $form.unbindComponent(proxy);
    });
  } else if (requiresQForm === true) {
    console.error("Parent QForm not found on useFormChild()!");
  }
}
const hex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/, hexa = /^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/, hexOrHexa = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, rgb = /^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/, rgba = /^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/;
const testPattern = {
  date: (v) => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v),
  time: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v),
  fulltime: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v),
  timeOrFulltime: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v),
  email: (v) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
  hexColor: (v) => hex.test(v),
  hexaColor: (v) => hexa.test(v),
  hexOrHexaColor: (v) => hexOrHexa.test(v),
  rgbColor: (v) => rgb.test(v),
  rgbaColor: (v) => rgba.test(v),
  rgbOrRgbaColor: (v) => rgb.test(v) || rgba.test(v),
  hexOrRgbColor: (v) => hex.test(v) || rgb.test(v),
  hexaOrRgbaColor: (v) => hexa.test(v) || rgba.test(v),
  anyColor: (v) => hexOrHexa.test(v) || rgb.test(v) || rgba.test(v)
};
const lazyRulesValues = [true, false, "ondemand"];
const useValidateProps = {
  modelValue: {},
  error: {
    type: Boolean,
    default: null
  },
  errorMessage: String,
  noErrorIcon: Boolean,
  rules: Array,
  reactiveRules: Boolean,
  lazyRules: {
    type: [Boolean, String],
    validator: (v) => lazyRulesValues.includes(v)
  }
};
function useValidate(focused, innerLoading) {
  const { props, proxy } = getCurrentInstance();
  const innerError = ref(false);
  const innerErrorMessage = ref(null);
  const isDirtyModel = ref(null);
  useFormChild({ validate, resetValidation });
  let validateIndex = 0, unwatchRules;
  const hasRules = computed(
    () => props.rules !== void 0 && props.rules !== null && props.rules.length > 0
  );
  const hasActiveRules = computed(
    () => props.disable !== true && hasRules.value === true
  );
  const hasError = computed(
    () => props.error === true || innerError.value === true
  );
  const errorMessage = computed(() => typeof props.errorMessage === "string" && props.errorMessage.length > 0 ? props.errorMessage : innerErrorMessage.value);
  watch(() => props.modelValue, () => {
    validateIfNeeded();
  });
  watch(() => props.reactiveRules, (val) => {
    if (val === true) {
      if (unwatchRules === void 0) {
        unwatchRules = watch(() => props.rules, () => {
          validateIfNeeded(true);
        });
      }
    } else if (unwatchRules !== void 0) {
      unwatchRules();
      unwatchRules = void 0;
    }
  }, { immediate: true });
  watch(focused, (val) => {
    if (val === true) {
      if (isDirtyModel.value === null) {
        isDirtyModel.value = false;
      }
    } else if (isDirtyModel.value === false) {
      isDirtyModel.value = true;
      if (hasActiveRules.value === true && props.lazyRules !== "ondemand" && innerLoading.value === false) {
        debouncedValidate();
      }
    }
  });
  function resetValidation() {
    validateIndex++;
    innerLoading.value = false;
    isDirtyModel.value = null;
    innerError.value = false;
    innerErrorMessage.value = null;
    debouncedValidate.cancel();
  }
  function validate(val = props.modelValue) {
    if (hasActiveRules.value !== true) {
      return true;
    }
    const index = ++validateIndex;
    const setDirty = innerLoading.value !== true ? () => {
      isDirtyModel.value = true;
    } : () => {
    };
    const update2 = (err, msg) => {
      err === true && setDirty();
      innerError.value = err;
      innerErrorMessage.value = msg || null;
      innerLoading.value = false;
    };
    const promises = [];
    for (let i = 0; i < props.rules.length; i++) {
      const rule = props.rules[i];
      let res;
      if (typeof rule === "function") {
        res = rule(val, testPattern);
      } else if (typeof rule === "string" && testPattern[rule] !== void 0) {
        res = testPattern[rule](val);
      }
      if (res === false || typeof res === "string") {
        update2(true, res);
        return false;
      } else if (res !== true && res !== void 0) {
        promises.push(res);
      }
    }
    if (promises.length === 0) {
      update2(false);
      return true;
    }
    innerLoading.value = true;
    return Promise.all(promises).then(
      (res) => {
        if (res === void 0 || Array.isArray(res) === false || res.length === 0) {
          index === validateIndex && update2(false);
          return true;
        }
        const msg = res.find((r) => r === false || typeof r === "string");
        index === validateIndex && update2(msg !== void 0, msg);
        return msg === void 0;
      },
      (e) => {
        if (index === validateIndex) {
          console.error(e);
          update2(true);
        }
        return false;
      }
    );
  }
  function validateIfNeeded(changedRules) {
    if (hasActiveRules.value === true && props.lazyRules !== "ondemand" && (isDirtyModel.value === true || props.lazyRules !== true && changedRules !== true)) {
      debouncedValidate();
    }
  }
  const debouncedValidate = debounce(validate, 0);
  onBeforeUnmount(() => {
    unwatchRules !== void 0 && unwatchRules();
    debouncedValidate.cancel();
  });
  Object.assign(proxy, { resetValidation, validate });
  injectProp(proxy, "hasError", () => hasError.value);
  return {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,
    validate,
    resetValidation
  };
}
const listenerRE = /^on[A-Z]/;
function useSplitAttrs(attrs, vnode) {
  const acc = {
    listeners: ref({}),
    attributes: ref({})
  };
  function update2() {
    const attributes = {};
    const listeners = {};
    for (const key in attrs) {
      if (key !== "class" && key !== "style" && listenerRE.test(key) === false) {
        attributes[key] = attrs[key];
      }
    }
    for (const key in vnode.props) {
      if (listenerRE.test(key) === true) {
        listeners[key] = vnode.props[key];
      }
    }
    acc.attributes.value = attributes;
    acc.listeners.value = listeners;
  }
  onBeforeUpdate(update2);
  update2();
  return acc;
}
function getTargetUid(val) {
  return val === void 0 ? `f_${getUid()}` : val;
}
function fieldValueIsFilled(val) {
  return val !== void 0 && val !== null && ("" + val).length > 0;
}
const useFieldProps = {
  ...useDarkProps,
  ...useValidateProps,
  label: String,
  stackLabel: Boolean,
  hint: String,
  hideHint: Boolean,
  prefix: String,
  suffix: String,
  labelColor: String,
  color: String,
  bgColor: String,
  filled: Boolean,
  outlined: Boolean,
  borderless: Boolean,
  standout: [Boolean, String],
  square: Boolean,
  loading: Boolean,
  labelSlot: Boolean,
  bottomSlots: Boolean,
  hideBottomSpace: Boolean,
  rounded: Boolean,
  dense: Boolean,
  itemAligned: Boolean,
  counter: Boolean,
  clearable: Boolean,
  clearIcon: String,
  disable: Boolean,
  readonly: Boolean,
  autofocus: Boolean,
  for: String,
  maxlength: [Number, String]
};
const useFieldEmits = ["update:modelValue", "clear", "focus", "blur", "popup-show", "popup-hide"];
function useFieldState() {
  const { props, attrs, proxy, vnode } = getCurrentInstance();
  const isDark = useDark(props, proxy.$q);
  return {
    isDark,
    editable: computed(
      () => props.disable !== true && props.readonly !== true
    ),
    innerLoading: ref(false),
    focused: ref(false),
    hasPopupOpen: false,
    splitAttrs: useSplitAttrs(attrs, vnode),
    targetUid: ref(getTargetUid(props.for)),
    rootRef: ref(null),
    targetRef: ref(null),
    controlRef: ref(null)
  };
}
function useField(state) {
  const { props, emit, slots, attrs, proxy } = getCurrentInstance();
  const { $q } = proxy;
  let focusoutTimer;
  if (state.hasValue === void 0) {
    state.hasValue = computed(() => fieldValueIsFilled(props.modelValue));
  }
  if (state.emitValue === void 0) {
    state.emitValue = (value) => {
      emit("update:modelValue", value);
    };
  }
  if (state.controlEvents === void 0) {
    state.controlEvents = {
      onFocusin: onControlFocusin,
      onFocusout: onControlFocusout
    };
  }
  Object.assign(state, {
    clearValue,
    onControlFocusin,
    onControlFocusout,
    focus
  });
  if (state.computedCounter === void 0) {
    state.computedCounter = computed(() => {
      if (props.counter !== false) {
        const len = typeof props.modelValue === "string" || typeof props.modelValue === "number" ? ("" + props.modelValue).length : Array.isArray(props.modelValue) === true ? props.modelValue.length : 0;
        const max = props.maxlength !== void 0 ? props.maxlength : props.maxValues;
        return len + (max !== void 0 ? " / " + max : "");
      }
    });
  }
  const {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,
    resetValidation
  } = useValidate(state.focused, state.innerLoading);
  const floatingLabel = state.floatingLabel !== void 0 ? computed(() => props.stackLabel === true || state.focused.value === true || state.floatingLabel.value === true) : computed(() => props.stackLabel === true || state.focused.value === true || state.hasValue.value === true);
  const shouldRenderBottom = computed(
    () => props.bottomSlots === true || props.hint !== void 0 || hasRules.value === true || props.counter === true || props.error !== null
  );
  const styleType = computed(() => {
    if (props.filled === true) {
      return "filled";
    }
    if (props.outlined === true) {
      return "outlined";
    }
    if (props.borderless === true) {
      return "borderless";
    }
    if (props.standout) {
      return "standout";
    }
    return "standard";
  });
  const classes = computed(
    () => `q-field row no-wrap items-start q-field--${styleType.value}` + (state.fieldClass !== void 0 ? ` ${state.fieldClass.value}` : "") + (props.rounded === true ? " q-field--rounded" : "") + (props.square === true ? " q-field--square" : "") + (floatingLabel.value === true ? " q-field--float" : "") + (hasLabel.value === true ? " q-field--labeled" : "") + (props.dense === true ? " q-field--dense" : "") + (props.itemAligned === true ? " q-field--item-aligned q-item-type" : "") + (state.isDark.value === true ? " q-field--dark" : "") + (state.getControl === void 0 ? " q-field--auto-height" : "") + (state.focused.value === true ? " q-field--focused" : "") + (hasError.value === true ? " q-field--error" : "") + (hasError.value === true || state.focused.value === true ? " q-field--highlighted" : "") + (props.hideBottomSpace !== true && shouldRenderBottom.value === true ? " q-field--with-bottom" : "") + (props.disable === true ? " q-field--disabled" : props.readonly === true ? " q-field--readonly" : "")
  );
  const contentClass = computed(
    () => "q-field__control relative-position row no-wrap" + (props.bgColor !== void 0 ? ` bg-${props.bgColor}` : "") + (hasError.value === true ? " text-negative" : typeof props.standout === "string" && props.standout.length > 0 && state.focused.value === true ? ` ${props.standout}` : props.color !== void 0 ? ` text-${props.color}` : "")
  );
  const hasLabel = computed(
    () => props.labelSlot === true || props.label !== void 0
  );
  const labelClass = computed(
    () => "q-field__label no-pointer-events absolute ellipsis" + (props.labelColor !== void 0 && hasError.value !== true ? ` text-${props.labelColor}` : "")
  );
  const controlSlotScope = computed(() => ({
    id: state.targetUid.value,
    editable: state.editable.value,
    focused: state.focused.value,
    floatingLabel: floatingLabel.value,
    modelValue: props.modelValue,
    emitValue: state.emitValue
  }));
  const attributes = computed(() => {
    const acc = {
      for: state.targetUid.value
    };
    if (props.disable === true) {
      acc["aria-disabled"] = "true";
    } else if (props.readonly === true) {
      acc["aria-readonly"] = "true";
    }
    return acc;
  });
  watch(() => props.for, (val) => {
    state.targetUid.value = getTargetUid(val);
  });
  function focusHandler() {
    const el = document.activeElement;
    let target = state.targetRef !== void 0 && state.targetRef.value;
    if (target && (el === null || el.id !== state.targetUid.value)) {
      target.hasAttribute("tabindex") === true || (target = target.querySelector("[tabindex]"));
      if (target && target !== el) {
        target.focus({ preventScroll: true });
      }
    }
  }
  function focus() {
    addFocusFn(focusHandler);
  }
  function blur() {
    removeFocusFn(focusHandler);
    const el = document.activeElement;
    if (el !== null && state.rootRef.value.contains(el)) {
      el.blur();
    }
  }
  function onControlFocusin(e) {
    clearTimeout(focusoutTimer);
    if (state.editable.value === true && state.focused.value === false) {
      state.focused.value = true;
      emit("focus", e);
    }
  }
  function onControlFocusout(e, then) {
    clearTimeout(focusoutTimer);
    focusoutTimer = setTimeout(() => {
      if (document.hasFocus() === true && (state.hasPopupOpen === true || state.controlRef === void 0 || state.controlRef.value === null || state.controlRef.value.contains(document.activeElement) !== false)) {
        return;
      }
      if (state.focused.value === true) {
        state.focused.value = false;
        emit("blur", e);
      }
      then !== void 0 && then();
    });
  }
  function clearValue(e) {
    stopAndPrevent(e);
    if ($q.platform.is.mobile !== true) {
      const el = state.targetRef !== void 0 && state.targetRef.value || state.rootRef.value;
      el.focus();
    } else if (state.rootRef.value.contains(document.activeElement) === true) {
      document.activeElement.blur();
    }
    if (props.type === "file") {
      state.inputRef.value.value = null;
    }
    emit("update:modelValue", null);
    emit("clear", props.modelValue);
    nextTick(() => {
      resetValidation();
      if ($q.platform.is.mobile !== true) {
        isDirtyModel.value = false;
      }
    });
  }
  function getContent() {
    const node = [];
    slots.prepend !== void 0 && node.push(
      h("div", {
        class: "q-field__prepend q-field__marginal row no-wrap items-center",
        key: "prepend",
        onClick: prevent
      }, slots.prepend())
    );
    node.push(
      h("div", {
        class: "q-field__control-container col relative-position row no-wrap q-anchor--skip"
      }, getControlContainer())
    );
    hasError.value === true && props.noErrorIcon === false && node.push(
      getInnerAppendNode("error", [
        h(QIcon, { name: $q.iconSet.field.error, color: "negative" })
      ])
    );
    if (props.loading === true || state.innerLoading.value === true) {
      node.push(
        getInnerAppendNode(
          "inner-loading-append",
          slots.loading !== void 0 ? slots.loading() : [h(QSpinner, { color: props.color })]
        )
      );
    } else if (props.clearable === true && state.hasValue.value === true && state.editable.value === true) {
      node.push(
        getInnerAppendNode("inner-clearable-append", [
          h(QIcon, {
            class: "q-field__focusable-action",
            tag: "button",
            name: props.clearIcon || $q.iconSet.field.clear,
            tabindex: 0,
            type: "button",
            "aria-hidden": null,
            role: null,
            onClick: clearValue
          })
        ])
      );
    }
    slots.append !== void 0 && node.push(
      h("div", {
        class: "q-field__append q-field__marginal row no-wrap items-center",
        key: "append",
        onClick: prevent
      }, slots.append())
    );
    state.getInnerAppend !== void 0 && node.push(
      getInnerAppendNode("inner-append", state.getInnerAppend())
    );
    state.getControlChild !== void 0 && node.push(
      state.getControlChild()
    );
    return node;
  }
  function getControlContainer() {
    const node = [];
    props.prefix !== void 0 && props.prefix !== null && node.push(
      h("div", {
        class: "q-field__prefix no-pointer-events row items-center"
      }, props.prefix)
    );
    if (state.getShadowControl !== void 0 && state.hasShadow.value === true) {
      node.push(
        state.getShadowControl()
      );
    }
    if (state.getControl !== void 0) {
      node.push(state.getControl());
    } else if (slots.rawControl !== void 0) {
      node.push(slots.rawControl());
    } else if (slots.control !== void 0) {
      node.push(
        h("div", {
          ref: state.targetRef,
          class: "q-field__native row",
          tabindex: -1,
          ...state.splitAttrs.attributes.value,
          "data-autofocus": props.autofocus === true || void 0
        }, slots.control(controlSlotScope.value))
      );
    }
    hasLabel.value === true && node.push(
      h("div", {
        class: labelClass.value
      }, hSlot(slots.label, props.label))
    );
    props.suffix !== void 0 && props.suffix !== null && node.push(
      h("div", {
        class: "q-field__suffix no-pointer-events row items-center"
      }, props.suffix)
    );
    return node.concat(hSlot(slots.default));
  }
  function getBottom() {
    let msg, key;
    if (hasError.value === true) {
      if (errorMessage.value !== null) {
        msg = [h("div", { role: "alert" }, errorMessage.value)];
        key = `q--slot-error-${errorMessage.value}`;
      } else {
        msg = hSlot(slots.error);
        key = "q--slot-error";
      }
    } else if (props.hideHint !== true || state.focused.value === true) {
      if (props.hint !== void 0) {
        msg = [h("div", props.hint)];
        key = `q--slot-hint-${props.hint}`;
      } else {
        msg = hSlot(slots.hint);
        key = "q--slot-hint";
      }
    }
    const hasCounter = props.counter === true || slots.counter !== void 0;
    if (props.hideBottomSpace === true && hasCounter === false && msg === void 0) {
      return;
    }
    const main = h("div", {
      key,
      class: "q-field__messages col"
    }, msg);
    return h("div", {
      class: "q-field__bottom row items-start q-field__bottom--" + (props.hideBottomSpace !== true ? "animated" : "stale"),
      onClick: prevent
    }, [
      props.hideBottomSpace === true ? main : h(Transition, { name: "q-transition--field-message" }, () => main),
      hasCounter === true ? h("div", {
        class: "q-field__counter"
      }, slots.counter !== void 0 ? slots.counter() : state.computedCounter.value) : null
    ]);
  }
  function getInnerAppendNode(key, content) {
    return content === null ? null : h("div", {
      key,
      class: "q-field__append q-field__marginal row no-wrap items-center q-anchor--skip"
    }, content);
  }
  let shouldActivate = false;
  onDeactivated(() => {
    shouldActivate = true;
  });
  onActivated(() => {
    shouldActivate === true && props.autofocus === true && proxy.focus();
  });
  onMounted(() => {
    if (isRuntimeSsrPreHydration.value === true && props.for === void 0) {
      state.targetUid.value = getTargetUid();
    }
    props.autofocus === true && proxy.focus();
  });
  onBeforeUnmount(() => {
    clearTimeout(focusoutTimer);
  });
  Object.assign(proxy, { focus, blur });
  return function renderField() {
    const labelAttrs = state.getControl === void 0 && slots.control === void 0 ? {
      ...state.splitAttrs.attributes.value,
      "data-autofocus": props.autofocus === true || void 0,
      ...attributes.value
    } : attributes.value;
    return h("label", {
      ref: state.rootRef,
      class: [
        classes.value,
        attrs.class
      ],
      style: attrs.style,
      ...labelAttrs
    }, [
      slots.before !== void 0 ? h("div", {
        class: "q-field__before q-field__marginal row no-wrap items-center",
        onClick: prevent
      }, slots.before()) : null,
      h("div", {
        class: "q-field__inner relative-position col self-stretch"
      }, [
        h("div", {
          ref: state.controlRef,
          class: contentClass.value,
          tabindex: -1,
          ...state.controlEvents
        }, getContent()),
        shouldRenderBottom.value === true ? getBottom() : null
      ]),
      slots.after !== void 0 ? h("div", {
        class: "q-field__after q-field__marginal row no-wrap items-center",
        onClick: prevent
      }, slots.after()) : null
    ]);
  };
}
const NAMED_MASKS = {
  date: "####/##/##",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
const TOKENS = {
  "#": { pattern: "[\\d]", negate: "[^\\d]" },
  S: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]" },
  N: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]" },
  A: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]", transform: (v) => v.toLocaleUpperCase() },
  a: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]", transform: (v) => v.toLocaleLowerCase() },
  X: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]", transform: (v) => v.toLocaleUpperCase() },
  x: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]", transform: (v) => v.toLocaleLowerCase() }
};
const KEYS = Object.keys(TOKENS);
KEYS.forEach((key) => {
  TOKENS[key].regex = new RegExp(TOKENS[key].pattern);
});
const tokenRegexMask = new RegExp("\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|([" + KEYS.join("") + "])|(.)", "g"), escRegex = /[.*+?^${}()|[\]\\]/g;
const MARKER = String.fromCharCode(1);
const useMaskProps = {
  mask: String,
  reverseFillMask: Boolean,
  fillMask: [Boolean, String],
  unmaskedValue: Boolean
};
function useMask(props, emit, emitValue, inputRef) {
  let maskMarked, maskReplaced, computedMask, computedUnmask;
  const hasMask = ref(null);
  const innerValue = ref(getInitialMaskedValue());
  function getIsTypeText() {
    return props.autogrow === true || ["textarea", "text", "search", "url", "tel", "password"].includes(props.type);
  }
  watch(() => props.type + props.autogrow, updateMaskInternals);
  watch(() => props.mask, (v) => {
    if (v !== void 0) {
      updateMaskValue(innerValue.value, true);
    } else {
      const val = unmaskValue(innerValue.value);
      updateMaskInternals();
      props.modelValue !== val && emit("update:modelValue", val);
    }
  });
  watch(() => props.fillMask + props.reverseFillMask, () => {
    hasMask.value === true && updateMaskValue(innerValue.value, true);
  });
  watch(() => props.unmaskedValue, () => {
    hasMask.value === true && updateMaskValue(innerValue.value);
  });
  function getInitialMaskedValue() {
    updateMaskInternals();
    if (hasMask.value === true) {
      const masked = maskValue(unmaskValue(props.modelValue));
      return props.fillMask !== false ? fillWithMask(masked) : masked;
    }
    return props.modelValue;
  }
  function getPaddedMaskMarked(size) {
    if (size < maskMarked.length) {
      return maskMarked.slice(-size);
    }
    let pad = "", localMaskMarked = maskMarked;
    const padPos = localMaskMarked.indexOf(MARKER);
    if (padPos > -1) {
      for (let i = size - localMaskMarked.length; i > 0; i--) {
        pad += MARKER;
      }
      localMaskMarked = localMaskMarked.slice(0, padPos) + pad + localMaskMarked.slice(padPos);
    }
    return localMaskMarked;
  }
  function updateMaskInternals() {
    hasMask.value = props.mask !== void 0 && props.mask.length > 0 && getIsTypeText();
    if (hasMask.value === false) {
      computedUnmask = void 0;
      maskMarked = "";
      maskReplaced = "";
      return;
    }
    const localComputedMask = NAMED_MASKS[props.mask] === void 0 ? props.mask : NAMED_MASKS[props.mask], fillChar = typeof props.fillMask === "string" && props.fillMask.length > 0 ? props.fillMask.slice(0, 1) : "_", fillCharEscaped = fillChar.replace(escRegex, "\\$&"), unmask = [], extract = [], mask = [];
    let firstMatch = props.reverseFillMask === true, unmaskChar = "", negateChar = "";
    localComputedMask.replace(tokenRegexMask, (_, char1, esc, token, char2) => {
      if (token !== void 0) {
        const c = TOKENS[token];
        mask.push(c);
        negateChar = c.negate;
        if (firstMatch === true) {
          extract.push("(?:" + negateChar + "+)?(" + c.pattern + "+)?(?:" + negateChar + "+)?(" + c.pattern + "+)?");
          firstMatch = false;
        }
        extract.push("(?:" + negateChar + "+)?(" + c.pattern + ")?");
      } else if (esc !== void 0) {
        unmaskChar = "\\" + (esc === "\\" ? "" : esc);
        mask.push(esc);
        unmask.push("([^" + unmaskChar + "]+)?" + unmaskChar + "?");
      } else {
        const c = char1 !== void 0 ? char1 : char2;
        unmaskChar = c === "\\" ? "\\\\\\\\" : c.replace(escRegex, "\\\\$&");
        mask.push(c);
        unmask.push("([^" + unmaskChar + "]+)?" + unmaskChar + "?");
      }
    });
    const unmaskMatcher = new RegExp(
      "^" + unmask.join("") + "(" + (unmaskChar === "" ? "." : "[^" + unmaskChar + "]") + "+)?" + (unmaskChar === "" ? "" : "[" + unmaskChar + "]*") + "$"
    ), extractLast = extract.length - 1, extractMatcher = extract.map((re, index) => {
      if (index === 0 && props.reverseFillMask === true) {
        return new RegExp("^" + fillCharEscaped + "*" + re);
      } else if (index === extractLast) {
        return new RegExp(
          "^" + re + "(" + (negateChar === "" ? "." : negateChar) + "+)?" + (props.reverseFillMask === true ? "$" : fillCharEscaped + "*")
        );
      }
      return new RegExp("^" + re);
    });
    computedMask = mask;
    computedUnmask = (val) => {
      const unmaskMatch = unmaskMatcher.exec(val);
      if (unmaskMatch !== null) {
        val = unmaskMatch.slice(1).join("");
      }
      const extractMatch = [], extractMatcherLength = extractMatcher.length;
      for (let i = 0, str = val; i < extractMatcherLength; i++) {
        const m = extractMatcher[i].exec(str);
        if (m === null) {
          break;
        }
        str = str.slice(m.shift().length);
        extractMatch.push(...m);
      }
      if (extractMatch.length > 0) {
        return extractMatch.join("");
      }
      return val;
    };
    maskMarked = mask.map((v) => typeof v === "string" ? v : MARKER).join("");
    maskReplaced = maskMarked.split(MARKER).join(fillChar);
  }
  function updateMaskValue(rawVal, updateMaskInternalsFlag, inputType) {
    const inp = inputRef.value, end = inp.selectionEnd, endReverse = inp.value.length - end, unmasked = unmaskValue(rawVal);
    updateMaskInternalsFlag === true && updateMaskInternals();
    const preMasked = maskValue(unmasked), masked = props.fillMask !== false ? fillWithMask(preMasked) : preMasked, changed = innerValue.value !== masked;
    inp.value !== masked && (inp.value = masked);
    changed === true && (innerValue.value = masked);
    document.activeElement === inp && nextTick(() => {
      if (masked === maskReplaced) {
        const cursor = props.reverseFillMask === true ? maskReplaced.length : 0;
        inp.setSelectionRange(cursor, cursor, "forward");
        return;
      }
      if (inputType === "insertFromPaste" && props.reverseFillMask !== true) {
        const cursor = end - 1;
        moveCursor.right(inp, cursor, cursor);
        return;
      }
      if (["deleteContentBackward", "deleteContentForward"].indexOf(inputType) > -1) {
        const cursor = props.reverseFillMask === true ? end === 0 ? masked.length > preMasked.length ? 1 : 0 : Math.max(0, masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse) + 1)) + 1 : end;
        inp.setSelectionRange(cursor, cursor, "forward");
        return;
      }
      if (props.reverseFillMask === true) {
        if (changed === true) {
          const cursor = Math.max(0, masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse + 1)));
          if (cursor === 1 && end === 1) {
            inp.setSelectionRange(cursor, cursor, "forward");
          } else {
            moveCursor.rightReverse(inp, cursor, cursor);
          }
        } else {
          const cursor = masked.length - endReverse;
          inp.setSelectionRange(cursor, cursor, "backward");
        }
      } else {
        if (changed === true) {
          const cursor = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, end) - 1);
          moveCursor.right(inp, cursor, cursor);
        } else {
          const cursor = end - 1;
          moveCursor.right(inp, cursor, cursor);
        }
      }
    });
    const val = props.unmaskedValue === true ? unmaskValue(masked) : masked;
    String(props.modelValue) !== val && emitValue(val, true);
  }
  function moveCursorForPaste(inp, start, end) {
    const preMasked = maskValue(unmaskValue(inp.value));
    start = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, start));
    inp.setSelectionRange(start, end, "forward");
  }
  const moveCursor = {
    left(inp, start, end, selection) {
      const noMarkBefore = maskMarked.slice(start - 1).indexOf(MARKER) === -1;
      let i = Math.max(0, start - 1);
      for (; i >= 0; i--) {
        if (maskMarked[i] === MARKER) {
          start = i;
          noMarkBefore === true && start++;
          break;
        }
      }
      if (i < 0 && maskMarked[start] !== void 0 && maskMarked[start] !== MARKER) {
        return moveCursor.right(inp, 0, 0);
      }
      start >= 0 && inp.setSelectionRange(
        start,
        selection === true ? end : start,
        "backward"
      );
    },
    right(inp, start, end, selection) {
      const limit = inp.value.length;
      let i = Math.min(limit, end + 1);
      for (; i <= limit; i++) {
        if (maskMarked[i] === MARKER) {
          end = i;
          break;
        } else if (maskMarked[i - 1] === MARKER) {
          end = i;
        }
      }
      if (i > limit && maskMarked[end - 1] !== void 0 && maskMarked[end - 1] !== MARKER) {
        return moveCursor.left(inp, limit, limit);
      }
      inp.setSelectionRange(selection ? start : end, end, "forward");
    },
    leftReverse(inp, start, end, selection) {
      const localMaskMarked = getPaddedMaskMarked(inp.value.length);
      let i = Math.max(0, start - 1);
      for (; i >= 0; i--) {
        if (localMaskMarked[i - 1] === MARKER) {
          start = i;
          break;
        } else if (localMaskMarked[i] === MARKER) {
          start = i;
          if (i === 0) {
            break;
          }
        }
      }
      if (i < 0 && localMaskMarked[start] !== void 0 && localMaskMarked[start] !== MARKER) {
        return moveCursor.rightReverse(inp, 0, 0);
      }
      start >= 0 && inp.setSelectionRange(
        start,
        selection === true ? end : start,
        "backward"
      );
    },
    rightReverse(inp, start, end, selection) {
      const limit = inp.value.length, localMaskMarked = getPaddedMaskMarked(limit), noMarkBefore = localMaskMarked.slice(0, end + 1).indexOf(MARKER) === -1;
      let i = Math.min(limit, end + 1);
      for (; i <= limit; i++) {
        if (localMaskMarked[i - 1] === MARKER) {
          end = i;
          end > 0 && noMarkBefore === true && end--;
          break;
        }
      }
      if (i > limit && localMaskMarked[end - 1] !== void 0 && localMaskMarked[end - 1] !== MARKER) {
        return moveCursor.leftReverse(inp, limit, limit);
      }
      inp.setSelectionRange(selection === true ? start : end, end, "forward");
    }
  };
  function onMaskedKeydown(e) {
    if (shouldIgnoreKey(e) === true) {
      return;
    }
    const inp = inputRef.value, start = inp.selectionStart, end = inp.selectionEnd;
    if (e.keyCode === 37 || e.keyCode === 39) {
      const fn = moveCursor[(e.keyCode === 39 ? "right" : "left") + (props.reverseFillMask === true ? "Reverse" : "")];
      e.preventDefault();
      fn(inp, start, end, e.shiftKey);
    } else if (e.keyCode === 8 && props.reverseFillMask !== true && start === end) {
      moveCursor.left(inp, start, end, true);
    } else if (e.keyCode === 46 && props.reverseFillMask === true && start === end) {
      moveCursor.rightReverse(inp, start, end, true);
    }
  }
  function maskValue(val) {
    if (val === void 0 || val === null || val === "") {
      return "";
    }
    if (props.reverseFillMask === true) {
      return maskValueReverse(val);
    }
    const mask = computedMask;
    let valIndex = 0, output = "";
    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      const valChar = val[valIndex], maskDef = mask[maskIndex];
      if (typeof maskDef === "string") {
        output += maskDef;
        valChar === maskDef && valIndex++;
      } else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        output += maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar;
        valIndex++;
      } else {
        return output;
      }
    }
    return output;
  }
  function maskValueReverse(val) {
    const mask = computedMask, firstTokenIndex = maskMarked.indexOf(MARKER);
    let valIndex = val.length - 1, output = "";
    for (let maskIndex = mask.length - 1; maskIndex >= 0 && valIndex > -1; maskIndex--) {
      const maskDef = mask[maskIndex];
      let valChar = val[valIndex];
      if (typeof maskDef === "string") {
        output = maskDef + output;
        valChar === maskDef && valIndex--;
      } else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        do {
          output = (maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar) + output;
          valIndex--;
          valChar = val[valIndex];
        } while (firstTokenIndex === maskIndex && valChar !== void 0 && maskDef.regex.test(valChar));
      } else {
        return output;
      }
    }
    return output;
  }
  function unmaskValue(val) {
    return typeof val !== "string" || computedUnmask === void 0 ? typeof val === "number" ? computedUnmask("" + val) : val : computedUnmask(val);
  }
  function fillWithMask(val) {
    if (maskReplaced.length - val.length <= 0) {
      return val;
    }
    return props.reverseFillMask === true && val.length > 0 ? maskReplaced.slice(0, -val.length) + val : val + maskReplaced.slice(val.length);
  }
  return {
    innerValue,
    hasMask,
    moveCursorForPaste,
    updateMaskValue,
    onMaskedKeydown
  };
}
const useFormProps = {
  name: String
};
function useFormInject(formAttrs = {}) {
  return (child, action, className) => {
    child[action](
      h("input", {
        class: "hidden" + (className || ""),
        ...formAttrs.value
      })
    );
  };
}
function useFormInputNameAttr(props) {
  return computed(() => props.name || props.for);
}
function useFileFormDomProps(props, typeGuard) {
  function getFormDomProps() {
    const model = props.modelValue;
    try {
      const dt = "DataTransfer" in window ? new DataTransfer() : "ClipboardEvent" in window ? new ClipboardEvent("").clipboardData : void 0;
      if (Object(model) === model) {
        ("length" in model ? Array.from(model) : [model]).forEach((file) => {
          dt.items.add(file);
        });
      }
      return {
        files: dt.files
      };
    } catch (e) {
      return {
        files: void 0
      };
    }
  }
  return typeGuard === true ? computed(() => {
    if (props.type !== "file") {
      return;
    }
    return getFormDomProps();
  }) : computed(getFormDomProps);
}
const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
const isChinese = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u{2f800}-\u{2fa1f}]/u;
const isKorean = /[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/;
const isPlainText = /[a-z0-9_ -]$/i;
function useKeyComposition(onInput) {
  return function onComposition(e) {
    if (e.type === "compositionend" || e.type === "change") {
      if (e.target.qComposing !== true) {
        return;
      }
      e.target.qComposing = false;
      onInput(e);
    } else if (e.type === "compositionupdate" && e.target.qComposing !== true && typeof e.data === "string") {
      const isComposing = client.is.firefox === true ? isPlainText.test(e.data) === false : isJapanese.test(e.data) === true || isChinese.test(e.data) === true || isKorean.test(e.data) === true;
      if (isComposing === true) {
        e.target.qComposing = true;
      }
    }
  };
}
var QInput = createComponent({
  name: "QInput",
  inheritAttrs: false,
  props: {
    ...useFieldProps,
    ...useMaskProps,
    ...useFormProps,
    modelValue: { required: false },
    shadowText: String,
    type: {
      type: String,
      default: "text"
    },
    debounce: [String, Number],
    autogrow: Boolean,
    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object]
  },
  emits: [
    ...useFieldEmits,
    "paste",
    "change"
  ],
  setup(props, { emit, attrs }) {
    const { proxy } = getCurrentInstance();
    const { $q } = proxy;
    const temp = {};
    let emitCachedValue = NaN, typedNumber, stopValueWatcher, emitTimer, emitValueFn;
    const inputRef = ref(null);
    const nameProp = useFormInputNameAttr(props);
    const {
      innerValue,
      hasMask,
      moveCursorForPaste,
      updateMaskValue,
      onMaskedKeydown
    } = useMask(props, emit, emitValue, inputRef);
    const formDomProps = useFileFormDomProps(props, true);
    const hasValue = computed(() => fieldValueIsFilled(innerValue.value));
    const onComposition = useKeyComposition(onInput);
    const state = useFieldState();
    const isTextarea = computed(
      () => props.type === "textarea" || props.autogrow === true
    );
    const isTypeText = computed(
      () => isTextarea.value === true || ["text", "search", "url", "tel", "password"].includes(props.type)
    );
    const onEvents = computed(() => {
      const evt = {
        ...state.splitAttrs.listeners.value,
        onInput,
        onPaste,
        onChange,
        onBlur: onFinishEditing,
        onFocus: stop
      };
      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = onComposition;
      if (hasMask.value === true) {
        evt.onKeydown = onMaskedKeydown;
      }
      if (props.autogrow === true) {
        evt.onAnimationend = adjustHeight;
      }
      return evt;
    });
    const inputAttrs = computed(() => {
      const attrs2 = {
        tabindex: 0,
        "data-autofocus": props.autofocus === true || void 0,
        rows: props.type === "textarea" ? 6 : void 0,
        "aria-label": props.label,
        name: nameProp.value,
        ...state.splitAttrs.attributes.value,
        id: state.targetUid.value,
        maxlength: props.maxlength,
        disabled: props.disable === true,
        readonly: props.readonly === true
      };
      if (isTextarea.value === false) {
        attrs2.type = props.type;
      }
      if (props.autogrow === true) {
        attrs2.rows = 1;
      }
      return attrs2;
    });
    watch(() => props.type, () => {
      if (inputRef.value) {
        inputRef.value.value = props.modelValue;
      }
    });
    watch(() => props.modelValue, (v) => {
      if (hasMask.value === true) {
        if (stopValueWatcher === true) {
          stopValueWatcher = false;
          if (String(v) === emitCachedValue) {
            return;
          }
        }
        updateMaskValue(v);
      } else if (innerValue.value !== v) {
        innerValue.value = v;
        if (props.type === "number" && temp.hasOwnProperty("value") === true) {
          if (typedNumber === true) {
            typedNumber = false;
          } else {
            delete temp.value;
          }
        }
      }
      props.autogrow === true && nextTick(adjustHeight);
    });
    watch(() => props.autogrow, (val) => {
      if (val === true) {
        nextTick(adjustHeight);
      } else if (inputRef.value !== null && attrs.rows > 0) {
        inputRef.value.style.height = "auto";
      }
    });
    watch(() => props.dense, () => {
      props.autogrow === true && nextTick(adjustHeight);
    });
    function focus() {
      addFocusFn(() => {
        const el = document.activeElement;
        if (inputRef.value !== null && inputRef.value !== el && (el === null || el.id !== state.targetUid.value)) {
          inputRef.value.focus({ preventScroll: true });
        }
      });
    }
    function select() {
      inputRef.value !== null && inputRef.value.select();
    }
    function onPaste(e) {
      if (hasMask.value === true && props.reverseFillMask !== true) {
        const inp = e.target;
        moveCursorForPaste(inp, inp.selectionStart, inp.selectionEnd);
      }
      emit("paste", e);
    }
    function onInput(e) {
      if (!e || !e.target) {
        return;
      }
      if (props.type === "file") {
        emit("update:modelValue", e.target.files);
        return;
      }
      const val = e.target.value;
      if (e.target.qComposing === true) {
        temp.value = val;
        return;
      }
      if (hasMask.value === true) {
        updateMaskValue(val, false, e.inputType);
      } else {
        emitValue(val);
        if (isTypeText.value === true && e.target === document.activeElement) {
          const { selectionStart, selectionEnd } = e.target;
          if (selectionStart !== void 0 && selectionEnd !== void 0) {
            nextTick(() => {
              if (e.target === document.activeElement && val.indexOf(e.target.value) === 0) {
                e.target.setSelectionRange(selectionStart, selectionEnd);
              }
            });
          }
        }
      }
      props.autogrow === true && adjustHeight();
    }
    function emitValue(val, stopWatcher) {
      emitValueFn = () => {
        if (props.type !== "number" && temp.hasOwnProperty("value") === true) {
          delete temp.value;
        }
        if (props.modelValue !== val && emitCachedValue !== val) {
          emitCachedValue = val;
          stopWatcher === true && (stopValueWatcher = true);
          emit("update:modelValue", val);
          nextTick(() => {
            emitCachedValue === val && (emitCachedValue = NaN);
          });
        }
        emitValueFn = void 0;
      };
      if (props.type === "number") {
        typedNumber = true;
        temp.value = val;
      }
      if (props.debounce !== void 0) {
        clearTimeout(emitTimer);
        temp.value = val;
        emitTimer = setTimeout(emitValueFn, props.debounce);
      } else {
        emitValueFn();
      }
    }
    function adjustHeight() {
      requestAnimationFrame(() => {
        const inp = inputRef.value;
        if (inp !== null) {
          const parentStyle = inp.parentNode.style;
          const { overflow } = inp.style;
          $q.platform.is.firefox !== true && (inp.style.overflow = "hidden");
          inp.style.height = "1px";
          parentStyle.marginBottom = inp.scrollHeight - 1 + "px";
          inp.style.height = inp.scrollHeight + "px";
          inp.style.overflow = overflow;
          parentStyle.marginBottom = "";
        }
      });
    }
    function onChange(e) {
      onComposition(e);
      clearTimeout(emitTimer);
      emitValueFn !== void 0 && emitValueFn();
      emit("change", e.target.value);
    }
    function onFinishEditing(e) {
      e !== void 0 && stop(e);
      clearTimeout(emitTimer);
      emitValueFn !== void 0 && emitValueFn();
      typedNumber = false;
      stopValueWatcher = false;
      delete temp.value;
      props.type !== "file" && setTimeout(() => {
        if (inputRef.value !== null) {
          inputRef.value.value = innerValue.value !== void 0 ? innerValue.value : "";
        }
      });
    }
    function getCurValue() {
      return temp.hasOwnProperty("value") === true ? temp.value : innerValue.value !== void 0 ? innerValue.value : "";
    }
    onBeforeUnmount(() => {
      onFinishEditing();
    });
    onMounted(() => {
      props.autogrow === true && adjustHeight();
    });
    Object.assign(state, {
      innerValue,
      fieldClass: computed(
        () => `q-${isTextarea.value === true ? "textarea" : "input"}` + (props.autogrow === true ? " q-textarea--autogrow" : "")
      ),
      hasShadow: computed(
        () => props.type !== "file" && typeof props.shadowText === "string" && props.shadowText.length > 0
      ),
      inputRef,
      emitValue,
      hasValue,
      floatingLabel: computed(
        () => hasValue.value === true || fieldValueIsFilled(props.displayValue)
      ),
      getControl: () => {
        return h(isTextarea.value === true ? "textarea" : "input", {
          ref: inputRef,
          class: [
            "q-field__native q-placeholder",
            props.inputClass
          ],
          style: props.inputStyle,
          ...inputAttrs.value,
          ...onEvents.value,
          ...props.type !== "file" ? { value: getCurValue() } : formDomProps.value
        });
      },
      getShadowControl: () => {
        return h("div", {
          class: "q-field__native q-field__shadow absolute-bottom no-pointer-events" + (isTextarea.value === true ? "" : " text-no-wrap")
        }, [
          h("span", { class: "invisible" }, getCurValue()),
          h("span", props.shadowText)
        ]);
      }
    });
    const renderFn = useField(state);
    Object.assign(proxy, {
      focus,
      select,
      getNativeElement: () => inputRef.value
    });
    return renderFn;
  }
});
var QItemSection = createComponent({
  name: "QItemSection",
  props: {
    avatar: Boolean,
    thumbnail: Boolean,
    side: Boolean,
    top: Boolean,
    noWrap: Boolean
  },
  setup(props, { slots }) {
    const classes = computed(
      () => `q-item__section column q-item__section--${props.avatar === true || props.side === true || props.thumbnail === true ? "side" : "main"}` + (props.top === true ? " q-item__section--top justify-start" : " justify-center") + (props.avatar === true ? " q-item__section--avatar" : "") + (props.thumbnail === true ? " q-item__section--thumbnail" : "") + (props.noWrap === true ? " q-item__section--nowrap" : "")
    );
    return () => h("div", { class: classes.value }, hSlot(slots.default));
  }
});
var QItemLabel = createComponent({
  name: "QItemLabel",
  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    lines: [Number, String]
  },
  setup(props, { slots }) {
    const parsedLines = computed(() => parseInt(props.lines, 10));
    const classes = computed(
      () => "q-item__label" + (props.overline === true ? " q-item__label--overline text-overline" : "") + (props.caption === true ? " q-item__label--caption text-caption" : "") + (props.header === true ? " q-item__label--header" : "") + (parsedLines.value === 1 ? " ellipsis" : "")
    );
    const style = computed(() => {
      return props.lines !== void 0 && parsedLines.value > 1 ? {
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": parsedLines.value
      } : null;
    });
    return () => h("div", {
      style: style.value,
      class: classes.value
    }, hSlot(slots.default));
  }
});
var QList = createComponent({
  name: "QList",
  props: {
    ...useDarkProps,
    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    padding: Boolean
  },
  setup(props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const classes = computed(
      () => "q-list" + (props.bordered === true ? " q-list--bordered" : "") + (props.dense === true ? " q-list--dense" : "") + (props.separator === true ? " q-list--separator" : "") + (isDark.value === true ? " q-list--dark" : "") + (props.padding === true ? " q-list--padding" : "")
    );
    return () => h("div", { class: classes.value, role: "list" }, hSlot(slots.default));
  }
});
const handlers$1 = [];
let escDown;
function onKeydown(evt) {
  escDown = evt.keyCode === 27;
}
function onBlur() {
  if (escDown === true) {
    escDown = false;
  }
}
function onKeyup(evt) {
  if (escDown === true) {
    escDown = false;
    if (isKeyCode(evt, 27) === true) {
      handlers$1[handlers$1.length - 1](evt);
    }
  }
}
function update(action) {
  window[action]("keydown", onKeydown);
  window[action]("blur", onBlur);
  window[action]("keyup", onKeyup);
  escDown = false;
}
function addEscapeKey(fn) {
  if (client.is.desktop === true) {
    handlers$1.push(fn);
    if (handlers$1.length === 1) {
      update("addEventListener");
    }
  }
}
function removeEscapeKey(fn) {
  const index = handlers$1.indexOf(fn);
  if (index > -1) {
    handlers$1.splice(index, 1);
    if (handlers$1.length === 0) {
      update("removeEventListener");
    }
  }
}
const handlers = [];
function trigger(e) {
  handlers[handlers.length - 1](e);
}
function addFocusout(fn) {
  if (client.is.desktop === true) {
    handlers.push(fn);
    if (handlers.length === 1) {
      document.body.addEventListener("focusin", trigger);
    }
  }
}
function removeFocusout(fn) {
  const index = handlers.indexOf(fn);
  if (index > -1) {
    handlers.splice(index, 1);
    if (handlers.length === 0) {
      document.body.removeEventListener("focusin", trigger);
    }
  }
}
var QMenu = createComponent({
  name: "QMenu",
  inheritAttrs: false,
  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useDarkProps,
    ...useTransitionProps,
    persistent: Boolean,
    autoClose: Boolean,
    separateClosePopup: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,
    fit: Boolean,
    cover: Boolean,
    square: Boolean,
    anchor: {
      type: String,
      validator: validatePosition
    },
    self: {
      type: String,
      validator: validatePosition
    },
    offset: {
      type: Array,
      validator: validateOffset
    },
    scrollTarget: {
      default: void 0
    },
    touchPosition: Boolean,
    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    }
  },
  emits: [
    ...useModelToggleEmits,
    "click",
    "escape-key"
  ],
  setup(props, { slots, emit, attrs }) {
    let refocusTarget = null, absoluteOffset, unwatchPosition, avoidAutoClose;
    const vm = getCurrentInstance();
    const { proxy } = vm;
    const { $q } = proxy;
    const innerRef = ref(null);
    const showing = ref(false);
    const hideOnRouteChange = computed(
      () => props.persistent !== true && props.noRouteDismiss !== true
    );
    const isDark = useDark(props, $q);
    const { registerTick, removeTick } = useTick();
    const { registerTimeout } = useTimeout();
    const { transition, transitionStyle } = useTransition(props, showing);
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget);
    const { anchorEl, canShow } = useAnchor({ showing });
    const { hide } = useModelToggle({
      showing,
      canShow,
      handleShow,
      handleHide,
      hideOnRouteChange,
      processOnMount: true
    });
    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent);
    const clickOutsideProps = {
      anchorEl,
      innerRef,
      onClickOutside(e) {
        if (props.persistent !== true && showing.value === true) {
          hide(e);
          if (e.type === "touchstart" || e.target.classList.contains("q-dialog__backdrop")) {
            stopAndPrevent(e);
          }
          return true;
        }
      }
    };
    const anchorOrigin = computed(
      () => parsePosition(
        props.anchor || (props.cover === true ? "center middle" : "bottom start"),
        $q.lang.rtl
      )
    );
    const selfOrigin = computed(() => props.cover === true ? anchorOrigin.value : parsePosition(props.self || "top start", $q.lang.rtl));
    const menuClass = computed(
      () => (props.square === true ? " q-menu--square" : "") + (isDark.value === true ? " q-menu--dark q-dark" : "")
    );
    const onEvents = computed(() => props.autoClose === true ? { onClick: onAutoClose } : {});
    const handlesFocus = computed(
      () => showing.value === true && props.persistent !== true
    );
    watch(handlesFocus, (val) => {
      if (val === true) {
        addEscapeKey(onEscapeKey);
        addClickOutside(clickOutsideProps);
      } else {
        removeEscapeKey(onEscapeKey);
        removeClickOutside(clickOutsideProps);
      }
    });
    function focus() {
      addFocusFn(() => {
        let node = innerRef.value;
        if (node && node.contains(document.activeElement) !== true) {
          node = node.querySelector("[autofocus], [data-autofocus]") || node;
          node.focus({ preventScroll: true });
        }
      });
    }
    function handleShow(evt) {
      refocusTarget = props.noRefocus === false ? document.activeElement : null;
      addFocusout(onFocusout);
      showPortal();
      configureScrollTarget();
      absoluteOffset = void 0;
      if (evt !== void 0 && (props.touchPosition || props.contextMenu)) {
        const pos = position(evt);
        if (pos.left !== void 0) {
          const { top, left } = anchorEl.value.getBoundingClientRect();
          absoluteOffset = { left: pos.left - left, top: pos.top - top };
        }
      }
      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + "|" + $q.screen.height + "|" + props.self + "|" + props.anchor + "|" + $q.lang.rtl,
          updatePosition
        );
      }
      if (props.noFocus !== true) {
        document.activeElement.blur();
      }
      registerTick(() => {
        updatePosition();
        props.noFocus !== true && focus();
      });
      registerTimeout(() => {
        if ($q.platform.is.ios === true) {
          avoidAutoClose = props.autoClose;
          innerRef.value.click();
        }
        updatePosition();
        showPortal(true);
        emit("show", evt);
      }, props.transitionDuration);
    }
    function handleHide(evt) {
      removeTick();
      hidePortal();
      anchorCleanup(true);
      if (refocusTarget !== null && (evt === void 0 || evt.qClickOutside !== true)) {
        refocusTarget.focus();
        refocusTarget = null;
      }
      registerTimeout(() => {
        hidePortal(true);
        emit("hide", evt);
      }, props.transitionDuration);
    }
    function anchorCleanup(hiding) {
      absoluteOffset = void 0;
      if (unwatchPosition !== void 0) {
        unwatchPosition();
        unwatchPosition = void 0;
      }
      if (hiding === true || showing.value === true) {
        removeFocusout(onFocusout);
        unconfigureScrollTarget();
        removeClickOutside(clickOutsideProps);
        removeEscapeKey(onEscapeKey);
      }
      if (hiding !== true) {
        refocusTarget = null;
      }
    }
    function configureScrollTarget() {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget);
        changeScrollEvent(localScrollTarget.value, updatePosition);
      }
    }
    function onAutoClose(e) {
      if (avoidAutoClose !== true) {
        closePortalMenus(proxy, e);
        emit("click", e);
      } else {
        avoidAutoClose = false;
      }
    }
    function onFocusout(evt) {
      if (handlesFocus.value === true && props.noFocus !== true && childHasFocus(innerRef.value, evt.target) !== true) {
        focus();
      }
    }
    function onEscapeKey(evt) {
      emit("escape-key");
      hide(evt);
    }
    function updatePosition() {
      const el = innerRef.value;
      if (el === null || anchorEl.value === null) {
        return;
      }
      setPosition({
        el,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        absoluteOffset,
        fit: props.fit,
        cover: props.cover,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      });
    }
    function renderPortalContent() {
      return h(
        Transition,
        { name: transition.value, appear: true },
        () => showing.value === true ? h("div", {
          role: "menu",
          ...attrs,
          ref: innerRef,
          tabindex: -1,
          class: [
            "q-menu q-position-engine scroll" + menuClass.value,
            attrs.class
          ],
          style: [
            attrs.style,
            transitionStyle.value
          ],
          ...onEvents.value
        }, hSlot(slots.default)) : null
      );
    }
    onBeforeUnmount(anchorCleanup);
    Object.assign(proxy, { focus, updatePosition });
    return renderPortal;
  }
});
const insetMap = {
  true: "inset",
  item: "item-inset",
  "item-thumbnail": "item-thumbnail-inset"
};
const margins = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24
};
var QSeparator = createComponent({
  name: "QSeparator",
  props: {
    ...useDarkProps,
    spaced: [Boolean, String],
    inset: [Boolean, String],
    vertical: Boolean,
    color: String,
    size: String
  },
  setup(props) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const orientation = computed(() => props.vertical === true ? "vertical" : "horizontal");
    const orientClass = computed(() => ` q-separator--${orientation.value}`);
    const insetClass = computed(() => props.inset !== false ? `${orientClass.value}-${insetMap[props.inset]}` : "");
    const classes = computed(
      () => `q-separator${orientClass.value}${insetClass.value}` + (props.color !== void 0 ? ` bg-${props.color}` : "") + (isDark.value === true ? " q-separator--dark" : "")
    );
    const style = computed(() => {
      const acc = {};
      if (props.size !== void 0) {
        acc[props.vertical === true ? "width" : "height"] = props.size;
      }
      if (props.spaced !== false) {
        const size = props.spaced === true ? `${margins.md}px` : props.spaced in margins ? `${margins[props.spaced]}px` : props.spaced;
        const dir = props.vertical === true ? ["Left", "Right"] : ["Top", "Bottom"];
        acc[`margin${dir[0]}`] = acc[`margin${dir[1]}`] = size;
      }
      return acc;
    });
    return () => h("hr", {
      class: classes.value,
      style: style.value,
      "aria-orientation": orientation.value
    });
  }
});
function useRefocusTarget(props, rootRef) {
  const refocusRef = ref(null);
  const refocusTargetEl = computed(() => {
    if (props.disable === true) {
      return null;
    }
    return h("span", {
      ref: refocusRef,
      class: "no-outline",
      tabindex: -1
    });
  });
  function refocusTarget(e) {
    const root = rootRef.value;
    if (e !== void 0 && e.type.indexOf("key") === 0) {
      if (root !== null && document.activeElement !== root && root.contains(document.activeElement) === true) {
        root.focus();
      }
    } else if (refocusRef.value !== null && (e === void 0 || root !== null && root.contains(e.target) === true)) {
      refocusRef.value.focus();
    }
  }
  return {
    refocusTargetEl,
    refocusTarget
  };
}
var optionSizes = {
  xs: 30,
  sm: 35,
  md: 40,
  lg: 50,
  xl: 60
};
const useCheckboxProps = {
  ...useDarkProps,
  ...useSizeProps,
  ...useFormProps,
  modelValue: {
    required: true,
    default: null
  },
  val: {},
  trueValue: { default: true },
  falseValue: { default: false },
  indeterminateValue: { default: null },
  checkedIcon: String,
  uncheckedIcon: String,
  indeterminateIcon: String,
  toggleOrder: {
    type: String,
    validator: (v) => v === "tf" || v === "ft"
  },
  toggleIndeterminate: Boolean,
  label: String,
  leftLabel: Boolean,
  color: String,
  keepColor: Boolean,
  dense: Boolean,
  disable: Boolean,
  tabindex: [String, Number]
};
const useCheckboxEmits = ["update:modelValue"];
function useCheckbox(type, getInner) {
  const { props, slots, emit, proxy } = getCurrentInstance();
  const { $q } = proxy;
  const isDark = useDark(props, $q);
  const rootRef = ref(null);
  const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef);
  const sizeStyle = useSize(props, optionSizes);
  const modelIsArray = computed(
    () => props.val !== void 0 && Array.isArray(props.modelValue)
  );
  const index = computed(() => {
    const val = toRaw(props.val);
    return modelIsArray.value === true ? props.modelValue.findIndex((opt) => toRaw(opt) === val) : -1;
  });
  const isTrue = computed(() => modelIsArray.value === true ? index.value > -1 : toRaw(props.modelValue) === toRaw(props.trueValue));
  const isFalse = computed(() => modelIsArray.value === true ? index.value === -1 : toRaw(props.modelValue) === toRaw(props.falseValue));
  const isIndeterminate = computed(
    () => isTrue.value === false && isFalse.value === false
  );
  const tabindex = computed(() => props.disable === true ? -1 : props.tabindex || 0);
  const classes = computed(
    () => `q-${type} cursor-pointer no-outline row inline no-wrap items-center` + (props.disable === true ? " disabled" : "") + (isDark.value === true ? ` q-${type}--dark` : "") + (props.dense === true ? ` q-${type}--dense` : "") + (props.leftLabel === true ? " reverse" : "")
  );
  const innerClass = computed(() => {
    const state = isTrue.value === true ? "truthy" : isFalse.value === true ? "falsy" : "indet";
    const color = props.color !== void 0 && (props.keepColor === true || (type === "toggle" ? isTrue.value === true : isFalse.value !== true)) ? ` text-${props.color}` : "";
    return `q-${type}__inner relative-position non-selectable q-${type}__inner--${state}${color}`;
  });
  const formAttrs = computed(() => {
    const prop = { type: "checkbox" };
    props.name !== void 0 && Object.assign(prop, {
      "^checked": isTrue.value === true ? "checked" : void 0,
      name: props.name,
      value: modelIsArray.value === true ? props.val : props.trueValue
    });
    return prop;
  });
  const injectFormInput = useFormInject(formAttrs);
  const attributes = computed(() => {
    const attrs = {
      tabindex: tabindex.value,
      role: type === "toggle" ? "switch" : "checkbox",
      "aria-label": props.label,
      "aria-checked": isIndeterminate.value === true ? "mixed" : isTrue.value === true ? "true" : "false"
    };
    if (props.disable === true) {
      attrs["aria-disabled"] = "true";
    }
    return attrs;
  });
  function onClick(e) {
    if (e !== void 0) {
      stopAndPrevent(e);
      refocusTarget(e);
    }
    if (props.disable !== true) {
      emit("update:modelValue", getNextValue(), e);
    }
  }
  function getNextValue() {
    if (modelIsArray.value === true) {
      if (isTrue.value === true) {
        const val = props.modelValue.slice();
        val.splice(index.value, 1);
        return val;
      }
      return props.modelValue.concat([props.val]);
    }
    if (isTrue.value === true) {
      if (props.toggleOrder !== "ft" || props.toggleIndeterminate === false) {
        return props.falseValue;
      }
    } else if (isFalse.value === true) {
      if (props.toggleOrder === "ft" || props.toggleIndeterminate === false) {
        return props.trueValue;
      }
    } else {
      return props.toggleOrder !== "ft" ? props.trueValue : props.falseValue;
    }
    return props.indeterminateValue;
  }
  function onKeydown2(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      stopAndPrevent(e);
    }
  }
  function onKeyup2(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onClick(e);
    }
  }
  const getInnerContent = getInner(isTrue, isIndeterminate);
  Object.assign(proxy, { toggle: onClick });
  return () => {
    const inner = getInnerContent();
    props.disable !== true && injectFormInput(
      inner,
      "unshift",
      ` q-${type}__native absolute q-ma-none q-pa-none`
    );
    const child = [
      h("div", {
        class: innerClass.value,
        style: sizeStyle.value,
        "aria-hidden": "true"
      }, inner)
    ];
    if (refocusTargetEl.value !== null) {
      child.push(refocusTargetEl.value);
    }
    const label = props.label !== void 0 ? hMergeSlot(slots.default, [props.label]) : hSlot(slots.default);
    label !== void 0 && child.push(
      h("div", {
        class: `q-${type}__label q-anchor--skip`
      }, label)
    );
    return h("div", {
      ref: rootRef,
      class: classes.value,
      ...attributes.value,
      onClick,
      onKeydown: onKeydown2,
      onKeyup: onKeyup2
    }, child);
  };
}
var QToggle = createComponent({
  name: "QToggle",
  props: {
    ...useCheckboxProps,
    icon: String,
    iconColor: String
  },
  emits: useCheckboxEmits,
  setup(props) {
    function getInner(isTrue, isIndeterminate) {
      const icon = computed(
        () => (isTrue.value === true ? props.checkedIcon : isIndeterminate.value === true ? props.indeterminateIcon : props.uncheckedIcon) || props.icon
      );
      const color = computed(() => isTrue.value === true ? props.iconColor : null);
      return () => [
        h("div", { class: "q-toggle__track" }),
        h(
          "div",
          {
            class: "q-toggle__thumb absolute flex flex-center no-wrap"
          },
          icon.value !== void 0 ? [
            h(QIcon, {
              name: icon.value,
              color: color.value
            })
          ] : void 0
        )
      ];
    }
    return useCheckbox("toggle", getInner);
  }
});
const labelPositions = ["top", "right", "bottom", "left"];
const useFabProps = {
  type: {
    type: String,
    default: "a"
  },
  outline: Boolean,
  push: Boolean,
  flat: Boolean,
  unelevated: Boolean,
  color: String,
  textColor: String,
  glossy: Boolean,
  square: Boolean,
  padding: String,
  label: {
    type: [String, Number],
    default: ""
  },
  labelPosition: {
    type: String,
    default: "right",
    validator: (v) => labelPositions.includes(v)
  },
  externalLabel: Boolean,
  hideLabel: {
    type: Boolean
  },
  labelClass: [Array, String, Object],
  labelStyle: [Array, String, Object],
  disable: Boolean,
  tabindex: [Number, String]
};
function useFab(props, showing) {
  return {
    formClass: computed(
      () => `q-fab--form-${props.square === true ? "square" : "rounded"}`
    ),
    stacked: computed(
      () => props.externalLabel === false && ["top", "bottom"].includes(props.labelPosition)
    ),
    labelProps: computed(() => {
      if (props.externalLabel === true) {
        const hideLabel = props.hideLabel === null ? showing.value === false : props.hideLabel;
        return {
          action: "push",
          data: {
            class: [
              props.labelClass,
              `q-fab__label q-tooltip--style q-fab__label--external q-fab__label--external-${props.labelPosition}` + (hideLabel === true ? " q-fab__label--external-hidden" : "")
            ],
            style: props.labelStyle
          }
        };
      }
      return {
        action: ["left", "top"].includes(props.labelPosition) ? "unshift" : "push",
        data: {
          class: [
            props.labelClass,
            `q-fab__label q-fab__label--internal q-fab__label--internal-${props.labelPosition}` + (props.hideLabel === true ? " q-fab__label--internal-hidden" : "")
          ],
          style: props.labelStyle
        }
      };
    })
  };
}
const anchorMap = {
  start: "self-end",
  center: "self-center",
  end: "self-start"
};
const anchorValues = Object.keys(anchorMap);
var QFabAction = createComponent({
  name: "QFabAction",
  props: {
    ...useFabProps,
    icon: {
      type: String,
      default: ""
    },
    anchor: {
      type: String,
      validator: (v) => anchorValues.includes(v)
    },
    to: [String, Object],
    replace: Boolean
  },
  emits: ["click"],
  setup(props, { slots, emit }) {
    const $fab = inject(fabKey, () => ({
      showing: { value: true },
      onChildClick: noop
    }));
    const { formClass, labelProps } = useFab(props, $fab.showing);
    const classes = computed(() => {
      const align = anchorMap[props.anchor];
      return formClass.value + (align !== void 0 ? ` ${align}` : "");
    });
    const isDisabled = computed(
      () => props.disable === true || $fab.showing.value !== true
    );
    function click(e) {
      $fab.onChildClick(e);
      emit("click", e);
    }
    function getContent() {
      const child = [];
      if (slots.icon !== void 0) {
        child.push(slots.icon());
      } else if (props.icon !== "") {
        child.push(
          h(QIcon, { name: props.icon })
        );
      }
      if (props.label !== "" || slots.label !== void 0) {
        child[labelProps.value.action](
          h("div", labelProps.value.data, slots.label !== void 0 ? slots.label() : [props.label])
        );
      }
      return hMergeSlot(slots.default, child);
    }
    const vm = getCurrentInstance();
    Object.assign(vm.proxy, { click });
    return () => h(QBtn, {
      class: classes.value,
      ...props,
      noWrap: true,
      stack: props.stacked,
      icon: void 0,
      label: void 0,
      noCaps: true,
      fabMini: true,
      disable: isDisabled.value,
      onClick: click
    }, getContent);
  }
});
const directions = ["up", "right", "down", "left"];
const alignValues = ["left", "center", "right"];
var QFab = createComponent({
  name: "QFab",
  props: {
    ...useFabProps,
    ...useModelToggleProps,
    icon: String,
    activeIcon: String,
    hideIcon: Boolean,
    hideLabel: {
      default: null
    },
    direction: {
      type: String,
      default: "right",
      validator: (v) => directions.includes(v)
    },
    persistent: Boolean,
    verticalActionsAlign: {
      type: String,
      default: "center",
      validator: (v) => alignValues.includes(v)
    }
  },
  emits: useModelToggleEmits,
  setup(props, { slots }) {
    const triggerRef = ref(null);
    const showing = ref(props.modelValue === true);
    const targetUid = getUid();
    const { proxy: { $q } } = getCurrentInstance();
    const { formClass, labelProps } = useFab(props, showing);
    const hideOnRouteChange = computed(() => props.persistent !== true);
    const { hide, toggle } = useModelToggle({
      showing,
      hideOnRouteChange
    });
    const slotScope = computed(() => ({ opened: showing.value }));
    const classes = computed(
      () => `q-fab z-fab row inline justify-center q-fab--align-${props.verticalActionsAlign} ${formClass.value}` + (showing.value === true ? " q-fab--opened" : " q-fab--closed")
    );
    const actionClass = computed(
      () => `q-fab__actions flex no-wrap inline q-fab__actions--${props.direction} q-fab__actions--${showing.value === true ? "opened" : "closed"}`
    );
    const actionAttrs = computed(() => {
      const attrs = {
        id: targetUid
      };
      if (showing.value === true) {
        attrs.role = "menu";
      } else {
        attrs["aria-hidden"] = "true";
      }
      return attrs;
    });
    const iconHolderClass = computed(
      () => `q-fab__icon-holder  q-fab__icon-holder--${showing.value === true ? "opened" : "closed"}`
    );
    function getIcon(kebab, camel) {
      const slotFn = slots[kebab];
      const classes2 = `q-fab__${kebab} absolute-full`;
      return slotFn === void 0 ? h(QIcon, { class: classes2, name: props[camel] || $q.iconSet.fab[camel] }) : h("div", { class: classes2 }, slotFn(slotScope.value));
    }
    function getTriggerContent() {
      const child = [];
      props.hideIcon !== true && child.push(
        h("div", { class: iconHolderClass.value }, [
          getIcon("icon", "icon"),
          getIcon("active-icon", "activeIcon")
        ])
      );
      if (props.label !== "" || slots.label !== void 0) {
        child[labelProps.value.action](
          h("div", labelProps.value.data, slots.label !== void 0 ? slots.label(slotScope.value) : [props.label])
        );
      }
      return hMergeSlot(slots.tooltip, child);
    }
    provide(fabKey, {
      showing,
      onChildClick(evt) {
        hide(evt);
        if (triggerRef.value !== null) {
          triggerRef.value.$el.focus();
        }
      }
    });
    return () => h("div", {
      class: classes.value
    }, [
      h(QBtn, {
        ref: triggerRef,
        class: formClass.value,
        ...props,
        noWrap: true,
        stack: props.stacked,
        align: void 0,
        icon: void 0,
        label: void 0,
        noCaps: true,
        fab: true,
        "aria-expanded": showing.value === true ? "true" : "false",
        "aria-haspopup": "true",
        "aria-controls": targetUid,
        "aria-owns": targetUid,
        onClick: toggle
      }, getTriggerContent),
      h("div", { class: actionClass.value, ...actionAttrs.value }, hSlot(slots.default))
    ]);
  }
});
async function readFile(fileHandle) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      resolve(evt.target.result);
    };
    reader.onerror = (evt) => reject(evt);
    reader.readAsText(fileHandle);
  });
}
function parseXML(stringContents) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(stringContents, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    return null;
  } else {
    return doc.documentElement;
  }
}
const DEFAULT_ATTRIBUTES = {
  Mut: { value: 0, short: "MU", name: "Mut" },
  Klugheit: { value: 0, short: "KL", name: "Klugheit" },
  Intuition: { value: 0, short: "IN", name: "Intuition" },
  Charisma: { value: 0, short: "CH", name: "Charisma" },
  Fingerfertigkeit: { value: 0, short: "FF", name: "Fingerfertigkeit" },
  Gewandtheit: { value: 0, short: "GE", name: "Gewandtheit" },
  Konstitution: { value: 0, short: "KO", name: "Konstitution" },
  K\u00F6rperkraft: { value: 0, short: "KK", name: "K\xF6rperkraft" },
  ini: { value: 0, short: "ini", name: "Basis-INI" },
  at: { value: 0, short: "at", name: "Basis-AT" },
  pa: { value: 0, short: "pa", name: "Basis-PA" },
  fk: { value: 0, short: "fk", name: "Basis-FK" }
};
function parseGeneral(xmlDocument) {
  const heroEl = xmlDocument.querySelector("held");
  const name = heroEl.getAttribute("name");
  const key = heroEl.getAttribute("key");
  const bdayEl = xmlDocument.querySelector("aussehen");
  const day = parseInt(bdayEl.getAttribute("gbtag"));
  const month = parseInt(bdayEl.getAttribute("gbmonat"));
  const year = parseInt(bdayEl.getAttribute("gbjahr"));
  const birthday = { day, month, year };
  const genderEl = xmlDocument.querySelector("geschlecht");
  const gender = genderEl.getAttribute("name");
  const profEl = xmlDocument.querySelector("ausbildung[art='Hauptprofession']");
  const profession = profEl.getAttribute("string");
  return {
    key,
    birthday,
    gender,
    name,
    profession
  };
}
function parseAttributes(xmlDocument) {
  const result = {};
  for (const attribute of Object.keys(DEFAULT_ATTRIBUTES)) {
    result[attribute] = { ...DEFAULT_ATTRIBUTES[attribute] };
    const xmlEl = xmlDocument.querySelector(`held>eigenschaften eigenschaft[name='${attribute}']`);
    if (!xmlEl)
      continue;
    const val = xmlEl.getAttribute("value");
    const mod = xmlEl.getAttribute("mod");
    result[attribute].value = parseInt(val) + parseInt(mod);
  }
  return result;
}
const GROUPS = {
  OTHER: "Gaben und anderes",
  COMBAT: "Kampf",
  PHYSICAL: "K\xF6rperlich",
  SOCIAL: "Gesellschaft",
  NATURE: "Natur",
  KNOWLEDGE: "Wissen",
  LANGUAGES: "Sprachen",
  SCRIPTS: "Schriften",
  CRAFTS: "Handwerk"
};
const talentGroups = {
  [GROUPS.OTHER]: {
    name: GROUPS.OTHER,
    icon: "sym_r_star",
    talents: []
  },
  [GROUPS.COMBAT]: {
    name: GROUPS.COMBAT,
    icon: "sym_r_swords",
    talents: [
      "Anderthalbh\xE4nder",
      "Armbrust",
      "Belagerungswaffen",
      "Blasrohr",
      "Bogen",
      "Diskus",
      "Dolche",
      "Fechtwaffen",
      "Hiebwaffen",
      "Infanteriewaffen",
      "Kettenst\xE4be",
      "Kettenwaffen",
      "Lanzenreiten",
      "Peitsche",
      "Raufen",
      "Ringen",
      "S\xE4bel",
      "Schleuder",
      "Schwerter",
      "Speere",
      "St\xE4be",
      "Wurfbeile",
      "Wurfmesser",
      "Wurfspeere",
      "Zweihandflegel",
      "Zweihandhiebwaffen",
      "Zweihandschwerter/-s\xE4bel"
    ]
  },
  [GROUPS.PHYSICAL]: {
    name: GROUPS.PHYSICAL,
    icon: "sym_r_directions_run",
    talents: [
      "Akrobatik",
      "Athletik",
      "Fliegen",
      "Gaukeleien",
      "Klettern",
      "K\xF6rperbeherrschung",
      "Reiten",
      "Schleichen",
      "Schwimmen",
      "Selbstbeherrschung",
      "Sich verstecken",
      "Singen",
      "Sinnensch\xE4rfe",
      "Skifahren",
      "Stimmen imitieren",
      "Tanzen",
      "Taschendiebstahl",
      "Zechen"
    ]
  },
  [GROUPS.SOCIAL]: {
    name: GROUPS.SOCIAL,
    icon: "sym_r_groups",
    talents: [
      "Bet\xF6ren",
      "Etikette",
      "Gassenwissen",
      "Lehren",
      "Menschenkenntnis",
      "Schauspielerei",
      "Schriftlicher Ausdruck",
      "Sich verkleiden",
      "\xDCberreden",
      "\xDCberzeugen"
    ]
  },
  [GROUPS.NATURE]: {
    name: GROUPS.NATURE,
    icon: "sym_r_nature",
    talents: [
      "F\xE4hrtensuchen",
      "Fallen stellen",
      "Fesseln/Entfesseln",
      "Fischen/Angeln",
      "Orientierung",
      "Wettervorhersage",
      "Wildnisleben"
    ]
  },
  [GROUPS.KNOWLEDGE]: {
    name: GROUPS.KNOWLEDGE,
    icon: "sym_r_school",
    talents: [
      "Anatomie",
      "Baukunst",
      "Brett-/Kartenspiel",
      "Geografie",
      "Geschichtswissen",
      "Gesteinskunde",
      "G\xF6tter und Kulte",
      "Heraldik",
      "H\xFCttenkunde",
      "Kriegskunst",
      "Kryptographie",
      "Magiekunde",
      "Mechanik",
      "Pflanzenkunde",
      "Philosophie",
      "Rechnen",
      "Rechtskunde",
      "Sagen und Legenden",
      "Sch\xE4tzen",
      "Sprachenkunde",
      "Staatskunst",
      "Sternkunde",
      "Tierkunde"
    ]
  },
  [GROUPS.LANGUAGES]: {
    name: GROUPS.LANGUAGES,
    icon: "sym_r_flag",
    talents: []
  },
  [GROUPS.SCRIPTS]: {
    name: GROUPS.SCRIPTS,
    icon: "sym_r_menu_book",
    talents: []
  },
  [GROUPS.CRAFTS]: {
    name: GROUPS.CRAFTS,
    icon: "sym_r_build",
    talents: [
      "Abrichten",
      "Ackerbau",
      "Alchimie",
      "Bergbau",
      "Bogenbau",
      "Boote fahren",
      "Brauer",
      "Drucker",
      "Fahrzeug lenken",
      "Falschspiel",
      "Feinmechanik",
      "Feuersteinbearbeitung",
      "Fleischer",
      "Gerber/K\xFCrschner",
      "Glaskunst",
      "Grobschmied",
      "Handel",
      "Hauswirtschaft",
      "Heilkunde: Gift",
      "Heilkunde: Krankheiten",
      "Heilkunde: Seele",
      "Heilkunde: Wunden",
      "Holzbearbeitung",
      "Instrumentenbauer",
      "Kartografie",
      "Kochen",
      "Kristallzucht",
      "Lederarbeiten",
      "Malen/Zeichnen",
      "Maurer",
      "Metallguss",
      "Musizieren",
      "Schl\xF6sser knacken",
      "Schnaps brennen",
      "Schneidern",
      "Seefahrt",
      "Seiler",
      "Steinmetz",
      "Steinschneider/Juwelier",
      "Stellmacher",
      "Stoffe f\xE4rben",
      "T\xE4towieren",
      "T\xF6pfern",
      "Viehzucht",
      "Webkunst",
      "Winzer",
      "Zimmermann"
    ]
  }
};
const flippedTalentGroups = Object.fromEntries(
  Object.values(talentGroups).map(({ name, talents }) => talents.map((t) => [t, name])).flat()
);
function getTalentGroup(talentName) {
  if (talentName.startsWith("Lesen/Schreiben"))
    return GROUPS.SCRIPTS;
  if (talentName.startsWith("Sprachen kennen"))
    return GROUPS.LANGUAGES;
  const group = flippedTalentGroups[talentName];
  return group != null ? group : GROUPS.OTHER;
}
function talentRollsToArray(str) {
  if (typeof str !== "string")
    return [];
  return str.trim().replace("(", "").replace(")", "").split("/");
}
function parseTalents(xmlDocument) {
  var _a;
  const talentEls = xmlDocument.querySelectorAll("held>talentliste talent");
  const result = {};
  const baseAttackEl = xmlDocument.querySelector("held>eigenschaften eigenschaft[name='fk']");
  const baseAttack = parseInt(baseAttackEl.getAttribute("value")) + parseInt(baseAttackEl.getAttribute("mod"));
  const allSpecializations = {};
  const specializationEls = xmlDocument.querySelectorAll("held>sf sonderfertigkeit talent");
  for (const specEl of specializationEls) {
    const talentName = specEl.getAttribute("name");
    const spec = specEl.parentNode.querySelector("spezialisierung");
    if (spec) {
      if (!allSpecializations[talentName])
        allSpecializations[talentName] = [];
      allSpecializations[talentName].push(spec.getAttribute("name"));
    }
  }
  for (const el of talentEls) {
    const name = el.getAttribute("name");
    const attributes = talentRollsToArray(el.getAttribute("probe"));
    const group = getTalentGroup(name);
    const value = parseInt(el.getAttribute("value"));
    const specializations = (_a = allSpecializations[name]) != null ? _a : [];
    result[name] = {
      name,
      attributes,
      value,
      group,
      specializations,
      extraRolls: {}
    };
    for (const spec of specializations) {
      result[name].extraRolls[spec] = value + 2;
    }
    if (group === GROUPS.COMBAT) {
      const combatEl = xmlDocument.querySelector(`held>kampf kampfwerte[name="${name}"]`);
      if (combatEl) {
        const AT = parseInt(combatEl.querySelector("attacke").getAttribute("value"));
        result[name].extraRolls.AT = AT;
        const PA = parseInt(combatEl.querySelector("parade").getAttribute("value"));
        result[name].extraRolls.PA = PA;
        for (const spec of specializations) {
          result[name].extraRolls["AT " + spec] = AT + 1;
          result[name].extraRolls["PA " + spec] = PA + 1;
        }
      } else {
        result[name].extraRolls.FK = baseAttack + value;
      }
    }
  }
  return result;
}
function parseCharacter(xmlDocument) {
  const generalData = parseGeneral(xmlDocument);
  const attributes = parseAttributes(xmlDocument);
  const talents = parseTalents(xmlDocument);
  return {
    generalData,
    attributes,
    talents
  };
}
var CharactersPage_vue_vue_type_style_index_0_lang = "";
const _hoisted_1 = { class: "sticky-fab" };
const _sfc_main = {
  __name: "CharactersPage",
  setup(__props) {
    const store = useCharacterStore();
    const { currentCharacter, characters } = storeToRefs(store);
    const editingCharacter = ref(false);
    const characterNameBackup = ref("");
    function toggleEditCharacter() {
      if (!editingCharacter.value) {
        characterNameBackup.value = currentCharacter.value.generalData.name;
      }
      editingCharacter.value = !editingCharacter.value;
    }
    const characterLoaded = computed(() => currentCharacter.value != null);
    const expandedGroups = reactive(Object.fromEntries(Object.keys(talentGroups).map((name) => [name, false])));
    const expandedAttributes = ref(false);
    const showInactiveTalents = ref(false);
    const talentSearch = ref("");
    const searchBar = ref(null);
    const stickyHeadingTop = computed(() => {
      const top = searchBar.value ? searchBar.value.$el.offsetHeight + searchBar.value.$el.offsetTop : 0;
      return top + "px";
    });
    function getItems(groupName) {
      const result = {};
      if (!currentCharacter.value)
        return result;
      const expanded = expandedGroups[groupName];
      const re = new RegExp(talentSearch.value, "i");
      const matches = Object.values(currentCharacter.value.talents).filter((t) => t.group === groupName && (expanded || isFav(t.name) || talentSearch.value !== "" && t.name.match(re))).map((t) => [t.name, t]);
      if (showInactiveTalents.value) {
        const inactiveTalents = talentGroups[groupName].talents.filter((t) => expanded || isFav(t) || talentSearch.value !== "" && t.match(re)).map((t) => [t, { name: t }]);
        Object.assign(result, Object.fromEntries(inactiveTalents));
      }
      Object.assign(result, Object.fromEntries(matches));
      return Object.values(result);
    }
    const favoriteTalents = reactive([]);
    function isFav(talent) {
      const index = favoriteTalents.indexOf(talent);
      return index >= 0;
    }
    function toggleFav(talent) {
      const index = favoriteTalents.indexOf(talent);
      if (index >= 0)
        favoriteTalents.splice(index, 1);
      else
        favoriteTalents.push(talent);
    }
    const fab = ref(null);
    function handleFabClick(evt) {
      if (Object.keys(characters.value).length)
        return;
      pickCharacterFile(evt);
      fab.value.hide();
    }
    const nativeFilePicker = ref(null);
    function pickCharacterFile(evt) {
      nativeFilePicker.value.value = null;
      nativeFilePicker.value.click(evt);
    }
    async function parseImportedFile(newFile) {
      const doc = await readFile(newFile).then((content) => parseXML(content));
      const character = parseCharacter(doc);
      store.setCharacter(character.generalData.key, character);
    }
    function roll(props) {
      const {
        name,
        value,
        attributes = void 0
      } = props;
      if (attributes) {
        console.log("Rolling", name, "vs", value, `(${attributes})`);
        return;
      }
      console.log("Rolling", name, "vs", value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "flex column q-gutter-y-md q-pa-md" }, {
        default: withCtx(() => [
          createVNode(QList, { class: "relative-position" }, {
            default: withCtx(() => [
              createVNode(QItem, { class: "text-h4 header-item q-mb-md" }, {
                default: withCtx(() => [
                  createTextVNode(" Charaktere ")
                ]),
                _: 1
              }),
              unref(currentCharacter) ? (openBlock(), createBlock(QItem, { key: 0 }, {
                default: withCtx(() => [
                  editingCharacter.value ? (openBlock(), createBlock(QItemSection, { key: 0 }, {
                    default: withCtx(() => [
                      createVNode(QInput, {
                        modelValue: unref(currentCharacter).generalData.name,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(currentCharacter).generalData.name = $event),
                        debounce: "200",
                        autofocus: "",
                        placeholder: "Suche",
                        outlined: "",
                        class: "full-width bg-glassed",
                        clearable: "",
                        "clear-icon": "sym_r_undo",
                        onClear: _cache[1] || (_cache[1] = ($event) => unref(currentCharacter).generalData.name = characterNameBackup.value),
                        onKeyup: withKeys(withModifiers(toggleEditCharacter, ["ctrl"]), ["enter"])
                      }, null, 8, ["modelValue", "onKeyup"])
                    ]),
                    _: 1
                  })) : (openBlock(), createBlock(QItemSection, {
                    key: 1,
                    style: { "min-height": "56px" }
                  }, {
                    default: withCtx(() => [
                      createVNode(QItemLabel, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(currentCharacter).generalData.name), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(QItemLabel, { caption: "" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(currentCharacter).generalData.profession), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })),
                  createVNode(QItemSection, { side: "" }, {
                    default: withCtx(() => [
                      createVNode(Transition, { name: "fadeScale" }, {
                        default: withCtx(() => [
                          editingCharacter.value ? (openBlock(), createBlock(QBtn, {
                            key: 0,
                            icon: "sym_r_task_alt",
                            color: "primary",
                            round: "",
                            flat: "",
                            onClick: toggleEditCharacter
                          })) : (openBlock(), createBlock(QBtn, {
                            key: 1,
                            icon: "sym_r_edit",
                            round: "",
                            flat: "",
                            onClick: toggleEditCharacter
                          }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(QItem, {
                key: "search",
                class: "sticky-search"
              }, {
                default: withCtx(() => [
                  createVNode(QInput, {
                    ref_key: "searchBar",
                    ref: searchBar,
                    modelValue: talentSearch.value,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => talentSearch.value = $event),
                    debounce: "200",
                    clearable: "",
                    autofocus: "",
                    placeholder: "Suche",
                    outlined: "",
                    class: "full-width bg-glassed",
                    onClear: _cache[3] || (_cache[3] = ($event) => talentSearch.value = "")
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              createVNode(TransitionGroup, {
                name: "list",
                tag: "div"
              }, {
                default: withCtx(() => {
                  var _a;
                  return [
                    createVNode(QItem, {
                      key: "header_attributes",
                      clickable: "",
                      class: "rounded-borders bg-white sticky-heading",
                      style: normalizeStyle({ top: unref(stickyHeadingTop) }),
                      onClick: _cache[4] || (_cache[4] = ($event) => expandedAttributes.value = !expandedAttributes.value)
                    }, {
                      default: withCtx(() => [
                        createVNode(QItemSection, { avatar: "" }, {
                          default: withCtx(() => [
                            createVNode(QIcon, {
                              name: "sym_r_account_circle",
                              color: "primary",
                              class: "icon-md-filled"
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(QItemSection, { class: "text-bold" }, {
                          default: withCtx(() => [
                            createTextVNode(" Eigenschaften ")
                          ]),
                          _: 1
                        }),
                        createVNode(QItemSection, { side: "" }, {
                          default: withCtx(() => [
                            createVNode(QIcon, {
                              name: "sym_r_expand_more",
                              class: normalizeClass({ "rotate-180": expandedAttributes.value }),
                              style: { "transition": "transform 100ms" }
                            }, null, 8, ["class"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["style"]),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(expandedAttributes.value ? (_a = unref(currentCharacter)) == null ? void 0 : _a.attributes : [], (attr) => {
                      return openBlock(), createBlock(QItem, {
                        key: `attr_${attr.short}`,
                        dense: "",
                        class: "rounded-borders"
                      }, {
                        default: withCtx(() => [
                          createVNode(QItemSection, { avatar: "" }),
                          createVNode(QItemSection, { class: "col" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(attr.name) + ": ", 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(QItemSection, { class: "col-auto text-right q-pr-md" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(attr.value), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(QItemSection, { side: "" }, {
                            default: withCtx(() => [
                              createVNode(QBtn, {
                                dense: "",
                                flat: "",
                                round: "",
                                icon: "mdi-dice-d20",
                                onClick: ($event) => roll(attr)
                              }, null, 8, ["onClick"])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }),
                _: 1
              }),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(talentGroups), (group) => {
                return openBlock(), createBlock(TransitionGroup, {
                  key: `talents_${group.name}`,
                  name: "list",
                  tag: "div"
                }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(QItem, {
                      key: `header_${group.name}`,
                      clickable: "",
                      class: "rounded-borders bg-white sticky-heading",
                      style: normalizeStyle({ top: unref(stickyHeadingTop) }),
                      onClick: ($event) => expandedGroups[group.name] = !expandedGroups[group.name]
                    }, {
                      default: withCtx(() => [
                        createVNode(QItemSection, { avatar: "" }, {
                          default: withCtx(() => [
                            createVNode(QIcon, {
                              name: group.icon,
                              color: "grey-8"
                            }, null, 8, ["name"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(QItemSection, { class: "text-bold" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(group.name), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(QItemSection, { side: "" }, {
                          default: withCtx(() => [
                            createVNode(QIcon, {
                              name: "sym_r_expand_more",
                              class: normalizeClass({ "rotate-180": expandedGroups[group.name] }),
                              style: { "transition": "transform 100ms" }
                            }, null, 8, ["class"])
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1032, ["style", "onClick"])),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(getItems(group.name), (talent) => {
                      return openBlock(), createBlock(QItem, {
                        key: `talent_${talent.name}`,
                        dense: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(QItemSection, { avatar: "" }, {
                            default: withCtx(() => [
                              createVNode(QIcon, {
                                name: "sym_r_favorite",
                                class: normalizeClass(["talent-fav-icon cursor-pointer", { "icon-md-filled favorite": isFav(talent.name) }]),
                                color: "primary",
                                onClick: ($event) => toggleFav(talent.name)
                              }, null, 8, ["class", "onClick"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(QItemSection, { class: "col" }, {
                            default: withCtx(() => {
                              var _a, _b;
                              return [
                                createTextVNode(toDisplayString(talent.name) + " " + toDisplayString(((_a = talent.specializations) == null ? void 0 : _a.length) ? "*" : "") + " " + toDisplayString(talent.attributes ? ` (${(_b = talent.attributes) == null ? void 0 : _b.join("/")})` : "") + toDisplayString(talent.value != null ? ":" : ""), 1)
                              ];
                            }),
                            _: 2
                          }, 1024),
                          createVNode(QItemSection, { class: "col-auto text-right q-pr-md" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(talent.value), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(QItemSection, { side: "" }, {
                            default: withCtx(() => [
                              talent.extraRolls && Object.keys(talent.extraRolls).length ? (openBlock(), createBlock(QBtn, {
                                key: 0,
                                dense: "",
                                flat: "",
                                round: "",
                                icon: "mdi-dice-d20"
                              }, {
                                default: withCtx(() => [
                                  createVNode(QMenu, {
                                    "auto-close": "",
                                    anchor: "top right",
                                    self: "top right"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(QList, { style: { "min-width": "100px" } }, {
                                        default: withCtx(() => [
                                          createVNode(QItem, {
                                            clickable: "",
                                            onClick: ($event) => roll(talent)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(QItemSection, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(talent.name) + ": ", 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(QItemSection, {
                                                side: "",
                                                class: "text-primary"
                                              }, {
                                                default: withCtx(() => {
                                                  var _a;
                                                  return [
                                                    createTextVNode(toDisplayString((_a = talent.value) != null ? _a : "n.a."), 1)
                                                  ];
                                                }),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"]),
                                          (openBlock(true), createElementBlock(Fragment, null, renderList(talent.extraRolls, (value, extraRoll) => {
                                            return openBlock(), createBlock(QItem, {
                                              key: extraRoll,
                                              clickable: "",
                                              onClick: ($event) => roll({ ...talent, name: `${talent.name} ${extraRoll}`, value, attributes: void 0 })
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(QItemSection, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(extraRoll) + ": ", 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(QItemSection, {
                                                  side: "",
                                                  class: "text-primary"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(value != null ? value : "n.a."), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["onClick"]);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)) : (openBlock(), createBlock(QBtn, {
                                key: 1,
                                dense: "",
                                flat: "",
                                round: "",
                                icon: "mdi-dice-d20",
                                disable: talent.value == null,
                                onClick: ($event) => roll(talent)
                              }, null, 8, ["disable", "onClick"]))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  _: 2
                }, 1024);
              }), 128)),
              createVNode(QSeparator, { key: "spacer" }),
              createVNode(QItem, {
                key: "show_inactive",
                clickable: "",
                onClick: _cache[6] || (_cache[6] = ($event) => showInactiveTalents.value = !showInactiveTalents.value)
              }, {
                default: withCtx(() => [
                  createVNode(QItemSection, { side: "" }, {
                    default: withCtx(() => [
                      createVNode(QToggle, {
                        modelValue: showInactiveTalents.value,
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => showInactiveTalents.value = $event),
                        "checked-icon": "sym_r_check",
                        style: { "margin": "-0.5em -0.2em -0.5em -1em" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(QItemSection, null, {
                    default: withCtx(() => [
                      createTextVNode(" Inaktive Talente anzeigen? ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_1, [
            createVNode(QFab, {
              ref_key: "fab",
              ref: fab,
              square: "",
              "vertical-actions-align": "right",
              icon: unref(characterLoaded) ? "sym_r_sync" : "sym_r_file_upload",
              direction: "up",
              onClick: handleFabClick
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(characters), (c, key) => {
                  return openBlock(), createBlock(QFabAction, {
                    key: `character_switcher_${key}`,
                    square: "",
                    "external-label": "",
                    color: "white",
                    "text-color": "primary",
                    icon: "sym_r_mood",
                    label: c.generalData.name,
                    "label-class": "bg-grey-3 text-grey-8 text-caption",
                    "label-position": "left",
                    onClick: ($event) => unref(store).setCurrentCharacter(key)
                  }, null, 8, ["label", "onClick"]);
                }), 128)),
                createVNode(QFabAction, {
                  "external-label": "",
                  color: "white",
                  "text-color": "primary",
                  icon: "sym_r_file_upload",
                  label: "Importieren",
                  "label-class": "bg-grey-3 text-grey-8 text-caption",
                  "label-position": "left",
                  onClick: pickCharacterFile
                })
              ]),
              _: 1
            }, 8, ["icon"]),
            createBaseVNode("input", {
              ref_key: "nativeFilePicker",
              ref: nativeFilePicker,
              type: "file",
              accept: ".xml",
              style: { "display": "none" },
              onInput: _cache[7] || (_cache[7] = (evt) => parseImportedFile(evt.target.files[0]))
            }, null, 544)
          ])
        ]),
        _: 1
      });
    };
  }
};
export { _sfc_main as default };

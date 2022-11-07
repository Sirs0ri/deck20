import { e as getNormalizedVNodes, d as vmHasRouter, b as QBtn, Q as QIcon } from "./QBtn.bd4123d9.js";
import { Q as QPage } from "./QPage.6e849ca5.js";
import { b as getModifierDirections, s as shouldStart, c as clearSelection, j as getScrollbarWidth, i as useTick, u as useTimeout, d as getScrollTarget, k as useQuasar } from "./use-quasar.76e99ffe.js";
import { b as createDirective, h as hSlot, c as createComponent, d as hDir, e as hMergeSlot } from "./render.9ad54730.js";
import { j as client, n as noop, m as leftClick, p as addEvt, q as preventDraggable, v as position, s as stopAndPrevent, x as cleanEvt, r as ref, c as computed, w as watch, g as getCurrentInstance, h, $ as Transition, b as nextTick, a4 as KeepAlive, a5 as onBeforeMount, o as onMounted, a as onBeforeUnmount, H as History, a6 as isNumber, a7 as defineStore, M as openBlock, V as createElementBlock, _ as normalizeClass, T as unref, U as createBaseVNode, F as isKeyCode, t as prevent, l as listenOpts, a8 as globalConfig, L as onUnmounted, a9 as Teleport, R as createTextVNode, S as toDisplayString, P as createVNode, O as withCtx, aa as _export_sfc, ab as storeToRefs, X as Fragment, W as renderList, ac as normalizeStyle, Q as createCommentVNode, N as createBlock, Z as mergeProps } from "./index.c6d27518.js";
import { a as useDarkProps, c as useDark, u as useModelToggleProps, b as useModelToggleEmits, d as useModelToggle } from "./use-model-toggle.63b86996.js";
import { u as useBridge } from "./bexBridge.7dd4b311.js";
import { r as removeFocusWaitFlag, a as addFocusWaitFlag } from "./focus-manager.32f8d49a.js";
function parseArg(arg) {
  const data = [0.06, 6, 50];
  if (typeof arg === "string" && arg.length) {
    arg.split(":").forEach((val, index) => {
      const v = parseFloat(val);
      v && (data[index] = v);
    });
  }
  return data;
}
var TouchSwipe = createDirective(
  {
    name: "touch-swipe",
    beforeMount(el, { value, arg, modifiers }) {
      if (modifiers.mouse !== true && client.has.touch !== true) {
        return;
      }
      const mouseCapture = modifiers.mouseCapture === true ? "Capture" : "";
      const ctx = {
        handler: value,
        sensitivity: parseArg(arg),
        direction: getModifierDirections(modifiers),
        noop,
        mouseStart(evt) {
          if (shouldStart(evt, ctx) && leftClick(evt)) {
            addEvt(ctx, "temp", [
              [document, "mousemove", "move", `notPassive${mouseCapture}`],
              [document, "mouseup", "end", "notPassiveCapture"]
            ]);
            ctx.start(evt, true);
          }
        },
        touchStart(evt) {
          if (shouldStart(evt, ctx)) {
            const target2 = evt.target;
            addEvt(ctx, "temp", [
              [target2, "touchmove", "move", "notPassiveCapture"],
              [target2, "touchcancel", "end", "notPassiveCapture"],
              [target2, "touchend", "end", "notPassiveCapture"]
            ]);
            ctx.start(evt);
          }
        },
        start(evt, mouseEvent) {
          client.is.firefox === true && preventDraggable(el, true);
          const pos = position(evt);
          ctx.event = {
            x: pos.left,
            y: pos.top,
            time: Date.now(),
            mouse: mouseEvent === true,
            dir: false
          };
        },
        move(evt) {
          if (ctx.event === void 0) {
            return;
          }
          if (ctx.event.dir !== false) {
            stopAndPrevent(evt);
            return;
          }
          const time = Date.now() - ctx.event.time;
          if (time === 0) {
            return;
          }
          const pos = position(evt), distX = pos.left - ctx.event.x, absX = Math.abs(distX), distY = pos.top - ctx.event.y, absY = Math.abs(distY);
          if (ctx.event.mouse !== true) {
            if (absX < ctx.sensitivity[1] && absY < ctx.sensitivity[1]) {
              ctx.end(evt);
              return;
            }
          } else if (absX < ctx.sensitivity[2] && absY < ctx.sensitivity[2]) {
            return;
          }
          const velX = absX / time, velY = absY / time;
          if (ctx.direction.vertical === true && absX < absY && absX < 100 && velY > ctx.sensitivity[0]) {
            ctx.event.dir = distY < 0 ? "up" : "down";
          }
          if (ctx.direction.horizontal === true && absX > absY && absY < 100 && velX > ctx.sensitivity[0]) {
            ctx.event.dir = distX < 0 ? "left" : "right";
          }
          if (ctx.direction.up === true && absX < absY && distY < 0 && absX < 100 && velY > ctx.sensitivity[0]) {
            ctx.event.dir = "up";
          }
          if (ctx.direction.down === true && absX < absY && distY > 0 && absX < 100 && velY > ctx.sensitivity[0]) {
            ctx.event.dir = "down";
          }
          if (ctx.direction.left === true && absX > absY && distX < 0 && absY < 100 && velX > ctx.sensitivity[0]) {
            ctx.event.dir = "left";
          }
          if (ctx.direction.right === true && absX > absY && distX > 0 && absY < 100 && velX > ctx.sensitivity[0]) {
            ctx.event.dir = "right";
          }
          if (ctx.event.dir !== false) {
            stopAndPrevent(evt);
            if (ctx.event.mouse === true) {
              document.body.classList.add("no-pointer-events--children");
              document.body.classList.add("non-selectable");
              clearSelection();
              ctx.styleCleanup = (withDelay) => {
                ctx.styleCleanup = void 0;
                document.body.classList.remove("non-selectable");
                const remove = () => {
                  document.body.classList.remove("no-pointer-events--children");
                };
                if (withDelay === true) {
                  setTimeout(remove, 50);
                } else {
                  remove();
                }
              };
            }
            ctx.handler({
              evt,
              touch: ctx.event.mouse !== true,
              mouse: ctx.event.mouse,
              direction: ctx.event.dir,
              duration: time,
              distance: {
                x: absX,
                y: absY
              }
            });
          } else {
            ctx.end(evt);
          }
        },
        end(evt) {
          if (ctx.event === void 0) {
            return;
          }
          cleanEvt(ctx, "temp");
          client.is.firefox === true && preventDraggable(el, false);
          ctx.styleCleanup !== void 0 && ctx.styleCleanup(true);
          evt !== void 0 && ctx.event.dir !== false && stopAndPrevent(evt);
          ctx.event = void 0;
        }
      };
      el.__qtouchswipe = ctx;
      if (modifiers.mouse === true) {
        const capture = modifiers.mouseCapture === true || modifiers.mousecapture === true ? "Capture" : "";
        addEvt(ctx, "main", [
          [el, "mousedown", "mouseStart", `passive${capture}`]
        ]);
      }
      client.has.touch === true && addEvt(ctx, "main", [
        [el, "touchstart", "touchStart", `passive${modifiers.capture === true ? "Capture" : ""}`],
        [el, "touchmove", "noop", "notPassiveCapture"]
      ]);
    },
    updated(el, bindings) {
      const ctx = el.__qtouchswipe;
      if (ctx !== void 0) {
        if (bindings.oldValue !== bindings.value) {
          typeof bindings.value !== "function" && ctx.end();
          ctx.handler = bindings.value;
        }
        ctx.direction = getModifierDirections(bindings.modifiers);
      }
    },
    beforeUnmount(el) {
      const ctx = el.__qtouchswipe;
      if (ctx !== void 0) {
        cleanEvt(ctx, "main");
        cleanEvt(ctx, "temp");
        client.is.firefox === true && preventDraggable(el, false);
        ctx.styleCleanup !== void 0 && ctx.styleCleanup();
        delete el.__qtouchswipe;
      }
    }
  }
);
function useCache() {
  const cache = /* @__PURE__ */ new Map();
  return {
    getCache: function(key, obj) {
      return cache[key] === void 0 ? cache[key] = obj : cache[key];
    },
    getCacheWithFn: function(key, fn) {
      return cache[key] === void 0 ? cache[key] = fn() : cache[key];
    }
  };
}
const usePanelChildProps = {
  name: { required: true },
  disable: Boolean
};
const PanelWrapper = {
  setup(_, { slots }) {
    return () => h("div", {
      class: "q-panel scroll",
      role: "tabpanel"
    }, hSlot(slots.default));
  }
};
const usePanelProps = {
  modelValue: {
    required: true
  },
  animated: Boolean,
  infinite: Boolean,
  swipeable: Boolean,
  vertical: Boolean,
  transitionPrev: String,
  transitionNext: String,
  transitionDuration: {
    type: [String, Number],
    default: 300
  },
  keepAlive: Boolean,
  keepAliveInclude: [String, Array, RegExp],
  keepAliveExclude: [String, Array, RegExp],
  keepAliveMax: Number
};
const usePanelEmits = ["update:modelValue", "before-transition", "transition"];
function usePanel() {
  const { props, emit, proxy } = getCurrentInstance();
  const { getCacheWithFn } = useCache();
  let panels, forcedPanelTransition;
  const panelIndex = ref(null);
  const panelTransition = ref(null);
  function onSwipe(evt) {
    const dir = props.vertical === true ? "up" : "left";
    goToPanelByOffset((proxy.$q.lang.rtl === true ? -1 : 1) * (evt.direction === dir ? 1 : -1));
  }
  const panelDirectives = computed(() => {
    return [[
      TouchSwipe,
      onSwipe,
      void 0,
      {
        horizontal: props.vertical !== true,
        vertical: props.vertical,
        mouse: true
      }
    ]];
  });
  const transitionPrev = computed(
    () => props.transitionPrev || `slide-${props.vertical === true ? "down" : "right"}`
  );
  const transitionNext = computed(
    () => props.transitionNext || `slide-${props.vertical === true ? "up" : "left"}`
  );
  const transitionStyle = computed(
    () => `--q-transition-duration: ${props.transitionDuration}ms`
  );
  const contentKey = computed(() => typeof props.modelValue === "string" || typeof props.modelValue === "number" ? props.modelValue : String(props.modelValue));
  const keepAliveProps = computed(() => ({
    include: props.keepAliveInclude,
    exclude: props.keepAliveExclude,
    max: props.keepAliveMax
  }));
  const needsUniqueKeepAliveWrapper = computed(
    () => props.keepAliveInclude !== void 0 || props.keepAliveExclude !== void 0
  );
  watch(() => props.modelValue, (newVal, oldVal) => {
    const index = isValidPanelName(newVal) === true ? getPanelIndex(newVal) : -1;
    if (forcedPanelTransition !== true) {
      updatePanelTransition(
        index === -1 ? 0 : index < getPanelIndex(oldVal) ? -1 : 1
      );
    }
    if (panelIndex.value !== index) {
      panelIndex.value = index;
      emit("before-transition", newVal, oldVal);
      nextTick(() => {
        emit("transition", newVal, oldVal);
      });
    }
  });
  function nextPanel() {
    goToPanelByOffset(1);
  }
  function previousPanel() {
    goToPanelByOffset(-1);
  }
  function goToPanel(name) {
    emit("update:modelValue", name);
  }
  function isValidPanelName(name) {
    return name !== void 0 && name !== null && name !== "";
  }
  function getPanelIndex(name) {
    return panels.findIndex((panel) => {
      return panel.props.name === name && panel.props.disable !== "" && panel.props.disable !== true;
    });
  }
  function getEnabledPanels() {
    return panels.filter((panel) => {
      return panel.props.disable !== "" && panel.props.disable !== true;
    });
  }
  function updatePanelTransition(direction) {
    const val = direction !== 0 && props.animated === true && panelIndex.value !== -1 ? "q-transition--" + (direction === -1 ? transitionPrev.value : transitionNext.value) : null;
    if (panelTransition.value !== val) {
      panelTransition.value = val;
    }
  }
  function goToPanelByOffset(direction, startIndex = panelIndex.value) {
    let index = startIndex + direction;
    while (index > -1 && index < panels.length) {
      const opt = panels[index];
      if (opt !== void 0 && opt.props.disable !== "" && opt.props.disable !== true) {
        updatePanelTransition(direction);
        forcedPanelTransition = true;
        emit("update:modelValue", opt.props.name);
        setTimeout(() => {
          forcedPanelTransition = false;
        });
        return;
      }
      index += direction;
    }
    if (props.infinite === true && panels.length > 0 && startIndex !== -1 && startIndex !== panels.length) {
      goToPanelByOffset(direction, direction === -1 ? panels.length : -1);
    }
  }
  function updatePanelIndex() {
    const index = getPanelIndex(props.modelValue);
    if (panelIndex.value !== index) {
      panelIndex.value = index;
    }
    return true;
  }
  function getPanelContentChild() {
    const panel = isValidPanelName(props.modelValue) === true && updatePanelIndex() && panels[panelIndex.value];
    return props.keepAlive === true ? [
      h(KeepAlive, keepAliveProps.value, [
        h(
          needsUniqueKeepAliveWrapper.value === true ? getCacheWithFn(contentKey.value, () => ({ ...PanelWrapper, name: contentKey.value })) : PanelWrapper,
          { key: contentKey.value, style: transitionStyle.value },
          () => panel
        )
      ])
    ] : [
      h("div", {
        class: "q-panel scroll",
        style: transitionStyle.value,
        key: contentKey.value,
        role: "tabpanel"
      }, [panel])
    ];
  }
  function getPanelContent() {
    if (panels.length === 0) {
      return;
    }
    return props.animated === true ? [h(Transition, { name: panelTransition.value }, getPanelContentChild)] : getPanelContentChild();
  }
  function updatePanelsList(slots) {
    panels = getNormalizedVNodes(
      hSlot(slots.default, [])
    ).filter(
      (panel) => panel.props !== null && panel.props.slot === void 0 && isValidPanelName(panel.props.name) === true
    );
    return panels.length;
  }
  function getPanels() {
    return panels;
  }
  Object.assign(proxy, {
    next: nextPanel,
    previous: previousPanel,
    goTo: goToPanel
  });
  return {
    panelIndex,
    panelDirectives,
    updatePanelsList,
    updatePanelIndex,
    getPanelContent,
    getEnabledPanels,
    getPanels,
    isValidPanelName,
    keepAliveProps,
    needsUniqueKeepAliveWrapper,
    goToPanelByOffset,
    goToPanel,
    nextPanel,
    previousPanel
  };
}
var QCarouselSlide = createComponent({
  name: "QCarouselSlide",
  props: {
    ...usePanelChildProps,
    imgSrc: String
  },
  setup(props, { slots }) {
    const style = computed(() => props.imgSrc ? { backgroundImage: `url("${props.imgSrc}")` } : {});
    return () => h("div", {
      class: "q-carousel__slide",
      style: style.value
    }, hSlot(slots.default));
  }
});
let counter = 0;
const useFullscreenProps = {
  fullscreen: Boolean,
  noRouteFullscreenExit: Boolean
};
const useFullscreenEmits = ["update:fullscreen", "fullscreen"];
function useFullscreen() {
  const vm = getCurrentInstance();
  const { props, emit, proxy } = vm;
  let historyEntry, fullscreenFillerNode, container;
  const inFullscreen = ref(false);
  vmHasRouter(vm) === true && watch(() => proxy.$route.fullPath, () => {
    props.noRouteFullscreenExit !== true && exitFullscreen();
  });
  watch(() => props.fullscreen, (v) => {
    if (inFullscreen.value !== v) {
      toggleFullscreen();
    }
  });
  watch(inFullscreen, (v) => {
    emit("update:fullscreen", v);
    emit("fullscreen", v);
  });
  function toggleFullscreen() {
    if (inFullscreen.value === true) {
      exitFullscreen();
    } else {
      setFullscreen();
    }
  }
  function setFullscreen() {
    if (inFullscreen.value === true) {
      return;
    }
    inFullscreen.value = true;
    container = proxy.$el.parentNode;
    container.replaceChild(fullscreenFillerNode, proxy.$el);
    document.body.appendChild(proxy.$el);
    counter++;
    if (counter === 1) {
      document.body.classList.add("q-body--fullscreen-mixin");
    }
    historyEntry = {
      handler: exitFullscreen
    };
    History.add(historyEntry);
  }
  function exitFullscreen() {
    if (inFullscreen.value !== true) {
      return;
    }
    if (historyEntry !== void 0) {
      History.remove(historyEntry);
      historyEntry = void 0;
    }
    container.replaceChild(proxy.$el, fullscreenFillerNode);
    inFullscreen.value = false;
    counter = Math.max(0, counter - 1);
    if (counter === 0) {
      document.body.classList.remove("q-body--fullscreen-mixin");
      if (proxy.$el.scrollIntoView !== void 0) {
        setTimeout(() => {
          proxy.$el.scrollIntoView();
        });
      }
    }
  }
  onBeforeMount(() => {
    fullscreenFillerNode = document.createElement("span");
  });
  onMounted(() => {
    props.fullscreen === true && setFullscreen();
  });
  onBeforeUnmount(exitFullscreen);
  Object.assign(proxy, {
    toggleFullscreen,
    setFullscreen,
    exitFullscreen
  });
  return {
    inFullscreen,
    toggleFullscreen
  };
}
const navigationPositionOptions = ["top", "right", "bottom", "left"];
const controlTypeOptions = ["regular", "flat", "outline", "push", "unelevated"];
var QCarousel = createComponent({
  name: "QCarousel",
  props: {
    ...useDarkProps,
    ...usePanelProps,
    ...useFullscreenProps,
    transitionPrev: {
      type: String,
      default: "fade"
    },
    transitionNext: {
      type: String,
      default: "fade"
    },
    height: String,
    padding: Boolean,
    controlColor: String,
    controlTextColor: String,
    controlType: {
      type: String,
      validator: (v) => controlTypeOptions.includes(v),
      default: "flat"
    },
    autoplay: [Number, Boolean],
    arrows: Boolean,
    prevIcon: String,
    nextIcon: String,
    navigation: Boolean,
    navigationPosition: {
      type: String,
      validator: (v) => navigationPositionOptions.includes(v)
    },
    navigationIcon: String,
    navigationActiveIcon: String,
    thumbnails: Boolean
  },
  emits: [
    ...useFullscreenEmits,
    ...usePanelEmits
  ],
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);
    let timer2, panelsLen;
    const {
      updatePanelsList,
      getPanelContent,
      panelDirectives,
      goToPanel,
      previousPanel,
      nextPanel,
      getEnabledPanels,
      panelIndex
    } = usePanel();
    const { inFullscreen } = useFullscreen();
    const style = computed(() => inFullscreen.value !== true && props.height !== void 0 ? { height: props.height } : {});
    const direction = computed(() => props.vertical === true ? "vertical" : "horizontal");
    const classes = computed(
      () => `q-carousel q-panel-parent q-carousel--with${props.padding === true ? "" : "out"}-padding` + (inFullscreen.value === true ? " fullscreen" : "") + (isDark.value === true ? " q-carousel--dark q-dark" : "") + (props.arrows === true ? ` q-carousel--arrows-${direction.value}` : "") + (props.navigation === true ? ` q-carousel--navigation-${navigationPosition.value}` : "")
    );
    const arrowIcons = computed(() => {
      const ico = [
        props.prevIcon || $q.iconSet.carousel[props.vertical === true ? "up" : "left"],
        props.nextIcon || $q.iconSet.carousel[props.vertical === true ? "down" : "right"]
      ];
      return props.vertical === false && $q.lang.rtl === true ? ico.reverse() : ico;
    });
    const navIcon = computed(() => props.navigationIcon || $q.iconSet.carousel.navigationIcon);
    const navActiveIcon = computed(() => props.navigationActiveIcon || navIcon.value);
    const navigationPosition = computed(
      () => props.navigationPosition || (props.vertical === true ? "right" : "bottom")
    );
    const controlProps = computed(() => ({
      color: props.controlColor,
      textColor: props.controlTextColor,
      round: true,
      [props.controlType]: true,
      dense: true
    }));
    watch(() => props.modelValue, () => {
      if (props.autoplay) {
        clearInterval(timer2);
        startTimer();
      }
    });
    watch(() => props.autoplay, (val) => {
      if (val) {
        startTimer();
      } else {
        clearInterval(timer2);
      }
    });
    function startTimer() {
      const duration = isNumber(props.autoplay) === true ? props.autoplay : 5e3;
      timer2 = setTimeout(
        duration >= 0 ? nextPanel : previousPanel,
        Math.abs(duration)
      );
    }
    onMounted(() => {
      props.autoplay && startTimer();
    });
    onBeforeUnmount(() => {
      clearInterval(timer2);
    });
    function getNavigationContainer(type, mapping) {
      return h("div", {
        class: `q-carousel__control q-carousel__navigation no-wrap absolute flex q-carousel__navigation--${type} q-carousel__navigation--${navigationPosition.value}` + (props.controlColor !== void 0 ? ` text-${props.controlColor}` : "")
      }, [
        h("div", {
          class: "q-carousel__navigation-inner flex flex-center no-wrap"
        }, getEnabledPanels().map(mapping))
      ]);
    }
    function getContent() {
      const node = [];
      if (props.navigation === true) {
        const fn = slots["navigation-icon"] !== void 0 ? slots["navigation-icon"] : (opts) => h(QBtn, {
          key: "nav" + opts.name,
          class: `q-carousel__navigation-icon q-carousel__navigation-icon--${opts.active === true ? "" : "in"}active`,
          ...opts.btnProps,
          onClick: opts.onClick
        });
        const maxIndex = panelsLen - 1;
        node.push(
          getNavigationContainer("buttons", (panel, index) => {
            const name = panel.props.name;
            const active = panelIndex.value === index;
            return fn({
              index,
              maxIndex,
              name,
              active,
              btnProps: {
                icon: active === true ? navActiveIcon.value : navIcon.value,
                size: "sm",
                ...controlProps.value
              },
              onClick: () => {
                goToPanel(name);
              }
            });
          })
        );
      } else if (props.thumbnails === true) {
        const color = props.controlColor !== void 0 ? ` text-${props.controlColor}` : "";
        node.push(getNavigationContainer("thumbnails", (panel) => {
          const slide = panel.props;
          return h("img", {
            key: "tmb#" + slide.name,
            class: `q-carousel__thumbnail q-carousel__thumbnail--${slide.name === props.modelValue ? "" : "in"}active` + color,
            src: slide.imgSrc || slide["img-src"],
            onClick: () => {
              goToPanel(slide.name);
            }
          });
        }));
      }
      if (props.arrows === true && panelIndex.value >= 0) {
        if (props.infinite === true || panelIndex.value > 0) {
          node.push(
            h("div", {
              key: "prev",
              class: `q-carousel__control q-carousel__arrow q-carousel__prev-arrow q-carousel__prev-arrow--${direction.value} absolute flex flex-center`
            }, [
              h(QBtn, {
                icon: arrowIcons.value[0],
                ...controlProps.value,
                onClick: previousPanel
              })
            ])
          );
        }
        if (props.infinite === true || panelIndex.value < panelsLen - 1) {
          node.push(
            h("div", {
              key: "next",
              class: `q-carousel__control q-carousel__arrow q-carousel__next-arrow q-carousel__next-arrow--${direction.value} absolute flex flex-center`
            }, [
              h(QBtn, {
                icon: arrowIcons.value[1],
                ...controlProps.value,
                onClick: nextPanel
              })
            ])
          );
        }
      }
      return hMergeSlot(slots.control, node);
    }
    return () => {
      panelsLen = updatePanelsList(slots);
      return h("div", {
        class: classes.value,
        style: style.value
      }, [
        hDir(
          "div",
          { class: "q-carousel__slides-container" },
          getPanelContent(),
          "sl-cont",
          props.swipeable,
          () => panelDirectives.value
        )
      ].concat(getContent()));
    };
  }
});
const months = [
  { index: 1, name: "Praios", days: 30 },
  { index: 2, name: "Rondra", days: 30 },
  { index: 3, name: "Efferd", days: 30 },
  { index: 4, name: "Travia", days: 30 },
  { index: 5, name: "Boron", days: 30 },
  { index: 6, name: "Hesinde", days: 30 },
  { index: 7, name: "Firun", days: 30 },
  { index: 8, name: "Tsa", days: 30 },
  { index: 9, name: "Phex", days: 30 },
  { index: 10, name: "Peraine", days: 30 },
  { index: 11, name: "Ingerimm", days: 30 },
  { index: 12, name: "Rahja", days: 30 },
  { index: 13, name: "Namenlose Tage", days: 5 }
];
const days = [
  { index: 4, name: "Praiostag", isMoonpasePeak: false },
  { index: 5, name: "Rohalstag", isMoonpasePeak: false },
  { index: 6, name: "Feuertag", isMoonpasePeak: false },
  { index: 7, name: "Wassertag", isMoonpasePeak: false },
  { index: 1, name: "Windstag", isMoonpasePeak: false },
  { index: 2, name: "Erdstag", isMoonpasePeak: true },
  { index: 3, name: "Markttag", isMoonpasePeak: false }
];
const moonPhases = [
  { index: 1, name: "Tote Mada", symbol: "\u{1F318}", symbolPeak: "\u{1F311}" },
  { index: 2, name: "Kelch", symbol: "\u{1F312}", symbolPeak: "\u{1F313}" },
  { index: 3, name: "Rad", symbol: "\u{1F314}", symbolPeak: "\u{1F31D}" },
  { index: 4, name: "Helm", symbol: "\u{1F316}", symbolPeak: "\u{1F317}" }
];
function isDateInvalid({ day, month, year }) {
  if (month < 1)
    return "Falscher Monat (<1)";
  if (day < 1)
    return "Falscher Tag (<1)";
  if (month > 13)
    return "Falscher Monat (>13)";
  if (day > 30)
    return "Falscher Tag (>30)";
  if (month === 13 && day > 5)
    return "Es gibt nur 5 Namenlose Tage";
  return false;
}
function getWeekday({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year });
  if (dateError)
    return dateError;
  const weekday = ((year - 1) * 365 + (month - 1) * 30 + day) % 7;
  return days[weekday];
}
function getMoonphase({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year });
  if (dateError)
    return dateError;
  const weekday = ((year - 1) * 365 + (month - 1) * 30 + day + 22) % 28;
  return moonPhases[Math.floor(weekday / 7)];
}
function getMonth({ day, month, year }) {
  return months.find((m) => m.index === month);
}
function substractDays({ day, month, year }, difference) {
  let newDays = day - difference;
  let newMonth = month;
  let newYear = year;
  while (newDays <= 0) {
    newMonth--;
    if (newMonth <= 0) {
      newMonth = months.length;
      newYear--;
    }
    newDays += months.find((m) => m.index === newMonth).days;
  }
  return { day: newDays, month: newMonth, year: newYear };
}
function addDays({ day, month, year }, difference) {
  let currentMonth = getMonth({ day, month, year });
  let newDays = day + difference;
  let newMonth = month;
  let newYear = year;
  while (newDays > currentMonth.days) {
    newMonth++;
    newDays -= currentMonth.days;
    if (newMonth > months.length) {
      newMonth = 1;
      newYear++;
    }
    currentMonth = getMonth({ day: 1, month: newMonth, year: newYear });
  }
  return { day: newDays, month: newMonth, year: newYear };
}
function dateEquals(a, b) {
  return a.day === b.day && a.month === b.month && a.year === b.year;
}
function getDateStrings({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year });
  if (dateError)
    return dateError;
  const weekDay = getWeekday({ day, month, year });
  const moonPhase = getMoonphase({ day, month, year });
  const moonSymbol = weekDay.isMoonpasePeak ? moonPhase.symbolPeak : moonPhase.symbol;
  return {
    dayName: weekDay.name,
    monthName: months.find((m) => m.index === month).name,
    moonPhase: moonPhase.name,
    moonSymbol
  };
}
function getFormattedDate({ day, month, year }, mode = "full") {
  const dateError = isDateInvalid({ day, month, year });
  if (dateError)
    return dateError;
  const {
    dayName,
    monthName,
    moonPhase,
    moonSymbol
  } = getDateStrings({ day, month, year });
  switch (mode) {
    case "short":
      return `${day}. ${monthName} ${year}, ein ${dayName}.`;
    case "full":
    default:
      return `${day}. ${monthName} ${year}, ein ${dayName}. Mondphase: ${moonPhase} ${moonSymbol}`;
  }
}
function getDayPopupString({ day, month, year }) {
  const {
    dayName,
    monthName,
    moonPhase,
    moonSymbol
  } = getDateStrings({ day, month, year });
  return `${day}. ${monthName} ${year} <br> ${dayName} <br> ${moonPhase} ${moonSymbol}`;
}
const useCalendarStore = defineStore("calendar", () => {
  const initialDate = { day: 0, month: 0, year: 0 };
  const today = ref({ ...initialDate });
  watch(today, (newVal, oldVal) => {
    if (dateEquals(oldVal, initialDate))
      return;
    if (dateEquals(oldVal, newVal))
      return;
    persist();
  });
  const {
    bexSend
  } = useBridge();
  async function restore() {
    {
      const { data } = await bexSend("restore-store", "calendar");
      if ("today" in data)
        today.value = data.today;
      return true;
    }
  }
  const restored = restore();
  function increment() {
    today.value = addDays(today.value, 1);
    persist();
  }
  function persist() {
    {
      bexSend("persist-store", {
        key: "calendar",
        value: {
          today: today.value
        }
      });
    }
  }
  return {
    today,
    increment,
    restored
  };
});
var CalendarDayBackground_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$3 = /* @__PURE__ */ createBaseVNode("div", { class: "background" }, null, -1);
const _hoisted_2$2 = [
  _hoisted_1$3
];
const _sfc_main$3 = {
  __name: "CalendarDayBackground",
  props: {
    date: {
      type: Object,
      default: () => ({ day: 1, month: 1, year: 1 })
    },
    today: {
      type: Boolean,
      default: false
    },
    previousMonth: {
      type: Boolean,
      default: false
    },
    nextMonth: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const cornerClasses = computed(() => {
      if (props.previousMonth || props.nextMonth)
        return "";
      const day = getWeekday(props.date);
      const _month = getMonth(props.date);
      const dayIndex = props.date.day;
      return Object.entries({
        "current-month": true,
        "corner--1": dayIndex === _month.days && day.index !== days.length && _month.days >= days.length,
        "corner--3": dayIndex === 1 && day.index !== 1 && _month.days >= days.length,
        "border-1": dayIndex <= days.length,
        "border-2": day.index === days.length || dayIndex === _month.days,
        "border-3": dayIndex > _month.days - days.length,
        "border-4": day.index === 1 || dayIndex === 1
      }).filter(([cornerId, active]) => active).map(([cornerId, active]) => cornerId).join(" ");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["date-cell-background", unref(cornerClasses)])
      }, _hoisted_2$2, 2);
    };
  }
};
const useAnchorProps = {
  target: {
    default: true
  },
  noParentEvent: Boolean,
  contextMenu: Boolean
};
function useAnchor({
  showing,
  avoidEmit,
  configureAnchorEl
}) {
  const { props, proxy, emit } = getCurrentInstance();
  const anchorEl = ref(null);
  let touchTimer;
  function canShow(evt) {
    return anchorEl.value === null ? false : evt === void 0 || evt.touches === void 0 || evt.touches.length <= 1;
  }
  const anchorEvents = {};
  if (configureAnchorEl === void 0) {
    Object.assign(anchorEvents, {
      hide(evt) {
        proxy.hide(evt);
      },
      toggle(evt) {
        proxy.toggle(evt);
        evt.qAnchorHandled = true;
      },
      toggleKey(evt) {
        isKeyCode(evt, 13) === true && anchorEvents.toggle(evt);
      },
      contextClick(evt) {
        proxy.hide(evt);
        prevent(evt);
        nextTick(() => {
          proxy.show(evt);
          evt.qAnchorHandled = true;
        });
      },
      prevent,
      mobileTouch(evt) {
        anchorEvents.mobileCleanup(evt);
        if (canShow(evt) !== true) {
          return;
        }
        proxy.hide(evt);
        anchorEl.value.classList.add("non-selectable");
        const target2 = evt.target;
        addEvt(anchorEvents, "anchor", [
          [target2, "touchmove", "mobileCleanup", "passive"],
          [target2, "touchend", "mobileCleanup", "passive"],
          [target2, "touchcancel", "mobileCleanup", "passive"],
          [anchorEl.value, "contextmenu", "prevent", "notPassive"]
        ]);
        touchTimer = setTimeout(() => {
          proxy.show(evt);
          evt.qAnchorHandled = true;
        }, 300);
      },
      mobileCleanup(evt) {
        anchorEl.value.classList.remove("non-selectable");
        clearTimeout(touchTimer);
        if (showing.value === true && evt !== void 0) {
          clearSelection();
        }
      }
    });
    configureAnchorEl = function(context = props.contextMenu) {
      if (props.noParentEvent === true || anchorEl.value === null) {
        return;
      }
      let evts;
      if (context === true) {
        if (proxy.$q.platform.is.mobile === true) {
          evts = [
            [anchorEl.value, "touchstart", "mobileTouch", "passive"]
          ];
        } else {
          evts = [
            [anchorEl.value, "mousedown", "hide", "passive"],
            [anchorEl.value, "contextmenu", "contextClick", "notPassive"]
          ];
        }
      } else {
        evts = [
          [anchorEl.value, "click", "toggle", "passive"],
          [anchorEl.value, "keyup", "toggleKey", "passive"]
        ];
      }
      addEvt(anchorEvents, "anchor", evts);
    };
  }
  function unconfigureAnchorEl() {
    cleanEvt(anchorEvents, "anchor");
  }
  function setAnchorEl(el) {
    anchorEl.value = el;
    while (anchorEl.value.classList.contains("q-anchor--skip")) {
      anchorEl.value = anchorEl.value.parentNode;
    }
    configureAnchorEl();
  }
  function pickAnchorEl() {
    if (props.target === false || props.target === "" || proxy.$el.parentNode === null) {
      anchorEl.value = null;
    } else if (props.target === true) {
      setAnchorEl(proxy.$el.parentNode);
    } else {
      let el = props.target;
      if (typeof props.target === "string") {
        try {
          el = document.querySelector(props.target);
        } catch (err) {
          el = void 0;
        }
      }
      if (el !== void 0 && el !== null) {
        anchorEl.value = el.$el || el;
        configureAnchorEl();
      } else {
        anchorEl.value = null;
        console.error(`Anchor: target "${props.target}" not found`);
      }
    }
  }
  watch(() => props.contextMenu, (val) => {
    if (anchorEl.value !== null) {
      unconfigureAnchorEl();
      configureAnchorEl(val);
    }
  });
  watch(() => props.target, () => {
    if (anchorEl.value !== null) {
      unconfigureAnchorEl();
    }
    pickAnchorEl();
  });
  watch(() => props.noParentEvent, (val) => {
    if (anchorEl.value !== null) {
      if (val === true) {
        unconfigureAnchorEl();
      } else {
        configureAnchorEl();
      }
    }
  });
  onMounted(() => {
    pickAnchorEl();
    if (avoidEmit !== true && props.modelValue === true && anchorEl.value === null) {
      emit("update:modelValue", false);
    }
  });
  onBeforeUnmount(() => {
    clearTimeout(touchTimer);
    unconfigureAnchorEl();
  });
  return {
    anchorEl,
    canShow,
    anchorEvents
  };
}
function useScrollTarget(props, configureScrollTarget) {
  const localScrollTarget = ref(null);
  let scrollFn;
  function changeScrollEvent(scrollTarget, fn) {
    const fnProp = `${fn !== void 0 ? "add" : "remove"}EventListener`;
    const fnHandler = fn !== void 0 ? fn : scrollFn;
    if (scrollTarget !== window) {
      scrollTarget[fnProp]("scroll", fnHandler, listenOpts.passive);
    }
    window[fnProp]("scroll", fnHandler, listenOpts.passive);
    scrollFn = fn;
  }
  function unconfigureScrollTarget() {
    if (localScrollTarget.value !== null) {
      changeScrollEvent(localScrollTarget.value);
      localScrollTarget.value = null;
    }
  }
  const noParentEventWatcher = watch(() => props.noParentEvent, () => {
    if (localScrollTarget.value !== null) {
      unconfigureScrollTarget();
      configureScrollTarget();
    }
  });
  onBeforeUnmount(noParentEventWatcher);
  return {
    localScrollTarget,
    unconfigureScrollTarget,
    changeScrollEvent
  };
}
let target = document.body;
function createGlobalNode(id) {
  const el = document.createElement("div");
  if (id !== void 0) {
    el.id = id;
  }
  if (globalConfig.globalNodes !== void 0) {
    const cls = globalConfig.globalNodes.class;
    if (cls !== void 0) {
      el.className = cls;
    }
  }
  target.appendChild(el);
  return el;
}
function removeGlobalNode(el) {
  el.remove();
}
const portalProxyList = [];
function isOnGlobalDialog(vm) {
  vm = vm.parent;
  while (vm !== void 0 && vm !== null) {
    if (vm.type.name === "QGlobalDialog") {
      return true;
    }
    if (vm.type.name === "QDialog" || vm.type.name === "QMenu") {
      return false;
    }
    vm = vm.parent;
  }
  return false;
}
function usePortal(vm, innerRef, renderPortalContent, checkGlobalDialog) {
  const portalIsActive = ref(false);
  const portalIsAccessible = ref(false);
  let portalEl = null;
  const focusObj = {};
  const onGlobalDialog = checkGlobalDialog === true && isOnGlobalDialog(vm);
  function showPortal(isReady) {
    if (isReady === true) {
      removeFocusWaitFlag(focusObj);
      portalIsAccessible.value = true;
      return;
    }
    portalIsAccessible.value = false;
    if (portalIsActive.value === false) {
      if (onGlobalDialog === false && portalEl === null) {
        portalEl = createGlobalNode();
      }
      portalIsActive.value = true;
      portalProxyList.push(vm.proxy);
      addFocusWaitFlag(focusObj);
    }
  }
  function hidePortal(isReady) {
    portalIsAccessible.value = false;
    if (isReady !== true) {
      return;
    }
    removeFocusWaitFlag(focusObj);
    portalIsActive.value = false;
    const index = portalProxyList.indexOf(vm.proxy);
    if (index !== -1) {
      portalProxyList.splice(index, 1);
    }
    if (portalEl !== null) {
      removeGlobalNode(portalEl);
      portalEl = null;
    }
  }
  onUnmounted(() => {
    hidePortal(true);
  });
  vm.proxy.__qPortalInnerRef = innerRef;
  return {
    showPortal,
    hidePortal,
    portalIsActive,
    portalIsAccessible,
    renderPortal: () => onGlobalDialog === true ? renderPortalContent() : portalIsActive.value === true ? [h(Teleport, { to: portalEl }, renderPortalContent())] : void 0
  };
}
const useTransitionProps = {
  transitionShow: {
    type: String,
    default: "fade"
  },
  transitionHide: {
    type: String,
    default: "fade"
  },
  transitionDuration: {
    type: [String, Number],
    default: 300
  }
};
function useTransition(props, showing) {
  const transitionState = ref(showing.value);
  watch(showing, (val) => {
    nextTick(() => {
      transitionState.value = val;
    });
  });
  return {
    transition: computed(() => "q-transition--" + (transitionState.value === true ? props.transitionHide : props.transitionShow)),
    transitionStyle: computed(() => `--q-transition-duration: ${props.transitionDuration}ms`)
  };
}
let timer;
const { notPassiveCapture } = listenOpts, registeredList = [];
function globalHandler(evt) {
  clearTimeout(timer);
  const target2 = evt.target;
  if (target2 === void 0 || target2.nodeType === 8 || target2.classList.contains("no-pointer-events") === true) {
    return;
  }
  let portalIndex = portalProxyList.length - 1;
  while (portalIndex >= 0) {
    const proxy = portalProxyList[portalIndex].$;
    if (proxy.type.name !== "QDialog") {
      break;
    }
    if (proxy.props.seamless !== true) {
      return;
    }
    portalIndex--;
  }
  for (let i = registeredList.length - 1; i >= 0; i--) {
    const state = registeredList[i];
    if ((state.anchorEl.value === null || state.anchorEl.value.contains(target2) === false) && (target2 === document.body || state.innerRef.value !== null && state.innerRef.value.contains(target2) === false)) {
      evt.qClickOutside = true;
      state.onClickOutside(evt);
    } else {
      return;
    }
  }
}
function addClickOutside(clickOutsideProps) {
  registeredList.push(clickOutsideProps);
  if (registeredList.length === 1) {
    document.addEventListener("mousedown", globalHandler, notPassiveCapture);
    document.addEventListener("touchstart", globalHandler, notPassiveCapture);
  }
}
function removeClickOutside(clickOutsideProps) {
  const index = registeredList.findIndex((h2) => h2 === clickOutsideProps);
  if (index > -1) {
    registeredList.splice(index, 1);
    if (registeredList.length === 0) {
      clearTimeout(timer);
      document.removeEventListener("mousedown", globalHandler, notPassiveCapture);
      document.removeEventListener("touchstart", globalHandler, notPassiveCapture);
    }
  }
}
let vpLeft, vpTop;
function validatePosition(pos) {
  const parts = pos.split(" ");
  if (parts.length !== 2) {
    return false;
  }
  if (["top", "center", "bottom"].includes(parts[0]) !== true) {
    console.error("Anchor/Self position must start with one of top/center/bottom");
    return false;
  }
  if (["left", "middle", "right", "start", "end"].includes(parts[1]) !== true) {
    console.error("Anchor/Self position must end with one of left/middle/right/start/end");
    return false;
  }
  return true;
}
function validateOffset(val) {
  if (!val) {
    return true;
  }
  if (val.length !== 2) {
    return false;
  }
  if (typeof val[0] !== "number" || typeof val[1] !== "number") {
    return false;
  }
  return true;
}
const horizontalPos = {
  "start#ltr": "left",
  "start#rtl": "right",
  "end#ltr": "right",
  "end#rtl": "left"
};
["left", "middle", "right"].forEach((pos) => {
  horizontalPos[`${pos}#ltr`] = pos;
  horizontalPos[`${pos}#rtl`] = pos;
});
function parsePosition(pos, rtl) {
  const parts = pos.split(" ");
  return {
    vertical: parts[0],
    horizontal: horizontalPos[`${parts[1]}#${rtl === true ? "rtl" : "ltr"}`]
  };
}
function getAnchorProps(el, offset) {
  let { top, left, right, bottom, width, height } = el.getBoundingClientRect();
  if (offset !== void 0) {
    top -= offset[1];
    left -= offset[0];
    bottom += offset[1];
    right += offset[0];
    width += offset[0];
    height += offset[1];
  }
  return {
    top,
    left,
    right,
    bottom,
    width,
    height,
    middle: left + (right - left) / 2,
    center: top + (bottom - top) / 2
  };
}
function getTargetProps(el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  };
}
function setPosition(cfg) {
  if (client.is.ios === true && window.visualViewport !== void 0) {
    const el = document.body.style;
    const { offsetLeft: left, offsetTop: top } = window.visualViewport;
    if (left !== vpLeft) {
      el.setProperty("--q-pe-left", left + "px");
      vpLeft = left;
    }
    if (top !== vpTop) {
      el.setProperty("--q-pe-top", top + "px");
      vpTop = top;
    }
  }
  let anchorProps;
  const { scrollLeft, scrollTop } = cfg.el;
  if (cfg.absoluteOffset === void 0) {
    anchorProps = getAnchorProps(cfg.anchorEl, cfg.cover === true ? [0, 0] : cfg.offset);
  } else {
    const { top: anchorTop, left: anchorLeft } = cfg.anchorEl.getBoundingClientRect(), top = anchorTop + cfg.absoluteOffset.top, left = anchorLeft + cfg.absoluteOffset.left;
    anchorProps = { top, left, width: 1, height: 1, right: left + 1, center: top, middle: left, bottom: top + 1 };
  }
  let elStyle = {
    maxHeight: cfg.maxHeight,
    maxWidth: cfg.maxWidth,
    visibility: "visible"
  };
  if (cfg.fit === true || cfg.cover === true) {
    elStyle.minWidth = anchorProps.width + "px";
    if (cfg.cover === true) {
      elStyle.minHeight = anchorProps.height + "px";
    }
  }
  Object.assign(cfg.el.style, elStyle);
  const targetProps = getTargetProps(cfg.el), props = {
    top: anchorProps[cfg.anchorOrigin.vertical] - targetProps[cfg.selfOrigin.vertical],
    left: anchorProps[cfg.anchorOrigin.horizontal] - targetProps[cfg.selfOrigin.horizontal]
  };
  applyBoundaries(props, anchorProps, targetProps, cfg.anchorOrigin, cfg.selfOrigin);
  elStyle = {
    top: props.top + "px",
    left: props.left + "px"
  };
  if (props.maxHeight !== void 0) {
    elStyle.maxHeight = props.maxHeight + "px";
    if (anchorProps.height > props.maxHeight) {
      elStyle.minHeight = elStyle.maxHeight;
    }
  }
  if (props.maxWidth !== void 0) {
    elStyle.maxWidth = props.maxWidth + "px";
    if (anchorProps.width > props.maxWidth) {
      elStyle.minWidth = elStyle.maxWidth;
    }
  }
  Object.assign(cfg.el.style, elStyle);
  if (cfg.el.scrollTop !== scrollTop) {
    cfg.el.scrollTop = scrollTop;
  }
  if (cfg.el.scrollLeft !== scrollLeft) {
    cfg.el.scrollLeft = scrollLeft;
  }
}
function applyBoundaries(props, anchorProps, targetProps, anchorOrigin, selfOrigin) {
  const currentHeight = targetProps.bottom, currentWidth = targetProps.right, margin = getScrollbarWidth(), innerHeight = window.innerHeight - margin, innerWidth = document.body.clientWidth;
  if (props.top < 0 || props.top + currentHeight > innerHeight) {
    if (selfOrigin.vertical === "center") {
      props.top = anchorProps[anchorOrigin.vertical] > innerHeight / 2 ? Math.max(0, innerHeight - currentHeight) : 0;
      props.maxHeight = Math.min(currentHeight, innerHeight);
    } else if (anchorProps[anchorOrigin.vertical] > innerHeight / 2) {
      const anchorY = Math.min(
        innerHeight,
        anchorOrigin.vertical === "center" ? anchorProps.center : anchorOrigin.vertical === selfOrigin.vertical ? anchorProps.bottom : anchorProps.top
      );
      props.maxHeight = Math.min(currentHeight, anchorY);
      props.top = Math.max(0, anchorY - currentHeight);
    } else {
      props.top = Math.max(
        0,
        anchorOrigin.vertical === "center" ? anchorProps.center : anchorOrigin.vertical === selfOrigin.vertical ? anchorProps.top : anchorProps.bottom
      );
      props.maxHeight = Math.min(currentHeight, innerHeight - props.top);
    }
  }
  if (props.left < 0 || props.left + currentWidth > innerWidth) {
    props.maxWidth = Math.min(currentWidth, innerWidth);
    if (selfOrigin.horizontal === "middle") {
      props.left = anchorProps[anchorOrigin.horizontal] > innerWidth / 2 ? Math.max(0, innerWidth - currentWidth) : 0;
    } else if (anchorProps[anchorOrigin.horizontal] > innerWidth / 2) {
      const anchorX = Math.min(
        innerWidth,
        anchorOrigin.horizontal === "middle" ? anchorProps.middle : anchorOrigin.horizontal === selfOrigin.horizontal ? anchorProps.right : anchorProps.left
      );
      props.maxWidth = Math.min(currentWidth, anchorX);
      props.left = Math.max(0, anchorX - props.maxWidth);
    } else {
      props.left = Math.max(
        0,
        anchorOrigin.horizontal === "middle" ? anchorProps.middle : anchorOrigin.horizontal === selfOrigin.horizontal ? anchorProps.left : anchorProps.right
      );
      props.maxWidth = Math.min(currentWidth, innerWidth - props.left);
    }
  }
}
var QTooltip = createComponent({
  name: "QTooltip",
  inheritAttrs: false,
  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useTransitionProps,
    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    },
    transitionShow: {
      default: "jump-down"
    },
    transitionHide: {
      default: "jump-up"
    },
    anchor: {
      type: String,
      default: "bottom middle",
      validator: validatePosition
    },
    self: {
      type: String,
      default: "top middle",
      validator: validatePosition
    },
    offset: {
      type: Array,
      default: () => [14, 14],
      validator: validateOffset
    },
    scrollTarget: {
      default: void 0
    },
    delay: {
      type: Number,
      default: 0
    },
    hideDelay: {
      type: Number,
      default: 0
    }
  },
  emits: [
    ...useModelToggleEmits
  ],
  setup(props, { slots, emit, attrs }) {
    let unwatchPosition, observer;
    const vm = getCurrentInstance();
    const { proxy: { $q } } = vm;
    const innerRef = ref(null);
    const showing = ref(false);
    const anchorOrigin = computed(() => parsePosition(props.anchor, $q.lang.rtl));
    const selfOrigin = computed(() => parsePosition(props.self, $q.lang.rtl));
    const hideOnRouteChange = computed(() => props.persistent !== true);
    const { registerTick, removeTick } = useTick();
    const { registerTimeout } = useTimeout();
    const { transition, transitionStyle } = useTransition(props, showing);
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget);
    const { anchorEl, canShow, anchorEvents } = useAnchor({ showing, configureAnchorEl });
    const { show, hide } = useModelToggle({
      showing,
      canShow,
      handleShow,
      handleHide,
      hideOnRouteChange,
      processOnMount: true
    });
    Object.assign(anchorEvents, { delayShow, delayHide });
    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent);
    if ($q.platform.is.mobile === true) {
      const clickOutsideProps = {
        anchorEl,
        innerRef,
        onClickOutside(e) {
          hide(e);
          if (e.target.classList.contains("q-dialog__backdrop")) {
            stopAndPrevent(e);
          }
          return true;
        }
      };
      const hasClickOutside = computed(
        () => props.modelValue === null && props.persistent !== true && showing.value === true
      );
      watch(hasClickOutside, (val) => {
        const fn = val === true ? addClickOutside : removeClickOutside;
        fn(clickOutsideProps);
      });
      onBeforeUnmount(() => {
        removeClickOutside(clickOutsideProps);
      });
    }
    function handleShow(evt) {
      showPortal();
      registerTick(() => {
        observer = new MutationObserver(() => updatePosition());
        observer.observe(innerRef.value, { attributes: false, childList: true, characterData: true, subtree: true });
        updatePosition();
        configureScrollTarget();
      });
      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + "|" + $q.screen.height + "|" + props.self + "|" + props.anchor + "|" + $q.lang.rtl,
          updatePosition
        );
      }
      registerTimeout(() => {
        showPortal(true);
        emit("show", evt);
      }, props.transitionDuration);
    }
    function handleHide(evt) {
      removeTick();
      hidePortal();
      anchorCleanup();
      registerTimeout(() => {
        hidePortal(true);
        emit("hide", evt);
      }, props.transitionDuration);
    }
    function anchorCleanup() {
      if (observer !== void 0) {
        observer.disconnect();
        observer = void 0;
      }
      if (unwatchPosition !== void 0) {
        unwatchPosition();
        unwatchPosition = void 0;
      }
      unconfigureScrollTarget();
      cleanEvt(anchorEvents, "tooltipTemp");
    }
    function updatePosition() {
      const el = innerRef.value;
      if (anchorEl.value === null || !el) {
        return;
      }
      setPosition({
        el,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      });
    }
    function delayShow(evt) {
      if ($q.platform.is.mobile === true) {
        clearSelection();
        document.body.classList.add("non-selectable");
        const target2 = anchorEl.value;
        const evts = ["touchmove", "touchcancel", "touchend", "click"].map((e) => [target2, e, "delayHide", "passiveCapture"]);
        addEvt(anchorEvents, "tooltipTemp", evts);
      }
      registerTimeout(() => {
        show(evt);
      }, props.delay);
    }
    function delayHide(evt) {
      if ($q.platform.is.mobile === true) {
        cleanEvt(anchorEvents, "tooltipTemp");
        clearSelection();
        setTimeout(() => {
          document.body.classList.remove("non-selectable");
        }, 10);
      }
      registerTimeout(() => {
        hide(evt);
      }, props.hideDelay);
    }
    function configureAnchorEl() {
      if (props.noParentEvent === true || anchorEl.value === null) {
        return;
      }
      const evts = $q.platform.is.mobile === true ? [
        [anchorEl.value, "touchstart", "delayShow", "passive"]
      ] : [
        [anchorEl.value, "mouseenter", "delayShow", "passive"],
        [anchorEl.value, "mouseleave", "delayHide", "passive"]
      ];
      addEvt(anchorEvents, "anchor", evts);
    }
    function configureScrollTarget() {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget);
        const fn = props.noParentEvent === true ? updatePosition : hide;
        changeScrollEvent(localScrollTarget.value, fn);
      }
    }
    function getTooltipContent() {
      return showing.value === true ? h("div", {
        ...attrs,
        ref: innerRef,
        class: [
          "q-tooltip q-tooltip--style q-position-engine no-pointer-events",
          attrs.class
        ],
        style: [
          attrs.style,
          transitionStyle.value
        ],
        role: "tooltip"
      }, hSlot(slots.default)) : null;
    }
    function renderPortalContent() {
      return h(Transition, {
        name: transition.value,
        appear: true
      }, getTooltipContent);
    }
    onBeforeUnmount(anchorCleanup);
    Object.assign(vm.proxy, { updatePosition });
    return renderPortal;
  }
});
var CalendarDayItem_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$2 = ["innerHTML"];
const _sfc_main$2 = {
  __name: "CalendarDayItem",
  props: {
    date: {
      type: Object,
      default: () => ({ day: 1, month: 1, year: 1 })
    },
    today: {
      type: Boolean,
      default: false
    },
    previousMonth: {
      type: Boolean,
      default: false
    },
    nextMonth: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["date-cell", {
          today: __props.today,
          "previous-month": __props.previousMonth,
          "next-month": __props.nextMonth
        }])
      }, [
        createTextVNode(toDisplayString(__props.date.day) + " ", 1),
        createVNode(QTooltip, {
          class: "text-center text-body2",
          "transition-show": "jump-down",
          "transition-hide": "fade"
        }, {
          default: withCtx(() => [
            createBaseVNode("span", {
              innerHTML: unref(getDayPopupString)(__props.date)
            }, null, 8, _hoisted_1$2)
          ]),
          _: 1
        })
      ], 2);
    };
  }
};
var CalendarView_vue_vue_type_style_index_0_scoped_true_lang = "";
const _hoisted_1$1 = { class: "calendar" };
const _hoisted_2$1 = {
  key: 0,
  class: "header"
};
const _hoisted_3 = { style: { "display": "contents" } };
const _hoisted_4 = { style: { "display": "contents" } };
const _sfc_main$1 = {
  __name: "CalendarView",
  setup(__props) {
    const store = useCalendarStore();
    const { today } = storeToRefs(store);
    const stateReady = ref(false);
    const currentView = ref({ ...store.today, day: 1 });
    const slide = ref("bf");
    const carousel = ref(null);
    function carouselNext() {
      carousel.value.next();
    }
    function carouselPrev() {
      carousel.value.previous();
    }
    const currentViewDays = computed(() => {
      if (!stateReady.value)
        return [];
      const view = unref(currentView);
      const firstOfThisMonth = { ...view, day: 1 };
      const lastOfThisMonth = { ...view, day: getMonth(view).days };
      const daysBeforeCount = getWeekday(firstOfThisMonth).index - 1;
      const daysCount = getMonth(view).days;
      const daysAfterCount = 6 * 7 - daysBeforeCount - daysCount;
      const days2 = [];
      let dayIndex = 0;
      for (let i = daysBeforeCount; i > 0; i--) {
        const date = substractDays(firstOfThisMonth, i);
        days2.push({
          bind: {
            date,
            previousMonth: true,
            nextMonth: false,
            today: isToday(date)
          },
          gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${dayIndex % 7 + 1}`
        });
        dayIndex++;
      }
      for (let i = 1; i <= daysCount; i++) {
        const date = { ...view, day: i };
        days2.push({
          bind: {
            date,
            previousMonth: false,
            nextMonth: false,
            today: isToday(date)
          },
          gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${dayIndex % 7 + 1}`
        });
        dayIndex++;
      }
      for (let i = 1; i <= daysAfterCount; i++) {
        const date = addDays(lastOfThisMonth, i);
        days2.push({
          bind: {
            date,
            previousMonth: false,
            nextMonth: true,
            today: isToday(date)
          },
          gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${dayIndex % 7 + 1}`
        });
        dayIndex++;
      }
      return days2;
    });
    function isToday({ day, month, year }) {
      return dateEquals(today.value, { day, month, year });
    }
    const seasonIcons = [
      "sym_r_filter_drama",
      "sym_r_ac_unit",
      "sym_r_local_florist",
      "sym_r_sunny"
    ];
    const seasonIcon = computed(() => {
      if (!stateReady.value)
        return "";
      switch (currentView.value.month) {
        case 3:
        case 4:
        case 5:
          return "sym_r_filter_drama";
        case 6:
        case 7:
        case 8:
          return "sym_r_ac_unit";
        case 9:
        case 10:
        case 11:
          return "sym_r_local_florist";
        case 12:
        case 13:
        case 1:
        case 2:
          return "sym_r_sunny";
        default:
          return "";
      }
    });
    function showNextMonth() {
      if (currentView.value.month === months.length) {
        currentView.value.month = 1;
        currentView.value.year++;
      } else {
        currentView.value.month++;
      }
    }
    function showPreviousMonth() {
      if (currentView.value.month === 1) {
        currentView.value.month = months.length;
        currentView.value.year--;
      } else {
        currentView.value.month--;
      }
    }
    function showToday() {
      currentView.value = { ...today.value, day: 1 };
    }
    let doubleClick = false;
    function handleDayClick(day, clickEvt) {
      if (clickEvt.ctrlKey) {
        if (doubleClick) {
          today.value = day.bind.date;
        } else {
          doubleClick = true;
          setTimeout(() => {
            doubleClick = false;
          }, 200);
        }
        return;
      }
      if (day.bind.previousMonth || day.bind.nextMonth) {
        currentView.value = { ...day.bind.date, day: 1 };
      }
    }
    store.restored.then((success) => {
      showToday();
      stateReady.value = true;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        (openBlock(), createElementBlock(Fragment, null, renderList(seasonIcons, (icon) => {
          return createVNode(QIcon, {
            key: `si_${icon}`,
            class: "season-icon",
            size: "12em",
            name: icon,
            style: normalizeStyle(icon === unref(seasonIcon) ? "" : "scale: 0.9; opacity: 0")
          }, null, 8, ["name", "style"]);
        }), 64)),
        (openBlock(), createElementBlock(Fragment, null, renderList(seasonIcons, (icon) => {
          return createVNode(QIcon, {
            key: `si_${icon}`,
            class: "season-icon season-icon-top",
            size: "12em",
            name: icon,
            style: normalizeStyle(icon === unref(seasonIcon) ? "" : "scale: 0.9; opacity: 0")
          }, null, 8, ["name", "style"]);
        }), 64)),
        stateReady.value ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
          createVNode(QCarousel, {
            ref_key: "carousel",
            ref: carousel,
            modelValue: slide.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => slide.value = $event),
            vertical: "",
            class: "bg-transparent fit",
            animated: "",
            "transition-prev": "jump-down",
            "transition-next": "jump-up",
            "transition-duration": "100",
            onMouseenter: carouselNext,
            onMouseleave: carouselPrev
          }, {
            default: withCtx(() => [
              createVNode(QCarouselSlide, {
                name: "bf",
                style: { "padding": "0" },
                class: "flex flex-center"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(getMonth)(currentView.value).name) + " " + toDisplayString(currentView.value.year) + " BF ", 1)
                ]),
                _: 1
              }),
              createVNode(QCarouselSlide, {
                name: "hal",
                style: { "padding": "0" },
                class: "flex flex-center"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(getMonth)(currentView.value).name) + " " + toDisplayString(currentView.value.year - 993) + " Hal ", 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ])) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: "grid-button",
          style: { "grid-area": "hdr / day 6" },
          onClick: showPreviousMonth
        }, [
          createVNode(QIcon, {
            size: "sm",
            color: "primary",
            name: "sym_r_navigate_before"
          })
        ]),
        createBaseVNode("div", {
          class: "grid-button",
          style: { "grid-area": "hdr / day 7" },
          onClick: showNextMonth
        }, [
          createVNode(QIcon, {
            size: "sm",
            color: "primary",
            name: "sym_r_navigate_next"
          })
        ]),
        createBaseVNode("div", _hoisted_3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(currentViewDays), (day, i) => {
            return openBlock(), createBlock(_sfc_main$3, mergeProps({
              key: `day_${i}`
            }, day.bind, {
              style: { gridArea: day.gridArea }
            }), null, 16, ["style"]);
          }), 128))
        ]),
        createBaseVNode("div", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(currentViewDays), (day, i) => {
            return openBlock(), createBlock(_sfc_main$2, mergeProps({
              key: `day_${i}`
            }, day.bind, {
              style: { gridArea: day.gridArea },
              onClick: (evt) => handleDayClick(day, evt)
            }), null, 16, ["style", "onClick"]);
          }), 128))
        ]),
        stateReady.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "footer grid-button",
          onClick: showToday
        }, toDisplayString(unref(getFormattedDate)(unref(store).today, "short")), 1)) : createCommentVNode("", true)
      ]);
    };
  }
};
var Calendar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4227b7ce"]]);
const _hoisted_1 = { class: "column" };
const _hoisted_2 = { class: "row justify-between" };
const _sfc_main = {
  __name: "CalendarPage",
  setup(__props) {
    const $q = useQuasar();
    const store = useCalendarStore();
    function sendToRoll20(evt) {
      const sendPublicly = evt.ctrlKey;
      $q.bex.send("ui-called-action", {
        command: "do-message",
        data: `${sendPublicly ? "" : "/w Max "}Heute ist der ${getFormattedDate(store.today)}`
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "flex flex-center q-gutter-y-md q-pa-md" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode(Calendar),
            createBaseVNode("div", _hoisted_2, [
              createVNode(QBtn, {
                class: "text-weight-regular",
                "icon-right": "sym_r_send",
                label: "Teilen",
                "no-caps": "",
                flat: "",
                onClick: sendToRoll20
              }),
              createVNode(QBtn, {
                class: "text-weight-regular icon-md-filled",
                "icon-right": "sym_r_event_upcoming",
                label: "weiter",
                "no-caps": "",
                flat: "",
                onClick: unref(store).increment
              }, null, 8, ["onClick"])
            ])
          ])
        ]),
        _: 1
      });
    };
  }
};
export { _sfc_main as default };

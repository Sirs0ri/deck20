import { g as getElement, c as css, v as vmIsDestroyed } from "./QBtn.bd4123d9.js";
import { A as onDeactivated, a as onBeforeUnmount, g as getCurrentInstance, a0 as Platform, b as nextTick, d as inject, a1 as quasarKey } from "./index.c6d27518.js";
const scrollTargets = [null, document, document.body, document.scrollingElement, document.documentElement];
function getScrollTarget(el, targetEl) {
  let target = getElement(targetEl);
  if (target === void 0) {
    if (el === void 0 || el === null) {
      return window;
    }
    target = el.closest(".scroll,.scroll-y,.overflow-auto");
  }
  return scrollTargets.includes(target) ? window : target;
}
function getVerticalScrollPosition(scrollTarget) {
  return scrollTarget === window ? window.pageYOffset || window.scrollY || document.body.scrollTop || 0 : scrollTarget.scrollTop;
}
function getHorizontalScrollPosition(scrollTarget) {
  return scrollTarget === window ? window.pageXOffset || window.scrollX || document.body.scrollLeft || 0 : scrollTarget.scrollLeft;
}
function animVerticalScrollTo(el, to, duration = 0) {
  const prevTime = arguments[3] === void 0 ? performance.now() : arguments[3];
  const pos = getVerticalScrollPosition(el);
  if (duration <= 0) {
    if (pos !== to) {
      setScroll(el, to);
    }
    return;
  }
  requestAnimationFrame((nowTime) => {
    const frameTime = nowTime - prevTime;
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime;
    setScroll(el, newPos);
    if (newPos !== to) {
      animVerticalScrollTo(el, to, duration - frameTime, nowTime);
    }
  });
}
function animHorizontalScrollTo(el, to, duration = 0) {
  const prevTime = arguments[3] === void 0 ? performance.now() : arguments[3];
  const pos = getHorizontalScrollPosition(el);
  if (duration <= 0) {
    if (pos !== to) {
      setHorizontalScroll(el, to);
    }
    return;
  }
  requestAnimationFrame((nowTime) => {
    const frameTime = nowTime - prevTime;
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime;
    setHorizontalScroll(el, newPos);
    if (newPos !== to) {
      animHorizontalScrollTo(el, to, duration - frameTime, nowTime);
    }
  });
}
function setScroll(scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, offset);
    return;
  }
  scrollTarget.scrollTop = offset;
}
function setHorizontalScroll(scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(offset, window.pageYOffset || window.scrollY || document.body.scrollTop || 0);
    return;
  }
  scrollTarget.scrollLeft = offset;
}
function setVerticalScrollPosition(scrollTarget, offset, duration) {
  if (duration) {
    animVerticalScrollTo(scrollTarget, offset, duration);
    return;
  }
  setScroll(scrollTarget, offset);
}
function setHorizontalScrollPosition(scrollTarget, offset, duration) {
  if (duration) {
    animHorizontalScrollTo(scrollTarget, offset, duration);
    return;
  }
  setHorizontalScroll(scrollTarget, offset);
}
let size;
function getScrollbarWidth() {
  if (size !== void 0) {
    return size;
  }
  const inner = document.createElement("p"), outer = document.createElement("div");
  css(inner, {
    width: "100%",
    height: "200px"
  });
  css(outer, {
    position: "absolute",
    top: "0px",
    left: "0px",
    visibility: "hidden",
    width: "200px",
    height: "150px",
    overflow: "hidden"
  });
  outer.appendChild(inner);
  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let w2 = inner.offsetWidth;
  if (w1 === w2) {
    w2 = outer.clientWidth;
  }
  outer.remove();
  size = w1 - w2;
  return size;
}
function hasScrollbar(el, onY = true) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return onY ? el.scrollHeight > el.clientHeight && (el.classList.contains("scroll") || el.classList.contains("overflow-auto") || ["auto", "scroll"].includes(window.getComputedStyle(el)["overflow-y"])) : el.scrollWidth > el.clientWidth && (el.classList.contains("scroll") || el.classList.contains("overflow-auto") || ["auto", "scroll"].includes(window.getComputedStyle(el)["overflow-x"]));
}
function useTimeout() {
  let timer;
  const vm = getCurrentInstance();
  function removeTimeout() {
    clearTimeout(timer);
  }
  onDeactivated(removeTimeout);
  onBeforeUnmount(removeTimeout);
  return {
    removeTimeout,
    registerTimeout(fn, delay) {
      clearTimeout(timer);
      if (vmIsDestroyed(vm) === false) {
        timer = setTimeout(fn, delay);
      }
    }
  };
}
const modifiersAll = {
  left: true,
  right: true,
  up: true,
  down: true,
  horizontal: true,
  vertical: true
};
const directionList = Object.keys(modifiersAll);
modifiersAll.all = true;
function getModifierDirections(mod) {
  const dir = {};
  for (const direction of directionList) {
    if (mod[direction] === true) {
      dir[direction] = true;
    }
  }
  if (Object.keys(dir).length === 0) {
    return modifiersAll;
  }
  if (dir.horizontal === true) {
    dir.left = dir.right = true;
  } else if (dir.left === true && dir.right === true) {
    dir.horizontal = true;
  }
  if (dir.vertical === true) {
    dir.up = dir.down = true;
  } else if (dir.up === true && dir.down === true) {
    dir.vertical = true;
  }
  if (dir.horizontal === true && dir.vertical === true) {
    dir.all = true;
  }
  return dir;
}
function shouldStart(evt, ctx) {
  return ctx.event === void 0 && evt.target !== void 0 && evt.target.draggable !== true && typeof ctx.handler === "function" && evt.target.nodeName.toUpperCase() !== "INPUT" && (evt.qClonedBy === void 0 || evt.qClonedBy.indexOf(ctx.uid) === -1);
}
function clearSelection() {
  if (window.getSelection !== void 0) {
    const selection = window.getSelection();
    if (selection.empty !== void 0) {
      selection.empty();
    } else if (selection.removeAllRanges !== void 0) {
      selection.removeAllRanges();
      Platform.is.mobile !== true && selection.addRange(document.createRange());
    }
  } else if (document.selection !== void 0) {
    document.selection.empty();
  }
}
function useTick() {
  let tickFn;
  const vm = getCurrentInstance();
  function removeTick() {
    tickFn = void 0;
  }
  onDeactivated(removeTick);
  onBeforeUnmount(removeTick);
  return {
    removeTick,
    registerTick(fn) {
      tickFn = fn;
      nextTick(() => {
        if (tickFn === fn) {
          vmIsDestroyed(vm) === false && tickFn();
          tickFn = void 0;
        }
      });
    }
  };
}
function useQuasar() {
  return inject(quasarKey);
}
export { getVerticalScrollPosition as a, getModifierDirections as b, clearSelection as c, getScrollTarget as d, setVerticalScrollPosition as e, setHorizontalScrollPosition as f, getHorizontalScrollPosition as g, hasScrollbar as h, useTick as i, getScrollbarWidth as j, useQuasar as k, shouldStart as s, useTimeout as u };

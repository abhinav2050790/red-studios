# Red Studios — Mobile-First Architecture (Android & iOS)

Every update in design, code, animation, or UX in this project is strictly **Mobile-First**. 

---

## 📱 1. Viewport & Hardware Screen Boundaries
- **Dynamic Viewports**: Use `100dvh` (with fallback to `100vh`) to prevent dynamic address bar jumps on iOS Safari and Android Chrome.
- **Safe Area Insets**:
  - Top: `env(safe-area-inset-top)` for iPhone Dynamic Island, notches, and status bars (`.pt-safe`).
  - Bottom: `env(safe-area-inset-bottom)` for iOS home indicator bars and Android gesture navigation (`.pb-safe`, `.mb-safe`).
- **Edge-to-Edge**: `viewportFit: "cover"` is strictly maintained in `src/app/layout.tsx`.

---

## 👆 2. Thumb-Zone Ergonomics & Navigation
- **Floating Action Dock**: Key actions (Brief, Discovery Call, Studio Menu Drawer, Back to Top) are positioned in the bottom floating dock (`fixed bottom-4 inset-x-3`) for effortless one-handed thumb reachability on 6.1" to 6.9" screens.
- **Native Bottom Sheets**: Lightboxes, project modals, and the studio navigation drawer open as bottom-sheet modals on mobile (`items-end sm:items-center`), featuring drag handles and spring physics.
- **Touch Target Dimensions**: Minimum 44×44px (Apple HIG) / 48×48px (Android Material Design) on all tap targets.
- **Haptic-Feel Micro-Interactions**: Use `.touch-press` (`active:scale-[0.96]`) for immediate tactile feedback without 300ms delay.

---

## ⚡ 3. WebGL Fluid Simulation & Mobile Thermal Envelope
- **Resolution Throttling**: Simulation FBOs are clamped to 128×128 (velocity) and 256×256 (dye) on mobile (`window.innerWidth <= 768`) to guarantee a locked 60–120fps with zero thermal throttling or battery drain.
- **Retina DPR Clamping**: WebGL canvas DPR is clamped to `Math.min(window.devicePixelRatio, 2.0)` to avoid extreme fill-rate overhead on 3×/4× density mobile displays.
- **Smart Idle Sleep**: The Navier-Stokes GPGPU solver automatically halts rendering after fluid dissipation settles, resulting in 0 draw calls when idle.
- **App-Switch Resilience**: `document.addEventListener("visibilitychange")` automatically resumes video textures and fluid simulation when a user returns from another app or tab.

---

## 📝 4. Form Inputs & Mobile Virtual Keyboards
- **iOS Safari Auto-Zoom Safeguard**: All `<input>`, `<textarea>`, and `<select>` elements MUST have a font-size of at least 16px (`text-base sm:text-sm`). Font sizes below 16px trigger automatic iOS browser viewport zooming.
- **Keyboard Optimization**:
  - `inputMode="email"` and `autoComplete="email"` for email fields.
  - `inputMode="tel"` and `autoComplete="tel"` for phone numbers.
  - `inputMode="url"` for reference URLs.
- **Dock Clearance**: All submit buttons and forms must include bottom padding (`pb-14 md:pb-0`) to prevent obstruction by mobile floating bars.

---

## 🎨 5. Editorial Lookbook & Touch Gestures
- **Thumb Swipe Sensitivity**: Horizontal swipe transitions trigger on horizontal deltas > 32px with directional lock (`Math.abs(deltaX) > Math.abs(deltaY) * 1.1`).
- **Scrollable Filter Chips**: Tag bars use `.overflow-x-auto.no-scrollbar.touch-snap-x` so filters flick naturally as horizontal chips.
- **Zero Hover Dependencies**: All key metadata, case study metrics, and actions are prominently visible without requiring mouse hover states.

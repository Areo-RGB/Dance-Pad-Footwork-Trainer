# Dance Pad Anti-Patterns

This document lists movement patterns that break biomechanics, flow, or safety. Use these rules to validate generated sequences or when designing new drills.

## 1. Foot Crossing
* **Description:** R foot left of L foot
* **Frames:** (L:4, R:6) → (L:6, R:4) → (L:4, R:6) (using 1-9 grid)
* **Reason:** Forces a full body twist at the hips. Destroys balance and flow.
* **Rule:** R column must never go left of L column.

## 2. Max Diagonal Split
* **Description:** L=1, R=9 — opposite corners
* **Frames:** (L:4, R:6) → (L:1, R:9) → (L:4, R:6)
* **Reason:** Stance is too wide to hold or recover from. No muscle group can generate useful force from this spread. Next step requires an uncontrolled lunge.
* **Rule:** L=1,R=9 and L=3,R=7 are both banned.

## 3. Extreme Row Lock
* **Description:** Both feet stuck in the top row
* **Frames:** (L:4, R:6) → (L:1, R:3) → (L:4, R:6)
* **Reason:** Locking both feet in the same extreme row (top or bottom) removes all forward/back recovery options. You're stranded with no natural exit step.
* **Rule:** Both feet cannot share the same top or bottom row.

## 4. Full-Width Column Hop
* **Description:** Single foot jumps col 1 → col 3
* **Frames:** (L:4, R:6) → (L:7, R:6) → (L:1, R:6)
* **Reason:** L jumps from col 1 directly to col 3 skipping the center column entirely. No momentum or body rotation can control this lateral distance in one step.
* **Rule:** Single foot cannot skip a column — max one column per step.

## 5. 90° Internal Rotation
* **Description:** Toes pointing fully inward
* **Frames:** (L:5, R:5, Ld:↑, Rd:↑) → (L:5, R:5, Ld:→, Rd:←)
* **Reason:** 90° internal hip rotation on both feet simultaneously. Internal rotation maxes out around 30–45° for most people. This risks knee ligament stress.
* **Rule:** Internal rotation > 45° per foot is unsafe — use ↗/↖ at most.

## 6. Over-Rotation External
* **Description:** Toe sweeping past 90° external
* **Frames:** (L:4, R:6, Ld:↑, Rd:↑) → (L:4, R:6, Ld:↑, Rd:↘) → (L:4, R:6, Ld:↑, Rd:↓)
* **Reason:** R toe at ↘ (135°) and ↓ (180°) external rotation. Impossible to achieve as a standing pivot — the body must fully turn with the foot, or the hip joint is forced past its end range.
* **Rule:** External rotation cap: → for R foot, ← for L foot (90° max).

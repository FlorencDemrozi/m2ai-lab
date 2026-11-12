---
name: { en: "OptiTrack PrimeX 22 motion capture", no: "OptiTrack PrimeX 22 bevegelsesfangst" }
summary: { en: "Dual-mode motion capture across a 5 × 8 m volume: sub-millimetre IR marker tracking as the lab’s ground-truth reference, plus markerless depth sensing." }
status: installed
source: lab
categories: [motion-capture]
# TODO: confirm the responsible researcher (defaults to the PI) and the linked applications (guessed). See TODO-content.md.
researchers: [florenc-demrozi]
applications: [gait, balance, rehabilitation, har, upper-body, sports, fall-detection, aging-aal]
manufacturer: "OptiTrack"
model: "PrimeX 22"
quantity: 12
specs: { cameras: 12, modes: "IR marker tracking + depth (markerless)", mounting: "ceiling", "capture area": "5 × 8 m" }
sync: hardware
url: https://www.optitrack.com/
icon: motion
twin_object: optitrack_cameras
order: 10
---
Twelve ceiling-mounted PrimeX 22 cameras track reflective markers in three dimensions across a
5 × 8 m capture volume. The cameras are dual mode: besides infrared marker tracking they work as
depth cameras, so the same rig also captures 3D pose and movement without markers or wearables.
The volume can be split into smaller virtual zones for studies that need less space. Recordings are synchronized with the lab's other sensors through hardware
TTL triggers and Lab Streaming Layer, so OptiTrack serves as the ground truth every other
modality is validated against.

The same open floor supports smaller studies, for example:

- full-body gait analysis over the whole 5.0 × 8.0 m area
- upper-body tests (arms, head) in about 3.0 × 3.0 m
- sitting activities in about 2.0 × 2.0 m
- balance tests in about 3.0 × 3.0 m

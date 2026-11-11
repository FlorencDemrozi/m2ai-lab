---
name: { en: "WitMotion WT901WIFI wireless IMUs" }
summary: { en: "Wireless 9-axis inertial sensors (accelerometer, gyroscope, magnetometer) streaming orientation over WiFi at up to 200 Hz, for body-worn motion tracking at scale." }
status: installed
source: lab
categories: [motion-capture, wearables-iot]
# TODO: confirm the responsible researcher (defaults to the PI) and the linked applications (guessed). See TODO-content.md.
researchers: [florenc-demrozi]
applications: [gait, har, balance, rehabilitation, sports]
manufacturer: "WitMotion"
model: "WT901WIFI"
quantity: 20
specs: { axes: "9 (acc ±16 g, gyro ±2000 °/s, mag)", output: "Euler angles, quaternions", rate: "up to 200 Hz", link: "2.4 GHz WiFi (TCP/UDP)" }
url: https://www.wit-motion.com/WirelessInclinometer/79.html
icon: tracker
twin_object: witmotion_wt901wifi
order: 22
---

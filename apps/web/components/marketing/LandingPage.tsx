"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = "paintings" | "handicrafts";

const img = (prompt: string) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt
  )}&image_size=landscape_4_3`;

const CATALOG = [
  {
    id: 1,
    title: "Monsoon Serenade in Oils",
    category: "paintings" as Category,
    price: 3400,
    artist: "Rohan's Fine Art Studio",
    distance: "1.2 km",
    img: img(
      "oil painting of monsoon rain over an Indian street, moody blue palette, fine art canvas"
    ),
  },
  {
    id: 2,
    title: "Botanical Watercolors",
    category: "paintings" as Category,
    price: 1200,
    artist: "Priya Atelier",
    distance: "2.4 km",
    img: img(
      "delicate botanical watercolor painting of wildflowers and leaves, soft pastel tones"
    ),
  },
  {
    id: 3,
    title: "Hand-Thrown Ceramic Vessel",
    category: "handicrafts" as Category,
    price: 1600,
    artist: "Clay & Kiln Co.",
    distance: "1.8 km",
    img: img(
      "hand-thrown ceramic stoneware vessel, rustic pottery, warm terracotta tones"
    ),
  },
  {
    id: 4,
    title: "Brass & Terracotta Lantern",
    category: "handicrafts" as Category,
    price: 2100,
    artist: "Kumbh Craft House",
    distance: "0.5 km",
    img: img(
      "handcrafted brass and terracotta lantern, Indian handicraft, warm glowing light"
    ),
  },
];

const HUES = [
  { key: "indigo", className: "dot-indigo", title: "Electric Indigo" },
  { key: "ruby", className: "dot-ruby", title: "Ruby Crimson" },
  { key: "pink", className: "dot-pink", title: "Light Pink" },
  { key: "teal", className: "dot-teal", title: "Teal Breeze" },
];

const HERITAGE_PATTERN_SVG = `
<svg class="heritage-pattern" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="heritageJewel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" style="stop-color:var(--primary-accent)" />
      <stop offset="100%" style="stop-color:#B8860B" />
    </linearGradient>
    <pattern id="heritageTapestry" width="260" height="260" patternUnits="userSpaceOnUse" patternTransform="rotate(6)">

      <g transform="translate(45,50)">
        <circle r="24" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.5" />
        <circle r="17" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.6" />
        <g stroke="currentColor" stroke-width="1.1" fill="none">
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(30)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(60)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(90)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(120)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(150)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(180)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(210)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(240)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(270)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(300)" />
          <path d="M0,0 C -4,-9 -1.5,-15 0,-17.5 C 1.5,-15 4,-9 0,0 Z" transform="rotate(330)" />
        </g>
        <g fill="currentColor" opacity="0.85">
          <circle cx="0" cy="-24" r="1" /><circle cx="12" cy="-20.8" r="1" /><circle cx="20.8" cy="-12" r="1" />
          <circle cx="24" cy="0" r="1" /><circle cx="20.8" cy="12" r="1" /><circle cx="12" cy="20.8" r="1" />
          <circle cx="0" cy="24" r="1" /><circle cx="-12" cy="20.8" r="1" /><circle cx="-20.8" cy="12" r="1" />
          <circle cx="-24" cy="0" r="1" /><circle cx="-20.8" cy="-12" r="1" /><circle cx="-12" cy="-20.8" r="1" />
        </g>
        <circle r="3.2" fill="url(#heritageJewel)" />
      </g>

      <g transform="translate(180,45)" stroke="currentColor" fill="none" stroke-width="1" opacity="0.85">
        <path d="M-24,0 A 12,12 0 0 1 0,0 A 12,12 0 0 1 24,0" />
        <path d="M-18,0 A 6,6 0 0 1 -6,0 A 6,6 0 0 1 6,0 A 6,6 0 0 1 18,0" opacity="0.7" />
        <g fill="currentColor" stroke="none">
          <circle cx="-24" cy="0" r="1.1"/><circle cx="-12" cy="-12" r="1.1"/><circle cx="0" cy="0" r="1.1"/>
          <circle cx="12" cy="-12" r="1.1"/><circle cx="24" cy="0" r="1.1"/>
        </g>
      </g>

      <g transform="translate(205,150)" stroke="currentColor" stroke-width="1" opacity="0.6">
        <path d="M-18,-18 L18,-18 M-18,-9 L18,-9 M-18,0 L18,0 M-18,9 L18,9 M-18,18 L18,18" />
        <path d="M-18,-18 L-18,18 M-9,-18 L-9,18 M0,-18 L0,18 M9,-18 L9,18 M18,-18 L18,18" opacity="0.45" />
      </g>

      <g transform="translate(38,205)" opacity="0.85">
        <path d="M-10,-14 L10,-14 L7,-4 C 12,2 12,16 0,20 C -12,16 -12,2 -7,-4 Z"
              fill="none" stroke="currentColor" stroke-width="1.1" />
        <line x1="-12" y1="-14" x2="12" y2="-14" stroke="currentColor" stroke-width="1.1" />
        <path d="M-5,-2 C -2,2 2,2 5,-2" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.7" />
      </g>

      <g transform="translate(130,130)" fill="none" stroke="currentColor" stroke-width="1" opacity="0.8">
        <path d="M0,-9 C 3,-9 3,-3 0,0 C -3,-3 -3,-9 0,-9 Z" />
        <path d="M0,-9 C 3,-9 3,-3 0,0 C -3,-3 -3,-9 0,-9 Z" transform="rotate(72)" />
        <path d="M0,-9 C 3,-9 3,-3 0,0 C -3,-3 -3,-9 0,-9 Z" transform="rotate(144)" />
        <path d="M0,-9 C 3,-9 3,-3 0,0 C -3,-3 -3,-9 0,-9 Z" transform="rotate(216)" />
        <path d="M0,-9 C 3,-9 3,-3 0,0 C -3,-3 -3,-9 0,-9 Z" transform="rotate(288)" />
        <circle r="1.6" fill="currentColor" stroke="none" />
      </g>

      <path d="M205 210
               C 221 210, 221 230, 210 238
               C 200 245, 187 241, 186 229
               C 185 220, 193 217, 198 222"
            fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.85" />

      <g transform="translate(232,18)" stroke="currentColor" stroke-width="1" opacity="0.75" fill="none">
        <path d="M-10,-6 Q -10,6 -10,6" />
        <path d="M-10,-10 L 6,-10 M -10,-2 L 6,-2 M -10,6 L 6,6" opacity="0.7" />
        <path d="M-10,-10 L -10,6 M -2,-10 L -2,6 M 6,-10 L 6,6" opacity="0.5" />
      </g>

      <g transform="translate(30,225)" fill="currentColor" opacity="0.85">
        <circle cx="-6" cy="-6" r="1"/><circle cx="0" cy="-8" r="1"/><circle cx="6" cy="-6" r="1"/>
        <circle cx="-8" cy="0" r="1"/><circle cx="0" cy="0" r="1.3"/><circle cx="8" cy="0" r="1"/>
        <circle cx="-6" cy="6" r="1"/><circle cx="0" cy="8" r="1"/><circle cx="6" cy="6" r="1"/>
      </g>

      <g transform="translate(120,225)" stroke="currentColor" stroke-width="1" fill="none" opacity="0.75">
        <path d="M-30,0 Q -25,-8 -20,0 Q -15,8 -10,0 Q -5,-8 0,0 Q 5,8 10,0 Q 15,-8 20,0 Q 25,8 30,0" />
      </g>

      <g transform="translate(95,20)" opacity="0.85">
        <circle r="12" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.5" />
        <g fill="currentColor" stroke="currentColor" stroke-width="0.9">
          <g transform="translate(0,-12)"><circle r="1.3" cy="-2" fill="currentColor" stroke="none"/><path d="M0,0 L0,4 M-2.5,2 L2.5,2 M0,4 L-2,7 M0,4 L2,7" fill="none"/></g>
          <g transform="translate(10.4,-6) rotate(60)"><circle r="1.3" cy="-2" fill="currentColor" stroke="none"/><path d="M0,0 L0,4 M-2.5,2 L2.5,2 M0,4 L-2,7 M0,4 L2,7" fill="none"/></g>
          <g transform="translate(10.4,6) rotate(120)"><circle r="1.3" cy="-2" fill="currentColor" stroke="none"/><path d="M0,0 L0,4 M-2.5,2 L2.5,2 M0,4 L-2,7 M0,4 L2,7" fill="none"/></g>
          <g transform="translate(0,12) rotate(180)"><circle r="1.3" cy="-2" fill="currentColor" stroke="none"/><path d="M0,0 L0,4 M-2.5,2 L2.5,2 M0,4 L-2,7 M0,4 L2,7" fill="none"/></g>
          <g transform="translate(-10.4,6) rotate(240)"><circle r="1.3" cy="-2" fill="currentColor" stroke="none"/><path d="M0,0 L0,4 M-2.5,2 L2.5,2 M0,4 L-2,7 M0,4 L2,7" fill="none"/></g>
          <g transform="translate(-10.4,-6) rotate(300)"><circle r="1.3" cy="-2" fill="currentColor" stroke="none"/><path d="M0,0 L0,4 M-2.5,2 L2.5,2 M0,4 L-2,7 M0,4 L2,7" fill="none"/></g>
        </g>
      </g>

      <g transform="translate(245,95)" opacity="0.85">
        <path d="M-9,0 C -5,-5 5,-5 9,0 C 5,5 -5,5 -9,0 Z" fill="none" stroke="currentColor" stroke-width="1" />
        <path d="M9,0 L14,-3.5 M9,0 L14,3.5" fill="none" stroke="currentColor" stroke-width="0.9" />
        <circle cx="-5" cy="-0.5" r="0.8" fill="currentColor" stroke="none" />
        <path d="M-3,-2.5 Q0,0 -3,2.5 M0,-3.5 Q3,0 0,3.5" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.7" />
      </g>

      <g transform="translate(72,150)" fill="none" stroke="currentColor" stroke-width="1" opacity="0.8">
        <path d="M-16,10 Q -6,-10 8,-4 Q 20,0 16,-14" />
        <path d="M-10,2 C -13,-3 -10,-7 -6,-6 C -8,-2 -8,1 -10,2 Z" />
        <path d="M2,-6 C 0,-11 3,-15 7,-13 C 5,-9 5,-6 2,-6 Z" />
        <circle cx="16" cy="-14" r="1.6" fill="currentColor" stroke="none" />
      </g>

      <g transform="translate(14,105) rotate(-25)" opacity="0.85">
        <rect x="-1.6" y="-16" width="3.2" height="10" rx="1.2" fill="none" stroke="currentColor" stroke-width="0.9" />
        <rect x="-1.9" y="-6" width="3.8" height="4" fill="currentColor" stroke="currentColor" stroke-width="0.6" opacity="0.75" />
        <path d="M-1.9,-2 L-2.6,4 Q0,7.5 2.6,4 L1.9,-2 Z" fill="none" stroke="currentColor" stroke-width="0.8" />
        <path d="M-1.6,4 Q0,9 1.6,4" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.6" />
        <path d="M4,7 Q6,8.5 8,10" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.7" />
        <circle cx="8" cy="10" r="2.6" fill="currentColor" stroke="none" opacity="0.5" />
      </g>

      <g transform="translate(255,180) rotate(15)" opacity="0.85" fill="none" stroke="currentColor">
        <line x1="-14" y1="0" x2="10" y2="0" stroke-width="0.9" />
        <ellipse cx="-14" cy="0" rx="1.6" ry="0.9" stroke-width="0.7" />
        <path d="M10,0 L13,-2.2" stroke-width="0.9" />
        <path d="M-11,-1.5 Q -6,-6 -2,-1.5 Q 2,3 6,-1.5" stroke-width="0.6" opacity="0.7" />
        <g stroke-width="0.9" opacity="0.75">
          <path d="M-4,8 L0,12 M0,8 L-4,12" />
          <path d="M2,10 L6,14 M6,10 L2,14" />
        </g>
      </g>

      <g transform="translate(150,250)" opacity="0.85">
        <path d="M0,10 L0,-2 M0,-2 Q-8,-6 -10,-14 M0,-2 Q8,-6 10,-14 M0,-2 Q-4,-10 -2,-18 M0,-2 Q4,-10 2,-18"
              fill="none" stroke="currentColor" stroke-width="0.8" />
        <g fill="currentColor" stroke="none" opacity="0.8">
          <circle cx="-9" cy="-10" r="0.6" /><circle cx="-6" cy="-13" r="0.6" />
          <circle cx="9" cy="-10" r="0.6" /><circle cx="6" cy="-13" r="0.6" />
          <circle cx="-3" cy="-14" r="0.6" /><circle cx="3" cy="-14" r="0.6" /><circle cx="0" cy="-18" r="0.6" />
        </g>
        <g stroke="currentColor" stroke-width="0.5" opacity="0.6" fill="none">
          <path d="M-2,6 L2,6 M-2,3 L2,3 M-1.5,0 L1.5,0" />
        </g>
      </g>

      <g stroke="currentColor" stroke-width="0.55" opacity="0.4" fill="none">
        <path d="M0,130 L130,0 L260,130 L130,260 Z" />
        <path d="M65,130 L130,65 L195,130 L130,195 Z" />
      </g>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#heritageTapestry)" />
</svg>`;

const HERO_MEDALLION_SVG = `
<svg class="hero-medallion" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g fill="none" stroke="currentColor">
    <circle cx="320" cy="320" r="300" stroke-width="1" />
    <circle cx="320" cy="320" r="255" stroke-width="1" stroke-dasharray="2 10" />
    <circle cx="320" cy="320" r="210" stroke-width="1.2" />
    <circle cx="320" cy="320" r="70" stroke-width="1.4" />

    <g transform="translate(320.0,145.0) scale(0.62)" stroke-width="1.1">
      <path d="M-8,4 Q-8,-8 0,-8 Q8,-8 8,4 Z" fill="none"/>
      <line x1="-10" y1="4" x2="10" y2="4"/>
      <line x1="-10" y1="7" x2="10" y2="7" stroke-width="0.6"/>
      <circle cx="-6" cy="7" r="0.8" fill="currentColor" stroke="none"/><circle cx="0" cy="7" r="0.8" fill="currentColor" stroke="none"/><circle cx="6" cy="7" r="0.8" fill="currentColor" stroke="none"/>
      <line x1="0" y1="-8" x2="0" y2="-11" stroke-width="0.7"/>
      <ellipse cx="0" cy="-11" rx="3" ry="0.9" fill="none" stroke-width="0.7"/>
    </g>

    <g transform="translate(358.9,149.4) scale(0.62)" stroke-width="1.1">
      <path d="M-7,9 L-7,3 L7,3 L7,9 Z" fill="none"/>
      <path d="M-9,3 L-7,0 L7,0 L9,3 Z" fill="none"/>
      <path d="M-5,0 L-5,-4 L5,-4 L5,0 Z" fill="none" stroke-width="0.8"/>
      <path d="M-7,-4 L-5,-6 L5,-6 L7,-4 Z" fill="none" stroke-width="0.8"/>
      <line x1="0" y1="-6" x2="0" y2="-9" stroke-width="0.6"/>
      <circle cx="0" cy="-9" r="0.8" fill="currentColor" stroke="none"/>
    </g>

    <g transform="translate(395.9,162.3) scale(0.62)" stroke-width="1.1">
      <path d="M-9,4 Q-9,-2 -3,-3 L2,-4 Q6,-4 7,-1 Q9,0 8,3 Q8,5 5,5 L-7,5 Q-9,5 -9,4 Z" fill="none"/>
      <path d="M2,-4 L4,-7 L3,-4" fill="none" stroke-width="0.8"/>
      <line x1="-5" y1="5" x2="-5" y2="8" stroke-width="0.7"/><line x1="4" y1="5" x2="4" y2="8" stroke-width="0.7"/>
      <circle cx="-6" cy="-1" r="0.6" fill="currentColor" stroke="none"/>
    </g>

    <g transform="translate(429.1,183.2) scale(0.62)" stroke-width="1.1">
      <path d="M-6,9 L-6,5 L6,5 L6,9 Z" fill="none"/>
      <path d="M-5,5 L-5,1 L5,1 L5,5 Z" fill="none" stroke-width="0.85"/>
      <path d="M-4,1 L-4,-3 L4,-3 L4,1 Z" fill="none" stroke-width="0.8"/>
      <path d="M-2.5,-3 L0,-9 L2.5,-3 Z" fill="none" stroke-width="0.75"/>
      <line x1="-4" y1="1" x2="-4" y2="-1" stroke-width="0.5"/><line x1="4" y1="1" x2="4" y2="-1" stroke-width="0.5"/>
      <circle cx="0" cy="-9" r="0.7" fill="currentColor" stroke="none"/>
    </g>

    <g transform="translate(456.8,210.9) scale(0.62)" stroke-width="1.1">
      <path d="M-6,9 L-6,3 Q-6,-6 0,-9 Q6,-6 6,3 L6,9 Z" fill="none"/>
      <rect x="-2" y="5" width="4" height="4" fill="none" stroke-width="0.7"/>
      <ellipse cx="0" cy="-9" rx="2.2" ry="0.8" fill="none" stroke-width="0.6"/>
      <circle cx="0" cy="-10.3" r="0.6" fill="currentColor" stroke="none"/>
    </g>

    <g transform="translate(477.7,244.1) scale(0.62)" stroke-width="1.1">
      <path d="M-8,9 L-8,0 L8,0 L8,9 Z" fill="none"/>
      <path d="M-9,0 L0,-7 L9,0 Z" fill="none"/>
      <path d="M-3,9 L-3,4 Q-3,2 0,2 Q3,2 3,4 L3,9" fill="none" stroke-width="0.7"/>
      <line x1="0" y1="-7" x2="0" y2="-10" stroke-width="0.6"/>
      <line x1="-1.5" y1="-8.5" x2="1.5" y2="-8.5" stroke-width="0.6"/>
    </g>

    <g transform="translate(490.6,281.1) scale(0.62)" stroke-width="1.1">
      <rect x="-6" y="4" width="12" height="5" fill="none" stroke-width="0.8"/>
      <path d="M0,-9 Q-3,-9 -3,-5 L-3,2 Q-3,4 0,4 Q3,4 3,2 L3,-5 Q3,-9 0,-9 Z" fill="none" stroke-width="0.85"/>
      <circle cx="0" cy="-10.6" r="1.4" fill="none" stroke-width="0.8"/>
    </g>

    <g transform="translate(495.0,320.0) scale(0.62)" stroke-width="1.1">
      <circle r="8" fill="none"/>
      <circle r="1.5" fill="currentColor" stroke="none"/>
      <line x1="0" y1="-8" x2="0" y2="8"/><line x1="-6.9" y1="-4" x2="6.9" y2="4"/><line x1="6.9" y1="-4" x2="-6.9" y2="4"/>
      <line x1="-9" y1="9" x2="9" y2="9" stroke-width="0.6"/>
    </g>

    <g transform="translate(490.6,358.9) scale(0.62)" stroke-width="1.1">
      <path d="M-9,9 L-5,0 L-2,4 L2,-3 L5,2 L9,9 Z" fill="none"/>
      <path d="M-5,0 L-6,1.5 L-4,1.5 Z" fill="currentColor" stroke="none" opacity="0.7"/>
      <path d="M2,-3 L1,-1 L3,-1 Z" fill="currentColor" stroke="none" opacity="0.7"/>
    </g>

    <g transform="translate(477.7,395.9) scale(0.62)" stroke-width="1.1">
      <path d="M-5,9 L-3,-6 Q0,-9 3,-6 L5,9 Z" fill="none"/>
      <line x1="-5" y1="9" x2="5" y2="9"/>
      <line x1="0" y1="-9" x2="0" y2="-12" stroke-width="0.6"/>
      <path d="M0,-12 L3,-11 L0,-10 Z" fill="currentColor" stroke="none"/>
    </g>

    <g transform="translate(456.8,429.1) scale(0.62)" stroke-width="1.1">
      <path d="M-2,3 L-2,-6 Q-2,-9 0,-9 Q2,-9 2,-6 L2,3" fill="none" stroke-width="0.9"/>
      <line x1="-2" y1="3" x2="-2" y2="9" stroke-width="0.8"/><line x1="2" y1="3" x2="2" y2="9" stroke-width="0.8"/>
      <circle cx="0" cy="-10.5" r="1.3" fill="none" stroke-width="0.8"/>
      <line x1="-2" y1="-4" x2="-4" y2="1" stroke-width="0.5" opacity="0.6"/><line x1="2" y1="-4" x2="4" y2="1" stroke-width="0.5" opacity="0.6"/>
    </g>

    <g transform="translate(429.1,456.8) scale(0.62)" stroke-width="1.1">
      <line x1="-8" y1="9" x2="-2" y2="-8" stroke-width="0.8"/>
      <line x1="8" y1="9" x2="2" y2="-8" stroke-width="0.8"/>
      <line x1="-2" y1="-8" x2="2" y2="-8" stroke-width="0.6"/>
      <path d="M-6,2 Q0,8 6,2" fill="none" stroke-width="0.6"/>
      <line x1="0" y1="-8" x2="0" y2="9" stroke-width="0.5" opacity="0.5"/>
    </g>

    <g transform="translate(395.9,477.7) scale(0.62)" stroke-width="1.1">
      <line x1="-6" y1="9" x2="-6" y2="-6" stroke-width="0.9"/>
      <line x1="6" y1="9" x2="6" y2="-6" stroke-width="0.9"/>
      <line x1="-8" y1="-9" x2="8" y2="-9" stroke-width="0.9"/>
      <line x1="-7.5" y1="-6.5" x2="7.5" y2="-6.5" stroke-width="0.7"/>
      <line x1="-7" y1="-4" x2="7" y2="-4" stroke-width="0.7"/>
      <circle cx="-7" cy="-9" r="0.6" fill="currentColor" stroke="none"/><circle cx="7" cy="-9" r="0.6" fill="currentColor" stroke="none"/>
    </g>

    <g transform="translate(358.9,490.6) scale(0.62)" stroke-width="1.1">
      <path d="M-8,10 L-8,-2 Q-8,-10 0,-10 Q8,-10 8,-2 L8,10" fill="none"/>
      <path d="M-4,10 L-4,-1 Q-4,-6 0,-6 Q4,-6 4,-1 L4,10" fill="none" stroke-width="0.75"/>
      <line x1="-11" y1="10" x2="11" y2="10"/>
      <circle cx="-8" cy="-11" r="0.8" fill="none" stroke-width="0.5"/><circle cx="8" cy="-11" r="0.8" fill="none" stroke-width="0.5"/>
    </g>

    <g transform="translate(320.0,495.0) scale(0.62)" stroke-width="1.1">
      <circle cx="0" cy="-9" r="1.4" fill="none" stroke-width="0.8"/>
      <path d="M-8,7 Q0,-3 8,7 Q0,3 -8,7 Z" fill="none" stroke-width="0.8"/>
      <line x1="-8" y1="7" x2="8" y2="7"/>
    </g>

    <g transform="translate(281.1,490.6) scale(0.62)" stroke-width="1.1">
      <path d="M-9,4 Q-5,-2 0,4 Q5,-2 9,4" fill="none" stroke-width="0.9"/>
      <path d="M-9,4 Q-9,7 -6,8" fill="none" stroke-width="0.6"/>
      <path d="M9,4 Q9,7 6,8" fill="none" stroke-width="0.6"/>
      <line x1="-9" y1="8" x2="9" y2="8" stroke-width="0.5" opacity="0.6"/>
    </g>

    <g transform="translate(244.1,477.7) scale(0.62)" stroke-width="1.1">
      <path d="M-9,4 L-3,-8 L3,-8 L9,4 Z" fill="none" stroke-width="0.8"/>
      <path d="M-1,-6 Q-1,1 -1,8" fill="none" stroke-width="0.6"/>
      <line x1="-3" y1="-6" x2="1" y2="-6" stroke-width="0.4" opacity="0.6"/><line x1="-2" y1="-2" x2="0" y2="-2" stroke-width="0.4" opacity="0.6"/><line x1="-2" y1="2" x2="0" y2="2" stroke-width="0.4" opacity="0.6"/>
    </g>

    <g transform="translate(210.9,456.8) scale(0.62)" stroke-width="1.1">
      <ellipse cx="-2" cy="1" rx="6" ry="4" fill="none" stroke-width="0.8"/>
      <path d="M4,-1 Q9,-3 9,1 Q9,3 5,2" fill="none" stroke-width="0.7"/>
      <path d="M6,-3 Q9,-4 9,-1" fill="none" stroke-width="0.6"/>
      <line x1="-4" y1="5" x2="-4" y2="8" stroke-width="0.6"/><line x1="0" y1="5" x2="0" y2="8" stroke-width="0.6"/>
    </g>

    <g transform="translate(183.2,429.1) scale(0.62)" stroke-width="1.1">
      <circle r="9" fill="none"/>
      <circle r="1.8" fill="currentColor" stroke="none"/>
      <line x1="0" y1="-9" x2="0" y2="9"/>
      <line x1="-9" y1="0" x2="9" y2="0"/>
      <line x1="-6.4" y1="-6.4" x2="6.4" y2="6.4"/>
      <line x1="6.4" y1="-6.4" x2="-6.4" y2="6.4"/>
    </g>

    <g transform="translate(162.3,395.9) scale(0.62)" stroke-width="1.1">
      <rect x="-7" y="1" width="14" height="8" fill="none" stroke-width="0.8"/>
      <path d="M-4,1 Q-4,-5 0,-6 Q4,-5 4,1" fill="none" stroke-width="0.8"/>
      <line x1="0" y1="-6" x2="0" y2="-9" stroke-width="0.5"/>
      <circle cx="0" cy="-9" r="0.6" fill="currentColor" stroke="none"/>
      <line x1="-9" y1="9" x2="9" y2="9" stroke-width="0.5" opacity="0.6"/>
    </g>

    <g transform="translate(149.4,358.9) scale(0.62)" stroke-width="1.1">
      <path d="M-9,-9 Q0,-13 9,-9 L9,7 L-9,7 Z" fill="none"/>
      <g stroke-width="0.4" opacity="0.7">
        <rect x="-6" y="-4" width="2" height="2.4" fill="none"/><rect x="-2" y="-4" width="2" height="2.4" fill="none"/><rect x="2" y="-4" width="2" height="2.4" fill="none"/>
        <rect x="-6" y="0" width="2" height="2.4" fill="none"/><rect x="-2" y="0" width="2" height="2.4" fill="none"/><rect x="2" y="0" width="2" height="2.4" fill="none"/>
        <rect x="-6" y="4" width="2" height="2" fill="none"/><rect x="-2" y="4" width="2" height="2" fill="none"/><rect x="2" y="4" width="2" height="2" fill="none"/>
      </g>
    </g>

    <g transform="translate(145.0,320.0) scale(0.62)" stroke-width="1.1">
      <path d="M-9,9 L-6,2 L-3,6 L0,-4 L3,6 L6,0 L9,9 Z" fill="none" stroke-width="0.8"/>
      <path d="M0,-4 L-1,-2 L1,-2 Z" fill="currentColor" stroke="none" opacity="0.7"/>
      <path d="M-9,3 Q0,6 9,3" fill="none" stroke-width="0.4" opacity="0.5"/>
    </g>

    <g transform="translate(149.4,281.1) scale(0.62)" stroke-width="1.1">
      <path d="M-9,9 L9,9 L7,6 L-7,6 Z" fill="none" stroke-width="0.85"/>
      <path d="M-7,6 L7,6 L5.5,3 L-5.5,3 Z" fill="none" stroke-width="0.8"/>
      <path d="M-5.5,3 L5.5,3 L4,0 L-4,0 Z" fill="none" stroke-width="0.75"/>
      <path d="M-4,0 L4,0 L2.5,-3 L-2.5,-3 Z" fill="none" stroke-width="0.7"/>
      <path d="M-2.5,-3 L2.5,-3 L0,-8 Z" fill="none" stroke-width="0.65"/>
      <circle cx="0" cy="-8" r="0.7" fill="currentColor" stroke="none"/>
    </g>

    <g transform="translate(162.3,244.1) scale(0.62)" stroke-width="1.1">
      <rect x="-8" y="2" width="16" height="7" fill="none" stroke-width="0.8"/>
      <path d="M-8,2 Q0,-4 8,2" fill="none" stroke-width="0.8"/>
      <line x1="-8" y1="-1" x2="-8" y2="-6" stroke-width="0.7"/><line x1="8" y1="-1" x2="8" y2="-6" stroke-width="0.7"/>
      <circle cx="-8" cy="-7" r="1.1" fill="none" stroke-width="0.6"/><circle cx="8" cy="-7" r="1.1" fill="none" stroke-width="0.6"/>
      <line x1="-8" y1="-8.1" x2="-8" y2="-9.5" stroke-width="0.5"/><line x1="8" y1="-8.1" x2="8" y2="-9.5" stroke-width="0.5"/>
    </g>

    <g transform="translate(183.2,210.9) scale(0.62)" stroke-width="1.1">
      <rect x="-9" y="4" width="18" height="5" fill="none" stroke-width="0.7"/>
      <path d="M-4,4 Q-4,-4 0,-6 Q4,-4 4,4" fill="none" stroke-width="0.8"/>
      <line x1="0" y1="-6" x2="0" y2="-8" stroke-width="0.5"/>
      <circle cx="0" cy="-8" r="0.6" fill="currentColor" stroke="none"/>
    </g>

    <g transform="translate(210.9,183.2) scale(0.62)" stroke-width="1.1">
      <path d="M-6,9 L-6,3 Q-6,-6 0,-8 Q6,-6 6,3 L6,9 Z" fill="none" stroke-width="0.9"/>
      <ellipse cx="0" cy="-8" rx="2.4" ry="1" fill="none" stroke-width="0.6"/>
      <line x1="0" y1="-9" x2="0" y2="-11" stroke-width="0.5"/><circle cx="0" cy="-11" r="0.5" fill="currentColor" stroke="none"/>
      <line x1="-10" y1="9" x2="-10" y2="0" stroke-width="0.6"/><circle cx="-10" cy="-1" r="0.9" fill="none" stroke-width="0.5"/>
      <line x1="10" y1="9" x2="10" y2="0" stroke-width="0.6"/><circle cx="10" cy="-1" r="0.9" fill="none" stroke-width="0.5"/>
      <line x1="-10" y1="9" x2="10" y2="9"/>
    </g>

    <g transform="translate(244.1,162.3) scale(0.62)" stroke-width="1.1">
      <path d="M-9,9 L0,-9 L9,9 Z" fill="none" stroke-width="0.8"/>
      <path d="M-3,9 L-3,5 L3,5 L3,9 Z" fill="none" stroke-width="0.7"/>
      <path d="M-3,5 L0,2 L3,5 Z" fill="none" stroke-width="0.6"/>
    </g>

    <g transform="translate(281.1,149.4) scale(0.62)" stroke-width="1.1">
      <path d="M-9,4 L-6,-6 L6,-6 L9,4" fill="none" stroke-width="0.8"/>
      <line x1="-9" y1="4" x2="9" y2="4"/>
      <line x1="-6" y1="-6" x2="-3" y2="4" stroke-width="0.5"/><line x1="-3" y1="-6" x2="0" y2="4" stroke-width="0.5"/><line x1="0" y1="-6" x2="3" y2="4" stroke-width="0.5"/><line x1="3" y1="-6" x2="6" y2="4" stroke-width="0.5"/>
      <line x1="-6" y1="-6" x2="6" y2="-6" stroke-width="0.6"/>
    </g>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.3">
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(0.0 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(12.857 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(25.714 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(38.571 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(51.429 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(64.286 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(77.143 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(90.0 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(102.857 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(115.714 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(128.571 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(141.429 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(154.286 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(167.143 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(180.0 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(192.857 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(205.714 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(218.571 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(231.429 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(244.286 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(257.143 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(270.0 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(282.857 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(295.714 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(308.571 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(321.429 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(334.286 320 320)"/>
      <line x1="320" y1="135" x2="320" y2="76" transform="rotate(347.143 320 320)"/>
    </g>

    <g stroke="currentColor" opacity="0.75">
      <g transform="translate(320.0,65.0) rotate(0.0)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(376.7,71.4) rotate(12.857)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(430.6,90.3) rotate(25.714)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(479.0,120.6) rotate(38.571)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(519.4,161.0) rotate(51.429)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(549.7,209.4) rotate(64.286)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(568.6,263.3) rotate(77.143)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(575.0,320.0) rotate(90.0)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(568.6,376.7) rotate(102.857)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(549.7,430.6) rotate(115.714)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(519.4,479.0) rotate(128.571)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(479.0,519.4) rotate(141.429)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(430.6,549.7) rotate(154.286)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(376.7,568.6) rotate(167.143)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(320.0,575.0) rotate(180.0)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(263.3,568.6) rotate(192.857)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(209.4,549.7) rotate(205.714)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(161.0,519.4) rotate(218.571)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(120.6,479.0) rotate(231.429)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(90.3,430.6) rotate(244.286)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(71.4,376.7) rotate(257.143)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(65.0,320.0) rotate(270.0)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(71.4,263.3) rotate(282.857)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(90.3,209.4) rotate(295.714)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(120.6,161.0) rotate(308.571)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(161.0,120.6) rotate(321.429)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(209.4,90.3) rotate(334.286)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
      <g transform="translate(263.3,71.4) rotate(347.143)">
        <path d="M0,0 C-2.6,-2 -2.6,-6 0,-9 C2.6,-6 2.6,-2 0,0 Z" fill="none" stroke-width="0.9"/>
        <circle cx="0" cy="-9" r="1" fill="url(#heritageJewel)" stroke="none"/>
      </g>
    </g>

    <g fill="url(#heritageJewel)" stroke="none">
      <circle cx="320.0" cy="30.0" r="2.6"/><circle cx="384.5" cy="37.3" r="2.6"/><circle cx="445.8" cy="58.7" r="2.6"/><circle cx="500.8" cy="93.3" r="2.6"/>
      <circle cx="546.7" cy="139.2" r="2.6"/><circle cx="581.3" cy="194.2" r="2.6"/><circle cx="602.7" cy="255.5" r="2.6"/><circle cx="610.0" cy="320.0" r="2.6"/>
      <circle cx="602.7" cy="384.5" r="2.6"/><circle cx="581.3" cy="445.8" r="2.6"/><circle cx="546.7" cy="500.8" r="2.6"/><circle cx="500.8" cy="546.7" r="2.6"/>
      <circle cx="445.8" cy="581.3" r="2.6"/><circle cx="384.5" cy="602.7" r="2.6"/><circle cx="320.0" cy="610.0" r="2.6"/><circle cx="255.5" cy="602.7" r="2.6"/>
      <circle cx="194.2" cy="581.3" r="2.6"/><circle cx="139.2" cy="546.7" r="2.6"/><circle cx="93.3" cy="500.8" r="2.6"/><circle cx="58.7" cy="445.8" r="2.6"/>
      <circle cx="37.3" cy="384.5" r="2.6"/><circle cx="30.0" cy="320.0" r="2.6"/><circle cx="37.3" cy="255.5" r="2.6"/><circle cx="58.7" cy="194.2" r="2.6"/>
      <circle cx="93.3" cy="139.2" r="2.6"/><circle cx="139.2" cy="93.3" r="2.6"/><circle cx="194.2" cy="58.7" r="2.6"/><circle cx="255.5" cy="37.3" r="2.6"/>
    </g>
  </g>

  <g stroke="currentColor" stroke-width="0.5" opacity="0.35">
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(0.000 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(12.857 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(25.714 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(38.571 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(51.429 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(64.286 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(77.143 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(90.000 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(102.857 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(115.714 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(128.571 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(141.429 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(154.286 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(167.143 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(180.000 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(192.857 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(205.714 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(218.571 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(231.429 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(244.286 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(257.143 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(270.000 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(282.857 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(295.714 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(308.571 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(321.429 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(334.286 320 320)"/>
    <line x1="320" y1="320" x2="320" y2="180" transform="rotate(347.143 320 320)"/>
    </g>
  </svg>`;

export default function LandingPage() {
  const [theme, setTheme] = useState("indigo");
  const [mode, setMode] = useState("light");
  const [category, setCategory] = useState<Category>("paintings");

  useEffect(() => {
    const savedHue = localStorage.getItem("colorHue");
    if (savedHue) setTheme(savedHue);
    if (localStorage.getItem("theme") === "dark") setMode("dark");
  }, []);

  function setThemeHue(hue: string) {
    setTheme(hue);
    localStorage.setItem("colorHue", hue);
  }

  function toggleDarkMode() {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  }

  const items = CATALOG.filter((i) => i.category === category);

  return (
    <div className="craftgali" data-theme={theme} data-mode={mode}>
      <div dangerouslySetInnerHTML={{ __html: HERITAGE_PATTERN_SVG }} />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />
      <div className="ambient-glow glow-3" />

      <header>
        <div className="header-glass">
          <Link href="/" className="brand">
            <img
              src="/craftgali-logo.png"
              alt="CraftGali Logo"
              className="logo-img"
            />
            Craft<em>Gali</em>
          </Link>
          <div className="nav-actions">
            <div className="color-picker-dropdown" title="Select Color Vibe">
              {HUES.map((h) => (
                <div
                  key={h.key}
                  className={`color-dot ${h.className} ${
                    theme === h.key ? "active-dot" : ""
                  }`}
                  onClick={() => setThemeHue(h.key)}
                  title={h.title}
                />
              ))}
            </div>
            <button
              className="btn-glass theme-toggle-btn"
              onClick={toggleDarkMode}
              title="Toggle Dark/Light Mode"
              aria-label="Toggle dark mode"
            >
              {mode === "dark" ? "☀️" : "🌙"}
            </button>
            <Link href="/sign-in" className="btn-glass">
              Sign In
            </Link>
            <Link href="/become-seller" className="btn-primary">
              Open Atelier
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-gallery">
        <div dangerouslySetInnerHTML={{ __html: HERO_MEDALLION_SVG }} />
        <div className="container">
          <div className="hero-subline">Passionate hands, Legendary art</div>
          <h1>
            Reaching Every Corner <em>of the World</em>
          </h1>
          <p>
            Explore breathtaking canvases, sculptures, and decor curated
            directly from independent makers in your creative ecosystem.
          </p>

          <div className="rangoli-divider">
            <svg
              width="180"
              height="18"
              viewBox="0 0 180 18"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line x1="0" y1="9" x2="60" y2="9" stroke="currentColor" strokeWidth="1" />
              <circle cx="70" cy="9" r="2.4" fill="currentColor" />
              <path d="M90,3 L96,9 L90,15 L84,9 Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="110" cy="9" r="2.4" fill="currentColor" />
              <line x1="120" y1="9" x2="180" y2="9" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <div className="search-container-box">
            <div className="search-field location-field">
              <span>📍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Location or radius..."
                defaultValue="Bandra West, 10 km"
              />
            </div>
            <div className="search-field keyword-field">
              <span>🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search artwork, studio, or medium..."
              />
            </div>
            <button type="button" className="btn-primary">
              Filter
            </button>
          </div>

          <span className="hero-slogan-badge">
            Crafted Locally, Cherished Globally
          </span>
        </div>
      </section>

      <section className="exhibition-section">
        <div className="container">
          <nav className="category-nav">
            <div className="cat-tabs">
              <button
                className={`tab-item ${
                  category === "paintings" ? "active" : ""
                }`}
                onClick={() => setCategory("paintings")}
              >
                Paintings & Canvas
              </button>
              <button
                className={`tab-item ${
                  category === "handicrafts" ? "active" : ""
                }`}
                onClick={() => setCategory("handicrafts")}
              >
                Handcrafted Objects
              </button>
            </div>
          </nav>
          <div className="gallery-grid" style={{ marginTop: 25 }}>
            {items.map((item) => (
              <div className="artwork-card" key={item.id}>
                <div style={{ overflow: "hidden" }}>
                  <div
                    className="art-canvas"
                    style={{ backgroundImage: `url('${item.img}')` }}
                  >
                    <span className="tag-dist">📍 {item.distance} away</span>
                  </div>
                </div>
                <div className="art-info">
                  <h3 className="art-title">{item.title}</h3>
                  <div className="art-artist">{item.artist}</div>
                  <div className="art-footer">
                    <span className="art-price">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: "8px 18px", fontSize: 12 }}
                    >
                      Inquire Piece
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="toran-divider">
        <svg viewBox="0 0 900 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="10" y1="6" x2="890" y2="6" stroke="currentColor" strokeWidth="1" />
          <g fill="none" stroke="currentColor" strokeWidth="1.1">
            <path d="M10,6 Q 55,44 100,6" />
            <path d="M100,6 Q 145,44 190,6" />
            <path d="M190,6 Q 235,44 280,6" />
            <path d="M280,6 Q 325,44 370,6" />
            <path d="M370,6 Q 415,44 460,6" />
            <path d="M460,6 Q 505,44 550,6" />
            <path d="M550,6 Q 595,44 640,6" />
            <path d="M640,6 Q 685,44 730,6" />
            <path d="M730,6 Q 775,44 820,6" />
            <path d="M820,6 Q 865,44 890,6" />
          </g>
          <g fill="currentColor" opacity="0.9">
            <path d="M55,32 C 50,40 50,48 55,54 C 60,48 60,40 55,32 Z" />
            <path d="M145,32 C 140,40 140,48 145,54 C 150,48 150,40 145,32 Z" />
            <path d="M235,32 C 230,40 230,48 235,54 C 240,48 240,40 235,32 Z" />
            <path d="M325,32 C 320,40 320,48 325,54 C 330,48 330,40 325,32 Z" />
            <path d="M415,32 C 410,40 410,48 415,54 C 420,48 420,40 415,32 Z" />
            <path d="M505,32 C 500,40 500,48 505,54 C 510,48 510,40 505,32 Z" />
            <path d="M595,32 C 590,40 590,48 595,54 C 600,48 600,40 595,32 Z" />
            <path d="M685,32 C 680,40 680,48 685,54 C 690,48 690,40 685,32 Z" />
            <path d="M775,32 C 770,40 770,48 775,54 C 780,48 780,40 775,32 Z" />
          </g>
          <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.8">
            <circle cx="10" cy="6" r="5.5" /><circle cx="100" cy="6" r="5.5" /><circle cx="190" cy="6" r="5.5" />
            <circle cx="280" cy="6" r="5.5" /><circle cx="370" cy="6" r="5.5" /><circle cx="460" cy="6" r="5.5" />
            <circle cx="550" cy="6" r="5.5" /><circle cx="640" cy="6" r="5.5" /><circle cx="730" cy="6" r="5.5" />
            <circle cx="820" cy="6" r="5.5" /><circle cx="890" cy="6" r="5.5" />
          </g>
          <g fill="url(#heritageJewel)">
            <circle cx="10" cy="6" r="3" /><circle cx="100" cy="6" r="3" /><circle cx="190" cy="6" r="3" />
            <circle cx="280" cy="6" r="3" /><circle cx="370" cy="6" r="3" /><circle cx="460" cy="6" r="3" />
            <circle cx="550" cy="6" r="3" /><circle cx="640" cy="6" r="3" /><circle cx="730" cy="6" r="3" />
            <circle cx="820" cy="6" r="3" /><circle cx="890" cy="6" r="3" />
          </g>
        </svg>
      </div>

      <div className="container">
        <section className="spotlight-wrapper">
          <svg className="jali-corner tl" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.1">
              <path d="M4,30 A26,26 0 0,1 30,4" />
              <path d="M4,18 A38,38 0 0,1 18,4" />
              <path d="M4,42 A50,50 0 0,1 42,4" />
            </g>
            <circle cx="4" cy="4" r="2.4" fill="url(#heritageJewel)" />
          </svg>
          <svg className="jali-corner br" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.1">
              <path d="M4,30 A26,26 0 0,1 30,4" />
              <path d="M4,18 A38,38 0 0,1 18,4" />
              <path d="M4,42 A50,50 0 0,1 42,4" />
            </g>
            <circle cx="4" cy="4" r="2.4" fill="url(#heritageJewel)" />
          </svg>
          <div className="spotlight-text">
            <h2>Raw Vision, Timeless Heritage</h2>
            <p>
              Every piece tells a story born from heritage craftsmanship. Share
              your talent with neighbors nearby and admirers across the globe.
            </p>
            <Link href="/become-seller" className="btn-primary">
              Share Your Art Globally
            </Link>
          </div>
          <div
            style={{
              background: "var(--glass-card)",
              padding: 24,
              borderRadius: 20,
              border: "1px solid var(--glass-border)",
            }}
          >
            <h4
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 6,
                color: "var(--text-primary)",
              }}
            >
              Meera’s Clay Atelier
            </h4>
            <div
              style={{
                fontSize: 12,
                color: "var(--primary-accent)",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Bandra West • 1.4 km away
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              “Crafting slow-made stoneware ceramics right in the
              neighborhood—shipped with pride across the globe.”
            </p>
          </div>
        </section>
      </div>

      <footer>
        <svg className="chakra-watermark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.4">
            <line x1="50" y1="6" x2="50" y2="94" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(15 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(30 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(45 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(60 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(75 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(90 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(105 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(120 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(135 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(150 50 50)" />
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(165 50 50)" />
          </g>
        </svg>
        <div className="container footer-flex">
          <Link href="/" className="brand" style={{ fontSize: 20 }}>
            <img
              src="/craftgali-logo.png"
              alt="CraftGali Logo"
              className="logo-img footer-logo"
            />
            Craft<em>Gali</em>
          </Link>
          <div>
            © 2026 Craft<em>Gali</em> — Supporting Artisans Reaching Every
            Corner of the World
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

const SCOPES = [
  { key: "nearby", name: "Nearby" },
  { key: "city", name: "City" },
  { key: "state", name: "State" },
  { key: "country", name: "Country" },
] as const;

const RADII = [5, 10, 25];

const CARDS = [
  {
    thumb: "linear-gradient(155deg,#93c5fd,#2563eb)",
    badge: "2.1 km away",
    title: "Hand-thrown clay vase",
    meta: "Meera Sculpts",
    price: "₹3,200",
    dist: "Fixed price",
  },
  {
    thumb: "linear-gradient(155deg,#60a5fa,#1e40af)",
    badge: "Auction · 1d left",
    title: "Wall mural, monsoon series",
    meta: "Rohan Paints",
    price: "₹5,600",
    dist: "Highest bid",
  },
  {
    thumb: "linear-gradient(155deg,#93c5fd,#1e40af)",
    badge: "3.4 km away",
    title: "Vintage brass table lamp",
    meta: "Pre-loved · Gently used",
    price: "₹1,450",
    dist: "Fixed price",
  },
  {
    thumb: "linear-gradient(155deg,#bfdbfe,#2563eb)",
    badge: "0.8 km away",
    title: "Macrame wall hanging",
    meta: "Studio Sena",
    price: "₹890",
    dist: "Fixed price",
  },
  {
    thumb: "linear-gradient(155deg,#3b82f6,#93c5fd)",
    badge: "Auction · 4h left",
    title: "Terracotta wall plates, set of 3",
    meta: "Kumbh Studio",
    price: "₹2,100",
    dist: "Highest bid",
  },
];

export default function ExploreSection() {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<string>("nearby");
  const [radius, setRadius] = useState<number>(10);
  const [label, setLabel] = useState("Bandra West, Mumbai");
  const [heading, setHeading] = useState("Explore your gali");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  function apply() {
    const labels: Record<string, string> = {
      nearby: `Bandra West, ${radius} km`,
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
    };
    const headings: Record<string, string> = {
      nearby: "Explore your gali",
      city: "Trending in Mumbai",
      state: "Trending across Maharashtra",
      country: "Trending across India",
    };
    setLabel(labels[scope]);
    setHeading(headings[scope]);
    setOpen(false);
  }

  return (
    <section className="explore" id="explore">
      <div className="wrap">
        <div className="explore-head">
          <h2>{heading}</h2>
          <div className="location-pill-wrap" ref={wrapRef}>
            <button
              className="location-pill"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              📍 <span>{label}</span> — change
            </button>

            {open && (
              <div className="loc-pop">
                <p className="loc-pop-label">Browse by</p>
                <div className="scope-row">
                  {SCOPES.map((s) => (
                    <button
                      key={s.key}
                      className={`scope-chip ${scope === s.key ? "active" : ""}`}
                      onClick={() => setScope(s.key)}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>

                {scope === "nearby" && (
                  <div className="radius-row">
                    {RADII.map((r) => (
                      <button
                        key={r}
                        className={`radius-chip ${radius === r ? "active" : ""}`}
                        onClick={() => setRadius(r)}
                      >
                        {r} km
                      </button>
                    ))}
                  </div>
                )}

                <p className="loc-note">
                  {scope === "nearby" ? (
                    <strong>Pickup ready.</strong>
                  ) : (
                    <strong>Pickup still works locally.</strong>
                  )}{" "}
                  {scope === "nearby"
                    ? "Everything shown here is close enough to meet up directly."
                    : "Wider scopes are for browsing — you'll need to arrange a nearby meet-up to actually buy."}
                </p>
                <button className="loc-apply" onClick={apply}>
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="explore-scroll">
          {CARDS.map((card) => (
            <div className="p-card" key={card.title}>
              <div className="p-thumb" style={{ background: card.thumb }}>
                <span className="p-badge">{card.badge}</span>
              </div>
              <div className="p-body">
                <p className="p-title">{card.title}</p>
                <p className="p-meta">{card.meta}</p>
                <div className="p-foot">
                  <span className="p-price">{card.price}</span>
                  <span className="p-dist">{card.dist}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

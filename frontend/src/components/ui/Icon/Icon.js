import React from "react";

const paths = {
  book:    "M4 4.5A2.5 2.5 0 016.5 2H20v17H6.5A2.5 2.5 0 014 16.5v-12zM20 22H6.5A2.5 2.5 0 014 19.5",
  film:    "M4 4h16v16H4z M4 8h16 M4 12h16 M4 16h16 M8 4v16 M16 4v16",
  music:   "M9 18V5l12-2v13 M9 18a3 3 0 11-6 0 3 3 0 016 0z M21 16a3 3 0 11-6 0 3 3 0 016 0z",
  search:  "M21 21l-4.35-4.35 M11 19a8 8 0 100-16 8 8 0 000 16z",
  plus:    "M12 5v14 M5 12h14",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  starOutline: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart:   "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  arrow_left: "M19 12H5 M12 19l-7-7 7-7",
  arrow_right:"M5 12h14 M12 5l7 7-7 7",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  user:    "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2h-4a2 2 0 01-2-2v-5h-2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
  chart:   "M3 3v18h18 M7 14l4-4 4 4 5-5",
  grid:    "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  close:   "M18 6L6 18 M6 6l12 12",
  check:   "M20 6L9 17l-5-5",
  filter:  "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  sort:    "M3 6h18 M6 12h12 M9 18h6",
  info:    "M12 16v-4 M12 8h.01 M12 22a10 10 0 100-20 10 10 0 000 20z",
  alert:   "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  bookmark:"M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
  "eye-off": "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M14.12 14.12a3 3 0 11-4.24-4.24 M1 1l22 22",
};

export default function Icon({ name, size = 20, strokeWidth = 1.8, className, ...rest }) {
  const d = paths[name];
  if (!d) return null;
  const filled = name === "star" || name === "heart" || name === "bookmark";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {d.split(" M").map((segment, i) => (
        <path key={i} d={(i === 0 ? "" : "M") + segment} />
      ))}
    </svg>
  );
}

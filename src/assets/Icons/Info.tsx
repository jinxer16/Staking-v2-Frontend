import React, { useState, useRef, useEffect } from "react";

export default function Info() {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d)">
        <path
          d="M15 0.429993H5C2 0.429993 0 2.42999 0 5.42999V11.43C0 14.43 2 16.43 5 16.43V18.56C5 19.36 5.89 19.84 6.55 19.39L11 16.43H15C18 16.43 20 14.43 20 11.43V5.42999C20 2.42999 18 0.429993 15 0.429993ZM10 12.6C9.58 12.6 9.25 12.26 9.25 11.85C9.25 11.44 9.58 11.1 10 11.1C10.42 11.1 10.75 11.44 10.75 11.85C10.75 12.26 10.42 12.6 10 12.6ZM11.26 8.44999C10.87 8.70999 10.75 8.87999 10.75 9.15999V9.36999C10.75 9.77999 10.41 10.12 10 10.12C9.59 10.12 9.25 9.77999 9.25 9.36999V9.15999C9.25 7.99999 10.1 7.42999 10.42 7.20999C10.79 6.95999 10.91 6.78999 10.91 6.52999C10.91 6.02999 10.5 5.61999 10 5.61999C9.5 5.61999 9.09 6.02999 9.09 6.52999C9.09 6.93999 8.75 7.27999 8.34 7.27999C7.93 7.27999 7.59 6.93999 7.59 6.52999C7.59 5.19999 8.67 4.11999 10 4.11999C11.33 4.11999 12.41 5.19999 12.41 6.52999C12.41 7.66999 11.57 8.23999 11.26 8.44999Z"
          fill="#2F2300"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0.429993"
          width="20"
          height="20.1332"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 0.919351 0 0 0 0 0.570833 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

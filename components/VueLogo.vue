<template>
  <svg :class="className" viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)">
      <g transform="translate(178.06 235.01)">
        <path d="m0 0-22.669-39.264-22.669 39.264h-75.491l98.16-170.02 98.16 170.02z" fill="url(#gradient1)"/>
      </g>
      <g transform="translate(178.06 235.01)">
        <path d="m0 0-22.669-39.264-22.669 39.264h-36.227l58.896-102.01 58.896 102.01z" fill="url(#gradient2)"/>
      </g>
    </g>
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00D4AA;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4FC08D;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667EEA;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#F093FB;stop-opacity:1" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: 'h-8 w-8'
})
</script>

---
name: 'Text-News'
platform: 'web'
category: 'web-apps'
description: 'Minimal, text-based news aggregator with a filter to remove trump.'
tech: [Astro, Netlify Blobs]
year: 2025
status: 'active'
heroImage: '/projects/text-news/hero.svg'
previewVideo: '/projects/text-news/preview.mp4'
galleryImages:
  - /projects/text-news/gallery-1.png
  - /projects/text-news/gallery-2.png
  - /projects/text-news/gallery-3.png
---

A fast, lightweight news aggregator that strips away the noise and lets you focus on headlines.

![Text News homepage](/projects/text-news/text-news-1.png)

## Overview

News sites are cluttered with ads, autoplaying videos, and attention-grabbing layouts. Text-News is a way to quickly see what is happening without all the noise.

{{gallery}}

## Why

I wanted a way to view news stories without seeing trump in every headline.

![Text News homepage](/projects/text-news/text-news-2.png)

## How

Text News is a fully server-less, database-free architecture. The backend fetches feeds and results in a Netlify blob that is refreshed every 5 minutes. The frontend uses Astro to render components from Netlify’s edge. The total size of the included javascript is just ~9kb.

![Text News homepage](/projects/text-news/text-news-3.png)

{{tech}}

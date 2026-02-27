---
name: 'Magfinder'
platform: 'web'
category: 'web-apps'
description: 'A weekly newsletter of independent magazine releases.'
tech: ['Next.js', 'TypeScript', 'Postgres', 'AWS Lambda', 'AWS SES', 'Anthropic API']
year: 2024
status: 'active'
heroImage: '/projects/magfinder/hero.svg'
previewVideo: '/projects/magfinder/preview.mp4'
websiteUrl: 'https://magfinder.co'
galleryImages:
  - /projects/magfinder/gallery-1.webp
  - /projects/magfinder/gallery-2.webp
  - /projects/magfinder/gallery-3.webp
---

A curated newsletter that helps readers discover new independent magazines from around the world.
![Magfinder header](/projects/magfinder/magfinder-1.webp)

## Overview

Every Sunday, Magfinder generates an email of the latest independent art magazines and articles and sends it out to a list of subscribers.

Users can visit magfinder.com daily to see a stream of new releases and articles from publishers

<!-- ![Magfinder newsletter](/projects/magfinder/magfinder-4.jpeg) -->

![Magfinder newsletter](/projects/magfinder/magfinder-5.webp)

<!-- <img src="/projects/magfinder/magfinder-5.webp" width="250" alt="Screenshot" /> -->

## Why

I built this because I found it hard to find independent magazines. These art magazines are largely passion projects made by people with limited budget. Some publishers are large, but many are small.

I wanted to give publishers a way to reach readers and readers a way to discover publishers.

{{gallery}}

## How

I started working on this sometime around 2021. It was a way for me to dive deeper into aspects of software development I didn’t normally get to work on.

Over the years its taken many different forms from a comprehensive social network style application to an e-commerce application.

The front end uses is written in typescript on next js and deployed on cloudflare pages. The backend consists of a number of lambdas that run around the clock, finding new releases, saving them to a postgres database, using anthropic api to generating description and summaries, and publishing the content to the front end.

The weekly email uses AWS SES to send the email out to subcribers every Sunday morning.

{{tech}}

# Bytes and Nibbles Website

[![Deploy workflow](https://github.com/Samuel-Harris/Bytes-and-Nibbles-Website/actions/workflows/deploy.yml/badge.svg)](https://github.com/Samuel-Harris/Bytes-and-Nibbles-Website/actions/workflows/deploy.yml)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Samuel-Harris/Bytes-and-Nibbles-Website?utm_source=oss&utm_medium=github&utm_campaign=Samuel-Harris%2FBytes-and-Nibbles-Website&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## Introduction

My tech blog and recipe website.

See my website hosted at [https://bytes-and-nibbles.web.app](https://bytes-and-nibbles.web.app).

![A screenshot of the 1.0.0 version of the website](website_screenshot.png)

## Usage instructions

Install dependencies: `npm install`.

Run locally: `npm run dev`.

Build to `out/`: `npm run build`.

Serve the build: `npx serve out`.

Configure the `.firebaserc` and `./app/common/firebaseConstants.ts` files to use your own firebase backend.

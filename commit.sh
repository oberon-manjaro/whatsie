#!/bin/bash -ev

git add .
git commit -m "$1"
git push

gulp live build
cd ../gh-pages
git add .
git commit -m "$1"
git push

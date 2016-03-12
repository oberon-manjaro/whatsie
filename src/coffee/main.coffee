(->
  # Global configuration for AddThis
  window.addthis_share = window.addthis_share || {}
  window.addthis_share =
    passthrough:
      twitter:
        text: 'Whatsie – Beautiful #WhatsApp Web client for Mac, Windows & Linux by @Aluxian'

  # Anchor smooth scrolling
  smoothScroll.init()

  # Configure FAQ expander triggers
  [].forEach.call document.querySelectorAll('.expander-trigger'), (trigger) ->
    trigger.addEventListener 'click', ->
      trigger.classList.toggle 'expander-hidden'
    , false

  # Reviews
  reviewElements = []
  lastReviewIndex = -1
  lastElemIndex = -1
  reviewElem = null

  # Find child elements too
  for elem in document.querySelectorAll '.reviews .review'
    reviewElements.push
      content: elem.querySelector('.content')
      author: elem.querySelector('.author')

  ## Shuffle reviews
  i = REVIEWS.length
  while i
    j = Math.floor Math.random() * i
    x = REVIEWS[--i]
    REVIEWS[i] = REVIEWS[j]
    REVIEWS[j] = x

  nextReviewIndex = ->
    lastReviewIndex += 1
    lastReviewIndex = 0 if lastReviewIndex >= REVIEWS.length
    lastReviewIndex

  nextElementIndex = ->
    lastElemIndex += 1
    lastElemIndex = 0 if lastElemIndex >= reviewElements.length
    lastElemIndex

  ## Assign initial reviews
  reviewElements.forEach (elem) ->
    review = REVIEWS[nextReviewIndex()]
    elem.content.innerHTML = review.text
    elem.author.innerHTML = review.author

  fadeIn = ->
    review = REVIEWS[nextReviewIndex()]
    reviewElem.content.innerHTML = review.text
    reviewElem.author.innerHTML = review.author
    reviewElem.content.style.opacity = 1
    reviewElem.author.style.opacity = 1
    setTimeout fadeOut, 2000 + 250

  fadeOut = ->
    reviewElem = reviewElements[nextElementIndex()]
    reviewElem.content.style.opacity = 0
    reviewElem.author.style.opacity = 0
    setTimeout fadeIn, 250

  reviewElem = reviewElements[nextElementIndex()]
  fadeIn()
)()

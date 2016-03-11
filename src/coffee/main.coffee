(->
  # Global configuration for AddThis
  window.addthis_share = window.addthis_share || {}
  window.addthis_share =
    passthrough:
      twitter:
        text: 'Whatsie – Beautiful #WhatsApp Web client for Mac' +
          ', Windows & Linux by @Aluxian'

  # Anchor smooth scrolling
  smoothScroll.init()

  # Configure FAQ expander triggers
  [].forEach.call document.querySelectorAll('.expander-trigger'), (trigger) ->
    trigger.addEventListener 'click', ->
      trigger.classList.toggle 'expander-hidden'
    , false
)()

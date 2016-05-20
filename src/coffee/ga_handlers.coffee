gah = {}

gaSend = (data) ->
  ga 'send', data

gah.downloadNow = () ->
  gaSend
    hitType: 'event'
    eventCategory: 'Download'
    eventAction: 'Redirect'
    eventLabel: 'Download Now'

gah.downloadBin = (type, name) ->
  gaSend
    hitType: 'event'
    eventCategory: 'Download'
    eventAction: type
    eventLabel: name

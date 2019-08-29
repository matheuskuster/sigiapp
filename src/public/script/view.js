var started = null
var time = null

function initTimer(crisisTime, crisisStarted) {
  started = crisisStarted
  time = crisisTime

  setCrisisTimer()
  setInterval(setCrisisTimer, 1000)
}

function setCrisisTimer () {
  const finishTime = moment(started).add(time, 'minutes')
  const diff = finishTime.diff(moment(), 'milliseconds', true)
  const timer = moment.duration(diff)

  const minutes = parseInt(timer.minutes())
  let seconds = parseInt(timer.seconds())

  if(minutes == 0 && seconds < 0) {
    seconds *= -1
    $('#minutes').html(`-${minutes.toString().padStart(2, '0')}`)
  } else {
    if (seconds < 0) {
      seconds *= -1
    } 

    $('#minutes').html(minutes.toString().padStart(2, '0'))
  }
  
  $('#seconds').html(seconds.toString().padStart(2, '0'))
}

socket.on('view_schedule', data => {
  document.location.reload(true)
})

const maxSeq = 4
const query = /\?lab\=[0-9]+/.exec(location.search)
let seq = Number(!!query ? query[0].replace('?lab=', '') : maxSeq)
let page = seq > maxSeq ? maxSeq : seq

const Lab = require('./labs/' + page).Lab
const lab = new Lab()

document.addEventListener('DOMContentLoaded', function() {
  const prev = document.querySelector<HTMLLinkElement>('#prevBtn')
  const next = document.querySelector<HTMLLinkElement>('#nextBtn')
  if (page > 0) {
    prev.href = `?lab=${page - 1}`
  } else {
    prev.style.opacity = '0.5'
    prev.style.pointerEvents = 'none'
  }
  if (page < maxSeq) {
    next.href = `?lab=${page + 1}`
  } else {
    next.style.opacity = '0.5'
    next.style.pointerEvents = 'none'
  }
})

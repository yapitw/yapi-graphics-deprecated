const seq = location.hash.slice(1) || 3
const Lab = require('./labs/' + seq).Lab

const lab = new Lab ()

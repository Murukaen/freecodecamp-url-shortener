"use strict";

const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8080
const sites = []
const URL_REGEX = /^https?:\/\/.+\..+$/

function sendError(res, msg) {
  res.send({
    error: msg
  })
}

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'))
})

app.get(/^\/new\/(.*)$/,function(req,res,next){
  let param = req.params[0]
  if (URL_REGEX.test(param)) {
    sites.push(param)
    var baseUrl = req.protocol + '://' + req.get('host')
    res.send({
      original_url: param,
      short_url: baseUrl + '/' + (sites.length-1)
    })
  }
  else
    sendError(res, "Passed parameter is not a valid url")
})

app.get('/:param', (req, res) => {
  let param = req.params.param
  if (isNaN(param))
    sendError(res, "Parameter must be a number")
  else if (param < 0 || param >= sites.length)
    sendError(res, "Passed id is not present")
  else {
    res.redirect(sites[param])
  }
})

app.listen(port, function () {
  console.log('Example app listening on port ' +  port)
})
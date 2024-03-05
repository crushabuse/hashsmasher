const fs = require("node:fs")
const express = require('express')
const app = express()
const port = 3000
var records = fs.readFileSync("allhashes.txt", "utf8")
var load = []
records.split("\n").forEach(record => {
    var name = record.split(" => ")[0]
    var hash = record.split(" => ")[1]
    load.push({
        [hash]: name
    })
})
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/hashlookup.html`)
})
/* The DeWalt routes have been removes*/

app.get('/lookup/ryobi/:hash', (req, res) => {
    const hash = req.params.hash
    const record = load.find(record => record[hash])
    if (!record) return res.json({
        ok: false,
        error: "Record not found.",
        metadata: { last_checked: fs.statSync("allhashes.txt").mtime }
    }).status(404)
    res.json({ ok: true, name: record[hash], metadata: { last_checked: fs.statSync("allhashes.txt").mtime } })
})

app.listen(port, () => {
    console.log(`Hashsmasher is listening on ${port}`)
})

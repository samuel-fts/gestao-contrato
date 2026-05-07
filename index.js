const http = require('http')
const fs = require('fs')
const porta = process.env.PORT || 3000

const servidor = http.createServer((req, res)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","Content-Type")
    res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS")
   if(req.method === "OPTIONS"){
    res.writeHead(204)
    res.end()
    }
    if(req.method === "POST" && req.url === "/exportar"){
        let body=""
        req.on("data",(chunck)=>{
            body += chunck
        })
        req.on("end",()=>{
            let data = JSON.parse(body)
            let json = JSON.stringify(data)

            fs.writeFileSync("./dados.json",json)
        })
        res.end()
    }
    if(req.method === "GET" && req.url === "/"){
            const dados = fs.readFileSync("./dados.json")
            res.writeHead(200,{"Content-Type":"application/json"})
            res.end(dados)
        }
    if(req.method === "POST" && req.url === "/bkp"){
        let b = ""
        req.on("data",(chunck)=>{
            b = b+chunck;
        })
        req.on("end",()=>{
            const data = JSON.parse(b)
            const json = JSON.stringify(data)

            fs.writeFileSync("./dados_bkp.json",json)
        })
        res.end()
    }
})

servidor.listen(porta,()=>{console.log("servidor rodadndo")})

//configurando servidor
const express = require("express")
const server = express()


//configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar o body do formulario
server.use(express.urlencoded({ extended: true }))

//configurar banco de dados postgres
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres',
    password:'1234',
    host:'localhost',
    database:'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})



//configurando a apresentação da página
server.get("/", function (req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de registro no banco")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
    

   
})

server.post("/", function (req, res) {

    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Preencha todos campos!")
    }

    //coloco os valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function (err) {
        //fluxo de erro
       if (err) return res.send("Erro no bando de dados.")

        return res.redirect("/")
    })
})

//ligando o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("servidor online")
})
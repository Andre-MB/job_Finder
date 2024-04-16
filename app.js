const express = require('express');
const exphbs = require('express-handlebars')
const app = express();
const path = require('path')
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const { title } = require('process');
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function () {
    console.log(`O Express está rodando na porta ${PORT}`);
})

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// db connection
db.authenticate().then(() => {
    console.log("Conctou ao banco com sucesso")
}).catch(err => {
    console.log("Ocorreu um erro ao conectar", err)
});

// routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%' + search + '%'; // PH-> PHP 

    if (!search) {
        Job.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        })
            .then(jobs => {

                res.render('index', {
                    jobs
                });

            })
            .catch(err => {
                console.log("Ocorreu um erro ao buscar os trabalhos:", err);
                res.render('index', { jobs: [] });
            });
    } else {
        Job.findAll({
            where: { title: { [Op.like]: query } },
            order: [
                ['createdAt', 'DESC']
            ]
        })
            .then(jobs => {

                res.render('index', {
                    jobs, search
                });

            })
            .catch(err => {
                console.log("Ocorreu um erro ao buscar os trabalhos:", err);
                res.render('index', { jobs: [] });
            });
    }


});

// jobs routes

app.use('/jobs', require('./routers/jobs'))
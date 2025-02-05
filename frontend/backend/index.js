const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const session = require('express-session');

const db=knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'sagarika',
        database: 'audilib'
    }
})

const app = express();

let initialPath = path.join(__dirname,"../frontend");

app.use(session({
    secret: 'yourSecretKey', 
    resave: false, 
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    const userName = req.session.userName;
    res.render('index', { userName });
});


app.get('/login',(req,res)=>{
    res.sendFile(path.join(initialPath,'login.html'));
})

app.get('/register',(req,res)=>{
    res.sendFile(path.join(initialPath,'register.html'));
})

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            req.session.userName = data[0].name;
            res.redirect('/')
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})


app.post('/login-user', async (req, res) => {
    console.log("Login request received:", req.body);

    const loginEmail = req.body["log-email"] || req.body.email;
    const loginPassword = req.body["log-pass"] || req.body.password;

    if (!loginEmail || !loginPassword) {
        console.log("Error: Missing email or password");
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    db.select('name', 'email')
    .from('users')
    .where({ email: loginEmail, password: loginPassword })
    .then(data => {
        console.log("Database response:", data);

        if (data.length) {
            // 🔹 Redirect to index.html after successful login
            req.session.userName = data[0].name;
            res.redirect('/');
        } else {
            console.log("Error: Incorrect credentials");
            res.json({ success: false, message: 'Email or password is incorrect' });
        }
    })
    .catch(err => {
        console.error("Database query error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    });
});

app.post('/search-books', (req, res) => {
    const { searchQuery } = req.body;
    console.log("Search Query Received:", searchQuery);  // Log to see if query is received correctly

    // Simple filtering of books based on the search query
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filteredBooks.length > 0) {
        res.json({ success: true, books: filteredBooks });
    } else {
        res.json({ success: false, message: 'No books found' });
    }
});

const port = 3000;

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`); // it is a backticks, not a single quote
});
app.set('view engine', 'ejs');
// import dari node_module
const jwt = require('jsonwebtoken')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//import secara local
const models = require('./models')

// Import the jwt.js module
const { comparePassword } = require('./helpers/password')
const { generateToken, verifyToken } = require('./helpers/jwt')
const { Op } = require('sequelize')

const app = express()
const PORT = 3000

app
   .use(express.json())
   .use(cors())
   .use(bodyParser.json())
   .post('/register', async (req, res) => {
      const { name, username, email, password, role, address, phonenumber } = req.body;
      const { Users } = models;
    
      // Check if email or username is already in use
      const existingUser = await Users.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });
   //  console.log(existingUser)
      if (existingUser) {
        return res.status(400).send('Email or username is already in use.')
      //   console.log('user :',existingUser)
      }
      // Create the user if email and username are not in use
      Users.create({ name, username, email, password, role, address, phonenumber })
        .then(() => {
          return res.status(201).send(`Successfully registered, name: ${name}`)
        })
    })
   
   .post('/login', (req, res) => {
      const { email, password } = req.body
      const { Users } = models

      if (!email || !password) {
         return res.status(400).send("Email dan password kosong")
      }
      Users.findOne({ where: { email: email } })
         .then((foundUser) => {
            // console.log(foundUser)
            if (!foundUser) {
               return res.status(401).json({ error: "Unauthorized", message: "Invalid email" })
            }
            // console.log("test")
            const isMatches = comparePassword(password, foundUser.password)

            if (!isMatches) {
               return res.status(401).json({ error: "Unauthorized", message: "Invalid email/password" })
            }
            const responsePayload = {
               email: foundUser.email,
               role: foundUser.role,
               id: foundUser.id
            }
            // encode sebagai jwt 
            const token = generateToken(responsePayload)
            // mengirim respons kembali ke client
            const responseData = {
               accessToken: token,
               email: responsePayload.email,
               role: responsePayload.role,
               id: responsePayload.id
            };
            res.status(200).json(responseData)
         })
         .catch(e => {
            console.log(e)
            res.status(500).json({ error: "Internal Server Error", message: e.message })
         })
   })

   .get('/profile',
      //middleware
      (req, res, next) => {

         try {
            const token = req.get('token')
            const payload = verifyToken(token)

            const { Users } = models

            Users.findOne({ where: { name: payload.name } })
               .then(foundUser => {
                  if (!foundUser) return res.status(401).send("User does not exits")

                  res.locals.user = foundUser

                  return next()
               })
            console.log(payload)
         } catch (e) {
            return res.status(401).send("Error when validation token")
         }
      },
      (req, res) => {
         const { id, name, username, email, password, role, address, phonenumber } = res.locals.user

         return res.status(200).send({ id, name, username, email, password, role, address, phonenumber })
      }
   )

   .post('/addmovie', (req, res) => {
      const { title, synopsis, trailerurl, imgurl, rating, status } = req.body;
      const { Movies } = models;
    
      // Create new movie
      Movies.create({ title, synopsis, trailerurl, imgurl, rating, status })
        .then(() => {
          // Send a JSON response with a success message
          return res.status(201).json({ message: `Berhasil menambah movie berjudul: ${title}` });
        })
        .catch((error) => {
          console.error('Error adding movie:', error);
          // Handle any errors and send an appropriate JSON response
          return res.status(500).json({ error: 'Internal Server Error' });
        })
    })


   .get('/movies',
      //middleware
      (req, res) => {
         //fetch data dari header 'token' kemudian disimpan dalam variabel konstan bernama 'token
         // console.log('line 134',req)
         const token = req.get('token')
         // if token is empty
         if (!token) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Please login First' })
         }
         try {
            // console.log("Token:", token)
            // verifikasi keaslian token yang diterima dari client
            const user = verifyToken(token)
            console.log("User:", user)
            // const token = req.get('token')
            // const payload = verifyToken(token)
            // console.log("Payload:", payload)
            const { Movies } = models
            // digunakan untuk mengambil semua data dari tabel "Movies".
            Movies.findAll()
               .then(foundMovies => {
                  // console.log("movie:", foundMovies)
                  //if movies empty
                  if (!foundMovies) {
                     return res.status(404).json({ error: 'Not found', message: 'Movie not found for the user' })
                  }
                  return res.status(200).json(foundMovies)
               })
         } catch (err) {
            // console.log("Error:", err)
            return res.status(401).json({ error: 'Unauthorized', message: 'Please login First' })
         }
      })


   .post('/bookmark/:movieId', (req, res) => {
      const token = req.get('token')
      // if token is empty
      if (!token) {
         return res.status(401).json({ error: 'Unauthorized', message: 'Please login First' })
      }
      // const jwt = require('jsonwebtoken')
      const decodedToken = jwt.decode(token)
      const userId = decodedToken.id
      // console.log('User ID:', userId)

      const { movieId } = req.params // get movieId dari route parameter
      // const { userId } = req.body
      const { Users, Movies, Bookmarks } = models
      // console.log("movie id", movieId)
      // console.log("user id", userId)

      // const userId = 2
      // const userId = getUserIdFromToken(token); 

      // Find the movie by movieId
      Movies.findByPk(movieId)
         .then(movie => {
            if (!movie) {
               return res.status(404).json({ error: 'Movie not found', message: 'Invalid movieId' })
            }

            // Find the user  by userId from token
            Users.findByPk(userId)
               .then(user => {
                  if (!user) {
                     return res.status(404).json({ error: 'User not found', message: 'Invalid userId' })
                  }
                  // Create new bookmark
                  Bookmarks.create({ userId, movieId })
                     .then(bookmark => {
                        return res.status(201).json({
                           message: 'Successfully added new Bookmark',
                           id: bookmark.id,
                           userId: bookmark.userId,
                           movieId: bookmark.movieId,
                           movieTitle: movie.title
                        })
                     })
                     .catch(err => {
                        return res.status(500).json({ error: 'Internal Server Error', message: err.message })
                     })
               })
               .catch(err => {
                  return res.status(500).json({ error: 'Internal Server Error', message: err.message })
               })
         })
         .catch(err => {
            return res.status(500).json({ error: 'Internal Server Error', message: err.message })
         })
   })

   .get('/mybookmark', (req, res) => {
      const token = req.get('token')
      if (!token) {
         return res.status(401).json({ error: 'Unauthorized', message: 'Please login First' })
      }

      try {
         const user = verifyToken(token)
         const { Bookmarks, Movies } = models

         Bookmarks.findAll({
            where: { userId: user.id }, // hanya mengambil bookmark untuk user yang sudah membuat  bookmark
            include: [Movies],
         })
            .then((foundBookmarks) => {
               if (!foundBookmarks || foundBookmarks.length === 0) {
                  return res.status(404).json({ error: 'Not found', message: 'No bookmarks found for the user' })
               }

               const bookmarksMovies = foundBookmarks.map((bookmark) => ({
                  bookmarkId: bookmark.id,
                  userId: bookmark.userId,
                  movieId: bookmark.movieId,
                  createdAt: bookmark.createdAt,
                  updatedAt: bookmark.updatedAt,
                  movie: bookmark.Movie,
               }));

               return res.status(200).json(bookmarksMovies)
            })
            .catch((err) => {
               return res.status(500).json({ error: 'Internal Server Error', message: err.message })
            })
      } catch (err) {
         return res.status(401).json({ error: 'Unauthorized', message: 'Please login First' })
      }
   })


app.listen(PORT, () => {
   console.log(`Aplikasi meluncur di sini ya: http://localhost:${PORT}`)
})
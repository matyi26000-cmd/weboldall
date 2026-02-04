import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const {
  MONGO_URI,
  JWT_SECRET,
  ADMIN_USER = 'admin',
  ADMIN_PASS = '123',
  PORT = 5174,
} = process.env

if (!MONGO_URI) {
  throw new Error('Missing MONGO_URI in .env')
}

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in .env')
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true },
)

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    label: { type: String, default: '' },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)
const Image = mongoose.model('Image', imageSchema)

const auth = async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Hiányzó token.' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Érvénytelen token.' })
  }
}

const ensureAdminUser = async () => {
  const existing = await User.findOne({ username: ADMIN_USER })
  if (existing) return
  const passwordHash = await bcrypt.hash(ADMIN_PASS, 10)
  await User.create({ username: ADMIN_USER, passwordHash, role: 'admin' })
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ message: 'Hiányzó felhasználónév vagy jelszó.' })
  }

  const user = await User.findOne({ username })
  if (!user) {
    return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó.' })
  }

  const matches = await bcrypt.compare(password, user.passwordHash)
  if (!matches) {
    return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó.' })
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' },
  )

  return res.json({ token, username: user.username })
})

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ username: req.user.username, role: req.user.role })
})

app.get('/api/images', async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 })
  res.json(
    images.map((image) => ({
      id: image._id.toString(),
      url: image.url,
      label: image.label,
    })),
  )
})

app.post('/api/images', auth, async (req, res) => {
  const { url, label = '' } = req.body || {}
  if (!url) {
    return res.status(400).json({ message: 'Hiányzó kép URL.' })
  }

  const created = await Image.create({ url, label })
  return res.status(201).json({
    id: created._id.toString(),
    url: created.url,
    label: created.label,
  })
})

app.put('/api/images/:id', auth, async (req, res) => {
  const { id } = req.params
  const { url, label } = req.body || {}

  const updated = await Image.findByIdAndUpdate(
    id,
    { url, label },
    { new: true },
  )

  if (!updated) {
    return res.status(404).json({ message: 'Kép nem található.' })
  }

  return res.json({
    id: updated._id.toString(),
    url: updated.url,
    label: updated.label,
  })
})

app.delete('/api/images/:id', auth, async (req, res) => {
  const { id } = req.params
  const deleted = await Image.findByIdAndDelete(id)

  if (!deleted) {
    return res.status(404).json({ message: 'Kép nem található.' })
  }

  return res.json({ id })
})

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await ensureAdminUser()
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })

import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'

const previewSlots = Array.from({ length: 6 }, (_, index) => index)

const getAuthToken = () => localStorage.getItem('adminToken') || ''

const readJsonSafe = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (event) => setIsMobile(event.matches)

    if (media.addEventListener) {
      media.addEventListener('change', handler)
    } else {
      media.addListener(handler)
    }

    setIsMobile(media.matches)

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handler)
      } else {
        media.removeListener(handler)
      }
    }
  }, [breakpoint])

  return isMobile
}

function SiteHeader() {
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <div className="brand">
          <span className="brand-mark"><img src="https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/470193159_1128589782603626_506694248422888268_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=GuzaBH7Ja-QQ7kNvwFTlGlR&_nc_oc=AdnJ0H2Ry2_8F3N8-2DOxet136DrChHa9rX0EHB3Q2vWJanC-9ueHBSQ6oTfDpcwMAw&_nc_zt=23&_nc_ht=scontent-vie1-1.xx&_nc_gid=LbW1SwCBmKNjrHuOtYy1pQ&oh=00_Afv1JfFmxBg1PErUHWmMYqB4QZakZSUVcPw561kRGhWjbw&oe=698949DF" alt="" /></span>
          <div className="brand-text">
            <p className="brand-title">Jójárt Sándor</p>
            <p className="brand-subtitle">villanyszerelő • Szeged</p>
          </div>
        </div>
        <nav className="nav-links" />
        <Link className="button button-primary" to="/#kapcsolat">
          Kapcsolatfelvétel
        </Link>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <p className="footer-note">© 2026 Jójárt Sándor. Minden jog fenntartva.</p>
      </div>
    </footer>
  )
}

function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')
    const element = document.getElementById(id)
    if (!element) return
    const timer = setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    return () => clearTimeout(timer)
  }, [hash])

  return null
}

function HomePage({ images }) {
  const previewImages = useMemo(() => images.slice(0, 6), [images])
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [slideDirection, setSlideDirection] = useState('next')
  const isMobile = useIsMobile(600)

  useEffect(() => {
    if (isMobile && activeIndex !== null) {
      setActiveIndex(null)
    }
  }, [isMobile, activeIndex])

  return (
    <main>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Jójárt Sándor villanyszerelő</h1>
            <p className="lead">Szegeden és vonzáskörzetében vállalok villanyszerelési munkákat</p>
            <div className="hero-stats">
              <div className="stat-card">
                <p className="stat-value">10+ év</p>
                <p className="stat-label">Szakmai tapasztalat</p>
              </div>
              <div className="stat-card">
                <p className="stat-value">Szeged</p>
                <p className="stat-label">Fő munkaterület</p>
              </div>
              <div className="stat-card">
                <p className="stat-value">Precíz</p>
                <p className="stat-label">Munkavégzés</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="munkakepek" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Munkáimról képek</h2>
          </div>
          <div className="gallery-grid">
            {previewSlots.map((slot) => {
              const image = previewImages[slot]
              return (
                <div key={`preview-${slot}`} className="image-card">
                  {image ? (
                    <button
                      className="image-button"
                      type="button"
                      onClick={() => {
                        if (isMobile) return
                        setActiveIndex(slot)
                      }}
                      disabled={isMobile}
                      aria-disabled={isMobile}
                      tabIndex={isMobile ? -1 : 0}
                    >
                      <img src={image.url} alt={image.label || 'Munkakép'} loading="lazy" />
                    </button>
                  ) : (
                    <span>Minta kép</span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="gallery-actions">
            <Link className="button button-primary" to="/galeria">
              További képek
            </Link>
          </div>
        </div>
      </section>


      <section id="kapcsolat" className="section cta">
        <div className="container cta-content">
          <div className="cta-card">
            <h3>Kapcsolatfelvétel</h3>
            <p className="contact-lead">Keress bátran az alábbi elérhetőségeken, az elemekre kattintva gyorsan elérsz.</p>
            <div className="contact-list">
              <button
                className="contact-item contact-card"
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
              >
                <span className="contact-icon">✉️</span>
                <div>
                  <p className="contact-label">Email</p>
                  <span className="contact-value">villanyszerelo.com</span>
                </div>
              </button>
              <button
                className="contact-item contact-card"
                type="button"
                onClick={() => setIsPhoneModalOpen(true)}
              >
                <span className="contact-icon">📞</span>
                <div>
                  <p className="contact-label">Telefon</p>
                  <span className="contact-value">+36 70 415 3856</span>
                </div>
              </button>
              <a
                className="contact-item contact-card"
                href="https://www.facebook.com/p/J%C3%B3j%C3%A1rt-S%C3%A1ndor-villanyszerel%C5%91-EV-100063578439174/?locale=hu_HU"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-icon">📘</span>
                <div>
                  <p className="contact-label">Facebook</p>
                  <span className="contact-value">Jójárt Sándor</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {isPhoneModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsPhoneModalOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h4>Hívás indítása</h4>
            <p>Szeretnéd felhívni ezt a számot?</p>
            <div className="modal-actions">
              <a
                className="button button-primary"
                href="tel:+36704153856"
                onClick={() => setIsPhoneModalOpen(false)}
              >
                Hívás
              </a>
              <button className="button button-ghost" type="button" onClick={() => setIsPhoneModalOpen(false)}>
                Mégse
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isEmailModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsEmailModalOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h4>Email írása</h4>
            <p>Gmail megnyitása új lapon.</p>
            <div className="modal-actions">
              <a
                className="button button-ghost gmail-button"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=villanyszerelo.com@gmail.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsEmailModalOpen(false)}
              >
                Gmail megnyitása
              </a>
              <button className="button button-ghost" type="button" onClick={() => setIsEmailModalOpen(false)}>
                Mégse
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeIndex !== null && previewImages[activeIndex] ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveIndex(null)}>
          <div
            className="modal image-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="image-frame">
              <div className="image-box" data-direction={slideDirection}>
                <img
                  key={previewImages[activeIndex].id || previewImages[activeIndex].url}
                  src={previewImages[activeIndex].url}
                  alt={previewImages[activeIndex].label || 'Munkakép'}
                />
                <button className="image-close" type="button" onClick={() => setActiveIndex(null)}>
                  ✕
                </button>
                <button
                  className="image-nav image-prev"
                  type="button"
                  onClick={() => {
                    setSlideDirection('prev')
                    setActiveIndex((value) =>
                      value === 0 ? previewImages.length - 1 : value - 1,
                    )
                  }}
                >
                  ‹
                </button>
                <button
                  className="image-nav image-next"
                  type="button"
                  onClick={() => {
                    setSlideDirection('next')
                    setActiveIndex((value) =>
                      value === previewImages.length - 1 ? 0 : value + 1,
                    )
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function GalleryPage({ images }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [slideDirection, setSlideDirection] = useState('next')
  const isMobile = useIsMobile(600)

  useEffect(() => {
    if (isMobile && activeIndex !== null) {
      setActiveIndex(null)
    }
  }, [isMobile, activeIndex])

  return (
    <main className="section section-tight">
      <div className="container">
        <div className="section-header">
          <h2>Galéria</h2>
        </div>
        <div className="gallery-actions gallery-actions-top">
          <Link className="button button-ghost" to="/">
            Vissza a főoldalra
          </Link>
        </div>
        <div className="gallery-grid">
          {images.length === 0 ? (
            <div className="image-card image-card-empty">
              <span>Nincs feltöltött kép</span>
            </div>
          ) : (
            images.map((image) => (
              <div key={image.id} className="image-card">
                <button
                  className="image-button"
                  type="button"
                  onClick={() => {
                    if (isMobile) return
                    setActiveIndex(images.findIndex((item) => item.id === image.id))
                  }}
                  disabled={isMobile}
                  aria-disabled={isMobile}
                  tabIndex={isMobile ? -1 : 0}
                >
                  <img src={image.url} alt={image.label || 'Munkakép'} loading="lazy" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="gallery-actions">
          <Link className="button button-ghost" to="/">
            Vissza a főoldalra
          </Link>
        </div>
      </div>

      {activeIndex !== null && images[activeIndex] ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveIndex(null)}>
          <div
            className="modal image-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="image-frame">
              <div className="image-box" data-direction={slideDirection}>
                <img
                  key={images[activeIndex].id || images[activeIndex].url}
                  src={images[activeIndex].url}
                  alt={images[activeIndex].label || 'Munkakép'}
                />
                <button className="image-close" type="button" onClick={() => setActiveIndex(null)}>
                  ✕
                </button>
                <button
                  className="image-nav image-prev"
                  type="button"
                  onClick={() => {
                    setSlideDirection('prev')
                    setActiveIndex((value) => (value === 0 ? images.length - 1 : value - 1))
                  }}
                >
                  ‹
                </button>
                <button
                  className="image-nav image-next"
                  type="button"
                  onClick={() => {
                    setSlideDirection('next')
                    setActiveIndex((value) => (value === images.length - 1 ? 0 : value + 1))
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function AdminPage({ images, setImages, setIsAdmin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [error, setError] = useState('')
  const [cloudName, setCloudName] = useState('')
  const [uploadPreset, setUploadPreset] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (response) => (response.ok ? readJsonSafe(response) : null))
        .then((data) => {
          if (data?.username) {
            setIsAuthed(true)
            setIsAdmin(true)
          } else {
            localStorage.removeItem('adminToken')
            setIsAuthed(false)
            setIsAdmin(false)
          }
        })
        .catch(() => {
          localStorage.removeItem('adminToken')
          setIsAuthed(false)
          setIsAdmin(false)
        })
    }
    setCloudName(localStorage.getItem('cloudinaryCloudName') || 'djujjr3qv')
    setUploadPreset(localStorage.getItem('cloudinaryUploadPreset') || 'jojartsandorfeltolto')
  }, [setIsAdmin])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await readJsonSafe(response)
      if (!response.ok) {
        throw new Error(data?.message || 'Sikertelen belépés.')
      }
      localStorage.setItem('adminToken', data.token)
      setIsAuthed(true)
      setIsAdmin(true)
      setPassword('')
    } catch (loginError) {
      setError(loginError.message || 'Hibás felhasználónév vagy jelszó.')
    }
  }

  const handleRemove = async (id) => {
    const token = getAuthToken()
    if (!token) {
      setUploadError('Nincs jogosultság a művelethez.')
      return
    }
    setUploadError('')
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await readJsonSafe(response)
      if (!response.ok) {
        throw new Error(data?.message || 'Sikertelen törlés.')
      }
      const updatedImages = images.filter((image) => image.id !== id)
      setImages(updatedImages)
    } catch (removeError) {
      setUploadError(removeError.message || 'Ismeretlen hiba történt.')
    }
  }

  const handleReplace = async (id, file) => {
    if (!file) return
    setUploadError('')
    if (!cloudName || !uploadPreset) {
      setUploadError('Hiányzik a Cloud Name vagy az Upload Preset.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('upload_preset', uploadPreset)
      formData.append('file', file)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      )

      const data = await response.json()
      if (!response.ok) {
        const message = data?.error?.message || 'Sikertelen feltöltés.'
        throw new Error(message)
      }

      const token = getAuthToken()
      if (!token) {
        setUploadError('Nincs jogosultság a művelethez.')
        return
      }

      const apiResponse = await fetch(`/api/images/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: data.secure_url,
          label: data.original_filename || '',
        }),
      })

      const apiData = await readJsonSafe(apiResponse)
      if (!apiResponse.ok) {
        throw new Error(apiData?.message || 'Sikertelen frissítés.')
      }

      const updatedImages = images.map((image) =>
        image.id === id
          ? {
              ...image,
              url: apiData.url,
              label: apiData.label || image.label,
            }
          : image,
      )

      setImages(updatedImages)
    } catch (replaceError) {
      setUploadError(replaceError.message || 'Ismeretlen hiba történt.')
    }
  }

  return (
    <main className="section admin-section">
      <div className="container">
        <div className="section-header">
          <h2>Admin felület</h2>
          <p>Képek kezelése és karbantartása.</p>
        </div>

        {!isAuthed ? (
          <form className="upload-card" onSubmit={handleLogin}>
            <div className="upload-grid">
              <label className="upload-field">
                Felhasználó
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                />
              </label>
              <label className="upload-field">
                Jelszó
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••"
                />
              </label>
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <div className="upload-actions">
              <button className="button button-primary" type="submit">
                Belépés
              </button>
              <Link className="button button-ghost" to="/">
                Vissza a főoldalra
              </Link>
            </div>
            <p className="note">Szerveroldali belépés MongoDB + JWT védelemmel.</p>
          </form>
        ) : (
          <div className="upload-card">
            <div className="upload-actions">
              <Link className="button button-ghost" to="/feltoltes">
                Képfeltöltés
              </Link>
              <Link className="button button-ghost" to="/">
                Főoldal
              </Link>
            </div>
            {uploadError ? <p className="form-error">{uploadError}</p> : null}
            {images.length === 0 ? (
              <p className="note">Nincs feltöltött kép.</p>
            ) : (
              <div className="gallery-grid admin-grid">
                {images.map((image) => (
                  <div key={image.id} className="image-card admin-card">
                    <img src={image.url} alt={image.label || 'Munkakép'} />
                    <label className="button button-ghost admin-edit" htmlFor={`edit-${image.id}`}>
                      Kép módosítása
                    </label>
                    <input
                      id={`edit-${image.id}`}
                      className="admin-file"
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleReplace(image.id, event.target.files[0] || null)}
                    />
                    <button
                      className="button button-ghost admin-remove"
                      type="button"
                      onClick={() => handleRemove(image.id)}
                    >
                      Törlés
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function UploadPage({ images, setImages }) {
  const [cloudName, setCloudName] = useState('djujjr3qv')
  const [uploadPreset, setUploadPreset] = useState('jojartsandorfeltolto')
  const [file, setFile] = useState(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setCloudName(localStorage.getItem('cloudinaryCloudName') || 'djujjr3qv')
    setUploadPreset(localStorage.getItem('cloudinaryUploadPreset') || 'jojartsandorfeltolto')
  }, [])

  const handleUpload = async () => {
    setError('')
    if (!cloudName || !uploadPreset) {
      setError('Add meg a Cloudinary Cloud Name és Upload Preset értékeket.')
      return
    }

    if (!file) {
      setError('Válassz egy képfájlt a feltöltéshez.')
      return
    }

    setIsUploading(true)
    try {
      localStorage.setItem('cloudinaryCloudName', cloudName)
      localStorage.setItem('cloudinaryUploadPreset', uploadPreset)

      const formData = new FormData()
      formData.append('upload_preset', uploadPreset)
      formData.append('file', file)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      )

      const data = await response.json()
      if (!response.ok) {
        const message = data?.error?.message || 'Sikertelen feltöltés. Ellenőrizd a beállításokat.'
        throw new Error(message)
      }
      const token = getAuthToken()
      if (!token) {
        throw new Error('Nincs jogosultság a feltöltéshez.')
      }

      const apiResponse = await fetch('/api/images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: data.secure_url,
          label: data.original_filename,
        }),
      })

      const apiData = await readJsonSafe(apiResponse)
      if (!apiResponse.ok) {
        throw new Error(apiData?.message || 'Sikertelen mentés.')
      }

      const newImage = {
        id: apiData.id,
        url: apiData.url,
        label: apiData.label,
      }

      const updatedImages = [newImage, ...images]
      setImages(updatedImages)
      setFile(null)
      setFileInputKey((value) => value + 1)
    } catch (uploadError) {
      setError(uploadError.message || 'Ismeretlen hiba történt.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="section upload-section">
      <div className="container">
        <div className="section-header">
          <h2>Képfeltöltés</h2>
          <p>Cloudinary segítségével fájlból tölthetsz fel képeket a galériába.</p>
        </div>
        <div className="upload-card">
          <div className="upload-header">
            <div>
              <p className="upload-kicker">Cloudinary beállítások</p>
              <h3>Képfeltöltés</h3>
            </div>
            <span className="upload-badge">Admin</span>
          </div>
          <p className="note">A Cloudinary beállítások el vannak rejtve.</p>
          <div className="upload-grid upload-grid-secondary">
            <label className="upload-field upload-field-file">
              Kép kiválasztása
              <input
                className="file-input"
                type="file"
                accept="image/*"
                key={fileInputKey}
                onChange={(event) => setFile(event.target.files[0] || null)}
              />
              <div className="file-drop">
                <p>Húzd ide a képet, vagy kattints a kiválasztáshoz</p>
                <span>JPG, PNG • max. 10 MB</span>
              </div>
            </label>
            <div className="upload-field">
              Kiválasztott fájl
              <div className="file-pill">{file ? file.name : 'Nincs kiválasztva'}</div>
            </div>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="upload-actions upload-actions-spread">
            <button
              className="button button-primary"
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Feltöltés...' : 'Kép feltöltése'}
            </button>
            <Link className="button button-ghost" to="/admin">
              Admin felület
            </Link>
            <Link className="button button-ghost" to="/">
              Vissza a főoldalra
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function App() {
  const [images, setImages] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/images')
      .then(async (response) => (response.ok ? readJsonSafe(response) : []))
      .then((data) => {
        setImages(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setImages([])
      })
  }, [])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      setIsAdmin(false)
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => (response.ok ? readJsonSafe(response) : null))
      .then((data) => {
        setIsAdmin(Boolean(data?.username))
      })
      .catch(() => {
        setIsAdmin(false)
      })
  }, [])

  return (
    <BrowserRouter>
      <div className="page">
        <ScrollToHash />
        <SiteHeader />
        <Routes>
          <Route path="/" element={<HomePage images={images} />} />
          <Route path="/galeria" element={<GalleryPage images={images} />} />
          <Route
            path="/feltoltes"
            element={
              isAdmin ? (
                <UploadPage images={images} setImages={setImages} />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
          <Route
            path="/admin"
            element={<AdminPage images={images} setImages={setImages} setIsAdmin={setIsAdmin} />}
          />
        </Routes>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}

export default App

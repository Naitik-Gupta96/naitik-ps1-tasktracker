import { useEffect, useRef } from 'react'


const GOOGLE_SCRIPT_ID = 'google-identity-services'

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID)
    if (existing) {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}


function GoogleAuthButton({ onCredential, onError, text = 'signin_with' }) {
  const buttonRef = useRef(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId || !buttonRef.current) {
      return
    }

    let isMounted = true

    loadGoogleScript()
      .then(() => {
        if (!isMounted || !window.google?.accounts?.id) {
          return
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential(response.credential),
        })

        buttonRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text,
          width: 320,
        })
      })
      .catch(() => {
        onError('Google sign-in is unavailable right now.')
      })

    return () => {
      isMounted = false
    }
  }, [clientId, onCredential, onError, text])

  if (!clientId) {
    return null
  }

  return <div className="google-auth-slot" ref={buttonRef} />
}


export default GoogleAuthButton

import { useState } from 'react'

import { updatePassword, updateProfile } from '../api/auth'
import { useAuthStore } from '../store/authStore'

function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  function handleProfileChange(event) {
    const { name, value } = event.target
    setProfileForm((current) => ({ ...current, [name]: value }))
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target
    setPasswordForm((current) => ({ ...current, [name]: value }))
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setProfileError('')
    setProfileMessage('')
    setIsSavingProfile(true)

    try {
      const updatedUser = await updateProfile(profileForm)
      setUser(updatedUser)
      setProfileMessage('Profile updated successfully.')
    } catch (error) {
      setProfileError(error.response?.data?.detail || 'Unable to save profile changes.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match.')
      return
    }

    setIsSavingPassword(true)

    try {
      const response = await updatePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      })
      setPasswordMessage(response.message)
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (error) {
      setPasswordError(error.response?.data?.detail || 'Unable to update the password.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <main className="profile-shell">
      <header className="profile-header">
        <div>
          <p className="section-tag">Profile</p>
          <h1>Personal settings</h1>
        </div>
        <button type="button" className="ghost-button" onClick={logout}>
          Log out
        </button>
      </header>

      <section className="profile-grid">
        <form className="profile-card" onSubmit={handleProfileSubmit}>
          <h2>Profile details</h2>

          <label>
            <span>Full name</span>
            <input name="full_name" value={profileForm.full_name} onChange={handleProfileChange} />
          </label>

          <label>
            <span>Bio</span>
            <textarea name="bio" rows="4" value={profileForm.bio} onChange={handleProfileChange} />
          </label>

          <label>
            <span>Avatar URL</span>
            <input name="avatar_url" value={profileForm.avatar_url} onChange={handleProfileChange} />
          </label>

          {profileError ? <p className="inline-error">{profileError}</p> : null}
          {profileMessage ? <p className="inline-success">{profileMessage}</p> : null}

          <button className="primary-button" type="submit" disabled={isSavingProfile}>
            {isSavingProfile ? 'Saving...' : 'Save changes'}
          </button>
        </form>

        <form className="profile-card" onSubmit={handlePasswordSubmit}>
          <h2>Change password</h2>

          <label>
            <span>Current password</span>
            <input
              name="current_password"
              type="password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
            />
          </label>

          <label>
            <span>New password</span>
            <input name="new_password" type="password" value={passwordForm.new_password} onChange={handlePasswordChange} />
          </label>

          <label>
            <span>Confirm new password</span>
            <input
              name="confirm_password"
              type="password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
            />
          </label>

          {passwordError ? <p className="inline-error">{passwordError}</p> : null}
          {passwordMessage ? <p className="inline-success">{passwordMessage}</p> : null}

          <button className="primary-button" type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default ProfilePage

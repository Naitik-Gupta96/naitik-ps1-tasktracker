import { useState } from 'react'

import AppSidebar from '../components/AppSidebar'
import { updatePassword, updateProfile } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { getApiErrorMessage } from '../utils/apiError'

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const initials = (user?.full_name || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')

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
      setProfileError(getApiErrorMessage(error, 'Unable to save profile changes.'))
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
      setPasswordError(getApiErrorMessage(error, 'Unable to update the password.'))
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <main className="dashboard-shell">
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} onLogout={logout} />

      <section className="profile-shell">
        <div className="topbar">
          <button type="button" className="menu-button" onClick={() => setIsSidebarOpen(true)}>
            Menu
          </button>
          <div className="topbar-account">
            <span>{user?.full_name}</span>
          </div>
        </div>

        <header className="profile-header">
          <div className="header-copy">
            <p className="section-tag">Profile</p>
            <h1>Personal settings</h1>
          </div>
        </header>

        <section className="profile-grid profile-grid-two">
          <form className="profile-card" onSubmit={handleProfileSubmit}>
            <div className="profile-card-top">
              {profileForm.avatar_url ? (
                <img className="profile-avatar" src={profileForm.avatar_url} alt={profileForm.full_name || 'Profile avatar'} />
              ) : (
                <div className="profile-avatar profile-avatar-fallback">{initials}</div>
              )}

              <div className="profile-avatar-copy">
                <h2>Profile details</h2>
                <p>Update the basics shown across your workspace.</p>
              </div>
            </div>

            <label>
              <span>Full name</span>
              <input name="full_name" value={profileForm.full_name} onChange={handleProfileChange} />
            </label>

            <label>
              <span>Bio</span>
              <textarea name="bio" rows="4" value={profileForm.bio} onChange={handleProfileChange} />
            </label>

            <label>
              <span>Profile image link</span>
              <input
                name="avatar_url"
                value={profileForm.avatar_url}
                onChange={handleProfileChange}
                placeholder="Optional: paste an image URL"
              />
            </label>

            {profileError ? <p className="inline-error">{profileError}</p> : null}
            {profileMessage ? <p className="inline-success">{profileMessage}</p> : null}

            <button className="primary-button" type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save changes'}
            </button>
          </form>

          <form className="profile-card" onSubmit={handlePasswordSubmit}>
            <h2>Change password</h2>
            <p className="profile-card-text">Keep your account secure with a fresh password.</p>

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
      </section>
    </main>
  )
}

export default ProfilePage

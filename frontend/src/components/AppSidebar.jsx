import { NavLink } from 'react-router-dom'

function getInitials(name) {
  if (!name) {
    return 'U'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

function AppSidebar({ isOpen, onClose, user, onLogout }) {
  const initials = getInitials(user?.full_name)

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'sidebar-overlay-visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar-drawer ${isOpen ? 'sidebar-drawer-open' : ''}`}>
        <div className="sidebar-panel">
          <div className="sidebar-top">
            <div className="sidebar-brand">
              <span className="brand-mark">TF</span>
              <div className="sidebar-brand-copy">
                <strong>TaskFlow</strong>
                <p>Personal task tracker</p>
              </div>
            </div>

            <button type="button" className="ghost-button sidebar-close" onClick={onClose}>
              Close
            </button>
          </div>

          <nav className="sidebar-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link-active' : ''}`} onClick={onClose}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link-active' : ''}`} onClick={onClose}>
              Profile
            </NavLink>
          </nav>

          <div className="sidebar-spacer" />

          <div className="sidebar-footer-card">
            <div className="account-chip">
              {user?.avatar_url ? (
                <img className="account-avatar" src={user.avatar_url} alt={user.full_name || 'Profile avatar'} />
              ) : (
                <div className="account-avatar account-avatar-fallback">{initials}</div>
              )}
              <div>
                <strong>{user?.full_name || 'User'}</strong>
                <p>{user?.email || ''}</p>
              </div>
            </div>

            <button type="button" className="ghost-button sidebar-logout" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AppSidebar

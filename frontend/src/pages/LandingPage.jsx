import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="marketing-shell">
      <section className="marketing-hero">
        <div className="hero-copy">
          <p className="section-tag">Personal Task Tracker</p>
          <h1>Stay focused. Ship more.</h1>
          <p className="hero-text">
            A clean personal workspace for planning, tracking, and finishing tasks without noise.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/login">
              Log in
            </Link>
            <Link className="ghost-button light-ghost" to="/register">
              Create account
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-card">
            <span>Today</span>
            <strong>3 priorities in progress</strong>
            <p>Keep the public side simple. The real workspace starts after login.</p>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>12</strong>
              <span>Total tasks</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Completed this week</span>
            </div>
            <div>
              <strong>92%</strong>
              <span>Focus score</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LandingPage

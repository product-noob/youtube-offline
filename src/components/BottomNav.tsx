export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <button type="button" className="nav-item">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
          <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
        </svg>
        <span>Home</span>
      </button>

      <button type="button" className="nav-item active">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
          <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z" />
        </svg>
        <span>Shorts</span>
      </button>

      <button type="button" className="nav-item create-btn">
        <svg viewBox="0 0 36 24" width="36" height="24" fill="none">
          <rect x="0.5" y="0.5" width="35" height="23" rx="11.5" stroke="#fff" strokeWidth="1" />
          <path d="M18 7v10M13 12h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>&nbsp;</span>
      </button>

      <button type="button" className="nav-item">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
          <path d="M10 18v-6l5 3-5 3zm7-15H7v2h10V3zm3 4H4v2h16V7zm2 4H2v10h20V11zm-2 8H4v-6h16v6z" />
        </svg>
        <span>Subscriptions</span>
      </button>

      <button type="button" className="nav-item">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <span>You</span>
      </button>
    </nav>
  );
}

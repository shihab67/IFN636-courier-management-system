import logo from 'assets/images/logo-big.png';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/landing.css';
import AuthContext from '../../store/modules/authContext';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  console.log(authCtx);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-inner">
            <div className="logo-section">
              <div className="logo-icon">
                <span className="logo-text">
                  <img src={logo} alt="SwiftShip" width="60" />
                </span>
              </div>
            </div>
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
            <div className={`header-buttons ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
              {authCtx.isLoggedIn ? (
                <Link to="/dashboard">
                  <button className="btn-outline">Dashboard</button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="btn-outline">Login</button>
                </Link>
              )}
              <button className="btn-primary">Track Your Parcel</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title fade-in-up" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              Delivering
              <span className="hero-title-accent">Efficiency to Your Doorstep</span>
            </h1>
            <p className="hero-description fade-in-up delay-200">
              Your trusted partner in seamless courier management. Experience lightning-fast delivery with real-time tracking and
              professional service you can count on.
            </p>
            <div className="hero-buttons fade-in-up delay-400">
              <button className="btn-primary-large">Get Started Today</button>
              <button className="btn-outline-large">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">Why Choose SwiftShip?</h2>
          <div className="features-grid">
            {[
              {
                icon: '📍',
                title: 'Real-time Tracking',
                description: 'Stay updated with every delivery. Track your packages with precision and transparency.'
              },
              {
                icon: '🤝',
                title: 'Reliable Partnerships',
                description: 'Join our network of trusted delivery partners and build lasting business relationships.'
              },
              {
                icon: '📊',
                title: 'User-Friendly Dashboard',
                description: 'Manage your shipments effortlessly with our intuitive and powerful management system.'
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-content">
          <div className="stats-grid">
            {[
              { number: '100K+', label: 'Packages Delivered' },
              { number: '99.8%', label: 'Success Rate' },
              { number: '24/7', label: 'Support Available' },
              { number: '150+', label: 'Partner Cities' }
            ].map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="join-section">
        <div className="join-content">
          <h2 className="section-title">Join Our Delivery Network</h2>
          <p className="join-description">
            Become part of SwiftShip&apos;s trusted courier network. Earn competitive rates with flexible scheduling and reliable support.
          </p>
          <div className="join-benefits">
            <div className="benefits-list">
              <span>✓ Flexible scheduling</span>
              <span>✓ Competitive compensation</span>
              <span>✓ Professional support</span>
              <span>✓ Growth opportunities</span>
            </div>
          </div>
          <button className="btn-join">Join Us and Deliver</button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-content">
          <h2 className="section-title">What Our Partners Say</h2>
          <div className="testimonials-grid">
            {[
              {
                quote:
                  'SwiftShip transformed our delivery operations. The dashboard is incredibly intuitive and the support team is always there when we need them.',
                author: 'Sarah Chen',
                role: 'Logistics Manager'
              },
              {
                quote:
                  'As a delivery partner, I love the flexibility SwiftShip offers. The payment system is reliable and the routes are well-optimized.',
                author: 'Marcus Rodriguez',
                role: 'Delivery Partner'
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <p className="testimonial-quote">&quot{testimonial.quote}&quot</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span className="testimonial-role">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-content">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="section-title">Get in Touch</h2>
              <p className="contact-description">
                Ready to streamline your delivery operations? Our team is here to help you get started with SwiftShip&apos;s comprehensive
                courier management system.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <span>📞</span>
                  </div>
                  <span>1-800-SWIFTSHIP</span>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <span>✉️</span>
                  </div>
                  <span>support@swiftship.com</span>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <span>🌐</span>
                  </div>
                  <span>Available in 150+ cities</span>
                </div>
              </div>
            </div>
            <div className="quote-form">
              <h3 className="form-title">Request Demo</h3>
              <div className="form-fields">
                <input type="text" placeholder="Company name" className="form-input" />
                <input type="email" placeholder="Email address" className="form-input" />
                <input type="tel" placeholder="Phone number" className="form-input" />
                <select className="form-select">
                  <option>Business type</option>
                  <option>E-commerce</option>
                  <option>Retail</option>
                  <option>Restaurant</option>
                  <option>Other</option>
                </select>
                <button className="btn-form">Request Demo</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <span className="logo-text">
                    <img src={logo} alt="SwiftShip" width="70" />
                  </span>
                </div>
              </div>
              <p className="footer-description">Delivering efficiency to your doorstep with trusted courier management solutions.</p>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Services</h4>
              <ul className="footer-links">
                <li className="footer-link">Real-time Tracking</li>
                <li className="footer-link">Partner Network</li>
                <li className="footer-link">Dashboard Management</li>
                <li className="footer-link">API Integration</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li className="footer-link">About SwiftShip</li>
                <li className="footer-link">Partner With Us</li>
                <li className="footer-link">Careers</li>
                <li className="footer-link">Press</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li className="footer-link">Help Center</li>
                <li className="footer-link">Documentation</li>
                <li className="footer-link">Terms of Service</li>
                <li className="footer-link">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SwiftShip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

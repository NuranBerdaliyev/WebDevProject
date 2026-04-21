import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="social-links">
          <a href="#" aria-label="Facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>

        <div class="footer-links">
          <div class="link-column">
            <a href="#">Audio Description</a>
            <a href="#">Investor Relations</a>
            <a href="#">Legal Notices</a>
          </div>
          <div class="link-column">
            <a href="#">Help Center</a>
            <a href="#">Jobs</a>
            <a href="#">Cookie Preferences</a>
          </div>
          <div class="link-column">
            <a href="#">Gift Cards</a>
            <a href="#">Terms of Use</a>
            <a href="#">Corporate Information</a>
          </div>
          <div class="link-column">
            <a href="#">Media Center</a>
            <a href="#">Privacy</a>
            <a href="#">Contact Us</a>
          </div>
        </div>

        <button class="service-code">Service Code</button>

        <p class="copyright">© 1997-2025 Netflix, Inc.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: 100px;
      padding: 50px 4%;
      color: #808080;
    }

    .footer-content {
      max-width: 980px;
      margin: 0 auto;
    }

    .social-links {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .social-links a {
      color: white;
      transition: opacity 0.2s;
    }

    .social-links a:hover {
      opacity: 0.7;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }

    .link-column {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .link-column a {
      color: #808080;
      text-decoration: none;
      font-size: 13px;
    }

    .link-column a:hover {
      text-decoration: underline;
    }

    .service-code {
      background: transparent;
      border: 1px solid #808080;
      color: #808080;
      padding: 8px 16px;
      font-size: 13px;
      cursor: pointer;
      margin-bottom: 20px;
    }

    .service-code:hover {
      color: white;
      border-color: white;
    }

    .copyright {
      font-size: 11px;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .footer-links {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class FooterComponent {}

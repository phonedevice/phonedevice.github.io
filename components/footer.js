import { icon } from "./icons.js";

export function renderFooter(target) {
  const year = new Date().getFullYear();
  target.innerHTML = `
    <div class="container footer-grid">
      <div class="footer-col">
        <div class="brand" style="margin-bottom:var(--space-sm)">
          <span class="brand__mark">${icon("scan")}</span>
          <span class="brand__name">Mobile Device Test</span>
        </div>
        <p>A free, browser-based hardware telemetry and diagnostic engine. Every check runs locally in your browser — nothing about your device is uploaded or stored.</p>
      </div>

      <div class="footer-col">
        <div class="footer-col__title">Browser Compatibility</div>
        <ul>
          <li class="static"><span>iOS Safari</span><b>Supported</b></li>
          <li class="static"><span>Android Chrome</span><b>Supported</b></li>
          <li class="static"><span>Desktop Chrome / Edge</span><b>Full APIs</b></li>
        </ul>
      </div>

      <div class="footer-col">
        <div class="footer-col__title">Detection Tools</div>
        <ul>
          <li><a href="#detection-tools">Screen &amp; Display</a></li>
          <li><a href="#detection-tools">Battery Status</a></li>
          <li><a href="#detection-tools">Network &amp; Connection</a></li>
          <li><a href="#detection-tools">Sensors &amp; Motion</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <div class="footer-col__title">Resources</div>
        <ul>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="sitemap.xml">Sitemap</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${year} Mobile Device Test. Browser-based hardware validation suite.</span>
      <nav aria-label="Legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
      </nav>
    </div>
  `;
}

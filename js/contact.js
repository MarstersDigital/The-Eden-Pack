/**
 * The Eden Pack - Contact & Inquiry Handler
 * Handles dynamic service toggles, URL query params, form submission & Leaflet coverage map
 */

document.addEventListener('DOMContentLoaded', () => {
  initServiceSelector();
  initContactForm();
  initCoverageMap();
});

// 1. Service Type Selector & Query Parameter Handling
function initServiceSelector() {
  const toggleButtons = document.querySelectorAll('.service-toggle-btn');
  const serviceInput = document.getElementById('selected-service');
  const walkingFields = document.getElementById('walking-dynamic-fields');
  const photoFields = document.getElementById('photo-dynamic-fields');

  if (!toggleButtons.length) return;

  const setService = (service) => {
    toggleButtons.forEach(btn => {
      if (btn.dataset.service === service) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    if (serviceInput) serviceInput.value = service;

    if (service === 'photography') {
      if (walkingFields) walkingFields.style.display = 'none';
      if (photoFields) photoFields.style.display = 'block';
    } else {
      if (walkingFields) walkingFields.style.display = 'block';
      if (photoFields) photoFields.style.display = 'none';
    }
  };

  // Check URL query parameters (e.g. ?service=photography)
  const urlParams = new URLSearchParams(window.location.search);
  const initialService = urlParams.get('service') === 'photography' ? 'photography' : 'walking';
  setService(initialService);

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setService(btn.dataset.service);
    });
  });
}

// 2. Contact Form Submission
function initContactForm() {
  const form = document.getElementById('eden-inquiry-form');
  const feedback = document.getElementById('form-feedback-msg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validity check
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Enquiry...</span>`;

    // Simulate graceful dispatch
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `
          <strong>✦ Enquiry Received into Eden ✦</strong><br>
          Thank you for reaching out. We treat every inquiry with intentional care and will be in touch with you shortly to discuss your pet's needs.
        `;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 900);
  });
}

// 3. Leaflet Coverage Map
function initCoverageMap() {
  const mapContainer = document.getElementById('coverage-map');
  if (!mapContainer || typeof L === 'undefined') return;

  // Center on Harrow & Pinner (North West London)
  const harrowCoords = [51.5835, -0.3456];

  const map = L.map('coverage-map', {
    center: harrowCoords,
    zoom: 12,
    scrollWheelZoom: false,
    zoomControl: true
  });

  // Dark Matter CartoDB tiles to match Eden deep forest theme
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Antique Gold custom HTML marker
  const customCrestIcon = L.divIcon({
    className: 'custom-crest-pin',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: #283329;
        border: 2px solid #A88450;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5);
      ">
        <svg viewBox="0 0 100 100" style="width: 20px; height: 20px; fill: #C6A675;">
          <ellipse cx="50" cy="55" rx="16" ry="14" />
          <circle cx="30" cy="32" r="7.5" />
          <circle cx="43" cy="22" r="7.5" />
          <circle cx="57" cy="22" r="7.5" />
          <circle cx="70" cy="32" r="7.5" />
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22]
  });

  // Marker for Primary Hub
  const marker = L.marker(harrowCoords, { icon: customCrestIcon }).addTo(map);
  marker.bindPopup(`
    <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; line-height: 1.4; color: #283329; padding: 4px;">
      <strong style="color: #A88450; font-size: 1.2rem; display: block; text-transform: uppercase; letter-spacing: 0.08em;">The Eden Pack Hub</strong>
      Harrow & Pinner • North West London<br>
      <span style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; color: #525B53;">
        Daily collection & countryside pack trails.
      </span>
    </div>
  `).openPopup();

  // Primary Walk Radius (approx 5.5 km covering Harrow, Pinner, Stanmore, Ruislip, Northwood)
  L.circle(harrowCoords, {
    color: '#A88450',
    weight: 2,
    opacity: 0.85,
    dashArray: '6, 6',
    fillColor: '#283329',
    fillOpacity: 0.22,
    radius: 5500
  }).addTo(map);
}

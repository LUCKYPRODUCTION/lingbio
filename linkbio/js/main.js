// LinkBio - Main JavaScript
// Handles all frontend functionality

// ============================================
// Data Management
// ============================================

const DEFAULT_PROFILE = {
  name: "LUCKY PRODUCTION",
  username: "@luckyproduction",
  bio: "Welcome to my link page!",
  image: "assets/logo instagram.png",
  theme: "light",
  socialLinks: [
    {
      platform: "instagram",
      url: "https://www.instagram.com/lucky_sablon_dan_konveksi?igsh=MXF4dHo5YzJmejVxNw==",
    },
    { platform: "twitter", url: "#" },
    { platform: "youtube", url: "#" },
    {
      platform: "tiktok",
      url: "https://www.tiktok.com/@lucky_production1?_r=1&_t=ZS-944Ep3o6pnR",
    },
  ],
};

const DEFAULT_LINKS = [
  {
    id: 1,
    title: "Visit My Website",
    description: "Check out my main website",
    url: "https://example.com",
    icon: "fas fa-globe",
    clicks: 0,
    active: true,
  },
  {
    id: 2,
    title: "Follow on Instagram",
    description: "@myusername",
    url: "https://instagram.com",
    icon: "fab fa-instagram",
    clicks: 0,
    active: true,
  },
  {
    id: 3,
    title: "YouTube Channel",
    description: "Subscribe for more content",
    url: "https://youtube.com",
    icon: "fab fa-youtube",
    clicks: 0,
    active: true,
  },
  {
    id: 4,
    title: "My Portfolio",
    description: "View my work",
    url: "https://portfolio.com",
    icon: "fas fa-briefcase",
    clicks: 0,
    active: true,
  },
];

// Load data from localStorage
function loadProfile() {
  const stored = localStorage.getItem("linkbio_profile");
  return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
}

function loadLinks() {
  const stored = localStorage.getItem("linkbio_links");
  return stored ? JSON.parse(stored) : DEFAULT_LINKS;
}

function saveProfile(profile) {
  localStorage.setItem("linkbio_profile", JSON.stringify(profile));
}

function saveLinks(links) {
  localStorage.setItem("linkbio_links", JSON.stringify(links));
}

// ============================================
// DOM Elements
// ============================================

const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profileBio = document.getElementById("profileBio");
const socialIcons = document.getElementById("socialIcons");
const linksContainer = document.getElementById("linksContainer");
const themeToggle = document.getElementById("themeToggle");
const shareBtn = document.getElementById("shareBtn");
const adminBtn = document.getElementById("adminBtn");
const qrBtn = document.getElementById("qrBtn");
const qrModal = document.getElementById("qrModal");
const shareModal = document.getElementById("shareModal");
const qrModalClose = document.getElementById("qrModalClose");
const shareModalClose = document.getElementById("shareModalClose");

// ============================================
// Render Functions
// ============================================

function renderProfile() {
  const profile = loadProfile();

  // Set profile info
  profileName.textContent = profile.name;
  profileUsername.textContent = profile.username;
  profileBio.textContent = profile.bio;

  // Set profile image
  if (profile.image && profile.image !== "assets/profile.jpg") {
    profileImage.src = profile.image;
  }

  // Set theme
  if (profile.theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Render social icons
  renderSocialIcons(profile.socialLinks);
}

function renderSocialIcons(socialLinks) {
  const platforms = {
    instagram: { icon: "fab fa-instagram", color: "#E4405F" },
    twitter: { icon: "fab fa-twitter", color: "#1DA1F2" },
    youtube: { icon: "fab fa-youtube", color: "#FF0000" },
    tiktok: { icon: "fab fa-tiktok", color: "#000000" },
    linkedin: { icon: "fab fa-linkedin-in", color: "#0077B5" },
    facebook: { icon: "fab fa-facebook", color: "#1877F2" },
    whatsapp: { icon: "fab fa-whatsapp", color: "#25D366" },
    github: { icon: "fab fa-github", color: "#333333" },
    threads: { icon: "fab fa-threads", color: "#000000" },
  };

  socialIcons.innerHTML = socialLinks
    .map((link) => {
      const platform = platforms[link.platform] || {
        icon: "fas fa-link",
        color: "#6366f1",
      };
      return `
            <a href="${link.url}" class="social-icon" data-platform="${link.platform}" 
               target="_blank" rel="noopener noreferrer" title="${link.platform}">
                <i class="${platform.icon}"></i>
            </a>
        `;
    })
    .join("");
}

function renderLinks() {
  const links = loadLinks();
  const activeLinks = links.filter((link) => link.active);

  if (activeLinks.length === 0) {
    linksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-link"></i>
                <h3>No Links Yet</h3>
                <p>Add links from the admin panel</p>
            </div>
        `;
    return;
  }

  linksContainer.innerHTML = activeLinks
    .map(
      (link, index) => `
        <a href="${link.url}" class="link-card" target="_blank" rel="noopener noreferrer" 
           data-id="${link.id}" style="animation-delay: ${index * 0.1}s">
            <div class="link-icon">
                <i class="${link.icon}"></i>
            </div>
            <div class="link-content">
                <div class="link-title">${link.title}</div>
                <div class="link-description">${link.description || ""}</div>
            </div>
            <div class="link-stats">
                <i class="fas fa-arrow-up-right"></i>
                ${link.clicks || 0}
            </div>
            <div class="link-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        </a>
    `,
    )
    .join("");

  // Add click handlers
  document.querySelectorAll(".link-card").forEach((card) => {
    card.addEventListener("click", handleLinkClick);
  });
}

function handleLinkClick(e) {
  const linkId = parseInt(e.currentTarget.dataset.id);
  const links = loadLinks();
  const linkIndex = links.findIndex((l) => l.id === linkId);

  if (linkIndex !== -1) {
    links[linkIndex].clicks = (links[linkIndex].clicks || 0) + 1;
    saveLinks(links);
  }
}

// ============================================
// Theme Toggle
// ============================================

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  themeToggle.innerHTML =
    newTheme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

  // Save theme preference
  const profile = loadProfile();
  profile.theme = newTheme;
  saveProfile(profile);
}

// ============================================
// QR Code
// ============================================

function generateQRCode() {
  const url = window.location.href;
  const qrContainer = document.getElementById("qrContainer");

  qrContainer.innerHTML = "";

  QRCode.toCanvas(
    url,
    {
      width: 200,
      margin: 2,
      color: {
        dark:
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "#ffffff"
            : "#000000",
        light:
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "#1a1a1a"
            : "#ffffff",
      },
    },
    function (error, canvas) {
      if (error) {
        console.error(error);
        return;
      }
      qrContainer.appendChild(canvas);
    },
  );
}

// ============================================
// Share Functionality
// ============================================

function shareProfile(platform) {
  const url = window.location.href;
  const profile = loadProfile();
  const text = `Check out ${profile.name}'s links!`;

  let shareUrl = "";

  switch (platform) {
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case "copy":
      navigator.clipboard.writeText(url).then(() => {
        showToast("Link copied to clipboard!", "success");
      });
      return;
    default:
      return;
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
}

// ============================================
// Toast Notification
// ============================================

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// Modal Functions
// ============================================

function openModal(modal) {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  if (modal === qrModal) {
    generateQRCode();
  }
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// ============================================
// Event Listeners
// ============================================

// Theme toggle
themeToggle.addEventListener("click", toggleTheme);

// Share button
shareBtn.addEventListener("click", () => openModal(shareModal));

// QR button
qrBtn.addEventListener("click", () => openModal(qrModal));

// Admin button
adminBtn.addEventListener("click", () => {
  window.location.href = "admin.html";
});

// Modal close buttons
qrModalClose.addEventListener("click", () => closeModal(qrModal));
shareModalClose.addEventListener("click", () => closeModal(shareModal));

// Close modal on outside click
[qrModal, shareModal].forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Share options
document.querySelectorAll(".share-option").forEach((option) => {
  option.addEventListener("click", () => {
    const platform = option.dataset.share;
    shareProfile(platform);
    closeModal(shareModal);
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(qrModal);
    closeModal(shareModal);
  }
});

// ============================================
// Initialize
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderLinks();
});

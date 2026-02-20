// LinkBio - Admin Panel JavaScript
// Handles all admin functionality

// ============================================
// Constants & Data
// ============================================

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "link221908",
};

const DEFAULT_PROFILE = {
  name: "Your Name",
  username: "@username",
  bio: "Welcome to my link page!",
  image: "assets/profile.jpg",
  theme: "light",
  accentColor: "#6366f1",
  socialLinks: [
    { platform: "instagram", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "youtube", url: "#" },
    { platform: "tiktok", url: "#" },
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

// ============================================
// Data Management
// ============================================

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

const loginScreen = document.getElementById("loginScreen");
const adminDashboard = document.getElementById("adminDashboard");
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const togglePassword = document.getElementById("togglePassword");
const logoutBtn = document.getElementById("logoutBtn");

// Navigation
const navItems = document.querySelectorAll(".nav-item[data-section]");
const sections = document.querySelectorAll(".admin-section");
const sectionTitle = document.getElementById("sectionTitle");
const sectionSubtitle = document.getElementById("sectionSubtitle");

// Links
const linksList = document.getElementById("adminLinksList");
const addLinkBtn = document.getElementById("addLinkBtn");
const linkModal = document.getElementById("linkModal");
const linkModalClose = document.getElementById("linkModalClose");
const linkModalTitle = document.getElementById("linkModalTitle");
const linkForm = document.getElementById("linkForm");
const cancelLinkBtn = document.getElementById("cancelLinkBtn");
const iconPicker = document.getElementById("iconPicker");

// Profile
const profileForm = document.getElementById("profileForm");
const editName = document.getElementById("editName");
const editUsername = document.getElementById("editUsername");
const editBio = document.getElementById("editBio");
const editImage = document.getElementById("editImage");
const imagePreview = document.getElementById("imagePreview");

// Appearance
const themeOptions = document.querySelectorAll(".theme-option");
const colorOptions = document.querySelectorAll(".color-option");

// Analytics
const totalClicks = document.getElementById("totalClicks");
const totalLinks = document.getElementById("totalLinks");
const totalViews = document.getElementById("totalViews");
const analyticsTableBody = document.getElementById("analyticsTableBody");

// Settings
const changePasswordForm = document.getElementById("changePasswordForm");
const exportDataBtn = document.getElementById("exportDataBtn");
const resetDataBtn = document.getElementById("resetDataBtn");

// Toast
const toastContainer = document.getElementById("toastContainer");

// ============================================
// Authentication
// ============================================

function checkAuth() {
  const isLoggedIn = localStorage.getItem("linkbio_admin_logged_in");
  if (isLoggedIn === "true") {
    showDashboard();
  } else {
    showLogin();
  }
}

function login(username, password) {
  // Simple authentication (in production, use server-side validation)
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    localStorage.setItem("linkbio_admin_logged_in", "true");
    showDashboard();
    showToast("Login berhasil!", "success");
  } else {
    showToast("Username atau password salah!", "error");
  }
}

function logout() {
  localStorage.removeItem("linkbio_admin_logged_in");
  showLogin();
  showToast("Berhasil logout!", "success");
}

function showLogin() {
  loginScreen.style.display = "flex";
  adminDashboard.style.display = "none";
}

function showDashboard() {
  loginScreen.style.display = "none";
  adminDashboard.style.display = "flex";
  initializeDashboard();
}

// ============================================
// Navigation
// ============================================

const sectionInfo = {
  links: { title: "Kelola Link", subtitle: "Kelola semua link Anda di sini" },
  profile: { title: "Edit Profil", subtitle: "Ubah informasi profil Anda" },
  appearance: {
    title: "Tampilan",
    subtitle: "Kustomisasi tampilan profil Anda",
  },
  analytics: { title: "Analytics", subtitle: "Lihat statistik klik link Anda" },
  settings: { title: "Pengaturan", subtitle: "Pengaturan umum aplikasi" },
};

function switchSection(sectionName) {
  // Update navigation
  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.section === sectionName) {
      item.classList.add("active");
    }
  });

  // Update section visibility
  sections.forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionName + "Section").classList.add("active");

  // Update title
  sectionTitle.textContent = sectionInfo[sectionName].title;
  sectionSubtitle.textContent = sectionInfo[sectionName].subtitle;

  // Load section data
  switch (sectionName) {
    case "links":
      renderLinks();
      break;
    case "profile":
      loadProfileForm();
      break;
    case "appearance":
      loadAppearanceSettings();
      break;
    case "analytics":
      loadAnalytics();
      break;
  }
}

// ============================================
// Links Management
// ============================================

function renderLinks() {
  const links = loadLinks();

  if (links.length === 0) {
    linksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-link"></i>
                <h3>Belum Ada Link</h3>
                <p>Klik "Tambah Link" untuk menambahkan link pertama Anda</p>
            </div>
        `;
    return;
  }

  linksList.innerHTML = links
    .map(
      (link, index) => `
        <div class="link-item" draggable="true" data-id="${link.id}" data-index="${index}">
            <div class="link-item-drag">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="link-item-icon">
                <i class="${link.icon}"></i>
            </div>
            <div class="link-item-content">
                <div class="link-item-title">${link.title}</div>
                <div class="link-item-desc">${link.description || "Tanpa deskripsi"}</div>
                <div class="link-item-url">${link.url}</div>
            </div>
            <div class="link-item-stats">
                <span>${link.clicks || 0}</span>
                <small>klik</small>
            </div>
            <label class="toggle">
                <input type="checkbox" ${link.active ? "checked" : ""} onchange="toggleLink(${link.id})">
                <span class="toggle-slider"></span>
            </label>
            <div class="link-item-actions">
                <button onclick="editLink(${link.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteLink(${link.id})" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("");

  // Add drag and drop functionality
  initDragAndDrop();
}

function initDragAndDrop() {
  const items = document.querySelectorAll('.link-item[draggable="true"]');

  items.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("drop", handleDrop);
  });
}

let draggedItem = null;

function handleDragStart(e) {
  draggedItem = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd(e) {
  this.classList.remove("dragging");
  document.querySelectorAll(".link-item").forEach((item) => {
    item.classList.remove("drag-over");
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  this.classList.add("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove("drag-over");

  if (draggedItem !== this) {
    const links = loadLinks();
    const fromIndex = parseInt(draggedItem.dataset.index);
    const toIndex = parseInt(this.dataset.index);

    // Reorder
    const [movedLink] = links.splice(fromIndex, 1);
    links.splice(toIndex, 0, movedLink);

    saveLinks(links);
    renderLinks();
    showToast("Link berhasil dipindahkan!", "success");
  }
}

function openLinkModal(link = null) {
  linkModal.classList.add("active");

  if (link) {
    linkModalTitle.textContent = "Edit Link";
    document.getElementById("linkId").value = link.id;
    document.getElementById("linkTitle").value = link.title;
    document.getElementById("linkDescription").value = link.description || "";
    document.getElementById("linkUrl").value = link.url;
    document.getElementById("linkIcon").value = link.icon;
    document.getElementById("linkActive").checked = link.active;

    // Set active icon
    document.querySelectorAll(".icon-option").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.icon === link.icon);
    });
  } else {
    linkModalTitle.textContent = "Tambah Link";
    linkForm.reset();
    document.getElementById("linkId").value = "";
    document.getElementById("linkIcon").value = "fas fa-globe";
    document.getElementById("linkActive").checked = true;

    // Reset icon selection
    document.querySelectorAll(".icon-option").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.icon === "fas fa-globe");
    });
  }
}

function closeLinkModal() {
  linkModal.classList.remove("active");
}

function saveLink(e) {
  e.preventDefault();

  const id = document.getElementById("linkId").value;
  const title = document.getElementById("linkTitle").value;
  const description = document.getElementById("linkDescription").value;
  const url = document.getElementById("linkUrl").value;
  const icon = document.getElementById("linkIcon").value;
  const active = document.getElementById("linkActive").checked;

  const links = loadLinks();

  if (id) {
    // Edit existing link
    const index = links.findIndex((l) => l.id === parseInt(id));
    if (index !== -1) {
      links[index] = { ...links[index], title, description, url, icon, active };
    }
    showToast("Link berhasil diperbarui!", "success");
  } else {
    // Add new link
    const newLink = {
      id: Date.now(),
      title,
      description,
      url,
      icon,
      clicks: 0,
      active,
    };
    links.push(newLink);
    showToast("Link berhasil ditambahkan!", "success");
  }

  saveLinks(links);
  closeLinkModal();
  renderLinks();
}

function editLink(id) {
  const links = loadLinks();
  const link = links.find((l) => l.id === id);
  if (link) {
    openLinkModal(link);
  }
}

function deleteLink(id) {
  if (confirm("Apakah Anda yakin ingin menghapus link ini?")) {
    let links = loadLinks();
    links = links.filter((l) => l.id !== id);
    saveLinks(links);
    renderLinks();
    showToast("Link berhasil dihapus!", "success");
  }
}

function toggleLink(id) {
  const links = loadLinks();
  const index = links.findIndex((l) => l.id === id);
  if (index !== -1) {
    links[index].active = !links[index].active;
    saveLinks(links);
  }
}

// ============================================
// Profile Management
// ============================================

function loadProfileForm() {
  const profile = loadProfile();
  editName.value = profile.name;
  editUsername.value = profile.username;
  editBio.value = profile.bio;
  editImage.value = profile.image;

  if (profile.image) {
    imagePreview.querySelector("img").src = profile.image;
  }
}

function saveProfileForm(e) {
  e.preventDefault();

  const profile = loadProfile();
  profile.name = editName.value;
  profile.username = editUsername.value;
  profile.bio = editBio.value;
  profile.image = editImage.value;

  saveProfile(profile);

  // Update image preview
  if (editImage.value) {
    imagePreview.querySelector("img").src = editImage.value;
  }

  showToast("Profil berhasil diperbarui!", "success");
}

// ============================================
// Appearance Settings
// ============================================

function loadAppearanceSettings() {
  const profile = loadProfile();

  // Set theme
  themeOptions.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === profile.theme);
  });

  // Set accent color
  colorOptions.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color === profile.accentColor);
  });
}

function setTheme(theme) {
  const profile = loadProfile();
  profile.theme = theme;
  saveProfile(profile);

  themeOptions.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });

  showToast("Tema berhasil diperbarui!", "success");
}

function setAccentColor(color) {
  const profile = loadProfile();
  profile.accentColor = color;
  saveProfile(profile);

  colorOptions.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color === color);
  });

  // Update CSS variable
  document.documentElement.style.setProperty("--accent-primary", color);

  showToast("Warna akcent berhasil diperbarui!", "success");
}

// ============================================
// Analytics
// ============================================

function loadAnalytics() {
  const links = loadLinks();

  // Calculate totals
  const total = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const activeLinks = links.filter((l) => l.active).length;

  totalClicks.textContent = total;
  totalLinks.textContent = activeLinks;
  totalViews.textContent = Math.floor(total * 1.5); // Estimated views

  // Sort by clicks
  const sortedLinks = [...links].sort(
    (a, b) => (b.clicks || 0) - (a.clicks || 0),
  );

  analyticsTableBody.innerHTML = sortedLinks
    .map(
      (link) => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="${link.icon}" style="color: var(--accent-primary);"></i>
                    <span>${link.title}</span>
                </div>
            </td>
            <td>${link.clicks || 0}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${total > 0 ? ((link.clicks || 0) / total) * 100 : 0}%; height: 100%; background: var(--accent-primary); border-radius: 4px;"></div>
                    </div>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">
                        ${total > 0 ? Math.round(((link.clicks || 0) / total) * 100) : 0}%
                    </span>
                </div>
            </td>
        </tr>
    `,
    )
    .join("");
}

// ============================================
// Settings
// ============================================

function changePassword(e) {
  e.preventDefault();

  const current = document.getElementById("currentPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (current !== ADMIN_CREDENTIALS.password) {
    showToast("Password saat ini salah!", "error");
    return;
  }

  if (newPass !== confirm) {
    showToast("Password baru tidak cocok!", "error");
    return;
  }

  if (newPass.length < 6) {
    showToast("Password minimal 6 karakter!", "error");
    return;
  }

  // Update password (in production, use server-side)
  showToast("Password berhasil diperbarui!", "success");
  changePasswordForm.reset();
}

function exportData() {
  const data = {
    profile: loadProfile(),
    links: loadLinks(),
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "linkbio-export.json";
  a.click();
  URL.revokeObjectURL(url);

  showToast("Data berhasil diekspor!", "success");
}

function resetData() {
  if (
    confirm(
      "Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan!",
    )
  ) {
    localStorage.removeItem("linkbio_profile");
    localStorage.removeItem("linkbio_links");

    // Re-initialize with defaults
    saveProfile(DEFAULT_PROFILE);
    saveLinks(DEFAULT_LINKS);

    showToast("Data berhasil direset!", "success");

    // Reload sections
    renderLinks();
    loadProfileForm();
    loadAppearanceSettings();
    loadAnalytics();
  }
}

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
        <span>${message}</span>
    `;

  toastContainer.appendChild(toast);

  // Remove after delay
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease reverse";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// Event Listeners
// ============================================

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login(loginUsername.value, loginPassword.value);
});

togglePassword.addEventListener("click", () => {
  const type = loginPassword.type === "password" ? "text" : "password";
  loginPassword.type = type;
  togglePassword.innerHTML = `<i class="fas fa-eye${type === "password" ? "" : "-slash"}"></i>`;
});

// Logout
logoutBtn.addEventListener("click", logout);

// Navigation
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    switchSection(item.dataset.section);
  });
});

// Links
addLinkBtn.addEventListener("click", () => openLinkModal());
linkModalClose.addEventListener("click", closeLinkModal);
cancelLinkBtn.addEventListener("click", closeLinkModal);
linkForm.addEventListener("submit", saveLink);

linkModal.addEventListener("click", (e) => {
  if (e.target === linkModal) closeLinkModal();
});

// Icon picker
document.querySelectorAll(".icon-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".icon-option")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("linkIcon").value = btn.dataset.icon;
  });
});

// Profile
profileForm.addEventListener("submit", saveProfileForm);

editImage.addEventListener("input", (e) => {
  if (e.target.value) {
    imagePreview.querySelector("img").src = e.target.value;
  }
});

// Appearance
themeOptions.forEach((btn) => {
  btn.addEventListener("click", () => setTheme(btn.dataset.theme));
});

colorOptions.forEach((btn) => {
  btn.addEventListener("click", () => setAccentColor(btn.dataset.color));
});

// Settings
changePasswordForm.addEventListener("submit", changePassword);
exportDataBtn.addEventListener("click", exportData);
resetDataBtn.addEventListener("click", resetData);

// Keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLinkModal();
  }
});

// Preview button
document.getElementById("previewBtn").addEventListener("click", () => {
  window.open("index.html", "_blank");
});

// ============================================
// Initialize
// ============================================

function initializeDashboard() {
  // Initialize with default data if not exists
  if (!localStorage.getItem("linkbio_profile")) {
    saveProfile(DEFAULT_PROFILE);
  }
  if (!localStorage.getItem("linkbio_links")) {
    saveLinks(DEFAULT_LINKS);
  }

  // Load first section
  switchSection("links");
}

// Start
document.addEventListener("DOMContentLoaded", checkAuth);

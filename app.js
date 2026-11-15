const bookingForm = document.querySelector('#booking-form');
const bookingDate = document.querySelector('#date');
const bookingStatus = document.querySelector('#form-status');
const navToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
const setupSelect = document.querySelector('#setup');
const durationField = document.querySelector('#duration-field');
const durationSelect = document.querySelector('#duration');
const mobileBook = document.querySelector('.mobile-book');

function syncSessionDuration() {
  const isPool = setupSelect?.value === 'Pool table';
  if (durationField) durationField.hidden = isPool;
  if (durationSelect) {
    durationSelect.required = !isPool;
    if (isPool) durationSelect.value = '';
  }
}

setupSelect?.addEventListener('change', syncSessionDuration);
syncSessionDuration();

if (bookingDate) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  bookingDate.min = localToday;
}

const timeSelect = document.querySelector('#time');
if (timeSelect) {
  for (let minutes = 10 * 60; minutes <= 21 * 60 + 30; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, hour, minute));
    timeSelect.add(new Option(label, value));
  }
}

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const data = new FormData(bookingForm);
  const date = new Date(`${data.get('date')}T00:00:00`);
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
  const message = [
    'Hi Playz24! I would like to enquire about a gaming session.',
    `Setup: ${data.get('setup')}`,
    `Preferred day: ${formattedDate}`,
    `Preferred time: ${data.get('time')}`,
    `Session length: ${data.get('setup') === 'Pool table' ? 'Per set' : data.get('duration')}`,
    `Players: ${data.get('players')}`,
    'Could you please confirm availability and the current rate?'
  ].join('\n');
  const whatsappUrl = `https://wa.me/919699556578?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  bookingStatus.textContent = 'Your enquiry is ready in WhatsApp. Send the message there to reach the cafe team.';
});

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNav?.classList.toggle('open', !isOpen);
});

const bookingSubmit = bookingForm?.querySelector('button[type="submit"]');
const rateTable = document.querySelector('.rate-table-wrap');
if (mobileBook && bookingSubmit) {
  const syncMobileBook = () => {
    const submitBounds = bookingSubmit.getBoundingClientRect();
    const mobileBounds = mobileBook.getBoundingClientRect();
    const rateBounds = rateTable?.getBoundingClientRect();
    const submitVisible = submitBounds.bottom > 0 && submitBounds.top < window.innerHeight;
    const ratesObscured = rateBounds && rateBounds.bottom > mobileBounds.top && rateBounds.top < mobileBounds.bottom;
    mobileBook.classList.toggle('is-hidden', submitVisible || ratesObscured);
  };
  window.addEventListener('scroll', syncMobileBook, { passive: true });
  window.addEventListener('resize', syncMobileBook);
  syncMobileBook();
}

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && siteNav?.classList.contains('open')) {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.focus();
  }
});

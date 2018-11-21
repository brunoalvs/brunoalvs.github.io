function loading() {
  const el = document.getElementById('mainHeader');

  el.classList.add('loadDone');
  el.classList.remove('loading');
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    loading();
  }, 3000);
});

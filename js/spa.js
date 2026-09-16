// Aurelia global helpers
(function(){
  window.closeAllModals = function(){
    document.querySelectorAll('.modal-backdrop').forEach(function(x){
      x.classList.remove('open');
    });
    document.getElementById('drawerOverlay')?.classList.remove('open');
    document.querySelectorAll('.drawer').forEach(function(d){
      d.classList.remove('open');
    });
    document.getElementById('filters')?.classList.remove('open');
    document.querySelector('.catalog-layout')?.classList.remove('filters-open');
    document.getElementById('openFilters')?.classList.remove('active');
    document.getElementById('openFilters')?.setAttribute('aria-expanded','false');
    if(typeof window.setAureliaFiltersOpen==='function')window.setAureliaFiltersOpen(false);
  };
})();

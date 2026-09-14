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
  };
})();

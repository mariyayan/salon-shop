export function switchBtns(e, btnsContainer) {
    if (!e.target.classList.contains('nav-btn')) return;
    if (e.target.classList.contains('nav-btn-active')) return;
    btnsContainer.querySelector('.nav-btn-active').classList.remove('nav-btn-active');
    e.target.classList.add('nav-btn-active');
}


export function getTargetCategoryName(e) {
  let categoryName=e.target.getAttribute('id').match(/^\w+/).join('');
  return categoryName;
}

export function turnArrow(e) {

    if (e.target.closest('.nested-block') && !e.target.classList.contains('containing-block')) return;

    let arrowContainer = e.target.closest('.arrow-container');

    if (arrowContainer) {

        let arrow = arrowContainer.querySelector('.fa-angle-down');
        arrow.classList.contains('turn-arrow-up') ? arrow.classList.remove('turn-arrow-up') : arrow.classList.add('turn-arrow-up');

    }
}
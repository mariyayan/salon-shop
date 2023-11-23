export function showNestedBlock(e) {

    let containingBlock = e.target.closest('.containing-block');

    if (!containingBlock) return;


    let nestedBlock = containingBlock.querySelector('.nested-block');

    if (nestedBlock.classList.contains('show-element') && e.target.closest('.nested-block') === nestedBlock) {
    nestedBlock.classList.contains('show-element') ?
        nestedBlock.querySelectorAll('.show-element').length > 0 ?
        containingBlock.querySelectorAll('.show-element').forEach(element => element.classList.remove('show-element')) : nestedBlock.classList.remove('show-element') : nestedBlock.classList.add('show-element');

}
}
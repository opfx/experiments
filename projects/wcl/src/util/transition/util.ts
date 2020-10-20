export const getWxViewElement = (el: HTMLElement) => {
  if (el.classList.contains('wx-view')) {
    return el;
  }

  const wxView = el.querySelector(':scope > .wx-view, :scope > wx-nav, :scope > wx-tabs');
  if (wxView) {
    return wxView;
  }
  return el;
};

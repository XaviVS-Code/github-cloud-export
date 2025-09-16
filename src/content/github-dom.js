export function getToolbar(){
  return document.querySelector('div[data-view-component="true"].d-flex.gap-2') ||
         document.querySelector('.file-navigation .d-flex');
}

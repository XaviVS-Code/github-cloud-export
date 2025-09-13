chrome.contextMenus.create({
  id:'send-to-cloud',
  title:'Send to Cloud',
  contexts:['link','page']
});
chrome.contextMenus.onClicked.addListener(info=>{
  console.log('Sandbox context menu clicked',info);
});

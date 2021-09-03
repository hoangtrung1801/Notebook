const { ipcRenderer, contextBridge } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
  const title = document.querySelector('#title');
  const content = document.querySelector('#content'); 
  const saveBtn = document.querySelector("#save-btn");

  saveBtn.addEventListener('click', () => {
    ipcRenderer.invoke('page:put', {
      id: ipcRenderer.sendSync('pageActiveId:get'),
      title: title.textContent,
      content: content.value
    }).then((res) => {console.log(res)})
  })
  reload();
})

function reload() {
  console.log('reload');
  const title = document.querySelector('#title');
  const content = document.querySelector('#content'); 
  const pageNav = document.querySelector('#page-nav');

  const data = ipcRenderer.sendSync('getData');

  const pageActiveId = ipcRenderer.sendSync('pageActiveId:get');
  const pageActive = data.find(page => page.id === pageActiveId);
  
  // active : border-l-4 border-gray-500
  pageNav.innerHTML = '';
  data.forEach(page => {
    pageNav.innerHTML += `
      <div class="relative flex items-center hover:bg-gray-200 cursor-pointer page" >
          <span class="text-xl pl-4 ">${page.title}</span>
          <div class="absolute top-0 left-0 w-full h-full ${pageActiveId === page.id ? 'border-l-4 border-gray-500' : ''}" id='${page.id}'></div>
      </div>
    `
  });

  title.textContent = pageActive.title;
  content.value = pageActive.content; 

  loadEvent();
}

function loadEvent() {
  const pages = document.querySelectorAll(".page");

  let idCur = ipcRenderer.sendSync('pageActiveId:get');
  pages.forEach(page => {
    page.addEventListener('click', (e) => {
      idCur = e.target.id;
      ipcRenderer.send('pageActiveId:post', idCur);
      reload();
    })
  })
}
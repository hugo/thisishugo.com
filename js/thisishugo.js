for (const el of document.querySelectorAll('.email')) {
  const href = el.innerText.replace('[at]', '@').replace('[dot]', '.')
  const link = document.createElement('a')
  link.href = 'mailto:' + href
  link.innerHTML = href
  link.classList.add('email')
  el.parentNode.replaceChild(link, el)
}

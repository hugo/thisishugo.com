for (const el of document.querySelectorAll('.email-hugo')) {
  const link = document.createElement('a')
  link.href = 'mailto:hello@thisishugo.com'
  link.innerHTML = 'hello@thisishugo.com'
  el.parentNode.replaceChild(link, el)
}

const pathName = window.location.pathname
console.log(pathName)
$(`.nav-item a[href="${pathName}"]`).css("color", "#fff")

/* Handling cookies */

// Set a cookie
function setCookie(name, value, days)
{
    let expires = '';
    if (days)
    {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

// Get a cookie by name
function getCookie(name)
{
    const nameEQ = name + '=';
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies)
    {
        if (cookie.startsWith(nameEQ)) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

// Delete a cookie
function deleteCookie(name)
{
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

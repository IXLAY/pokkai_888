const showPopup = document.querySelector('.popup');
const popupContainer = document.querySelector('.popup-container');
const closePopup = document.querySelector('.close-popup');
const showContact = document.querySelector('.contact');
const contactContainer = document.querySelector('.contact-container');
const closeContact = document.querySelector('.close-contact');

showPopup.onclick = () => {
    popupContainer.classList.add('active');
}

closePopup.onclick = () => {
    popupContainer.classList.remove('active');
}

showContact.onclick = () => {
    contactContainer.classList.add('active');
}

closeContact.onclick = () => {
    contactContainer.classList.remove('active');
}

// const setting = document.querySelector('#setting-menu');
// const menu = document.querySelector('#menu');

// setting.addEventListener('click', () => {
//     menu.classList.toggle('hide')
// })

// document.addEventListener('click', e => {
//     if (menu.contains(e.target) && e.target !== setting) {
//         menu.classList.add('hide')
//     }
// })

//////////////////////////////////////////////////////////////////

// const showSetting = document.querySelector('.setting');
// const setting = document.querySelector('.dropdown-menu');
// const closeSetting = document.querySelector('.close-setting');

// showSetting.onclick =() => {
//     setting.classList.add('active');
// }

// closeSetting.onclick = () => {
//     setting.classList.remove('active');
// }
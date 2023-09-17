// open form model and close
let addNewBtn = document.querySelector(".addMember");
let closeFormBtn = document.querySelector(".addNewContact .close");
let formSection = document.querySelector(".form");
let contactForm = document.querySelector(".form .addNewContact");

addNewBtn.addEventListener('click', () => {
    formSection.classList.add("overlay");
    contactForm.style.display = "block";
});
closeFormBtn.addEventListener('click', () => {
    formSection.classList.remove("overlay");
    contactForm.style.display = "none";
});
// -----------------------------------------------------------//
// create array to store data
let saveData = localStorage.getItem("contact");
let contactList = JSON.parse(saveData || "[]");
// select the inputs of the form
let contactFormName = document.getElementById("contact_form_name");
let contactFormPhone = document.getElementById("contact_form_phone");
let contactFormEmail = document.getElementById("contact_form_email");
let contactFormAddress = document.getElementById("contact_form_address");
// get last id
let lastContactId = contactList.length;
// create a function to push new contact into the array
let newContact = () => {
    contactList.push({
        contactId: lastContactId += 1,
        contactName: contactFormName.value,
        contactPhone: contactFormPhone.value,
        contactEmail: contactFormEmail.value,
        contactAddress: contactFormAddress.value
    });
}
// create render function to show data in the table
let contactTableTbody = document.getElementById("tbody");
let renderContacts = () => {
    let tr = '';
    contactList.forEach(contact => {
        tr += `
            <tr data-id = ${contact.contactId}>
                <td>${contact.contactId}</td>
                <td>${contact.contactName}</td>
                <td>${contact.contactPhone}</td>
                <td>${contact.contactEmail}</td>
                <td>${contact.contactAddress}</td>
                <td class="green">Edit</td>
                <td class="red">Delete</td>
            </tr>
        `
    });
    contactTableTbody.innerHTML = tr;
}
// intial start of web page
renderContacts();
// reset value function 
let resetValue = () => {
    contactFormName.value = '';
    contactFormPhone.value = '';
    contactFormEmail.value = '';
    contactFormAddress.value = '';
};
// handel save btn listener
let saveBtn = document.querySelector(".save");
// add new contact handler
let saveBtnHandler = () => {
    newContact();
    localStorage.setItem("contact", JSON.stringify(contactList));
    resetValue();
    renderContacts();
    formSection.classList.remove("overlay");
    contactForm.style.display = "none";
};
saveBtn.addEventListener('click', saveBtnHandler);
// logic to handel edit and delete
contactTableTbody.addEventListener('click', e => {
    if (e.target.classList.contains("green")) {
        let tr = e.target.parentElement;
        let id = tr.dataset.id;
        let index = parseInt(id) - 1;
        //get values from array into the input values
        contactFormName.value = contactList[index].contactName;
        contactFormPhone.value = contactList[index].contactPhone;
        contactFormEmail.value = contactList[index].contactEmail;
        contactFormAddress.value = contactList[index].contactAddress;
        //open form with overlay
        formSection.classList.add("overlay");
        contactForm.style.display = "block";
        // update handler
        let updateHandler = () => {
            // new object with modified data
            let updatedContact = {
                contactId: parseInt(id),
                contactName: contactFormName.value,
                contactPhone: contactFormPhone.value,
                contactEmail: contactFormEmail.value,
                contactAddress: contactFormAddress.value
            }
            // change the old object with new object
            contactList[index] = updatedContact;
            localStorage.setItem("contact", JSON.stringify(contactList));
            // close overlay and hide form
            formSection.classList.remove("overlay");
            contactForm.style.display = "none";
            // reset data
            resetValue();
            // display (render data)
            renderContacts();
            // listener hander
            saveBtn.removeEventListener('click', updateHandler);
            saveBtn.addEventListener('click', saveBtnHandler)
        }
        saveBtn.removeEventListener('click', saveBtnHandler);
        saveBtn.addEventListener('click', updateHandler);
    }
    // **********DELETE***********
    if (e.target.classList.contains("red")) {
        let tr = e.target.parentElement;
        let id = tr.dataset.id;
        let index = parseInt(id) - 1;
        contactList.splice(index, 1);
        localStorage.setItem("contact", JSON.stringify(contactList));
        renderContacts();
    }
});
// search logic
let searchInput = document.getElementById("search");
let form = searchInput.parentElement;
let trs = document.querySelectorAll('tbody tr');
form.addEventListener('submit', e => e.preventDefault());
searchInput.addEventListener('keyup', () => {
    let searchInputValue = searchInput.value.toLowerCase();
    trs.forEach(tr => {
        trName = tr.children[1].textContent.toLowerCase();
        if (trName.includes(searchInputValue)) {
            tr.style.display = "";
        } else {
            tr.style.display = "none";
        }
    })
});
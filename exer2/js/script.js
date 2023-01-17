const url = 'https://randomuser.me/api/?results=150';
const promise = fetch(url).then(results => results.json()); // fetch 150 user data from randomuser api

const startPage = 1;
let contact_list_count = 0;
let contact_per_page = 0;
const min_contact_list_count = 1;
const max_contact_list_count = 150;


updateContactList();


/* Function to render contacts per page */
function renderContactItems(pageNum) {
    const list = document.getElementsByTagName('ul')[0];
    list.innerHTML = "";
    let lb = (pageNum - 1) * contact_per_page;
    let ub = lb + contact_per_page;
    promise.then(contacts => {
        for (let c = lb; c < Math.min(ub, contact_list_count); c++) {
            let li = `<li class="contact-item cf">
            <div class="contact-details">
                <img class="avatar" src="${contacts.results[c].picture.thumbnail}">
                <h3>${contacts.results[c].name.first} ${contacts.results[c].name.last}</h3>
                <span class="email">${contacts.results[c].email}</span>
            </div>
            <div class="joined-details">
                <span class="date">Joined ${contacts.results[c].registered.date}</span>
        </div>
        </li>`
            list.innerHTML += li;
        }
    });
}

/* Function to display total contacts requested by user and displayed across pages */
function renderTotal(count) {
    const total = document.querySelector('.page-header > h3');
    total.innerText = `Total: ${count}`;
}

/* Function to dynamically increase or decrease page numbers based on total contact count
** and contacts to display per page. Creates an a tag within li tag and appends to ul.
*/
function renderPagination(count) {
    let pages_count = Math.ceil(count / contact_per_page);
    let target = document.getElementsByClassName('pagination')[0];
    target.innerHTML = "";
    for (let p = 1; p <= pages_count; p++) {
        let li = `<li><a href="#" onclick="renderContactItems(${p})">${p}</a></li>`
        target.innerHTML += li;
    }
    return pages_count;
}

/* Function to update the count of contacts to be displayed based on input from user
** Min - 1 Max - 150
** Function calls update to total, pagination and contact items on first page.
*/
function updateContactList() {
    let cl_count = document.getElementById('contactCount').value;
    let cl_per_page_count = document.getElementById('contactPerSlide').value;
    if (isNaN(cl_count)) return;
    if (cl_count > max_contact_list_count) {
        cl_count = max_contact_list_count;
        document.getElementById('contactCount').value = max_contact_list_count;
    }
    else if (cl_count < min_contact_list_count) {
        cl_count = min_contact_list_count;
        document.getElementById('contactCount').value = min_contact_list_count;
    }

    contact_list_count = parseInt(cl_count);
    contact_per_page = parseInt(cl_per_page_count);
    renderTotal(contact_list_count);
    renderPagination(contact_list_count);
    renderContactItems(startPage);
}

/* Function called when there is a change in contacts to display per page
** from user.
*/
function renderPage(select) {
    contact_per_page = parseInt(select.value);
    renderPagination(contact_list_count)
    renderContactItems(startPage);
}
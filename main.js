//=============== Khai báo biến =====================
const loginModal = document.querySelector('.staff__logIn');
const loginModalButton = document.querySelector('#loginModalButton');
const closeModalButton = document.querySelector('#closeModalButton');
const addStaffButton = document.querySelector('#addStaffButton');
const form = document.querySelector('.modal__form');
const staffID = document.querySelector('#staffID');
const staffName = document.querySelector('#staffName');
const staffEmail = document.querySelector('#staffEmail');
const staffPass = document.querySelector('#staffPass');
const staffBirthday = document.querySelector('#staffDate');
const staffOffice = document.querySelector('#staffOffice');
const fillterNameInput = document.querySelector('#fillterNameInput');
const searchStaffButton = document.querySelector('#searchStaffButton');
const staffTable = document.querySelector('.staff__table');

//==============  Constructor function staffList =================

function StaffList() {
    this.staff = [];

    this.addStaffMethod = function (staffObj) {
        this.staff.push(staffObj);
    }

    this.findIndexMethod = function (token) {
        let indexStaff = -1;
        this.staff.forEach(function (staff, index) {
            if (staff.token === token) {
                indexStaff = index;
            }
        })
        return indexStaff;
    }

    this.deleteStaffMethod = function (token) {
        let indexStaff = this.findIndexMethod(token);
        this.staff.splice(indexStaff, 1);
    }

    this.editStaffMethod = function (indexStaff) {
        this.staff[indexStaff].id = staffID.value
        this.staff[indexStaff].name = staffName.value
        this.staff[indexStaff].email = staffEmail.value
        this.staff[indexStaff].password = staffPass.value
        this.staff[indexStaff].birthday = staffBirthday.value
        this.staff[indexStaff].office = staffOffice.value
    }
}

// ============== Constructor function staffItems ================

function StaffItem(id, name, email, password, birthday, office, token) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.birthday = birthday;
    this.office = office;
    this.token = token;
}

const staffList = new StaffList();
let editFlagger = false;
let editToken = '';

// ========= Local Storage ==========

function setLocalStorage(arr) {
    localStorage.setItem('StaffList', JSON.stringify(arr));
}

function getLocalStorage() {
    staffList.staff = localStorage.getItem('StaffList') ? JSON.parse(localStorage.getItem('StaffList')) : [];
    displayStaff();
}

// =========== CALL FUNCTION ===================

getLocalStorage();

addStaffButton.addEventListener('click', function () {
    !editFlagger ? addStaff() : editStaff();

})

loginModalButton.addEventListener('click', function () {
    editFlagger = false;
    openModal();
});

searchStaffButton.addEventListener('click', function () {
    searchStaff();
});

closeModalButton.addEventListener('click', closeModal);

// ========== Function ==========

function addStaff() {
    let token = new Date().getTime().toString();
    let item = new StaffItem(staffID.value, staffName.value, staffEmail.value, staffPass.value, staffBirthday.value, staffOffice.value, token);

    staffList.addStaffMethod(item);
    setLocalStorage(staffList.staff);
    form.reset();
    closeModal();
    displayStaff();
}

function displayStaff() {
    let content = `
                <tr class="text-blue-600">
                    <th>
                        Mã nhân viên
                        <i class="fa-solid fa-arrow-up px-1 text-sm"></i>
                    </th>
                    <th>Họ và tên nhân viên</th>
                    <th>Email</th>
                    <th>Ngày sinh</th>
                    <th>Chức vụ</th>
                    <th><i class="fa-solid fa-gear"></i></th>
                </tr>
    `;

    staffList.staff.forEach(function (staff) {
        content += `
                <tr>
                    <td>${staff.id}</td>
                    <td>${staff.name}</td>
                    <td>${staff.email}</td>
                    <td>${staff.birthday}</td>
                    <td>${staff.office}</td>
                    <td>
                        <button onclick="getStaff('${staff.token}');"
                            class="py-2 px-4 bg-teal-600 rounded-lg text-white hover:bg-teal-500 transition">Edit</button>
                        <button onclick="deleteStaff('${staff.token}');"
                            class="py-2 px-4 bg-red-600 rounded-lg text-white hover:bg-red-500 transition">Delete</button>
                    </td>
                </tr>
        `
    });

    staffTable.innerHTML = content;
}

function deleteStaff(token) {
    staffList.deleteStaffMethod(token);
    setLocalStorage(staffList.staff);
    displayStaff();
}

function getStaff(token) {
    let indexEdit = staffList.findIndexMethod(token);
    staffID.value = staffList.staff[indexEdit].id;
    staffName.value = staffList.staff[indexEdit].name;
    staffEmail.value = staffList.staff[indexEdit].email;
    staffPass.value = staffList.staff[indexEdit].password;
    staffBirthday.value = staffList.staff[indexEdit].birthday;
    staffOffice.value = staffList.staff[indexEdit].office;

    editFlagger = true;
    editToken = indexEdit;
    openModal();
}

function editStaff() {
    staffList.editStaffMethod(editToken);
    setLocalStorage(staffList.staff);
    displayStaff();
    closeModal();
}

function closeModal() {
    loginModal.classList.remove('staff__logIn--active');
}

function openModal() {
    loginModal.classList.add('staff__logIn--active');
    if (editFlagger) {
        addStaffButton.innerHTML = 'Chỉnh sửa';
    }
    else {
        form.reset();
        addStaffButton.innerHTML = 'Thêm thành viên';
    }
}

function searchStaff() {
    let index = staffList.staff.findIndex(function (staff) {
        return staff.name === fillterNameInput.value.trim();
    });

    if (index !== -1) {
        staffTable.innerHTML = `
        <tr>
            <td>${staffList.staff[index].id}</td>
            <td>${staffList.staff[index].name}</td>
            <td>${staffList.staff[index].email}</td>
            <td>${staffList.staff[index].birthday}</td>
            <td>${staffList.staff[index].office}</td>
            <td>
                <button onclick="getStaff('${staffList.staff[index].token}');"
                    class="py-2 px-4 bg-teal-600 rounded-lg text-white hover:bg-teal-500 transition">Edit</button>
                <button onclick="deleteStaff('${staffList.staff[index].token}');"
                    class="py-2 px-4 bg-red-600 rounded-lg text-white hover:bg-red-500 transition">Delete</button>
            </td>
        </tr>`;
    }
}






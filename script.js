function textYear(yearsOld) {
  let txt;
  count = yearsOld % 100;
  if (count >= 5 && count <= 20) {
    txt = "лет";
  } else {
    count = count % 10;
    if (count == 1) {
      txt = "год";
    } else if (count >= 2 && count <= 4) {
      txt = "года";
    } else {
      txt = "лет";
    }
  }
  return txt;
}

const addButton = document.querySelector(".add__btn");
const findButton = document.querySelector(".find__btn");
const addForm = document.querySelector(".add-form");
const searchForm = document.querySelector(".search-form");
const submitButton = document.querySelector(".submit__btn");

const tableStudents = document.querySelector(".section-table");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  getFillForm();
  createListStudents();
  getValidation();
  if (submitButton.disabled !== true) {
    getFillForm().studentData.classList.add("js-is-active");
    document.querySelector(".section-main").style.filter = "blur(2px)";
  } else {
    getFillForm().studentData.classList.remove("js-is-active");
  }
});

findButton.addEventListener("click", () => {
  searchForm.classList.add("js-is-active");
  findButton.style.transform = "scale(0.98)";
  addButton.style.transform = "scale(1)";
  findButton.disabled = true;
  addButton.disabled = false;

  addForm.classList.remove("js-is-active");

  tableStudents.classList.add("js-is-active");
});

addButton.addEventListener("click", () => {
  addForm.classList.add("js-is-active");
  findButton.style.transform = "scale(1)";
  addButton.style.transform = "scale(0.98)";
  addButton.disabled = true;
  findButton.disabled = false;

  searchForm.classList.remove("js-is-active");
  tableStudents.classList.remove("js-is-active");
  alertSearch.classList.remove("js-is-active");
});

function getFillForm() {
  const inputField = document.querySelectorAll(".add-form__input");

  const surnameStudent = document.getElementById("surname");
  const firstnameStudent = document.getElementById("name");
  const secondnameStudent = document.getElementById("middlename");
  const birthDateStudent = document.getElementById("birthdate");
  const yearAdmissionStudent = document.getElementById("year-of-admission");
  const facultyStudent = document.getElementById("faculty");

  const dataСhecking = document.querySelector(".data-checking");
  const studentData = document.querySelector(".verify-modal");

  let surname = upperFirstLetter(surnameStudent.value);
  let firstname = upperFirstLetter(firstnameStudent.value);
  let secondname = upperFirstLetter(secondnameStudent.value);
  let birthDate = new Date(birthDateStudent.value).getTime();

  let age = getAge(birthDateStudent.value);
  let course = getYearOfAdmission(yearAdmissionStudent.value).course;
  let faculty = facultyStudent.options[facultyStudent.selectedIndex].text;


  function upperFirstLetter(str) {
    if (str == "") return str;
    let strFirst = str.toLowerCase().trim();
    let strSecond = strFirst[0].toUpperCase() + strFirst.slice(1);
    return strSecond;
  }

  function getAge(birthDateStudent) {
    let born = new Date(birthDateStudent);
    let today = new Date();
    let age = today.getFullYear() - born.getFullYear();
    if (
      today.getMonth() < born.getMonth() ||
      (today.getMonth() == born.getMonth() && today.getDate() < born.getDate())
    ) {
      age--;
    }
    return age;
  }

  function getYearOfAdmission(yearAdmissionStudent) {
    let yearAdmission = new Date(yearAdmissionStudent);
    let today = new Date();
    let dateAdmission = yearAdmission
      .toLocaleString("ru", { year: "numeric" })
      .replace(" г.", "");

    let graduation = yearAdmission.getFullYear() + 4;
    let course = today.getFullYear() - yearAdmission.getFullYear();

    if (
      today.getMonth() < 8 &&
      today.getFullYear() - yearAdmission.getFullYear() <= 4
    ) {
      course =
        dateAdmission +
        " " +
        "-" +
        " " +
        graduation +
        " (" +
        course +
        " " +
        "курс)";
    } else {
      course =
        dateAdmission +
        " " +
        "-" +
        " " +
        graduation +
        " " +
        "(Обучение закончено)";
    }
    return {
      course,
      dateAdmission,
      graduation,
    };
  }

  let graduation = getYearOfAdmission(yearAdmissionStudent.value).graduation;
  let dateAdmission = getYearOfAdmission(
    yearAdmissionStudent.value
  ).dateAdmission;
  let birthDateString = new Date(birthDateStudent.value).toLocaleDateString(
    "ru-RU",
    { year: "numeric", month: "long", day: "numeric" }
  );

  dataСhecking.innerHTML = `<strong>Фамилия:</strong> ${surname}, <br>
    <strong>Имя:</strong> ${firstname}, <br>
    <strong>Отчество:</strong> ${secondname}, <br>
    <strong>Дата рождения:</strong> ${birthDateString}, <br>
    <strong>Возраст:</strong> ${age} ${textYear(age)}, <br>
    <strong>Годы обучения:</strong> ${course}, <br>
    <strong>Факультет:</strong> ${faculty}.`;

  return {
    surnameStudent,
    firstnameStudent,
    secondnameStudent,
    birthDateStudent,
    surname,
    firstname,
    secondname,
    age,
    dateAdmission,
    course,
    faculty,
    studentData,
    dataСhecking,
    inputField,
    graduation,
    birthDate,
  };
}

function getItemsData() {
  let students = JSON.parse(localStorage.getItem("Студенты"));
  if (students == undefined) {
    students = [];
  }

  return students;
}

function createListStudents() {
  let fillForm = getFillForm();
  let students = getItemsData();
  const acceptButton = document.querySelector(".accept__btn");
  const returnButton = document.querySelector(".return__btn");

  acceptButton.addEventListener("click", () => {
    let oneStudent = {};
    oneStudent["student"] =
      fillForm.surname + " " + fillForm.firstname + " " + fillForm.secondname;
    oneStudent["birthDate"] = fillForm.birthDate;
    oneStudent["age"] = "(" + fillForm.age + " " + textYear(fillForm.age) + ")";
    oneStudent["yearFinish"] = fillForm.graduation;
    oneStudent["yearStart"] = fillForm.dateAdmission;
    oneStudent["course"] = fillForm.course;
    oneStudent["faculty"] = fillForm.faculty;

    students.push(oneStudent);

    localStorage.setItem("Студенты", JSON.stringify(students));

    addForm.classList.remove("js-is-active");
    tableStudents.classList.add("js-is-active");
    addButton.style.display = "inline-block";
    submitButton.disabled = false;
    fillForm.studentData.classList.remove("js-is-active");
    fillForm.inputField.forEach((elem) => {
      elem.value = "";
    });

    createTable();

    tableStudents.classList.add("js-is-active");
    addButton.style.transform = "scale(1)";
    document.querySelector(".section-main").style.filter = "blur(0)";
  });

  returnButton.addEventListener("click", () => {
    submitButton.disabled = false;
    fillForm.studentData.classList.remove("js-is-active");
    document.querySelector(".section-main").style.filter = "blur(0)";
  });
}

function getValidation() {
  let fillForm = getFillForm();

  fillForm.inputField.forEach((elem) => {
    valid(elem);
    elem.addEventListener("input", () => {
      valid(elem);
    });
  });

  function valid(elem) {
    if (elem.value === "") {
      elem.classList.add("is-invalid");
      elem.nextElementSibling.textContent =
        "Это поле обязательно для заполнения";
      submitButton.disabled = true;
    } else {
      elem.classList.remove("is-invalid");
      elem.nextElementSibling.textContent = "";
      submitButton.disabled = false;
    }

    if (elem.type === "text") {
      if (!elem.value.trim().match(/^[А-Яа-я]+$/) && elem.value !== "") {
        elem.classList.add("is-invalid");
        elem.nextElementSibling.textContent =
          "Доступны только буквы русского алфавита";
        elem.value = "";
        submitButton.disabled = true;
      }
    }

    if (elem.type === "tel") {
      const now = new Date();
      if (!elem.value.trim().match(/^[0-9]+$/) && elem.value !== "") {
        elem.classList.add("is-invalid");
        elem.nextElementSibling.textContent = "Для ввода доступны только цифры";
        elem.value = "";
        submitButton.disabled = true;
      }
      if (elem.value > now.getFullYear()) {
        elem.classList.add("is-invalid");
        elem.nextElementSibling.textContent = "Введите корректный год";
        submitButton.disabled = true;
      }
    }

    if (elem.type === "date") {
      const now = new Date();
      const inputDate = elem.value.split("-");
      const inputYear = inputDate[0];
      if (inputYear >= now.getFullYear() - 15) {
        elem.classList.add("is-invalid");
        elem.nextElementSibling.textContent = "Введите корректную дату";
        submitButton.disabled = true;
      }
    }
  }
}

function createTable() {
  let students = getItemsData();
  const table = document.getElementById("table-body");
  table.innerText = "";

  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  for (const key of students) {
    let birthDate = new Date(key.birthDate).toLocaleString("ru-RU", options);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    const text1 = document.createTextNode(key.student);
    const text2 = document.createTextNode(key.faculty);
    const text3 = document.createTextNode(birthDate + " " + key.age);
    const text4 = document.createTextNode(key.course);

    td3.setAttribute("data-birth", key.birthDate);
    td4.setAttribute("data-admission", key.yearStart);
    td4.setAttribute("data-graduation", key.yearFinish);

    const tr = document.createElement("tr");

    td1.append(text1);
    td2.append(text2);
    td3.append(text3);
    td4.append(text4);
    tr.append(td1, td2, td3, td4);

    table.append(tr);
  }
}

createTable();

const table = document.getElementById("sortable");
const headers = table.querySelectorAll("th");

const directions = Array.from(headers).map((header) => {
  return "";
});

function transform(index, cell) {
  const type = headers[index].getAttribute("data-name");
  if (type === "age") {
    return cell.getAttribute("data-birth") / 10000;
  }
  if (type === "year of study") {
    return parseFloat(cell.innerHTML);
  } else {
    return cell.innerHTML;
  }
}

function sortColumn(index) {
  const tableBody = table.querySelector("tbody");
  const rows = tableBody.querySelectorAll("tr");
  const direction = directions[index] || "asc";
  const multiplier = direction === "asc" ? 1 : -1;
  const newRows = Array.from(rows);
  newRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll("td")[index];
    const cellB = rowB.querySelectorAll("td")[index];
    const a = transform(index, cellA);
    const b = transform(index, cellB);
    if (a > b) {
      return 1 * multiplier;
    }
    if (a < b) {
      return -1 * multiplier;
    }
    if (a === b) {
      return 0;
    }
  });

  directions[index] = direction === "asc" ? "desc" : "asc";

  rows.forEach((row) => {
    tableBody.removeChild(row);
  });

  newRows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
}

headers.forEach((header, index) => {
  header.addEventListener("click", () => {
    sortColumn(index);
  });
});

const searchButton = document.querySelector(".search__btn");
const alertSearch = document.querySelector(".search-alert");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  tableSearch();
});

function tableSearch() {
  const table = document.getElementById("sortable");
  const searchFullName = document.getElementById("search-fullname");
  const searchFaculty = document.getElementById("search-faculty");
  const searchYearOfAdmission = document.getElementById(
    "search-year-of-admission"
  );
  const searchYearOfGraduation = document.getElementById(
    "search-year-of-graduation"
  );

  let searchInp = document.querySelectorAll(".form-control");

  let searchFullNamePhrase = new RegExp(searchFullName.value, "i");
  let searchFacultyPhrase = new RegExp(searchFaculty.value, "i");
  let searchYearOfAdmissionPhrase = searchYearOfAdmission.value;
  let searchYearOfGraduationPhrase = searchYearOfGraduation.value;
  let hiddeRows = 0;

  for (let i = 1; i < table.rows.length; i++) {
    let isFound = false;

    const regFullNameText = table.rows[i].cells[0].innerHTML;
    const regFacultyText = table.rows[i].cells[1].innerHTML;
    const regYearOfAdmissionText =
      table.rows[i].cells[3].getAttribute("data-admission");
    const regYearOfGraduationText =
      table.rows[i].cells[3].getAttribute("data-graduation");
    isFound =
      (searchFullName.value == "" ||
        searchFullNamePhrase.test(regFullNameText)) &&
      (searchFaculty.value == "" || searchFacultyPhrase.test(regFacultyText)) &&
      (searchYearOfAdmission.value == "" ||
        searchYearOfAdmissionPhrase === regYearOfAdmissionText) &&
      (searchYearOfGraduation.value == "" ||
        searchYearOfGraduationPhrase === regYearOfGraduationText);

    if (isFound) {
      table.rows[i].style.display = "";
    } else {
      table.rows[i].style.display = "none";
      if (table.rows[i].style.display == "none") hiddeRows++;
      if (table.rows.length - 1 == hiddeRows) {
        alertSearch.classList.add("js-is-active");
        tableStudents.classList.remove("js-is-active");

        createTable();
      }
    }
    searchInp.forEach((inp) => {
      inp.addEventListener("input", () => {
        alertSearch.classList.remove("js-is-active");
        tableStudents.classList.add("js-is-active");
      });
    });
  }
}

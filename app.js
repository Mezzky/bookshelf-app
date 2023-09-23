// Mendapatkan elemen-elemen DOM yang dibutuhkan
const bookForm = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const statusInput = document.getElementById("status");
const yearInput = document.getElementById("year"); // Menambahkan elemen input tahun
const listBelumSelesai = document.getElementById("list-belum-selesai");
const listSelesai = document.getElementById("list-selesai");

// Fungsi untuk membuat elemen buku baru
function createBookElement(id, title, author, status, year) {
  const bookItem = document.createElement("li");
  bookItem.className = "book-item";

  const bookInfo = document.createElement("div");
  bookInfo.className = "book-info";
  bookInfo.innerHTML = `
      <h3>${title}</h3>
      <p>Penulis: ${author}</p>
      <p>Tahun Terbit: ${year}</p> <!-- Menampilkan tahun terbit -->
  `;

  const actionButtons = document.createElement("div");
  actionButtons.className = "action-buttons";
  
  // Tambahkan kelas dan label tombol "Pindahkan" sesuai dengan status buku
  const moveButton = document.createElement("button");
  moveButton.className = "move-button";
  moveButton.onclick = function () {
      moveBook(this);
  };
  if (status === "selesai") {
      moveButton.textContent = "Sudah Dibaca";
      moveButton.classList.add("blue-button");
  } else {
      moveButton.textContent = "Belum Dibaca";
      moveButton.classList.add("green-button");
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.onclick = function () {
      deleteBook(this);
  };
  deleteButton.textContent = "Hapus";

  actionButtons.appendChild(moveButton);
  actionButtons.appendChild(deleteButton);

  bookItem.appendChild(bookInfo);
  bookItem.appendChild(actionButtons);

  if (status === "belum-selesai") {
      listBelumSelesai.appendChild(bookItem);
  } else {
      listSelesai.appendChild(bookItem);
  }
}

// Fungsi untuk menghasilkan ID acak
function generateRandomId() {
  return Math.floor(Math.random() * 1000000); // Ubah rentang sesuai kebutuhan Anda
}

// Fungsi untuk menambahkan buku ke rak buku
function addBook(event) {
  event.preventDefault();

  const id = generateRandomId(); // Generate ID acak
  const title = titleInput.value;
  const author = authorInput.value;
  const status = statusInput.value;
  const year = yearInput.value; // Ambil nilai tahun

  if (title === "" || author === "" || year === "") {
      alert("Judul, penulis, dan tahun buku harus diisi.");
      return;
  }

  createBookElement(id, title, author, status, year); // Menambahkan ID dan tahun ke dalam fungsi ini

  // Simpan data buku ke localStorage
  const bookData = {
      id, // Simpan ID
      title,
      author,
      status,
      year // Simpan tahun
  };

  let savedBooks = JSON.parse(localStorage.getItem("books")) || [];
  savedBooks.push(bookData);
  localStorage.setItem("books", JSON.stringify(savedBooks));

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = ""; // Reset input tahun

  // Ubah label pada tombol "Pindahkan" sesuai dengan status buku yang baru ditambahkan
  const buttons = document.querySelectorAll(".move-button");
  buttons.forEach(button => {
      if (status === "selesai") {
          button.textContent = "Sudah Dibaca";
          button.classList.add("blue-button");
      } else {
          button.textContent = "Belum Dibaca";
          button.classList.add("green-button");
      }
  });
}

// Fungsi untuk mengambil data buku dari localStorage saat aplikasi dimuat
function loadBooks() {
  const savedBooks = JSON.parse(localStorage.getItem("books"));

  if (savedBooks) {
    savedBooks.forEach(bookData => {
      createBookElement(
        bookData.id, // Tambahkan ID
        bookData.title,
        bookData.author,
        bookData.status,
        bookData.year // Tambahkan tahun
      );

      // Perbarui label dan warna tombol "Pindahkan" saat buku dibaca
      const bookItem = document.querySelector(".book-item:last-child"); // Ambil buku yang baru saja ditambahkan
      const moveButton = bookItem.querySelector(".move-button");
      if (bookData.status === "selesai") {
        moveButton.textContent = "Sudah Dibaca";
        moveButton.classList.add("blue-button");
      } else {
        moveButton.textContent = "Belum Dibaca";
        moveButton.classList.add("green-button");
      }
    });
  }
}

// Memanggil fungsi loadBooks saat aplikasi dimuat
loadBooks();

// Menambahkan event listener ke form untuk menambahkan buku
bookForm.addEventListener("submit", addBook);

// Fungsi untuk memindahkan buku antar rak
function moveBook(button) {
  const bookItem = button.parentElement.parentElement;
  const currentShelf = bookItem.parentElement;
  const isBelumSelesai = currentShelf === listBelumSelesai;

  // Ubah status buku
  const newStatus = isBelumSelesai ? "selesai" : "belum-selesai";

  // Perbarui data buku di localStorage
  const bookTitle = bookItem.querySelector("h3").textContent;
  const savedBooks = JSON.parse(localStorage.getItem("books"));

  const updatedBooks = savedBooks.map(book => {
      if (book.title === bookTitle) {
          book.status = newStatus;
      }
      return book;
  });

  localStorage.setItem("books", JSON.stringify(updatedBooks));

  // Ubah label pada tombol "Pindahkan" sesuai dengan status buku
  button.textContent = newStatus === "selesai" ? "Sudah Dibaca" : "Belum Dibaca";

  // Ubah warna tombol berdasarkan status buku
  button.classList.toggle("blue-button", newStatus === "selesai");
  button.classList.toggle("green-button", newStatus === "belum-selesai");

  // Pindahkan buku ke rak yang sesuai
  if (isBelumSelesai) {
      listSelesai.appendChild(bookItem);
  } else {
      listBelumSelesai.appendChild(bookItem);
  }
}

// Fungsi untuk menghapus buku
function deleteBook(button) {
  const bookItem = button.parentElement.parentElement;
  bookItem.remove();

  const bookTitle = bookItem.querySelector("h3").textContent;
  const savedBooks = JSON.parse(localStorage.getItem("books"));
  const updatedBooks = savedBooks.filter(book => book.title !== bookTitle);
  localStorage.setItem("books", JSON.stringify(updatedBooks));
}

// Fungsi untuk melakukan pencarian buku berdasarkan judul, penulis, atau tahun
function searchBooks() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const bookItems = document.querySelectorAll(".book-item");

  bookItems.forEach(bookItem => {
    const bookTitle = bookItem.querySelector("h3").textContent.toLowerCase();
    const bookAuthor = bookItem.querySelector("p").textContent.toLowerCase();
    const bookYear = bookItem.querySelector("p:last-child").textContent.toLowerCase(); // Ambil tahun

    // Periksa apakah judul, penulis, atau tahun buku cocok dengan kata kunci pencarian
    if (
      bookTitle.includes(searchTerm) ||
      bookAuthor.includes(searchTerm) ||
      bookYear.includes(searchTerm) // Periksa tahun juga
    ) {
      bookItem.style.display = ""; // Tampilkan buku jika cocok
    } else {
      bookItem.style.display = "none"; // Sembunyikan buku jika tidak cocok
    }
  });
}


// Tambahkan event listener untuk memanggil fungsi searchBooks() saat input berubah
document.getElementById("search").addEventListener("input", searchBooks);

// End of JavaScript code
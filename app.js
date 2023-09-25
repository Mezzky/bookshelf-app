// Mendapatkan elemen-elemen DOM yang dibutuhkan
const bookForm = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const yearInput = document.getElementById("year");
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
  
  // Tambahkan kelas dan label tombol sesuai dengan status buku
  const moveButton = document.createElement("button");
  moveButton.className = "move-button";
  moveButton.onclick = function () {
      moveBook(this);
  };
  if (status) {
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

  if (status) {
      listSelesai.appendChild(bookItem);
  } else {
      listBelumSelesai.appendChild(bookItem);
  }
}

// Fungsi untuk menghasilkan ID unik berdasarkan timestamp
function generateUniqueId() {
  return +new Date(); // Menggunakan nilai timestamp sebagai ID
}

// Fungsi untuk menambahkan buku ke rak buku
function addBook(event) {
  event.preventDefault();

  const id = generateUniqueId(); 
  const title = titleInput.value;
  const author = authorInput.value;
  const year = yearInput.value;

  if (title === "" || author === "" || isNaN(year)) {
      alert("Judul, penulis, dan tahun buku harus diisi dan tahun harus berupa angka.");
      return;
  }

  let status = false; // Status awal, belum dibaca

  createBookElement(id, title, author, status, year);

  // Simpan data buku ke localStorage
  const bookData = {
      id,
      title,
      author,
      status,
      year
  };

  let savedBooks = JSON.parse(localStorage.getItem("books")) || [];
  savedBooks.push(bookData);
  localStorage.setItem("books", JSON.stringify(savedBooks));

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
}

// Fungsi untuk mengambil data buku dari localStorage saat aplikasi dimuat
function loadBooks() {
  const savedBooks = JSON.parse(localStorage.getItem("books"));

  if (savedBooks) {
    savedBooks.forEach(bookData => {
      createBookElement(
        bookData.id,
        bookData.title,
        bookData.author,
        bookData.status,
        bookData.year
      );

      // Perbarui label dan warna tombol saat buku dibaca
      const bookItem = document.querySelector(".book-item:last-child"); // Ambil buku yang baru saja ditambahkan
      const moveButton = bookItem.querySelector(".move-button");
      if (bookData.status) {
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
  const newStatus = isBelumSelesai ? true : false;

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

  // Tambahkan buku ke rak yang sesuai
  if (newStatus) {
    listSelesai.appendChild(bookItem);
  } else {
    listBelumSelesai.appendChild(bookItem);
  }

  // Ubah label pada tombol sesuai dengan status buku
  button.textContent = newStatus ? "Sudah Dibaca" : "Belum Dibaca";
  button.classList.toggle("blue-button", newStatus);
  button.classList.toggle("green-button", !newStatus);
}

// Fungsi untuk menghapus buku
function deleteBook(button) {
  const bookItem = button.parentElement.parentElement;
  bookItem.remove();

  const bookTitle = bookItem.querySelector("h3").textContent;
  const savedBooks = JSON.parse(localStorage.getItem("books"));
  const updatedBooks = savedBooks.filter(book => book.title !== bookTitle);
  localStorage.setItem("books", JSON.stringify(updatedBooks));

  alert("Buku Berhasil di Hapus");
}

// Fungsi untuk melakukan pencarian buku berdasarkan judul, penulis, atau tahun
function searchBooks() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const bookItems = document.querySelectorAll(".book-item");

  bookItems.forEach(bookItem => {
    const bookTitle = bookItem.querySelector("h3").textContent.toLowerCase();
    const bookAuthor = bookItem.querySelector("p").textContent.toLowerCase();
    const bookYear = bookItem.querySelector("p:last-child").textContent.toLowerCase();

    // Periksa apakah judul, penulis, atau tahun buku cocok dengan kata kunci pencarian
    if (
      bookTitle.includes(searchTerm) ||
      bookAuthor.includes(searchTerm) ||
      bookYear.includes(searchTerm)
    ) {
      bookItem.style.display = ""; // Tampilkan buku jika cocok
    } else {
      bookItem.style.display = "none"; // Sembunyikan buku jika tidak cocok
    }
  });
}

// Tambahkan event listener untuk memanggil fungsi searchBooks() saat input berubah
document.getElementById("search").addEventListener("input", searchBooks);

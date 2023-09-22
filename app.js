// Mendapatkan elemen-elemen DOM yang dibutuhkan
const bookForm = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const statusInput = document.getElementById("status");
const listBelumSelesai = document.getElementById("list-belum-selesai");
const listSelesai = document.getElementById("list-selesai");

// Fungsi untuk membuat elemen buku baru
function createBookElement(title, author, status) {
    const bookItem = document.createElement("li");
    bookItem.className = "book-item";

    const bookInfo = document.createElement("div");
    bookInfo.className = "book-info";
    bookInfo.innerHTML = `
        <h3>${title}</h3>
        <p>Penulis: ${author}</p>
    `;

    const actionButtons = document.createElement("div");
    actionButtons.className = "action-buttons";
    actionButtons.innerHTML = `
        <button class="move-button" onclick="moveBook(this)">Pindahkan</button>
        <button class="delete-button" onclick="deleteBook(this)">Hapus</button>
    `;

    bookItem.appendChild(bookInfo);
    bookItem.appendChild(actionButtons);

    if (status === "belum-selesai") {
        listBelumSelesai.appendChild(bookItem);
    } else {
        listSelesai.appendChild(bookItem);
    }
}

// Fungsi untuk menambahkan buku ke rak buku
function addBook(event) {
  event.preventDefault();

  const title = titleInput.value;
  const author = authorInput.value;
  const status = statusInput.value;

  if (title === "" || author === "") {
      alert("Judul dan penulis buku harus diisi.");
      return;
  }

  createBookElement(title, author, status);

  // Simpan data buku ke localStorage (Kriteria 5)
  const bookData = {
      title,
      author,
      status
  };

  let savedBooks = JSON.parse(localStorage.getItem("books")) || [];
  savedBooks.push(bookData);
  localStorage.setItem("books", JSON.stringify(savedBooks));

  titleInput.value = "";
  authorInput.value = "";
}

// Fungsi untuk mengambil data buku dari localStorage saat aplikasi dimuat
function loadBooks() {
  const savedBooks = JSON.parse(localStorage.getItem("books"));

  if (savedBooks) {
      savedBooks.forEach(bookData => {
          createBookElement(bookData.title, bookData.author, bookData.status);
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

  // Cek apakah buku saat ini ada di rak "Belum Selesai" atau "Selesai"
  const isBelumSelesai = currentShelf === listBelumSelesai;

  // Ganti rak buku sesuai dengan status buku
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

  // Tambahkan kode di sini untuk menghapus data buku dari localStorage (Kriteria 5)
  const bookTitle = bookItem.querySelector("h3").textContent;
  const savedBooks = JSON.parse(localStorage.getItem("books"));
  const updatedBooks = savedBooks.filter(book => book.title !== bookTitle);
  localStorage.setItem("books", JSON.stringify(updatedBooks));
}

// Fungsi untuk melakukan pencarian buku berdasarkan judul atau penulis
function searchBooks() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const bookItems = document.querySelectorAll(".book-item");

  bookItems.forEach(bookItem => {
      const bookTitle = bookItem.querySelector("h3").textContent.toLowerCase();
      const bookAuthor = bookItem.querySelector("p").textContent.toLowerCase();

      // Periksa apakah judul atau penulis buku cocok dengan kata kunci pencarian
      if (bookTitle.includes(searchTerm) || bookAuthor.includes(searchTerm)) {
          bookItem.style.display = ""; // Tampilkan buku jika cocok
      } else {
          bookItem.style.display = "none"; // Sembunyikan buku jika tidak cocok
      }
  });
}

// Tambahkan event listener untuk memanggil fungsi searchBooks() saat input berubah
document.getElementById("search").addEventListener("input", searchBooks);


// End of JavaScript code

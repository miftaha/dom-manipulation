const quoteDisplay = document.getElementById('quoteDisplay')
const newQuote = document.getElementById('newQuote')

const quotes = [
  {
    text: "Life is what happens when you're busy making other plans.",
    category: 'Life',
  },
  { text: 'The purpose of our lives is to be happy.', category: 'Life' },
  { text: 'Get busy living or get busy dying.', category: 'Motivation' },
  {
    text: 'You have within you right now, everything you need to deal with whatever the world can throw at you.',
    category: 'Motivation',
  },
]

const newQuoteText = document.getElementById('newQuoteText')
const newQuoteCategory = document.getElementById('newQuoteCategory')
const addQuotebtn = document.getElementById('addQuoteBtn')
const categoryFilter = document.getElementById('categoryFilter')

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  const randomQuote = quotes[randomIndex]
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>Category: ${randomQuote.category}</em></p>`
}
newQuote.addEventListener('click', showRandomQuote)

function addQuote() {
  if (newQuoteText.value === '' || newQuoteCategory.value === '') {
    alert('Please enter both a quote and a category.')
    newQuoteText.value = ''
    newQuoteCategory.value = ''
  } else {
    quotes.push({ text: newQuoteText.value, category: newQuoteCategory.value })
    alert('Quote added successfully!')
    saveQuotes()
    newQuoteText.value = ''
    newQuoteCategory.value = ''
  }
}

function createAddQuoteForm() {
  addQuote()
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes))
}
function exportQuotes() {
  const dataStr = JSON.stringify(quotes)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'quotes.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function importFromJsonFile(event) {
  const fileReader = new FileReader()
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result)
    quotes.push(...importedQuotes)
    saveQuotes()
    JSON.parse(localStorage.getItem(quotes))
    alert('Quotes imported successfully!')
  }
  fileReader.readAsText(event.target.files[0])
}
const exportQuotesButton = document.getElementById('exportQuotes')
exportQuotesButton.addEventListener('click', exportQuotes)

function populateCategories() {
  const categories = new Set(quotes.map((quote) => quote.category))
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'
  categories.forEach((category) => {
    const option = document.createElement('option')
    option.value = category
    option.textContent = category
    categoryFilter.appendChild(option)
  })

  const savedCategory = localStorage.getItem('selectedCategory')
  if (savedCategory) {
    categoryFilter.value = savedCategory
    filterQuotes()
  }
}
function filterQuotes() {
  const selectedCategory = categoryFilter.value
  localStorage.setItem('selectedCategory', selectedCategory)
  const filteredQuotes =
    selectedCategory === 'all'
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory)
  quoteDisplay.innerHTML = filteredQuotes.length
    ? filteredQuotes
        .map((quote) => `<p>"${quote.text}" - ${quote.category}</p>`)
        .join('')
    : '<p>No quotes available.</p>'
}
populateCategories()
filterQuotes()

async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const serverQuotes = await response.json()
    const updatedQuotes = serverQuotes.map((post) => ({
      text: post.title,
      category: 'Server',
    }))

    quotes = [
      ...updatedQuotes,
      ...quotes.filter(
        (quote) => !updatedQuotes.some((sq) => sq.text === quote.text)
      ),
    ]
    saveQuotes()
    populateCategories()
    filterQuotes()
  } catch (error) {
    console.error('Error fetching data from server:', error)
  }
}

setInterval(fetchQuotesFromServer, 300000)
